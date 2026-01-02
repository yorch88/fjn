from fastapi import FastAPI
from .core.events import register_startup, register_shutdown
from .modules.tickets.routes import router as tickets_router
from .modules.kanban.routes import router as kanban_router
from .modules.users.routes import router as users_router
from app.modules.issues.routes import router as issues_router


app = FastAPI(title="Support FJZ Modular API", version="0.1.0")

# 👇 sin middleware de planta por ahora
# from .core.middleware import PlantGuardMiddleware
# app.add_middleware(PlantGuardMiddleware)

app.include_router(tickets_router, prefix="/tickets", tags=["Tickets"])
app.include_router(kanban_router, prefix="/kanban", tags=["Kanban"])
app.include_router(users_router, prefix="/auth", tags=["Auth"])
app.include_router(issues_router)

register_startup(app)
register_shutdown(app)
 