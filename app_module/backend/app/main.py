from fastapi import FastAPI
from .core.events import register_startup, register_shutdown
from .modules.tickets.routes import router as tickets_router
from .modules.kanban.routes import router as kanban_router

app = FastAPI(title="Support FJN Modular API", version="0.1.0")
app.include_router(tickets_router, prefix="/tickets", tags=["tickets"])
app.include_router(kanban_router, prefix="/kanban", tags=["kanban"])
register_startup(app)
register_shutdown(app)
