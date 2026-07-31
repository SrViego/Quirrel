/**
 * Temas de cor do terminal (Quirrel).
 * QUIRREL_THEME=moss|void|pale|coral|dirt
 */

const THEMES = {
  moss: {
    id: 'moss',
    name: 'Greenpath',
    brand: '\x1b[38;5;114m',
    accent: '\x1b[38;5;150m',
    user: '\x1b[38;5;108m',
    muted: '\x1b[38;5;242m',
    warn: '\x1b[38;5;214m',
    ok: '\x1b[38;5;114m'
  },
  void: {
    id: 'void',
    name: 'Abismo',
    brand: '\x1b[38;5;141m',
    accent: '\x1b[38;5;183m',
    user: '\x1b[38;5;111m',
    muted: '\x1b[38;5;240m',
    warn: '\x1b[38;5;218m',
    ok: '\x1b[38;5;141m'
  },
  pale: {
    id: 'pale',
    name: 'Corte pálida',
    brand: '\x1b[38;5;229m',
    accent: '\x1b[38;5;222m',
    user: '\x1b[38;5;187m',
    muted: '\x1b[38;5;243m',
    warn: '\x1b[38;5;215m',
    ok: '\x1b[38;5;228m'
  },
  coral: {
    id: 'coral',
    name: 'Morgana coral',
    brand: '\x1b[38;5;209m',
    accent: '\x1b[38;5;216m',
    user: '\x1b[38;5;180m',
    muted: '\x1b[38;5;242m',
    warn: '\x1b[38;5;214m',
    ok: '\x1b[38;5;114m'
  },
  dirt: {
    id: 'dirt',
    name: 'Dirtmouth',
    brand: '\x1b[38;5;180m',
    accent: '\x1b[38;5;137m',
    user: '\x1b[38;5;250m',
    muted: '\x1b[38;5;241m',
    warn: '\x1b[38;5;179m',
    ok: '\x1b[38;5;151m'
  }
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function resolveThemeName() {
  const raw = (process.env.QUIRREL_THEME || 'moss').toLowerCase().trim();
  if (THEMES[raw]) return raw;
  return 'moss';
}

function getTheme() {
  return THEMES[resolveThemeName()] || THEMES.moss;
}

function listThemes() {
  return Object.values(THEMES).map((t) => ({ id: t.id, name: t.name }));
}

function paint(key, text) {
  const t = getTheme();
  const code = t[key] || '';
  return `${code}${text}${RESET}`;
}

function c() {
  const t = getTheme();
  return {
    dim: (s) => `${DIM}${t.muted}${s}${RESET}`,
    brand: (s) => `${BOLD}${t.brand}${s}${RESET}`,
    accent: (s) => `${t.accent}${s}${RESET}`,
    green: (s) => `${t.ok}${s}${RESET}`,
    yellow: (s) => `${t.warn}${s}${RESET}`,
    cyan: (s) => `${t.user}${s}${RESET}`,
    bold: (s) => `${BOLD}${s}${RESET}`,
    muted: (s) => `${t.muted}${s}${RESET}`,
    quirrel: (s) => `${BOLD}${t.brand}${s}${RESET}`
  };
}

module.exports = {
  THEMES,
  getTheme,
  resolveThemeName,
  listThemes,
  paint,
  c,
  RESET
};
