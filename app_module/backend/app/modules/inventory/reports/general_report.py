from app.core.db import get_db
from datetime import datetime, timedelta
from fastapi import HTTPException


DATE_FIELDS = {
    "created_at",
    "updated_at",
    "received_at",
    "last_recal_date",
    "next_recal_due_date",
}

ALLOWED_FIELDS = {
    "serial_number",
    "part_number",
    "description",
    "model",
    "family",
    "grade",
    "status",
    "created_clock",
    "current_owner",
    "consignment_type",
    "name",   # alias opcional
} | DATE_FIELDS


async def get_report(field: str, op: str, value: str | None, user):
    db = await get_db()

    # seguridad por planta
    query = {"id_plant": user["id_plant"]}

    # validar campo
    if field not in ALLOWED_FIELDS:
        raise HTTPException(400, detail=f"Unsupported field: {field}")

    # si pidió “todo”
    if op == "empty":
        cursor = db.inventory_equipment.find(query).sort("created_at", -1)
        return await _collect(cursor)

    # =============================
    #      FILTROS DE FECHA
    # =============================
    if field in DATE_FIELDS:
        if not value:
            raise HTTPException(400, detail="Value is required for date filters")

        try:
            dt = datetime.fromisoformat(value)
        except ValueError:
            raise HTTPException(400, detail="Invalid date format, use YYYY-MM-DD")

        if op == "==":
            start = dt
            end = dt + timedelta(days=1)
            query[field] = {"$gte": start, "$lt": end}

        elif op == ">":
            query[field] = {"$gt": dt}

        elif op == "<":
            query[field] = {"$lt": dt}

        else:
            raise HTTPException(400, detail="Operator not supported for dates")

    # =============================
    #      STRINGS / NUMÉRICOS
    # =============================
    else:

        # alias: name → busca en name OR description
        if field == "name" and op == "contains":
            query["$or"] = [
                {"name": {"$regex": value, "$options": "i"}},
                {"description": {"$regex": value, "$options": "i"}},
            ]

        elif op == "==":
            query[field] = {"$eq": value}

        elif op == "<>":
            query[field] = {"$ne": value}

        elif op == "contains":
            query[field] = {"$regex": value, "$options": "i"}

        elif op == ">":
            query[field] = {"$gt": value}

        elif op == "<":
            query[field] = {"$lt": value}

        else:
            raise HTTPException(400, detail="Unsupported operator")

    cursor = db.inventory_equipment.find(query).sort("created_at", -1)
    return await _collect(cursor)


async def _collect(cursor):
    """Convierte cursor Mongo → lista segura (nunca null)."""
    results = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id")
        results.append(doc)

    return results
