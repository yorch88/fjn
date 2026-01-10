from fastapi import FastAPI
from .core.events import register_startup, register_shutdown
from .modules.tickets.routes import router as tickets_router
from .modules.kanban.routes import router as kanban_router
from .modules.users.routes import router as users_router
from app.modules.dependencies.issues.routes import router as issues_router
from app.modules.dependencies.departments.routes import router as department
from app.modules.inventory.routes import router as inventory_router
from app.modules.dependencies.locations.routes import router as locations_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Support FJZ Modular API", version="0.1.0")

# from .core.middleware import PlantGuardMiddleware
# app.add_middleware(PlantGuardMiddleware)


origins = [
    "http://localhost:3000",   # React / Next
    "http://localhost:5173",   # Vite
    "http://localhost:4200",   # Angular
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets_router, prefix="/tickets", tags=["Tickets"])
app.include_router(kanban_router, prefix="/kanban", tags=["Kanban"])
app.include_router(users_router, prefix="/auth", tags=["Auth"])
app.include_router(issues_router)
app.include_router(department)
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])
app.include_router(locations_router)

register_startup(app)
register_shutdown(app)
 