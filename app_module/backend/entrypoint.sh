#!/usr/bin/env sh
set -e

if [ "$APP_ENV" = "production" ]; then
  echo "🚀 Running PRODUCTION mode"
  exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 2
else
  echo "🛠 Running DEVELOPMENT mode"
  exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --reload
fi
