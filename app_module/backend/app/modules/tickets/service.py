from bson import ObjectId
from fastapi import HTTPException

from typing import List
from app.core.db import get_db
from .models import Ticket, TicketCreate, TicketOut, Comment, TicketUpdate
from datetime import datetime
from app.modules.dependencies.issues.service import get_issue


async def add_comment_to_ticket(ticket_id: str, message: str, current_user):
    db = await get_db()
    tickets_collection = db.tickets

    ticket = await tickets_collection.find_one({"_id": ObjectId(ticket_id)})

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Plant security
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


async def update_ticket_service(ticket_id: str, data: TicketCreate, user):
    db = await get_db()

    ticket = await db.tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        raise HTTPException(404, "Ticket not found")

    updates = {}

    # if the issue changed
    if data.issue_id and data.issue_id != ticket.get("issue_id"):
        issue = await get_issue(data.issue_id)
        updates["issue_id"] = data.issue_id
        updates["assigned_department"] = issue.department

        # history
        ticket.setdefault("change_history", [])
        ticket["change_history"].append({
            "field": "issue_id",
            "old": ticket.get("issue_id"),
            "new": data.issue_id,
            "changed_by": str(user["clock_num"]),
            "changed_at": datetime.utcnow(),
        })

        updates["change_history"] = ticket["change_history"]

    # apply update
    await db.tickets.update_one(
        {"_id": ObjectId(ticket_id)},
        {"$set": updates}
    )

    ticket.update(updates)
    ticket["id"] = str(ticket["_id"])
    del ticket["_id"]

    return TicketOut(**ticket)


async def create_ticket(data: TicketCreate, user) -> TicketOut:
    db = await get_db()

    id_department = data.id_department

    # If issue is provided, use its department as auto-assignment
    if data.issue_id:
        issue = await get_issue(data.issue_id)
        if issue and issue.department:
            id_department = issue.department

    doc = {
        "title": data.title,
        "description": data.description,
        "priority": data.priority,
        "status": "open",

        "requester": user["id"],
        "id_plant": user["id_plant"],

        # "area": data.area,
        "station": data.station,

        "issue_id": data.issue_id,
        "id_department": id_department,   # only this one

        "assigned_to": None,
        "assignment_history": [],

        "comments": [],
        "change_history": [],

        "created_at": datetime.utcnow(),
    }

    result = await db.tickets.insert_one(doc)
    doc["id"] = str(result.inserted_id)

    return TicketOut(**doc)


async def get_tickets_for_user(user) -> List[TicketOut]:
    """
    Returns all tickets for the user's plant.
    """
    db = await get_db()

    cursor = db.tickets.find({"id_plant": user["id_plant"]}).sort("created_at", -1)

    tickets: List[TicketOut] = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        tickets.append(TicketOut(**doc))

    return tickets


async def add_history(ticket_id: str, field: str, old, new, user, reason=None):
    db = await get_db()
    clock = user["clock_num"]
    if isinstance(clock, tuple):
        clock = clock[0]

    entry = {
        "field": field,
        "old_value": str(old) if old is not None else None,
        "new_value": str(new) if new is not None else None,
        "changed_by": str(clock),
        "reason": reason,
        "created_at": datetime.utcnow(),
    }

    await db.tickets.update_one(
        {"_id": ObjectId(ticket_id)},
        {"$push": {"history": entry}}
    )


async def update_ticket_service(ticket_id: str, data: TicketUpdate, user):
    db = await get_db()

    ticket = await db.tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket["id_plant"] != user["id_plant"]:
        raise HTTPException(403, "Forbidden")

    updates = {}

    for field in ["status", "priority", "description", "area", "station"]:
        new_value = getattr(data, field)
        if new_value is not None and new_value != ticket.get(field):
            updates[field] = new_value

            await add_history(
                ticket_id,
                field,
                ticket.get(field),
                new_value,
                user,
                data.reason,
            )

    if not updates:
        return {"message": "No changes applied"}

    updates["updated_at"] = datetime.utcnow()

    await db.tickets.update_one(
        {"_id": ObjectId(ticket_id)},
        {"$set": updates}
    )

    return {"message": "Ticket updated"}


async def assign_ticket(ticket_id: str, user_id: str, current_user):
    db = await get_db()
    ticket = await db.tickets.find_one({"_id": ObjectId(ticket_id)})

    if ticket["id_plant"] != current_user["id_plant"]:
        raise HTTPException(403, "Forbidden")

    record = {
        "previous": ticket.get("assigned_to"),
        "new": user_id,
        "changed_by": str(current_user["clock_num"]).strip(),
        "date": datetime.utcnow(),
    }

    await db.tickets.update_one(
        {"_id": ObjectId(ticket_id)},
        {
            "$set": {"assigned_to": user_id},
            "$push": {"assignment_history": record},
        },
    )

    return {"message": "Assigned"}
