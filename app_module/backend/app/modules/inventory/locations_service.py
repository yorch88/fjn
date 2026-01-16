from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from app.core.db import get_db
from ..helpers.mongo import normalize_mongo_doc


async def create_location(data, user):
    db = await get_db()
    now = datetime.utcnow()

    exists = await db.inventory_locations.find_one({
        "code": data.code,
        "id_plant": user["id_plant"]
    })

    if exists:
        raise HTTPException(400, "Location code already exists")

    doc = {
        "code": data.code,
        "zone": data.zone,
        "aisle": data.aisle,
        "rack": data.rack,
        "level": data.level,

        "position": data.position or "",   # ✅ REQUIRED BY MODEL

        "capacity": data.capacity,

        "active": True,

        "id_plant": user["id_plant"],

        "created_at": now,
        "updated_at": now                # ✅ REQUIRED BY MODEL
    }

    result = await db.inventory_locations.insert_one(doc)

    doc["id"] = str(result.inserted_id)
    del doc["_id"]

    return doc


async def list_locations(user):
    db = await get_db()

    cursor = db.inventory_locations.find({
        "id_plant": user["id_plant"],
        "active": True
    }).sort("code", 1)

    items = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        doc = normalize_mongo_doc(doc)

    items.append(doc)

    return items


async def disable_location(location_id, user):
    db = await get_db()

    result = await db.inventory_locations.update_one(
        {
            "_id": ObjectId(location_id),
            "id_plant": user["id_plant"]
        },
        {"$set": {"active": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "Location not found")

    return {"message": "Location disabled"}
