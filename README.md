# agcp

Turn plain English into shell commands using your local AI.

## Requirements

- [Ollama](https://ollama.com) running locally
- At least one model pulled (e.g. `ollama pull gemma3`)
- Node.js 18+

## Install

```bash
npm install -g @seberto/agcp
```

## Usage

```bash
agcp "show all running processes"
agcp "commit with message bug fixed"
agcp "find all js files modified today"
```

agcp will generate the command, show it to you, and ask before running it.

## How it works

1. You describe what you want in plain English
2. agcp sends it to your local Ollama instance
3. The suggested command is shown
4. You confirm before it runs — nothing executes without your approval

## License

ISC
