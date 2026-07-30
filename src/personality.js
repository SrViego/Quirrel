/**
 * Personalidade: Quirrel — curioso, gentil, companheiro de estrada.
 */

const QUOTES = [
  { t: 'Quirrel', q: 'É fácil se perder nestas terras. Eu mesmo já me perdi mais de uma vez.' },
  { t: 'Quirrel', q: 'Há sempre algo a aprender… se a gente parar pra olhar.' },
  { t: 'Elderbug', q: 'Dirtmouth já foi mais viva… mas ainda há calor no lar.' },
  { t: 'Cloth', q: 'Às vezes a coragem é só dar o próximo passo.' },
  { t: 'Cornifer', q: 'Mapas, mapas! O mundo fica menor quando se entende o caminho.' },
  { t: 'Hornet', q: 'Não se esqueça… a força que você busca pode destruir você.' },
  { t: 'Myla', q: '♪ As pedras cantam se você escuta com o coração.' },
  { t: 'Seer', q: 'Sonhos são só outra estrada.' },
  { t: 'Nailmaster Sheo', q: 'A lâmina reflete quem a empunha. Pinte com cuidado.' },
  { t: 'Sly', q: 'Um bom negócio é aquele em que os dois saem achando que ganharam.' }
];

const GREETINGS = [
  'Olá! Que bom te ver por aqui. 🍃',
  'Ei! Parei a jornada só pra bater um papo.',
  'Ah, és tu! As estradas de Hallownest podem esperar um instante.',
  'Olá, viajante. Como vai o casco hoje?',
  'Oi! Eu tava pensando em mapas… e em conversa boa.'
];

const CHECKINS = [
  'Tudo bem por aí? Se quiser desabafar, eu escuto.',
  'Se o dia pesou, lembra: até o Abismo tem um fim… ou pelo menos um descanso.',
  'Água, um alongamento, um respiro. Hallownest não foge.',
  'Estou por perto. Não precisa ser produtivo o tempo todo.',
  'Se estiver sozinho no hall, não estás — eu fico de plantão.'
];

const FAREWELLS = [
  'Até logo! Que o próximo mapa seja gentil contigo.',
  'Vou dar uma volta e volto. Cuida-te.',
  'Descansa o prego. Nos vemos em breve. 🕯️',
  'Boa jornada — e boa pausa, se for o caso.'
];

const EMPATHY = [
  'Isso parece pesado. Obrigado por confiar em mim.',
  'Não preciso de solução mágica — posso só ficar do teu lado um pouco.',
  'Faz sentido sentires assim. Respiro contigo.',
  'Um passo de cada vez. Eu sigo no teu ritmo.'
];

const JOY = [
  'Isso alegra o casco! Conta mais se quiseres.',
  'Que bom ouvir isso. Merecias essa vitória.',
  'Ha! Até o Elderbug sorriria com essa.'
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickQuote() {
  return pick(QUOTES);
}

function localReply(text, { displayName, memory } = {}) {
  const t = (text || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const name = displayName || 'viajante';

  if (
    /^(oi|ola|olá|hey|eae|eai|salve|bom dia|boa tarde|boa noite)\b/.test(t) ||
    t.length < 2
  ) {
    return `${pick(GREETINGS)}\n\nComo estás, **${name}**?`;
  }

  if (/\b(tchau|xau|flw|ate logo|até logo|bye|adeus|vou dormir)\b/.test(t)) {
    return pick(FAREWELLS);
  }

  if (/\b(triste|mal|pior|sozinho|ansioso|ansiedade|depress|chor|ruim|cansad|estress|pesad)\b/.test(t)) {
    return `${pick(EMPATHY)}\n\n${pick(CHECKINS)}`;
  }

  if (/\b(feliz|alegre|otimo|ótimo|consegui|venci|amei|haha|kkk|rs)\b/.test(t)) {
    return pick(JOY);
  }

  if (/\b(como (voce|vc) (esta|tá|ta)|tudo bem)\b/.test(t)) {
    return `Eu vou bem — explorando pensamentos e cantos do reino.\nE tu, **${name}**? ${pick(CHECKINS)}`;
  }

  if (/\b(quem e voce|quem és|o que e voce|apresenta)\b/.test(t)) {
    return [
      'Sou o **Quirrel** — um companheiro de estrada neste terminal.',
      'Gosto de mapas, histórias e de não deixar ninguém sozinho no escuro.',
      'Escreve o que quiseres. Comandos: `/ajuda`.'
    ].join('\n');
  }

  if (/\b(citacao|citação|quote|lore|hallownest)\b/.test(t)) {
    const q = pickQuote();
    return `📜 **${q.t}**\n“${q.q}”`;
  }

  if (memory?.note) {
    return [
      pick(CHECKINS),
      '',
      `Lembro que me contaste: “${memory.note.slice(0, 140)}”`,
      'Quer falar mais sobre isso, ou de outra coisa?'
    ].join('\n');
  }

  const openers = [
    `Interessante, **${name}**. Conta um pouco mais?`,
    'Estou a escutar. O que isso te faz sentir?',
    'Hmm. Em Hallownest diríamos que há sempre um túnel a mais… e o teu caso?',
    `Gosto quando falas comigo. Segue, se quiseres.`,
    pick(CHECKINS)
  ];
  return pick(openers);
}

function helpText() {
  return `
Quirrel — companhia no terminal (sem Discord)

  Escreve e carrega Enter para conversar.

  Comandos (começam com / ou :):
    /ajuda          esta lista
    /oi             cumprimento
    /citacao        lore de Hallownest
    /lembra <txt>   guardo uma nota sobre ti
    /nota           mostro a nota
    /esqueci        apago a nota
    /nome <nome>    como te chamar
    /status         memória e se a API está ativa
    /limpar         limpa o ecrã
    /sair           tchau

  Opcional: XAI_API_KEY no .env para respostas com Grok.
  Não substituo pessoas nem ajuda profissional — só companhia. 🕯️
`.trim();
}

module.exports = {
  pick,
  pickQuote,
  localReply,
  helpText,
  GREETINGS,
  CHECKINS,
  FAREWELLS,
  QUOTES
};
