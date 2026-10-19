/**
 * Memória persistente: nome, notas, diário, humor, contagens.
 * Histórico de chat fica só em RAM (salvo se exportar).
 */

const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'data', 'memory.json');
const diaryDir = path.join(__dirname, '..', 'data', 'diario');
const exportDir = path.join(__dirname, '..', 'data', 'exports');

function defaultData() {
  return {
    name: null,
    /** @deprecated single note — migrado para notes[] */
    note: null,
    /** @type {{ id: number, text: string, at: number }[]} */
    notes: [],
    /** humor 1–5 do dia: { "2026-07-31": 4 } */
    moodByDay: {},
    chatCount: 0,
    lastChatAt: 0,
    sessionChats: 0,
    theme: null,
    history: []
  };
}

function load() {
  try {
    if (!fs.existsSync(file)) return defaultData();
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const base = defaultData();
    const data = {
      ...base,
      ...raw,
      notes: Array.isArray(raw.notes) ? raw.notes : [],
      moodByDay:
        raw.moodByDay && typeof raw.moodByDay === 'object' ? raw.moodByDay : {},
      history: []
    };
    // migração: note string → notes[]
    if (data.note && !data.notes.length) {
      data.notes.push({
        id: 1,
        text: String(data.note).slice(0, 400),
        at: Date.now()
      });
      data.note = null;
    }
    // normaliza ids
    data.notes = data.notes.map((n, i) => ({
      id: n.id || i + 1,
      text: String(n.text || '').slice(0, 400),
      at: n.at || Date.now()
    }));
    return data;
  } catch {
    return defaultData();
  }
}

function save(data) {
  try {
    saveUnsafe(data);
    return true;
  } catch (err) {
    console.error(`[memória] não consegui salvar (${err.message}). Continuo sem gravar.`);
    return false;
  }
}

function saveUnsafe(data) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const out = {
    name: data.name,
    note: null,
    notes: (data.notes || []).slice(0, 50),
    moodByDay: data.moodByDay || {},
    chatCount: data.chatCount || 0,
    lastChatAt: data.lastChatAt || 0,
    theme: data.theme || null
  };
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(out, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function pushHistory(data, role, content) {
  if (!Array.isArray(data.history)) data.history = [];
  data.history.push({
    role,
    content: String(content).slice(0, 800),
    at: Date.now()
  });
  if (data.history.length > 40) data.history = data.history.slice(-40);
}

function nextNoteId(notes) {
  const max = notes.reduce((m, n) => Math.max(m, n.id || 0), 0);
  return max + 1;
}

function addNote(data, text) {
  if (!data.notes) data.notes = [];
  if (data.notes.length >= 50) return { ok: false, error: 'Máximo de 50 notas.' };
  const note = {
    id: nextNoteId(data.notes),
    text: String(text).slice(0, 400),
    at: Date.now()
  };
  data.notes.push(note);
  save(data);
  return { ok: true, note };
}

function removeNote(data, id) {
  const before = data.notes?.length || 0;
  data.notes = (data.notes || []).filter((n) => n.id !== id);
  if (data.notes.length === before) return { ok: false, error: 'Nota não encontrada.' };
  save(data);
  return { ok: true };
}

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function setMood(data, level) {
  const n = Math.min(5, Math.max(1, Number(level)));
  if (!data.moodByDay) data.moodByDay = {};
  data.moodByDay[todayKey()] = n;
  save(data);
  return n;
}

function getMood(data, day = todayKey()) {
  return data.moodByDay?.[day] ?? null;
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDay(day) {
  return typeof day === 'string' && DAY_RE.test(day);
}

function diaryPath(day = todayKey()) {
  if (!isValidDay(day)) throw new Error(`Data inválida: ${day} (use AAAA-MM-DD)`);
  return path.join(diaryDir, `${day}.md`);
}

function appendDiary(text, day = todayKey()) {
  if (!fs.existsSync(diaryDir)) fs.mkdirSync(diaryDir, { recursive: true });
  const p = diaryPath(day);
  const stamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const block = `\n### ${stamp}\n${String(text).trim()}\n`;
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, `# Diário · ${day}\n${block}`, 'utf8');
  } else {
    fs.appendFileSync(p, block, 'utf8');
  }
  return p;
}

function readDiary(day = todayKey()) {
  if (!isValidDay(day)) return null;
  const p = diaryPath(day);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function listDiaryDays() {
  if (!fs.existsSync(diaryDir)) return [];
  return fs
    .readdirSync(diaryDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort()
    .reverse();
}

function exportMarkdown(data, { includeHistory = true } = {}) {
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const p = path.join(exportDir, `quirrel-${stamp}.md`);
  const lines = [
    `# Quirrel · export ${stamp}`,
    '',
    `**Viajante:** ${data.name || '—'}`,
    `**Conversas (total):** ${data.chatCount || 0}`,
    `**Sessão:** ${data.sessionChats || 0}`,
    `**Humor hoje:** ${getMood(data) ?? '—'}`,
    ''
  ];
  if (data.notes?.length) {
    lines.push('## Notas', '');
    for (const n of data.notes) {
      lines.push(`- **#${n.id}** ${n.text}`);
    }
    lines.push('');
  }
  if (includeHistory && data.history?.length) {
    lines.push('## Histórico da sessão', '');
    for (const h of data.history) {
      const who = h.role === 'user' ? data.name || 'tu' : 'Quirrel';
      lines.push(`**${who}:** ${h.content}`, '');
    }
  }
  const days = listDiaryDays().slice(0, 14);
  if (days.length) {
    lines.push('## Diário (últimos dias)', '');
    for (const d of days) {
      lines.push(`### ${d}`, '', readDiary(d) || '', '');
    }
  }
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  return p;
}

function sessionSummary(data) {
  const parts = [
    `falamos **${data.sessionChats || 0}** vezes nessa sessão`,
    `total **${data.chatCount || 0}**`,
    data.notes?.length ? `**${data.notes.length}** notas` : null,
    getMood(data) != null ? `humor hoje **${getMood(data)}/5**` : null
  ].filter(Boolean);
  return parts.join(' · ');
}

module.exports = {
  file,
  diaryDir,
  exportDir,
  load,
  save,
  pushHistory,
  addNote,
  removeNote,
  setMood,
  getMood,
  todayKey,
  isValidDay,
  appendDiary,
  readDiary,
  listDiaryDays,
  exportMarkdown,
  sessionSummary,
  defaultData
};
