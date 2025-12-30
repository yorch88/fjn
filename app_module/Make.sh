#!/usr/bin/env bash

PROJECT_NAME="support-kiosk"
DOCKER_COMPOSE="docker compose"

SERVICE_FRONTEND="frontend"
SERVICE_BACKEND="backend"
SERVICE_CELERY="celery"
SERVICE_MONGO="mongo"
SERVICE_REDIS="redis"


RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
NC="\033[0m"

check_requirements() {
  if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker no está instalado o no está en el PATH.${NC}"
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}❌ Tu Docker no soporta 'docker compose'.${NC}"
    echo -e "${YELLOW}👉 Actualiza Docker o instala Docker Compose v2.${NC}"
    exit 1
  fi
}

help() {
  echo ""
  echo -e "📦 ${BLUE}${PROJECT_NAME}${NC} — comandos disponibles"
  echo ""
  echo "▶️  Arranque / parada"
  echo "  $0 up                 - Levanta todos los contenedores"
  echo "  $0 down               - Detiene y elimina contenedores"
  echo "  $0 restart            - Reinicia todo"
  echo "  $0 ps                 - Lista contenedores"
  echo ""
  echo "🔁 Reconstrucción"
  echo "  $0 build              - Reconstruye todas las imágenes"
  echo "  $0 rebuild-frontend   - Reconstruye solo frontend"
  echo "  $0 rebuild-backend    - Reconstruye solo backend"
  echo ""
  echo "📜 Logs"
  echo "  $0 logs               - Logs de todos"
  echo "  $0 logs-frontend      - Logs del frontend"
  echo "  $0 logs-backend       - Logs del backend"
  echo "  $0 logs-celery        - Logs de celery"
  echo "  $0 logs-mongo         - Logs de mongo"
  echo "  $0 logs-redis         - Logs de redis"
  echo ""
  echo "💻 Consolas"
  echo "  $0 shell-frontend     - Shell del frontend"
  echo "  $0 shell-backend      - Shell del backend"
  echo "  $0 shell-mongo        - Shell mongo"
  echo "  $0 shell-redis        - redis-cli"
  echo ""
  echo "🎯 Reinicio rápido"
  echo "  $0 restart-frontend"
  echo "  $0 restart-backend"
  echo "  $0 restart-celery"
  echo ""
  echo "📦 NPM utilidades"
  echo "  $0 npm-install"
  echo "  $0 npm-ci"
  echo ""
}

run() {
  echo -e "${GREEN}▶ Ejecutando:${NC} $*"
  eval "$@"
}

check_requirements

case "$1" in
  up)                 run "$DOCKER_COMPOSE up -d" ;;
  down)               run "$DOCKER_COMPOSE down" ;;
  restart)            run "$DOCKER_COMPOSE down && $DOCKER_COMPOSE up -d" ;;
  ps)                 run "$DOCKER_COMPOSE ps" ;;
  build)              run "$DOCKER_COMPOSE build" ;;
  rebuild-frontend)   run "$DOCKER_COMPOSE build $SERVICE_FRONTEND" ;;
  rebuild-backend)    run "$DOCKER_COMPOSE build $SERVICE_BACKEND" ;;
  logs)               run "$DOCKER_COMPOSE logs -f" ;;
  logs-frontend)      run "$DOCKER_COMPOSE logs -f $SERVICE_FRONTEND" ;;
  logs-backend)       run "$DOCKER_COMPOSE logs -f $SERVICE_BACKEND" ;;
  logs-celery)        run "$DOCKER_COMPOSE logs -f $SERVICE_CELERY" ;;
  logs-mongo)         run "$DOCKER_COMPOSE logs -f $SERVICE_MONGO" ;;
  logs-re
