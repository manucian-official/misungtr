# Contributing

## Development

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r backend\requirements-dev.txt
cd apps\web
npm install
```

## Checks

```powershell
python -m compileall backend mcp_servers
pytest
cd apps\web
npm run build
npm run test:e2e
```

Keep changes local-first, privacy-first, and small enough to review.
