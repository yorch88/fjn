from fastapi import APIRouter, Depends, Request

from app.core.security import get_current_user
from app.shared.utils import ensure_same_plant
from .service import list_tickets, create_ticket

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/")
async def get_all(request: Request, user=Depends(get_current_user)):
    ensure_same_plant(user, user["id_plant"])
    return await list_tickets(user["id_plant"])


@router.post("/")
async def create(request: Request, data: dict, user=Depends(get_current_user)):
    data["id_plant"] = user["id_plant"]
    ensure_same_plant(user, data["id_plant"])
    return await create_ticket(data)
 