from typing import List
from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from .models import TicketCreate, TicketOut
from .service import create_ticket, get_tickets_for_user


router = APIRouter()


@router.post("/", response_model=TicketOut)
async def create_ticket_endpoint(
    body: TicketCreate,
    current_user = Depends(get_current_user),
):
    """
    Crea un ticket ligado a la planta del usuario autenticado.
    """
    return await create_ticket(body, current_user)


@router.get("/", response_model=List[TicketOut])
async def list_tickets_endpoint(
    current_user = Depends(get_current_user),
):
    """
    Lista todos los tickets de la planta del usuario autenticado.
    """
    return await get_tickets_for_user(current_user)