/**
 * Personalidade: Quirrel — curioso, gentil, companheiro de estrada.
 * Português do Brasil (você / natural).
 */

const QUOTES = [
  { t: 'Quirrel', q: 'É fácil se perder nessas terras. Eu mesmo já me perdi mais de uma vez.' },
  { t: 'Quirrel', q: 'Sempre tem algo pra aprender… se a gente parar pra olhar.' },
  { t: 'Quirrel', q: 'A carapaça carrega histórias. As suas também merecem ser ouvidas.' },
  { t: 'Elderbug', q: 'Dirtmouth já foi mais viva… mas ainda tem calor no lar.' },
  { t: 'Cloth', q: 'Às vezes a coragem é só dar o próximo passo.' },
  { t: 'Cornifer', q: 'Mapas, mapas! O mundo fica menor quando a gente entende o caminho.' },
  { t: 'Iselda', q: 'Ele some com o mapa… mas volta. Sempre volta. Como as boas conversas.' },
  { t: 'Hornet', q: 'Não se esqueça… a força que você busca pode destruir você.' },
  { t: 'Myla', q: '♪ As pedras cantam se você escuta com o coração.' },
  { t: 'Seer', q: 'Sonhos são só outra estrada.' },
  { t: 'Nailmaster Sheo', q: 'A lâmina reflete quem a empunha. Pinte com cuidado.' },
  { t: 'Sly', q: 'Um bom negócio é aquele em que os dois saem achando que ganharam.' },
  { t: 'Bretta', q: 'Heróis existem… às vezes só precisam de alguém que acredite.' },
  { t: 'Zote', q: 'Prestem atenção! A grandeza não pede licença — só espaço no corredor.' },
  { t: 'Tiso', q: 'A arena espera. Mas o descanso também é vitória.' },
  { t: 'Relic Seeker Lemm', q: 'Relíquias contam o que as vozes já esqueceram.' },
  { t: 'Midwife', q: 'Conhecimento tem preço. Amizade… às vezes só pede tempo.' },
  { t: 'White Lady', q: 'O que plantamos no silêncio floresce longe dos nossos olhos.' },
  { t: 'The Hunter', q: 'Observa. Cada criatura ensina uma lição — se você sobreviver à aula.' },
  { t: 'Quirrel', q: 'Um banco, um momento, um amigo. Hallownest pode esperar.' }
];

const CHARACTERS = {
  quirrel: {
    name: 'Quirrel',
    blurb:
      'Estudioso, viajante e otimista. Adora mapas, ruínas e boa companhia. Não deixa você sozinho no escuro por muito tempo.'
  },
  hornet: {
    name: 'Hornet',
    blurb:
      'Protetora feroz e direta. Poucas palavras, muita precisão — igual a agulha dela.'
  },
  elderbug: {
    name: 'Elderbug',
    blurb:
      'O ancião de Dirtmouth. Vê a cidade mudar e ainda oferece um oi no banco.'
  },
  cornifer: {
    name: 'Cornifer',
    blurb:
      'Cartógrafo incansável. Se ouvir um humming no corredor, é ele desenhando o próximo atalho.'
  },
  iselda: {
    name: 'Iselda',
    blurb:
      'Esposa do Cornifer. Vende mapas com paciência… e um sorrisinho quando ele se perde de novo.'
  },
  cloth: {
    name: 'Cloth',
    blurb:
      'Guerreira de coração grande. Medo e coragem andam juntos — ela escolhe avançar mesmo assim.'
  },
  myla: {
    name: 'Myla',
    blurb:
      'Mineira que canta no escuro. Às vezes a canção muda… mas a voz fica na memória.'
  },
  sly: {
    name: 'Sly',
    blurb:
      'Mercador esperto (e bem mais do que parece). Um prego afiado e um preço justo.'
  },
  sheo: {
    name: 'Nailmaster Sheo',
    blurb:
      'Mestre do prego que descobriu a arte. Força sem beleza é só barulho.'
  },
  seer: {
    name: 'Seer',
    blurb:
      'Guardiã dos sonhos da tribo das mariposas. Sonhos têm peso — e caminho.'
  },
  bretta: {
    name: 'Bretta',
    blurb:
      'Romântica de Dirtmouth. Acredita em heróis… às vezes com fanfic demais na cabeça.'
  },
  zote: {
    name: 'Zote',
    blurb:
      'O Poderoso… segundo ele. Lição: confiança sem mapa ainda é confiança (perigosa).'
  },
  lemm: {
    name: 'Relic Seeker Lemm',
    blurb:
      'Colecionador de relíquias em City of Tears. História em troca de geo (e paciência).'
  },
  hunter: {
    name: 'The Hunter',
    blurb:
      'Registra cada presa. Curiosidade afiada como garra — e um diário que nunca acaba.'
  }
};

const MAPA_TIPS = [
  'Hoje: escolhe **um** túnel e vai até o fim. Não precisa mapear o reino inteiro.',
  'Dica do mapa: marca onde você **descansou** de verdade — não só onde passou correndo.',
  'Às vezes o atalho aparece quando você para de forçar a porta principal.',
  'Revisa o que já explorou. Hallownest esconde salas atrás de salas “já vistas”.',
  'Leva geo o bastante pro banco e pra volta. Coragem sem recurso é só pressa.',
  'Se estiver perdido: sobe. A superfície orienta — até em metáfora.',
  'Um bom mapa tem anotações. Seu dia também merece uma frase no `/diario`.',
  'Não tenha medo de voltar pra Dirtmouth. Lar não é derrota; é ponto de save.',
  'O Cornifer diria: traça o contorno primeiro, os detalhes depois.',
  'Hoje a missão é **leve**: 25 minutos de foco (`/foco 25`) e um gole de água.',
  'Tem caminho que só abre com a chave certa. Qual chave falta hoje — descanso ou ação?',
  'Sonhos (e abas do navegador) se multiplicam. Fecha um corredor antes de abrir três.'
];

const GREETINGS_MORNING = [
  'Bom dia! O Stag ainda boceja e eu já tô curioso com o mapa de hoje.',
  'Manhã em Dirtmouth. Café imaginário e coragem de verdade — como você tá?',
  'Oi! O sol (ou o que passa por sol aqui) ainda tá amável. Bom recomeço.'
];

const GREETINGS_AFTERNOON = [
  'Boa tarde! No meio do mapa — precisa de banco ou de prego afiado?',
  'Tarde de exploração. Eu trouxe curiosidade; você traz o resto.',
  'E aí! O reino não vai embora. Um respiro e a gente segue.'
];

const GREETINGS_EVENING = [
  'Boa noite. As lanternas de City of Tears combinam com conversa baixa.',
  'Noite no hall. Se o dia pesou, pode largar o peso aqui um pouco.',
  'Oi… nessa hora até o Quirrel fala mais devagar. Como foi o caminho?'
];

const GREETINGS_NIGHT = [
  'Ainda acordado? O Abismo não julga — mas o sono às vezes é o melhor mapa.',
  'Madrugada de viajante. Tô aqui se quiser companhia quieta.',
  'Oi na escuridão mansa. Sem pressa. Só a gente e o terminal.'
];

const GREETINGS = [
  'Olá! Que bom te ver por aqui. 🍃',
  'E aí! Parei a jornada só pra bater um papo.',
  'Ah, é você! As estradas de Hallownest podem esperar um instante.',
  'Olá, viajante. Como vai a carapaça hoje?',
  'Oi! Eu tava pensando em mapas… e em conversa boa.'
];

const CHECKINS = [
  'Tudo bem por aí? Se quiser desabafar, eu escuto.',
  'Se o dia pesou, lembra: até o Abismo tem um fim… ou pelo menos um descanso.',
  'Água, um alongamento, um respiro. Hallownest não foge.',
  'Tô por perto. Não precisa ser produtivo o tempo todo.',
  'Se estiver sozinho no hall, não tá — eu fico de plantão.'
];

const FAREWELLS = [
  'Até logo! Que o próximo mapa seja gentil com você.',
  'Vou dar uma volta e volto. Se cuida.',
  'Descansa o prego. A gente se vê em breve. 🕯️',
  'Boa jornada — e boa pausa, se for o caso.'
];

const EMPATHY = [
  'Isso parece pesado. Obrigado por confiar em mim.',
  'Não preciso de solução mágica — posso só ficar do seu lado um pouco.',
  'Faz sentido você sentir assim. Respiro com você.',
  'Um passo de cada vez. Eu sigo no seu ritmo.'
];

const JOY = [
  'Isso alegra a carapaça! Conta mais se quiser.',
  'Que bom ouvir isso. Você merecia essa vitória.',
  'Ha! Até o Elderbug sorriria com essa.'
];

const MOOD_LABELS = {
  1: 'pesado como o Abismo',
  2: 'nublado em City of Tears',
  3: 'estável em Dirtmouth',
  4: 'leve como Greenpath',
  5: 'radiante como o Crystal Peak no sol'
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickQuote(filterName) {
  if (filterName) {
    const key = String(filterName).toLowerCase();
    const subset = QUOTES.filter(
      (q) =>
        q.t.toLowerCase().includes(key) ||
        key.includes(q.t.toLowerCase().split(' ').pop())
    );
    if (subset.length) return pick(subset);
  }
  return pick(QUOTES);
}

function hourBucket(d = new Date()) {
  const h = d.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  if (h >= 18 && h < 23) return 'evening';
  return 'night';
}

function timeGreeting() {
  const b = hourBucket();
  if (b === 'morning') return pick(GREETINGS_MORNING);
  if (b === 'afternoon') return pick(GREETINGS_AFTERNOON);
  if (b === 'evening') return pick(GREETINGS_EVENING);
  return pick(GREETINGS_NIGHT);
}

function characterInfo(query) {
  if (!query) {
    return Object.values(CHARACTERS)
      .map((c) => `· **${c.name}**`)
      .join('\n');
  }
  const key = String(query)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '');
  if (CHARACTERS[key]) return CHARACTERS[key];
  for (const [k, v] of Object.entries(CHARACTERS)) {
    const n = v.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/\s+/g, '');
    if (n.includes(key) || key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

function mapaTip() {
  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash + day.charCodeAt(i) * (i + 1)) % MAPA_TIPS.length;
  return MAPA_TIPS[hash];
}

function moodLine(level) {
  if (level == null) return null;
  return `Humor ${level}/5 — ${MOOD_LABELS[level] || 'no caminho'}`;
}

function localReply(text, { displayName, memory } = {}) {
  const t = (text || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const name = displayName || 'viajante';
  const mood = memory?.moodByDay?.[new Date().toISOString().slice(0, 10)];

  if (
    /^(oi|ola|olá|hey|eae|eai|salve|bom dia|boa tarde|boa noite)\b/.test(t) ||
    t.length < 2
  ) {
    const g = timeGreeting();
    const moodBit = mood != null ? `\n(${moodLine(mood)})` : '';
    return `${g}${moodBit}\n\nComo você tá, **${name}**?`;
  }

  if (/\b(tchau|xau|flw|ate logo|até logo|bye|adeus|vou dormir)\b/.test(t)) {
    return pick(FAREWELLS);
  }

  if (/\b(triste|mal|pior|sozinho|ansioso|ansiedade|depress|chor|ruim|cansad|estress|pesad|vazio)\b/.test(t)) {
    return `${pick(EMPATHY)}\n\n${pick(CHECKINS)}${
      mood != null && mood <= 2
        ? '\n\nSe estiver muito pesado, fala com alguém de verdade também — eu fico aqui no terminal.'
        : ''
    }`;
  }

  if (/\b(feliz|alegre|otimo|ótimo|consegui|venci|amei|haha|kkk|rs|animad)\b/.test(t)) {
    return pick(JOY);
  }

  if (/\b(como (voce|vc) (esta|tá|ta)|tudo bem com voce|e ai com voce)\b/.test(t)) {
    return `Eu tô bem — explorando pensamentos e cantos do reino.\nE você, **${name}**? ${pick(CHECKINS)}`;
  }

  if (/\b(quem e voce|quem e vc|o que e voce|apresenta|se apresenta)\b/.test(t)) {
    return [
      'Eu sou o **Quirrel** — um companheiro de estrada neste terminal.',
      'Gosto de mapas, histórias e de não deixar ninguém sozinho no escuro.',
      'Escreve o que quiser. Comandos: `/ajuda`.'
    ].join('\n');
  }

  if (/\b(obrigad|valeu|thanks|vlw)\b/.test(t)) {
    return pick([
      'De nada! É bom ser útil no mapa de alguém.',
      'Sempre! O hall fica mais quente assim.',
      'Por você? Qualquer hora. 🕯️'
    ]);
  }

  if (/\b(jogo|jogar|live|stream|twitch)\b/.test(t)) {
    return pick([
      'Boa sessão! Se for pro hall da live, eu fico na retaguarda do terminal.',
      'Que o prego (e o FPS) estejam do seu lado. Depois conta como foi.',
      'Multi-jogo? Lembra de hidratar entre um boss e outro.'
    ]);
  }

  if (/\b(citacao|citação|quote|lore|hallownest)\b/.test(t)) {
    const q = pickQuote();
    return `📜 **${q.t}**\n“${q.q}”`;
  }

  if (/\b(mapa|perdido|direcao|direção)\b/.test(t)) {
    return `🗺️ ${mapaTip()}`;
  }

  if (memory?.notes?.length) {
    const last = memory.notes[memory.notes.length - 1];
    return [
      pick(CHECKINS),
      '',
      `Lembro da sua nota #${last.id}: “${last.text.slice(0, 120)}”`,
      'Quer falar mais sobre isso, ou de outra coisa? (`/notas` lista tudo)'
    ].join('\n');
  }

  if (memory?.note) {
    return [
      pick(CHECKINS),
      '',
      `Lembro que você me contou: “${memory.note.slice(0, 140)}”`,
      'Quer falar mais sobre isso, ou de outra coisa?'
    ].join('\n');
  }

  const openers = [
    `Interessante, **${name}**. Conta um pouco mais?`,
    'Tô escutando. O que isso te faz sentir?',
    'Hmm. Em Hallownest a gente diria que sempre tem um túnel a mais… e no seu caso?',
    'Gosto quando você fala comigo. Pode seguir, se quiser.',
    `Se quiser organizar o dia: \`/mapa\` · \`/foco 25\` · \`/diario …\``,
    pick(CHECKINS)
  ];
  return pick(openers);
}

function helpText() {
  return `
Quirrel — companhia no terminal (Hallownest)

  Escreve e aperta Enter pra conversar.

  Memória
    /lembra <txt>     guarda uma nota (várias!)
    /notas            lista as notas
    /nota [n]         mostra a nota #n (ou a última)
    /esquece [n]      apaga a nota #n (ou a última)
    /nome <nome>      como te chamar
    /humor [1-5]      humor do dia
    /diario <txt>     escreve no diário de hoje
    /diario ver [dia] lê o diário (AAAA-MM-DD)

  Hallownest
    /oi               cumprimento (hora do dia)
    /citacao [quem]   lore
    /personagem [x]   quem é quem
    /mapa            dica / reflexão do dia

  Sessão
    /historico [n]    últimas falas (padrão 8)
    /foco [min]       timer de foco (padrão 25)
    /foco off         cancela o timer
    /reset            limpa o histórico desta sessão
    /exporta          salva .md em data/exports/
    /status           memória + API + tema
    /tema [nome]      moss|void|pale|coral|dirt
    /limpar           limpa a tela
    /sair             tchau

  Opcional: XAI_API_KEY / QUIRREL_THEME no .env
  Não substituo pessoas nem ajuda profissional. 🕯️
`.trim();
}

module.exports = {
  pick,
  pickQuote,
  localReply,
  helpText,
  timeGreeting,
  characterInfo,
  mapaTip,
  moodLine,
  hourBucket,
  GREETINGS,
  CHECKINS,
  FAREWELLS,
  QUOTES,
  CHARACTERS,
  MOOD_LABELS
};
