from bson import ObjectId
from fastapi import HTTPException

from typing import List
from app.core.db import get_db
from .models import Ticket, TicketCreate, TicketOut, Comment
from datetime import datetime



async def add_comment_to_ticket(ticket_id: str, message: str, current_user):
    db = await get_db()
    tickets_collection = db.tickets

    ticket = await tickets_collection.find_one({"_id": ObjectId(ticket_id)})

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # 🔐 Seguridad por planta
    if ticket["id_plant"] != current_user["id_plant"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    comment = Comment(
        user_clock=str(current_user["clock_num"]).strip("(),' "),
        message=message,
        created_at=datetime.utcnow(),
    ).model_dump()

    await tickets_collection.update_one(
        {"_id": ObjectId(ticket_id)},
        {
            "$push": {"comments": comment},
            "$set": {"updated_at": datetime.utcnow()},
        },
    )

    return {"message": "Comment added"}


async def list_tickets(plant_id: str):
    db = await get_db()
    cursor = db.tickets.find({"id_plant": plant_id})
    tickets: list[Ticket] = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        tickets.append(Ticket(**doc))

    return tickets




async def create_ticket(data: TicketCreate, user) -> TicketOut:
    """
    Crea un ticket para la planta del usuario autenticado.
    """
    db = await get_db()
    doc = {
        "title": data.title,
        "description": data.description,
        "priority": data.priority,
        "status": "open",
        "requester": user["id"],        # id del usuario que hace la petición
        "id_plant": user["id_plant"],   # planta tomada del token
        "area": data.area,
        "station": data.station,
        "created_at": datetime.utcnow(),
    }

    result = await db.tickets.insert_one(doc)
    doc["id"] = str(result.inserted_id)

    # limpiamos el _id de Mongo para el response
    return TicketOut(**doc)


async def get_tickets_for_user(user) -> List[TicketOut]:
    """
    Devuelve todos los tickets de la planta del usuario.
    """
    db = await get_db()

    cursor = db.tickets.find({"id_plant": user["id_plant"]}).sort("created_at", -1)

    tickets: List[TicketOut] = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        tickets.append(TicketOut(**doc))

    return tickets