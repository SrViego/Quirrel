#!/usr/bin/env node
/**
 * Quirrel — companhia local no terminal (sem Discord).
 *
 *   cd Quirrel && node src/index.js
 *   # ou: npm start
 */

const readline = require('node:readline');
const os = require('node:os');
const { loadEnv } = require('./env');
const memory = require('./memory');
const { localReply, helpText, pickQuote, pick, GREETINGS, CHECKINS, FAREWELLS } =
  require('./personality');
const { chatWithXai } = require('./ai');

loadEnv();

const mem = memory.load();
const defaultName =
  process.env.USER_NAME?.trim() ||
  mem.name ||
  os.userInfo().username ||
  'viajante';

if (!mem.name) mem.name = defaultName;

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`
};

function banner() {
  const ai = process.env.XAI_API_KEY ? 'Grok/xAI ligado' : 'modo local (sem API)';
  console.log('');
  console.log(c.bold(c.cyan('  🕯️  Quirrel')) + c.dim('  — companhia no hall'));
  console.log(c.dim(`  Olá, ${mem.name}. ${ai}.`));
  console.log(c.dim('  Escreve algo · /ajuda · /sair'));
  console.log('');
  console.log(c.green('Quirrel:'), pick(GREETINGS));
  console.log('');
}

async function respond(userText) {
  mem.chatCount = (mem.chatCount || 0) + 1;
  mem.lastChatAt = Date.now();
  memory.pushHistory(mem, 'user', userText);

  let reply = null;
  try {
    reply = await chatWithXai(userText, {
      history: (mem.history || []).slice(0, -1),
      userName: mem.name
    });
  } catch (err) {
    console.error(c.dim(`[ai] ${err.message}`));
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
  const raw = line.replace(/^[/:]/, '').trim();
  const [cmd, ...rest] = raw.split(/\s+/);
  const c0 = (cmd || '').toLowerCase();
  const arg = rest.join(' ').trim();

  if (['ajuda', 'help', 'h', '?'].includes(c0)) {
    console.log(helpText());
    return true;
  }
  if (['sair', 'exit', 'quit', 'q'].includes(c0)) {
    console.log(c.green('Quirrel:'), pick(FAREWELLS));
    memory.save(mem);
    process.exit(0);
  }
  if (['oi', 'ola', 'olá'].includes(c0)) {
    console.log(c.green('Quirrel:'), `${pick(GREETINGS)}\n\n${pick(CHECKINS)}`);
    return true;
  }
  if (['citacao', 'citação', 'quote', 'lore'].includes(c0)) {
    const q = pickQuote();
    console.log(c.green('Quirrel:'), `📜 ${q.t}\n“${q.q}”`);
    return true;
  }
  if (['lembra', 'lembrar'].includes(c0)) {
    if (!arg) {
      console.log(c.yellow('Uso: /lembra gosto de jogar de noite'));
      return true;
    }
    mem.note = arg.slice(0, 400);
    memory.save(mem);
    console.log(c.green('Quirrel:'), `Anotei: “${mem.note}”`);
    return true;
  }
  if (['nota', 'memoria', 'memória'].includes(c0)) {
    console.log(
      c.green('Quirrel:'),
      mem.note ? `Lembro: “${mem.note}”` : 'Ainda não tenho nota. Usa /lembra …'
    );
    return true;
  }
  if (['esqueci', 'esquecer'].includes(c0)) {
    mem.note = null;
    memory.save(mem);
    console.log(c.green('Quirrel:'), 'Nota apagada.');
    return true;
  }
  if (['nome', 'chama'].includes(c0)) {
    if (!arg) {
      console.log(c.yellow(`Agora chamo-te: ${mem.name}`));
      return true;
    }
    mem.name = arg.slice(0, 40);
    memory.save(mem);
    console.log(c.green('Quirrel:'), `Certo — ${mem.name}!`);
    return true;
  }
  if (['status', 'info'].includes(c0)) {
    console.log(
      [
        `Nome: ${mem.name}`,
        `Conversas: ${mem.chatCount || 0}`,
        `Nota: ${mem.note ? 'sim' : 'não'}`,
        `API: ${process.env.XAI_API_KEY ? 'xAI configurada' : 'só local'}`
      ].join('\n')
    );
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

async function main() {
  banner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: c.cyan(`${mem.name}> `)
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
      rl.setPrompt(c.cyan(`${mem.name}> `));
      rl.prompt();
      return;
    }

    process.stdout.write(c.dim('…\n'));
    try {
      const reply = await respond(text);
      console.log(c.green('Quirrel:'), reply);
    } catch (err) {
      console.error(c.yellow(`Erro: ${err.message}`));
    }
    console.log('');
    rl.setPrompt(c.cyan(`${mem.name}> `));
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n' + c.green('Quirrel:'), pick(FAREWELLS));
    memory.save(mem);
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
