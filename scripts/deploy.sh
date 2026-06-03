#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

