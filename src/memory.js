const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'data', 'memory.json');

function load() {
  try {
    if (!fs.existsSync(file)) {
      return { name: null, note: null, chatCount: 0, lastChatAt: 0, history: [] };
    }
    return {
      name: null,
      note: null,
      chatCount: 0,
      lastChatAt: 0,
      history: [],
      ...JSON.parse(fs.readFileSync(file, 'utf8'))
    };
  } catch {
    return { name: null, note: null, chatCount: 0, lastChatAt: 0, history: [] };
  }
}

function save(data) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  // não grava histórico longo no disco (só note/name/counts)
  const out = {
    name: data.name,
    note: data.note,
    chatCount: data.chatCount,
    lastChatAt: data.lastChatAt
  };
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(out, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function pushHistory(data, role, content) {
  if (!Array.isArray(data.history)) data.history = [];
  data.history.push({ role, content: String(content).slice(0, 800) });
  if (data.history.length > 16) data.history = data.history.slice(-16);
}

module.exports = { load, save, pushHistory, file };
