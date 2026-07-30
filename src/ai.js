/**
 * Chat opcional via API xAI (Grok).
 * Sem XAI_API_KEY → null (usa personality.localReply).
 */

async function chatWithXai(userMessage, { history = [], userName } = {}) {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) return null;

  const model = process.env.XAI_MODEL || 'grok-3-mini';
  const messages = [
    {
      role: 'system',
      content: [
        'Tu és o Quirrel, de Hollow Knight / Hallownest.',
        'Companheiro de conversa no terminal: curioso, gentil, aventureiro.',
        'Respostas curtas (2–6 frases), em português (espelha o user).',
        userName ? `O utilizador gosta de ser chamado: ${userName}.` : '',
        'Não sejas sermão. Não inventes ser terapeuta.',
        'Se o user estiver em crise grave, sugere ajuda humana real.',
        'Podes usar leve flavor de Hallownest sem forçar.'
      ]
        .filter(Boolean)
        .join(' ')
    },
    ...history.slice(-10),
    { role: 'user', content: userMessage }
  ];

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
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

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[ai] xAI', res.status, errText.slice(0, 180));
    return null;
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

module.exports = { chatWithXai };
