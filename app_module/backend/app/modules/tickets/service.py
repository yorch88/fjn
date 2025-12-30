from ...core.db import get_db


async def list_tickets(plant_id: str):
    db = await get_db()
    cursor = db.tickets.find({"id_plant": plant_id})
    return [t async for t in cursor]


async def create_ticket(ticket):
    db = await get_db()
    await db.tickets.insert_one(ticket)
    return {"message": "Ticket created"}
