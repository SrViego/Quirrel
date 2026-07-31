#!/usr/bin/env node
/**
 * Quirrel — companhia local no terminal (Hallownest).
 *
 *   cd Quirrel && npm start
 */

const readline = require('node:readline');
const os = require('node:os');
const { loadEnv } = require('./env');
const memory = require('./memory');
const {
  localReply,
  helpText,
  pickQuote,
  pick,
  timeGreeting,
  characterInfo,
  mapaTip,
  moodLine,
  GREETINGS,
  CHECKINS,
  FAREWELLS,
  CHARACTERS
} = require('./personality');
const { chatWithXai } = require('./ai');
const { c: colorFn, resolveThemeName, listThemes, getTheme } = require('./theme');

loadEnv();

const mem = memory.load();
if (mem.theme) process.env.QUIRREL_THEME = mem.theme;

const defaultName =
  process.env.USER_NAME?.trim() ||
  mem.name ||
  os.userInfo().username ||
  'viajante';

if (!mem.name) mem.name = defaultName;
mem.sessionChats = 0;
mem.history = [];

let focusTimer = null;
let focusEndsAt = 0;

function col() {
  return colorFn();
}

function banner() {
  const c = col();
  const th = getTheme();
  const ai = process.env.XAI_API_KEY ? 'Grok/xAI ligado' : 'modo local (sem API)';
  const mood = memory.getMood(mem);
  console.log('');
  console.log(c.brand('  🕯️  Quirrel') + c.dim(`  — ${th.name}`));
  console.log(c.dim(`  Olá, ${mem.name}. ${ai}.`));
  if (mood != null) console.log(c.dim(`  ${moodLine(mood)}`));
  console.log(c.dim('  Escreve algo · /ajuda · /sair'));
  console.log('');
  console.log(c.green('Quirrel:'), timeGreeting());
  console.log('');
}

function say(msg) {
  console.log(col().green('Quirrel:'), msg);
}

function clearFocusTimer() {
  if (focusTimer) {
    clearTimeout(focusTimer);
    focusTimer = null;
  }
  focusEndsAt = 0;
}

function startFocus(minutes) {
  clearFocusTimer();
  const ms = Math.max(1, minutes) * 60 * 1000;
  focusEndsAt = Date.now() + ms;
  focusTimer = setTimeout(() => {
    focusTimer = null;
    focusEndsAt = 0;
    console.log('');
    say(
      pick([
        `⏰ Foco concluído (${minutes} min). Banco. Água. Bom trabalho, viajante.`,
        `⏰ Acabou o timer de ${minutes} min. O Cornifer aprovaria esse mapa de tempo.`,
        `⏰ ${minutes} minutos no túnel. Pode sair pra superfície um instante.`
      ])
    );
    if (rl) rl.prompt();
  }, ms);
  if (typeof focusTimer.unref === 'function') focusTimer.unref();
}

async function respond(userText) {
  mem.chatCount = (mem.chatCount || 0) + 1;
  mem.sessionChats = (mem.sessionChats || 0) + 1;
  mem.lastChatAt = Date.now();
  memory.pushHistory(mem, 'user', userText);

  let reply = null;
  try {
    reply = await chatWithXai(userText, {
      history: (mem.history || [])
        .filter((h) => h.role === 'user' || h.role === 'assistant')
        .slice(0, -1)
        .map((h) => ({ role: h.role, content: h.content })),
      userName: mem.name,
      notes: mem.notes || [],
      mood: memory.getMood(mem)
    });
  } catch (err) {
    console.error(col().dim(`[ai] ${err.message}`));
  }

  if (!reply) {
    reply = localReply(userText, {
      displayName: mem.name,
      memory: mem
    });
  }

  memory.pushHistory(mem, 'assistant', reply);
  memory.save(mem);
  return reply;
}

function handleSlash(line) {
  const c = col();
  const raw = line.replace(/^[/:]/, '').trim();
  const [cmd, ...rest] = raw.split(/\s+/);
  const c0 = (cmd || '').toLowerCase();
  const arg = rest.join(' ').trim();
  const first = (rest[0] || '').trim();

  if (['ajuda', 'help', 'h', '?'].includes(c0)) {
    console.log(helpText());
    return true;
  }

  if (['sair', 'exit', 'quit', 'q'].includes(c0)) {
    farewellAndExit();
    return true;
  }

  if (['oi', 'ola', 'olá'].includes(c0)) {
    const mood = memory.getMood(mem);
    say(
      `${timeGreeting()}${mood != null ? `\n${moodLine(mood)}` : ''}\n\n${pick(CHECKINS)}`
    );
    return true;
  }

  if (['citacao', 'citação', 'quote', 'lore'].includes(c0)) {
    const q = pickQuote(arg || null);
    say(`📜 **${q.t}**\n“${q.q}”`);
    return true;
  }

  if (['personagem', 'char', 'npc'].includes(c0)) {
    if (!arg) {
      say(`Personagens que conheço:\n${characterInfo()}\n\nUso: /personagem quirrel`);
      return true;
    }
    const ch = characterInfo(arg);
    if (!ch) {
      say(`Não achei “${arg}”. Tenta: ${Object.keys(CHARACTERS).join(', ')}`);
      return true;
    }
    say(`**${ch.name}**\n${ch.blurb}`);
    return true;
  }

  if (['mapa', 'dica', 'tip'].includes(c0)) {
    say(`🗺️ ${mapaTip()}`);
    return true;
  }

  // ── notas ──────────────────────────────────────────────
  if (['lembra', 'lembrar', 'noteadd'].includes(c0)) {
    if (!arg) {
      console.log(c.yellow('Uso: /lembra gosto de jogar de noite'));
      return true;
    }
    const r = memory.addNote(mem, arg);
    if (!r.ok) {
      say(r.error);
      return true;
    }
    say(`Anotei #${r.note.id}: “${r.note.text}”`);
    return true;
  }

  if (['notas', 'notes', 'lembretes'].includes(c0)) {
    if (!mem.notes?.length) {
      say('Sem notas. Usa /lembra …');
      return true;
    }
    const lines = mem.notes.map((n) => `  #${n.id}  ${n.text}`);
    say(`Notas (${mem.notes.length}):\n${lines.join('\n')}`);
    return true;
  }

  if (['nota', 'note', 'memoria', 'memória'].includes(c0)) {
    if (!mem.notes?.length) {
      say(mem.note ? `Lembro: “${mem.note}”` : 'Ainda não tenho nota. /lembra …');
      return true;
    }
    let n = null;
    if (first && /^\d+$/.test(first)) {
      n = mem.notes.find((x) => x.id === parseInt(first, 10));
    } else {
      n = mem.notes[mem.notes.length - 1];
    }
    say(n ? `#${n.id}: “${n.text}”` : 'Não achei essa nota. /notas');
    return true;
  }

  if (['esqueci', 'esquecer', 'esquece', 'delnota'].includes(c0)) {
    if (!mem.notes?.length) {
      mem.note = null;
      memory.save(mem);
      say('Nada pra esquecer.');
      return true;
    }
    const id = first && /^\d+$/.test(first)
      ? parseInt(first, 10)
      : mem.notes[mem.notes.length - 1].id;
    const r = memory.removeNote(mem, id);
    say(r.ok ? `Apaguei a nota #${id}.` : r.error);
    return true;
  }

  // ── humor ──────────────────────────────────────────────
  if (['humor', 'mood', 'comoestou'].includes(c0)) {
    if (!first) {
      const m = memory.getMood(mem);
      say(m != null ? moodLine(m) : 'Ainda sem humor hoje. /humor 1-5 (1 pesado · 5 ótimo)');
      return true;
    }
    const n = parseInt(first, 10);
    if (n < 1 || n > 5 || Number.isNaN(n)) {
      console.log(c.yellow('Uso: /humor 3'));
      return true;
    }
    const v = memory.setMood(mem, n);
    say(`Anotei: ${moodLine(v)}. Valeu por compartilhar.`);
    return true;
  }

  // ── diário ─────────────────────────────────────────────
  if (['diario', 'diário', 'journal'].includes(c0)) {
    if (!arg || first === 'ver' || first === 'show' || first === 'ler') {
      const day =
        first === 'ver' || first === 'show' || first === 'ler'
          ? rest[1] || memory.todayKey()
          : first && /^\d{4}-\d{2}-\d{2}$/.test(first)
            ? first
            : null;
      if (day || !arg) {
        const d = day || memory.todayKey();
        const body = memory.readDiary(d);
        if (!body) {
          const days = memory.listDiaryDays().slice(0, 5);
          say(
            `Sem diário em ${d}.${days.length ? `\nDias: ${days.join(', ')}` : ''}\nEscreve: /diario texto do dia`
          );
          return true;
        }
        console.log(body);
        return true;
      }
    }
    if (first === 'lista' || first === 'list') {
      const days = memory.listDiaryDays();
      say(days.length ? `Dias:\n${days.map((d) => `  ${d}`).join('\n')}` : 'Diário vazio.');
      return true;
    }
    const text = arg.replace(/^(ver|show|ler)\s+/i, '').trim() || arg;
    if (!text || text === 'ver') {
      console.log(c.yellow('Uso: /diario hoje foquei no boss · /diario ver'));
      return true;
    }
    const p = memory.appendDiary(text);
    say(`Escrevi no diário (${memory.todayKey()}).\n${c.dim(p)}`);
    return true;
  }

  // ── histórico ──────────────────────────────────────────
  if (['historico', 'histórico', 'history', 'hist'].includes(c0)) {
    const n = Math.min(30, Math.max(1, parseInt(first || '8', 10) || 8));
    const slice = (mem.history || []).slice(-n);
    if (!slice.length) {
      say('Histórico vazio nessa sessão.');
      return true;
    }
    const lines = slice.map((h) => {
      const who = h.role === 'user' ? mem.name : 'Quirrel';
      return `  ${who}: ${h.content.slice(0, 120)}`;
    });
    console.log(lines.join('\n'));
    return true;
  }

  // ── foco ───────────────────────────────────────────────
  if (['foco', 'focus', 'pomodoro', 'timer'].includes(c0)) {
    if (['off', 'stop', 'cancela', 'cancelar', '0'].includes(first.toLowerCase())) {
      clearFocusTimer();
      say('Timer de foco cancelado.');
      return true;
    }
    const min = parseInt(first || '25', 10);
    if (Number.isNaN(min) || min < 1 || min > 180) {
      console.log(c.yellow('Uso: /foco 25  ·  /foco off'));
      return true;
    }
    startFocus(min);
    say(
      `Foco de **${min} min** rolando. Eu aviso quando acabar. (/foco off cancela)\n🗺️ ${mapaTip()}`
    );
    return true;
  }

  // ── nome ───────────────────────────────────────────────
  if (['nome', 'chama'].includes(c0)) {
    if (!arg) {
      console.log(c.yellow(`Agora chamo-te: ${mem.name}`));
      return true;
    }
    mem.name = arg.slice(0, 40);
    memory.save(mem);
    say(`Beleza — ${mem.name}!`);
    return true;
  }

  // ── tema ───────────────────────────────────────────────
  if (['tema', 'theme', 'cor'].includes(c0)) {
    if (!arg) {
      const list = listThemes()
        .map((t) => (t.id === resolveThemeName() ? `【${t.id}】` : t.id))
        .join(' · ');
      say(`Tema: ${resolveThemeName()} (${getTheme().name})\nOpções: ${list}\n/tema moss`);
      return true;
    }
    const id = arg.toLowerCase();
    if (!listThemes().some((t) => t.id === id)) {
      say(`Tema desconhecido. Usa: ${listThemes().map((t) => t.id).join(', ')}`);
      return true;
    }
    process.env.QUIRREL_THEME = id;
    mem.theme = id;
    memory.save(mem);
    say(`Tema → ${getTheme().name} (${id}).`);
    return true;
  }

  // ── status / reset / export / clear ────────────────────
  if (['status', 'info'].includes(c0)) {
    const mood = memory.getMood(mem);
    const focusLeft =
      focusEndsAt > Date.now()
        ? `${Math.ceil((focusEndsAt - Date.now()) / 60000)} min de foco`
        : 'sem timer';
    console.log(
      [
        `Nome: ${mem.name}`,
        `Conversas: ${mem.chatCount || 0} (sessão ${mem.sessionChats || 0})`,
        `Notas: ${mem.notes?.length || 0}`,
        `Humor hoje: ${mood != null ? mood + '/5' : '—'}`,
        `Tema: ${resolveThemeName()}`,
        `Foco: ${focusLeft}`,
        `API: ${process.env.XAI_API_KEY ? 'xAI configurada' : 'só local'}`,
        `Histórico sessão: ${(mem.history || []).length} msgs`
      ].join('\n')
    );
    return true;
  }

  if (['reset', 'limparhist'].includes(c0)) {
    mem.history = [];
    mem.sessionChats = 0;
    say('Histórico dessa sessão limpo. Nome, notas e diário ficam.');
    return true;
  }

  if (['exporta', 'export', 'exportar'].includes(c0)) {
    const p = memory.exportMarkdown(mem, { includeHistory: true });
    say(`Exportei o mapa da conversa:\n${p}`);
    return true;
  }

  if (['limpar', 'clear', 'cls'].includes(c0)) {
    console.clear();
    banner();
    return true;
  }

  console.log(c.yellow('Comando desconhecido. /ajuda'));
  return true;
}

function farewellAndExit() {
  clearFocusTimer();
  const summary = memory.sessionSummary(mem);
  say(`${pick(FAREWELLS)}\n\nResumo: ${summary}`);
  memory.save(mem);
  process.exit(0);
}

let rl;

async function main() {
  banner();

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: col().cyan(`${mem.name}> `)
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const text = line.trim();
    if (!text) {
      rl.prompt();
      return;
    }

    if (text.startsWith('/') || text.startsWith(':')) {
      handleSlash(text);
      rl.setPrompt(col().cyan(`${mem.name}> `));
      rl.prompt();
      return;
    }

    process.stdout.write(col().dim('…\n'));
    try {
      const reply = await respond(text);
      say(reply);
    } catch (err) {
      console.error(col().yellow(`Erro: ${err.message}`));
    }
    console.log('');
    rl.setPrompt(col().cyan(`${mem.name}> `));
    rl.prompt();
  });

  rl.on('close', () => {
    clearFocusTimer();
    console.log('');
    say(`${pick(FAREWELLS)}\n\nResumo: ${memory.sessionSummary(mem)}`);
    memory.save(mem);
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
