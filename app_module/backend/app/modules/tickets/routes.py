from fastapi import APIRouter
from .models import Ticket
from .service import list_tickets, create_ticket

router = APIRouter()

@router.get("/", response_model=list[Ticket])
async def get_all():
    return await list_tickets()

@router.post("/", response_model=Ticket)
async def create(ticket: Ticket):
    return await create_ticket(ticket)
