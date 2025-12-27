PROJECT_NAME = support-kiosk
DOCKER_COMPOSE = docker-compose
DOCKER_EXEC = docker exec

SERVICE_FRONTEND = frontend
SERVICE_BACKEND = backend
SERVICE_CELERY = celery
SERVICE_MONGO = mongo
SERVICE_REDIS = redis

.PHONY: help up down restart build logs ps \
        shell-frontend shell-backend shell-mongo shell-redis \
        restart-frontend restart-backend restart-celery \
        logs-frontend logs-backend logs-celery logs-mongo logs-redis \
        npm-install npm-ci rebuild-backend rebuild-frontend

help:
	@echo ""
	@echo "📦 $(PROJECT_NAME) — comandos disponibles"
	@echo ""
	@echo "▶️  Arranque / parada"
	@echo "  make up                 - Levanta todos los contenedores"
	@echo "  make down               - Detiene y elimina contenedores"
	@echo "  make restart            - Reinicia todo"
	@echo "  make ps                 - Lista contenedores"
	@echo ""
	@echo "🔁 Reconstrucción"
	@echo "  make build              - Reconstruye todas las imágenes"
	@echo "  make rebuild-frontend   - Reconstruye solo frontend"
	@echo "  make rebuild-backend    - Reconstruye solo backend"
	@echo ""
	@echo "📜 Logs"
	@echo "  make logs               - Logs de todos"
	@echo "  make logs-frontend      - Logs del frontend"
	@echo "  make logs-backend       - Logs del backend"
	@echo "  make logs-celery        - Logs de celery"
	@echo "  make logs-mongo         - Logs de mongo"
	@echo "  make logs-redis         - Logs de redis"
	@echo ""
	@echo "💻 Consolas"
	@echo "  make shell-frontend     - Shell del frontend"
	@echo "  make shell-backend      - Shell del backend"
	@echo "  make shell-mongo        - Shell mongo"
	@echo "  make shell-redis        - redis-cli"
	@echo ""
	@echo "🎯 Servicios (reinicio rápido)"
	@echo "  make restart-frontend"
	@echo "  make restart-backend"
	@echo "  make restart-celery"
	@echo ""
	@echo "📦 NPM utilidades"
	@echo "  make npm-install        - npm install dentro del contenedor"
	@echo "  make npm-ci             - npm ci dentro del contenedor"
	@echo ""

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

restart: down up

ps:
	$(DOCKER_COMPOSE) ps

build:
	$(DOCKER_COMPOSE) build

rebuild-frontend:
	$(DOCKER_COMPOSE) build $(SERVICE_FRONTEND)

rebuild-backend:
	$(DOCKER_COMPOSE) build $(SERVICE_BACKEND)

logs:
	$(DOCKER_COMPOSE) logs -f

logs-frontend:
	$(DOCKER_COMPOSE) logs -f $(SERVICE_FRONTEND)

logs-backend:
	$(DOCKER_COMPOSE) logs -f $(SERVICE_BACKEND)

logs-celery:
	$(DOCKER_COMPOSE) logs -f $(SERVICE_CELERY)

logs-mongo:
	$(DOCKER_COMPOSE) logs -f $(SERVICE_MONGO)

logs-redis:
	$(DOCKER_COMPOSE) logs -f $(SERVICE_REDIS)

shell-frontend:
	$(DOCKER_COMPOSE) exec $(SERVICE_FRONTEND) sh

shell-backend:
	$(DOCKER_COMPOSE) exec $(SERVICE_BACKEND) sh


shell-mongo:
	$(DOCKER_COMPOSE) exec $(SERVICE_MONGO) bash

shell-redis:
	$(DOCKER_COMPOSE) exec $(SERVICE_REDIS) redis-cli

restart-frontend:
	$(DOCKER_COMPOSE) restart $(SERVICE_FRONTEND)

restart-backend:
	$(DOCKER_COMPOSE) restart $(SERVICE_BACKEND)

restart-celery:
	$(DOCKER_COMPOSE) restart $(SERVICE_CELERY)

npm-install:
	$(DOCKER_COMPOSE) run --rm $(SERVICE_FRONTEND) npm install

npm-ci:
	$(DOCKER_COMPOSE) run --rm $(SERVICE_FRONTEND) npm ci
