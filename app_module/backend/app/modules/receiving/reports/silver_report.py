from app.core.db import get_db
from datetime import datetime, timedelta
from fastapi import HTTPException


async def get_silver_hours_report(user, threshold: float = 50):
    db = await get_db()

    now = datetime.utcnow()

    cursor = db.inventory_equipment.find({
        "id_plant": user["id_plant"],
        "grade": "SILVER",
        "received_at": {"$ne": None}
    })

    results = []

    async for eq in cursor:
        received = eq["received_at"]

        hours_used = (now - received).total_seconds() / 3600
        limit = eq.get("usage_hours_limit") or 0
        remaining = limit - hours_used

        if remaining <= threshold:
            results.append({
                "id": str(eq["_id"]),
                "serial_number": eq["serial_number"],
                "part_number": eq.get("part_number"),
                "grade": eq["grade"],
                "usage_hours_limit": limit,
                "hours_used": round(hours_used, 2),
                "hours_remaining": round(remaining, 2),
                "received_at": received,
                "status": "WARNING" if remaining > 0 else "EXCEEDED",
            })

    return results