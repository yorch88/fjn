from bson import ObjectId
from fastapi import HTTPException
from app.core.db import get_db
from .models import BuildingBaseCreate, BuildingBaseOut


async def create_BuildingBase(data: BuildingBaseCreate) -> BuildingBaseOut:
    db = await get_db()
    doc = data.model_dump()

    existing = await db.buildings.find_one({"name": doc["name"]})
    if existing:
        raise ValueError("Bulding already Exist")

    result = await db.buildings.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return BuildingBaseOut(**doc)



async def get_BuildingBase(dep_id: str) -> BuildingBaseOut:
    db = await get_db()

    doc = await db.buildings.find_one({"_id": ObjectId(dep_id)})
    if not doc:
        raise HTTPException(404, "BuildingBase not found")

    doc["id"] = str(doc["_id"])
    del doc["_id"]

    return BuildingBaseOut(**doc)

async def list_BuildingBases() -> list[BuildingBaseOut]:
    db = await get_db()
    cursor = db.buildings.find().sort("name", 1)

    deparments = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        deparments.append(BuildingBaseOut(**doc))

    return deparments