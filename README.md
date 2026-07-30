# Quirrel — companhia no terminal

Companheiro **local** (sem Discord): conversa no teu terminal, com clima de Hallownest.

```
HallownestBots/
  Morgana/     ← bot Discord (jogos, economia)
  Quirrel/     ← companhia no PC (este)
```

---

## Começar

```sh
cd ~/Documentos/HallownestBots/Quirrel
node src/index.js
# ou
npm start
```

Opcional — atalho no PATH:

```sh
mkdir -p ~/.local/bin
ln -sf ~/Documentos/HallownestBots/Quirrel/src/index.js ~/.local/bin/quirrel
chmod +x ~/Documentos/HallownestBots/Quirrel/src/index.js
# depois: quirrel
```

---

## Uso

Escreve e carrega **Enter**. Comandos:

| Comando | Efeito |
|---------|--------|
| `/ajuda` | lista |
| `/oi` | cumprimento |
| `/citacao` | lore |
| `/lembra …` | nota sobre ti |
| `/nota` / `/esqueci` | ver / apagar |
| `/nome Viego` | como te chamar |
| `/status` | memória + API |
| `/sair` | tchau |

---

## API opcional (Grok)

Sem chave funciona em **modo local** (frases + memória).

Com [xAI](https://console.x.ai/):

```sh
cp .env.example .env
# XAI_API_KEY=xai-...
```

---

## Ficheiros

- `src/index.js` — chat REPL  
- `src/personality.js` — personalidade e lore  
- `src/memory.js` — `data/memory.json`  
- `src/ai.js` — xAI opcional  

---

🕯️ *“É fácil se perder nestas terras. Eu mesmo já me perdi mais de uma vez.”*
