from bson import ObjectId
from fastapi import HTTPException
from app.core.db import get_db
from .models import DepartmentCreate, DepartmentOut


async def create_department(data: DepartmentCreate) -> DepartmentOut:
    db = await get_db()
    doc = data.model_dump()

    existing = await db.departments.find_one({"name": doc["name"]})
    if existing:
        raise ValueError("El departamento ya existe")

    result = await db.departments.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return DepartmentOut(**doc)



async def get_department(dep_id: str) -> DepartmentOut:
    db = await get_db()

    doc = await db.departments.find_one({"_id": ObjectId(dep_id)})
    if not doc:
        raise HTTPException(404, "Department not found")

    doc["id"] = str(doc["_id"])
    del doc["_id"]

    return DepartmentOut(**doc)

async def list_departments() -> list[DepartmentOut]:
    db = await get_db()
    cursor = db.departments.find().sort("name", 1)

    deparments = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        deparments.append(DepartmentOut(**doc))

    return deparments