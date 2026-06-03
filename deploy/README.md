# Deploy

This folder contains production deployment helpers. The main production stack is composed from the root `docker-compose.yml` and `docker-compose.prod.yml`.

## Production Start

```powershell
.\scripts\deploy.ps1
```

Linux or macOS:

```sh
./scripts/deploy.sh
```

## Production URLs

- Web UI: http://localhost
- API health: http://localhost/health
- SearXNG: http://localhost:8080
- Ollama: http://localhost:11434

## Operational Scripts

- `scripts/deploy.ps1`: build and start the production stack.
- `scripts/healthcheck.ps1`: verify app, API, SearXNG, and Ollama ports.
- `scripts/backup-workspace.ps1`: archive the Docker workspace volume.

## Validation

```powershell
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
.\scripts\healthcheck.ps1
cd apps\web
npm run test:e2e
```

## Hardening Before Remote Exposure

- Put a TLS reverse proxy in front of the web service.
- Add authentication before exposing the API outside localhost.
- Replace `config/searxng/settings.yml` secret key.
- Restrict Docker volume mounts to project data only.
