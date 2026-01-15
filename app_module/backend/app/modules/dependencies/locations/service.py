from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from app.core.db import get_db

COLL = "inventory_locations"

def _oid(id: str) -> ObjectId:
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(400, detail="Invalid id")

def _clean(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc

async def ensure_indexes(db):
    # unique: id_plant + coords
    await db[COLL].create_index(
        [("id_plant", 1), ("zone", 1), ("aisle", 1), ("rack", 1), ("level", 1), ("position", 1)],
        unique=True,
        name="uniq_location_coords",
    )

async def create_location(payload, user):
    db = await get_db()
    await ensure_indexes(db)

    now = datetime.utcnow()
    doc = payload.model_dump()
    doc.update({
        "id_plant": user["id_plant"],
        "created_at": now,
        "updated_at": now,
        "active": True,
    })

    try:
        res = await db[COLL].insert_one(doc)
    except Exception as e:
        # típico duplicate key error
        raise HTTPException(409, detail="Location already exists")

    saved = await db[COLL].find_one({"_id": res.inserted_id})
    return _clean(saved)

async def list_locations(user):
    db = await get_db()
    cursor = db[COLL].find({"id_plant": user["id_plant"]}).sort([("zone", 1), ("aisle", 1), ("rack", 1)])
    out = []
    async for d in cursor:
        out.append(_clean(d))
    return out

async def get_location(location_id: str, user):
    db = await get_db()
    doc = await db[COLL].find_one({"_id": _oid(location_id), "id_plant": user["id_plant"]})
    if not doc:
        raise HTTPException(404, detail="Location not found")
    return _clean(doc)

async def update_location(location_id: str, payload, user):
    db = await get_db()
    now = datetime.utcnow()

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return await get_location(location_id, user)

    updates["updated_at"] = now

    try:
        res = await db[COLL].update_one(
            {"_id": _oid(location_id), "id_plant": user["id_plant"]},
            {"$set": updates},
        )
    except Exception:
        raise HTTPException(409, detail="Location already exists (duplicate coords)")

    if res.matched_count == 0:
        raise HTTPException(404, detail="Location not found")

    return await get_location(location_id, user)

async def delete_location(location_id: str, user):
    db = await get_db()
    res = await db[COLL].delete_one({"_id": _oid(location_id), "id_plant": user["id_plant"]})
    if res.deleted_count == 0:
        raise HTTPException(404, detail="Location not found")
    return {"detail": "Deleted"}
