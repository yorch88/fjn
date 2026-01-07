# app/modules/inventory/service.py

from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timedelta
from ..helpers.inventory import calculate_usage_hours

from app.core.db import get_db
from .models import (
    EquipmentCreate,
    EquipmentOut,
    UsageLogCreate,
)


def compute_next_recal(grade: str, ref: datetime | None):
    if grade != "GOLDEN":
        return None
    base = ref or datetime.utcnow()
    return base + timedelta(days=365)

async def create_equipment(data: EquipmentCreate, user):
    db = await get_db()
    now = datetime.utcnow()

    # check duplicates
    exists = await db.inventory_equipment.find_one({
        "$or": [
            {"serial_number": data.serial_number},
            {"part_number": data.part_number}
        ]
    })

    usage_hours = calculate_usage_hours(data.received_at)

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Serial number or part number already exists"
        )
    
    doc = {
        "name": data.name,
        "description": data.description,
        "serial_number": data.serial_number,
        "part_number": data.part_number,
        "family": data.family,
        "model": data.model,
        "status": "ACTIVE",                # ensured
        "grade": data.grade,
        "consignment_type": data.consignment_type,

        "purchaser": data.purchaser,
        "current_owner": data.current_owner,
        "shipped_by": data.shipped_by,

        "total_usage_hours": usage_hours,
        "usage_hours_limit": data.usage_hours_limit if data.grade == "SILVER" else None,

        "received_at": data.received_at or now,

        # we ALWAYS override
        "id_user": user["id"],            # correct
        "last_recal_date": None,          # added
        "next_recal_due_date": None,      # added
        "id_plant": user["id_plant"],     # critical

        "created_at": now,
        "updated_at": now,
    }

    result = await db.inventory_equipment.insert_one(doc)

    doc["id"] = str(result.inserted_id)
    return EquipmentOut(**doc)


async def list_equipment(user):
    db = await get_db()

    cursor = db.inventory_equipment.find({
        "id_plant": user["id_plant"]   # critical
    }).sort("created_at", -1)

    items = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        items.append(doc)

    return items


async def add_usage(data: UsageLogCreate, user):
    db = await get_db()

    equipment = await db.inventory_equipment.find_one({"_id": ObjectId(data.equipment_id)})
    if not equipment:
        raise HTTPException(404, "Equipment not found")

    duration = (data.ended_at - data.started_at).total_seconds() / 3600

    log = {
        "equipment_id": ObjectId(data.equipment_id),
        "fixture_code": data.fixture_code,
        "started_at": data.started_at,
        "ended_at": data.ended_at,
        "duration_hours": duration,
        "created_at": datetime.utcnow(),
        "created_by": user["id"]
    }

    await db.inventory_usage_logs.insert_one(log)

    new_total = equipment.get("total_usage_hours", 0) + duration

    update = {
        "total_usage_hours": new_total,
        "updated_at": datetime.utcnow()
    }

    if equipment["grade"] == "SILVER" and new_total > equipment.get("usage_hours_limit", 400):
        update["status"] = "EXCEEDED_LIMIT"

    await db.inventory_equipment.update_one(
        {"_id": ObjectId(data.equipment_id)},
        {"$set": update}
    )

    return {"message": "Logged"}


async def add_equipment_history(equipment_id, field, old, new, user, reason=None):
    db = await get_db()

    entry = {
        "field": field,
        "old_value": old,
        "new_value": new,
        "changed_by": str(user["clock_num"]),
        "reason": reason,
        "created_at": datetime.utcnow(),
    }

    await db.inventory_equipment.update_one(
        {"_id": ObjectId(equipment_id)},
        {"$push": {"history": entry}}
    )


async def update_equipment(equipment_id: str, data, user):
    db = await get_db()

    equipment = await db.inventory_equipment.find_one({"_id": ObjectId(equipment_id)})
    if not equipment:
        raise HTTPException(404, "Equipment not found")

    # plant-level security
    if equipment["id_plant"] != user["id_plant"]:
        raise HTTPException(403, "Forbidden")

    updates = {}

    for field, new_value in data.model_dump(exclude_unset=True).items():
        if field == "reason":
            continue

        old_value = equipment.get(field)

        if new_value is not None and new_value != old_value:
            updates[field] = new_value

            await add_equipment_history(
                equipment_id,
                field,
                old_value,
                new_value,
                user,
                data.reason,
            )

    if not updates:
        return {"message": "No changes applied"}

    updates["updated_at"] = datetime.utcnow()

    await db.inventory_equipment.update_one(
        {"_id": ObjectId(equipment_id)},
        {"$set": updates}
    )

    return {"message": "Equipment updated"}
