from fastapi import FastAPI
from app.modules.users.bootstrap import create_admin_user
from .db import connect, close

def register_startup(app: FastAPI):

    @app.on_event("startup")
    async def _startup():

        await connect()

        #await create_admin_user() #aqui crear el usuario de la db y el usuario para la base de datos de produccion

        print("✅ Application startup completed")

def register_shutdown(app: FastAPI):
    @app.on_event("shutdown")
    async def _shutdown():
        await close()
