from .models import Ticket
from ...core.db import get_db

async def list_tickets():
    db = await get_db()
    cursor = db.tickets.find({})
    return [Ticket(**t) async for t in cursor]

async def create_ticket(ticket: Ticket):
    db = await get_db()
    r = await db.tickets.insert_one(ticket.model_dump())
    ticket.id = str(r.inserted_id)
    return ticket
