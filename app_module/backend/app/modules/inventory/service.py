# app/modules/inventory/service.py

from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timedelta
from ..helpers.inventory import calculate_usage_hours
from ..helpers.mongo import normalize_mongo_doc

from app.core.db import get_db
from .models import (
    EquipmentCreate,
    EquipmentOut,
    UsageLogCreate,
    EquipmentUpdate
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
        "location_id": ObjectId(data.location_id) if data.location_id else None,
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

    doc = normalize_mongo_doc(doc)

    return EquipmentOut(**doc)


async def list_equipment(user):
    db = await get_db()

    cursor = db.inventory_equipment.find({
        "id_plant": user["id_plant"]
    }).sort("created_at", -1)

    items = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        doc = normalize_mongo_doc(doc)

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


async def update_equipment(equipment_id: str, body: EquipmentUpdate, user):
    db = await get_db()

    payload = body.model_dump(exclude_unset=True)

    if not payload:
        raise HTTPException(400, detail="No fields to update")

    payload["updated_at"] = datetime.utcnow()

    result = await db.inventory_equipment.update_one(
        {
            "_id": ObjectId(equipment_id),
            "id_plant": user["id_plant"],
        },
        {"$set": payload},
    )

    if result.matched_count == 0:
        raise HTTPException(404, detail="Equipment not found")

    doc = await db.inventory_equipment.find_one(
        {"_id": ObjectId(equipment_id)}
    )

    doc["id"] = str(doc["_id"])
    del doc["_id"]

    doc = normalize_mongo_doc(doc)

    return EquipmentOut(**doc)


async def move_equipment(equipment_id: str, location_id: str, user):
    db = await get_db()

    equipment_oid = ObjectId(equipment_id)
    location_oid = ObjectId(location_id)

    equipment = await db.inventory_equipment.find_one({
        "_id": equipment_oid,
        "id_plant": user["id_plant"]
    })

    if not equipment:
        raise HTTPException(404, "Equipment not found")

    location = await db.inventory_locations.find_one({
    "_id": ObjectId(location_id),
    "id_plant": user["id_plant"],
    "active": {"$ne": True}
    })

    if not location:
        raise HTTPException(404, "Location not found")

    # ---------- CAPACITY CHECK ----------

    capacity = location.get("capacity")

    if capacity is not None:
        current_count = await db.inventory_equipment.count_documents({
            "location_id": location_id,
            "id_plant": user["id_plant"]
        })

        if current_count >= capacity:
            raise HTTPException(
                status_code=400,
                detail="Location capacity exceeded"
            )

    # ---------- MOVE ----------

    old_location = equipment.get("location_id")

    await db.inventory_equipment.update_one(
        {"_id": equipment_oid},
        {
            "$set": {
                "location_id": location_oid,
                "updated_at": datetime.utcnow()
            }
        }
    )

    # ---------- HISTORY ----------

    history = {
        "equipment_id": equipment_oid,
        "from_location": old_location,
        "to_location": location_oid,
        "moved_by": user["clock_num"],
        "moved_at": datetime.utcnow(),
        "id_plant": user["id_plant"]
    }

    await db.inventory_location_history.insert_one(history)

    return {"detail": "Equipment moved successfully"}
