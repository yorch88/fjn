#!/usr/bin/env sh
set -e
sleep 2
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
