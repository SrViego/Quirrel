/**
 * Chat opcional via API xAI (Grok).
 * Sem XAI_API_KEY → null (usa personality.localReply).
 */

async function chatWithXai(
  userMessage,
  { history = [], userName, notes = [], mood = null } = {}
) {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) return null;

  const model = process.env.XAI_MODEL || 'grok-3-mini';
  const noteHint = notes?.length
    ? `Notas que você guardou sobre o usuário: ${notes
        .slice(-5)
        .map((n) => n.text)
        .join(' | ')}`
    : '';
  const moodHint =
    mood != null ? `Humor do usuário hoje (1-5): ${mood}.` : '';

  const messages = [
    {
      role: 'system',
      content: [
        'Você é o Quirrel, de Hollow Knight / Hallownest.',
        'Companheiro de conversa no terminal: curioso, gentil, aventureiro.',
        'Respostas curtas (2–6 frases), em português do Brasil natural (você, tá, pra, etc.).',
        'NÃO use português de Portugal (tu, estás, contigo, fixe, telemóvel).',
        userName ? `O usuário gosta de ser chamado: ${userName}.` : '',
        noteHint,
        moodHint,
        'Não seja sermão. Não invente ser terapeuta.',
        'Se o usuário estiver em crise grave, sugira ajuda humana de verdade.',
        'Pode usar leve flavor de Hallownest sem forçar.'
      ]
        .filter(Boolean)
        .join(' ')
    },
    ...history.slice(-10),
    { role: 'user', content: userMessage }
  ];

  const timeoutMs = Number(process.env.XAI_TIMEOUT_MS || 30000);
  let res;
  try {
    res = await fetch('https://api.x.ai/v1/chat/completions', {
      signal: AbortSignal.timeout(timeoutMs),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.85,
        max_tokens: 450
      })
    });
  } catch (err) {
    // timeout / rede → null (index.js cai pro modo local)
    const why = err?.name === 'TimeoutError' ? `timeout ${timeoutMs}ms` : err?.message;
    console.error('[ai] xAI indisponível:', why);
    return null;
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[ai] xAI', res.status, errText.slice(0, 180));
    return null;
  }

  const json = await res.json().catch(() => null);
  if (!json) return null;
  return json.choices?.[0]?.message?.content?.trim() || null;
}

module.exports = { chatWithXai };
