<h1 align="center">misungtr</h1>

<p align="center">
 <img src="./gitbooks/.gitbook/assets/demo.png" alt="misungtr demo" />
</p>

<p align="center" style="display: inline-block">
 <img src="https://img.shields.io/badge/status-early%20beta-orange" alt="Early Beta" />
 <img src="https://img.shields.io/badge/local--first-yes-2d6f6d" alt="Local First" />
 <img src="https://img.shields.io/badge/privacy--first-yes-1f4a5b" alt="Privacy First" />
 <img src="https://img.shields.io/badge/Ollama-ready-111111" alt="Ollama Ready" />
 <img src="https://img.shields.io/badge/MCP-ready-7c5c2e" alt="MCP Ready" />
 <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
</p>

<p align="center">
 <strong>misungtr is a self-hosted AI workspace: local inference, private workspace memory, SearXNG search, MCP tools, and Docker-first deployment.</strong>
</p>

<p align="center">
 <a href="./docs/architecture.md">Architecture</a> •
 <a href="./deploy/README.md">Deploy</a> •
 <a href="./SECURITY.md">Security</a> •
 <a href="./THREAT_MODEL.md">Threat Model</a> •
 <a href="./ROADMAP.md">Roadmap</a> •
 <a href="./CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  🇺🇸 <a href="./README.md">English</a> | 🇻🇳 Vietnamese coming soon
</p>

> **Early Beta**: Under active development. Expect rough edges, strange sparks, and unfinished corners.

> **Local-first, upfront:** misungtr is designed to run on your own hardware with your own data. The default stack uses local Ollama inference, optional llama.cpp, self-hosted SearXNG, local workspace notes, and MCP servers that are scoped to project data. No telemetry is added by the app.

# Install

The recommended install path is Docker Compose. It gives you the full stack: web UI, FastAPI backend, Ollama, SearXNG, optional llama.cpp, and optional MCP servers.

## Recommended install

**Windows, macOS, or Linux with Docker:**

```bash
docker compose up --build
```

Pull a local Ollama model:

```bash
docker compose exec ollama ollama pull llama3.1:8b
```

Open:

- Web UI: http://localhost:5173
- API docs: http://localhost:8000/docs
- SearXNG: http://localhost:8080
- Ollama: http://localhost:11434

## Production deploy

Production mode serves the web UI through Nginx on port `80` and proxies `/api` to the backend.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Windows helper:

```powershell
.\scripts\deploy.ps1
.\scripts\healthcheck.ps1
```

Linux/macOS helper:

```bash
./scripts/deploy.sh
```

## Local development

Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r backend\requirements-dev.txt
cd apps\web
npm install
cd ..\..
.\launch-windows.ps1
```

Manual backend and web:

```powershell
.\scripts\dev-backend.ps1
.\scripts\dev-web.ps1
```

# What is misungtr?

misungtr is a self-hosted AI workspace built to feel like a local, private alternative to polished hosted chat products. It is not trying to be sterile. It is built to be useful, inspectable, moddable, and a little more alive.

- **Simple, UI-first & local**: a React workspace gives you chat, SearXNG-powered search, and local notes on the first screen. The UI talks to a FastAPI backend and keeps the provider layer swappable.

- **Ollama + llama.cpp inference**: the backend ships with provider adapters for Ollama and OpenAI-compatible llama.cpp servers. Pick the default with `AI_DEFAULT_PROVIDER`, or pass a provider per request.

- **Local workspace memory**: notes are stored inside the configured workspace root. File access is path-scoped so workspace tools cannot escape into arbitrary folders.

- **SearXNG web search**: search goes through your own SearXNG container by default. The API exposes `/api/search`, and the MCP search server exposes the same capability as a tool.

- **MCP servers included**: `mcp_servers/workspace_server.py` provides local file tools, and `mcp_servers/web_search_server.py` provides web search through SearXNG.

- **Docker-first deploy**: the default Compose stack is for development; the production override adds Nginx, restart policies, backend healthchecks, and production API proxying.

- **E2E-tested workspace flow**: Playwright tests cover the visible shell, chat flow, search flow, and note saving with mocked API responses.

## Architecture

```text
Browser UI
  |
  | HTTP
  v
FastAPI backend
  |-- routes/chat.py       chat completion endpoint
  |-- routes/search.py     SearXNG-backed web search endpoint
  |-- routes/workspace.py  local note storage endpoint
  |
  | services
  |-- inference.py         Ollama and llama.cpp providers
  |-- search.py            SearXNG client
  |-- workspace.py         safe local file access
  |
  +--> Ollama              local model runtime
  +--> llama.cpp           optional GGUF runtime profile
  +--> SearXNG             self-hosted metasearch

MCP servers
  |-- workspace_server.py  list/read/write workspace files
  |-- web_search_server.py SearXNG search tool
```

Deeper docs: [Architecture](./docs/architecture.md) · [Deploy](./deploy/README.md) · [Security](./SECURITY.md) · [Threat Model](./THREAT_MODEL.md).

## Context in minutes, not weeks

misungtr starts with a small local workspace: chat, search, and notes. The next step is turning those notes and files into durable memory: Markdown chunks, local embeddings, SQLite persistence, and retrieval that can feed the model without sending private data to hosted services.

The project is intentionally shaped so the memory layer can grow without rewriting the whole app:

- API routes stay thin.
- Service adapters own provider-specific behavior.
- MCP servers expose local tools separately from HTTP routes.
- Docker profiles let optional services grow around the core.

## misungtr vs Other Agent Workspaces

High-level comparison. Products evolve, so verify against each vendor.

|                         | Hosted Chat Apps | Terminal Agents | misungtr |
| ----------------------- | ---------------- | --------------- | -------- |
| **Self-hosted**         | 🚫 Usually no    | ⚠️ Partial       | ✅ Docker stack |
| **Local inference**     | ⚠️ Limited       | ✅ Often         | ✅ Ollama + llama.cpp |
| **Web UI**              | ✅ Polished      | 🚫 Usually no    | ✅ Workspace UI |
| **Private search**      | 🚫 Hosted        | ⚠️ BYO           | ✅ SearXNG |
| **MCP tools**           | ⚠️ Varies        | ✅ Often         | ✅ Included |
| **Workspace files**     | ⚠️ Hosted sync   | ✅ Local         | ✅ Path-scoped local notes |
| **Deploy story**        | 🚫 Vendor-owned  | ⚠️ Manual        | ✅ Compose + production override |
| **E2E tests**           | Unknown          | ⚠️ Varies        | ✅ Playwright |

# Contributing from source

New contributor? Start with [`CONTRIBUTING.md`](./CONTRIBUTING.md). The short path is:

1. Install Git, Docker, Python 3.12+, Node.js 22+, npm, and ripgrep.
2. Clone the repo, install backend deps with `pip install -r backend/requirements-dev.txt`, and install web deps with `npm install` inside `apps/web`.
3. Use `.\launch-windows.ps1`, `docker compose up --build`, or the focused scripts in `scripts/`.
4. Run checks before opening a PR.

```powershell
.\.venv\Scripts\python -m compileall backend mcp_servers app.py
.\.venv\Scripts\pytest
cd apps\web
npm run build
npm run test:e2e
```

If Windows has little free space on `C:`, install Playwright browsers into the repo drive:

```powershell
New-Item -ItemType Directory -Force -Path .playwright,.tmp
$env:PLAYWRIGHT_BROWSERS_PATH="D:\My gene\.playwright"
$env:TEMP="D:\My gene\.tmp"
$env:TMP="D:\My gene\.tmp"
cd apps\web
npx playwright install chromium
npm run test:e2e
```

# Roadmap

- Streaming chat responses.
- SQLite conversation persistence.
- Local memory tree and Obsidian-compatible Markdown vault.
- RAG over workspace files.
- Tool-calling orchestration across search and notes.
- Desktop companion launcher.
- Local authentication for non-loopback deployments.
- Backup and restore flows for workspace data.

# Security

misungtr is designed for trusted local networks first. Do not expose it directly to the public internet without authentication, TLS, rate limiting, and network controls.

Read:

- [Security](./SECURITY.md)
- [Threat Model](./THREAT_MODEL.md)
- [Deploy Hardening](./deploy/README.md)

# Star us on GitHub

If misungtr helps you build a local-first AI workspace, star the repo and make the project easier to find.

<p align="center">
 <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=misungtr/misungtr&type=date&theme=dark&legend=top-left" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=misungtr/misungtr&type=date&legend=top-left" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=misungtr/misungtr&type=date&legend=top-left" />
 </picture>
</p>

# Contributors Hall of Fame

Contributors help turn misungtr from a useful local stack into a real open workspace.

<p align="center">
 <img src="https://contrib.rocks/image?repo=misungtr/misungtr" alt="misungtr contributors" />
</p>
