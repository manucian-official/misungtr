param(
    [switch]$WithMcp,
    [switch]$WithLlamaCpp
)

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$profiles = @()
if ($WithMcp) { $profiles += "--profile"; $profiles += "mcp" }
if ($WithLlamaCpp) { $profiles += "--profile"; $profiles += "llamacpp" }

docker compose -f docker-compose.yml -f docker-compose.prod.yml @profiles up --build -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml @profiles ps

