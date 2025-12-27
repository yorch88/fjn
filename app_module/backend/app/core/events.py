from fastapi import FastAPI
from .db import connect, close

def register_startup(app: FastAPI):
    @app.on_event("startup")
    async def _startup():
        await connect()

def register_shutdown(app: FastAPI):
    @app.on_event("shutdown")
    async def _shutdown():
        await close()
