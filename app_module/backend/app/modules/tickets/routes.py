from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.security import get_current_user
from .models import TicketCreate, TicketOut, TicketUpdate, AssignBody
from .service import (create_ticket, get_tickets_for_user, add_comment_to_ticket,
                      update_ticket_service, assign_ticket)


router = APIRouter()


class CommentCreate(BaseModel):
    message: str


@router.post("/{ticket_id}/comment")
async def add_comment(
    ticket_id: str,
    body: CommentCreate,
    current_user = Depends(get_current_user),):
    return await add_comment_to_ticket(ticket_id, body.message, current_user)

@router.post("/", response_model=TicketOut)
async def create_ticket_endpoint(
    body: TicketCreate,
    current_user = Depends(get_current_user),):
    """
    Crea un ticket ligado a la planta del usuario autenticado.
    """
    return await create_ticket(body, current_user)


@router.get("/", response_model=List[TicketOut])
async def list_tickets_endpoint(
    current_user = Depends(get_current_user),):
    """
    Lista todos los tickets de la planta del usuario autenticado.
    """
    return await get_tickets_for_user(current_user)

@router.patch("/{ticket_id}")
async def update_ticket(
    ticket_id: str,
    body: TicketUpdate,
    current_user = Depends(get_current_user)):
    return await update_ticket_service(ticket_id, body, current_user)

@router.post("/{ticket_id}/assign")
async def assign_user(ticket_id: str, body: AssignBody, current_user = Depends(get_current_user)):
    return await assign_ticket(ticket_id, body.user_id, current_user)
