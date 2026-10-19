# Quirrel — companhia no terminal

Companheiro **local** (sem Discord): conversa no terminal, clima de Hallownest · v1.1  
Fala em **português do Brasil**.

```
HallownestBots/
  Morgana/   Discord
  Quirrel/   companhia no PC (este)
  LiveBot/   Twitch
```

---

## Começar

```sh
cd ~/Documentos/HallownestBots/Quirrel
npm start
# ou: node src/index.js
```

Opcional no PATH:

```sh
ln -sf ~/Documentos/HallownestBots/Quirrel/src/index.js ~/.local/bin/quirrel
chmod +x ~/Documentos/HallownestBots/Quirrel/src/index.js
```

---

## Comandos

### Memória
| | |
|--|--|
| `/lembra …` | guarda uma nota (várias) |
| `/notas` | lista |
| `/nota [n]` | mostra #n ou a última |
| `/esquece [n]` | apaga |
| `/nome Viego` | como te chamar |
| `/humor 1-5` | humor do dia |
| `/diario texto` | diário de hoje |
| `/diario ver [data]` | ler diário |

### Hallownest
| | |
|--|--|
| `/oi` | cumprimento (manhã/tarde/noite) |
| `/citacao [quem]` | lore |
| `/personagem [nome]` | quem é quem |
| `/mapa` | dica / reflexão do dia |

### Sessão
| | |
|--|--|
| `/historico [n]` | últimas falas |
| `/foco 25` | timer de foco (aviso ao acabar) |
| `/foco off` | cancela |
| `/reset` | limpa histórico da sessão |
| `/exporta` | `.md` em `data/exports/` |
| `/tema moss` | moss · void · pale · coral · dirt |
| `/status` | resumo |
| `/limpar` | limpa a tela |
| `/sair` | tchau + resumo da sessão |

Escreve sem `/` pra conversar (local ou Grok se tiver chave).

---

## Config

```sh
cp .env.example .env
# XAI_API_KEY=xai-...
# QUIRREL_THEME=moss
# USER_NAME=Viego
# XAI_TIMEOUT_MS=30000   (sem resposta nesse tempo → resposta local)
```

### Privacidade (modo xAI)

Com `XAI_API_KEY` definida, cada mensagem é enviada para a API da xAI junto com
o seu nome, as **últimas 5 notas** (`/lembra`), o **humor do dia** (`/humor`) e as
últimas mensagens da sessão. O diário **não** é enviado. Sem a chave, tudo fica
só no seu PC (`data/`).

---

## Arquivos

| Path | |
|------|--|
| `src/index.js` | REPL + comandos |
| `src/personality.js` | voz, lore, mapa |
| `src/memory.js` | notas, diário, humor |
| `src/theme.js` | cores do terminal |
| `src/ai.js` | xAI opcional |
| `data/memory.json` | memória |
| `data/diario/` | diários por dia |
| `data/exports/` | exports |

---

🕯️ *“É fácil se perder nessas terras. Eu mesmo já me perdi mais de uma vez.”*
