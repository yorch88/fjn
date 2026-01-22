from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException

from app.core.db import get_db
from app.modules.dependencies.departments.service import get_department


# ======================================================
# Helpers
# ======================================================

async def validate_department_optional(department_id: str):

    if not department_id:
        return

    try:
        await get_department(department_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid department reference: {department_id}"
        )


# ======================================================
# Create Task
# ======================================================

async def create_task(payload):

    db = await get_db()

    # Validate optional departments
    await validate_department_optional(payload.origin_department_id)
    await validate_department_optional(payload.destination_department_id)
    await validate_department_optional(payload.current_department_id)

    task = payload.model_dump()

    now = datetime.utcnow()

    task.update({
        "status": "open",

        # ETA logic
        "eta_at": payload.eta_at if hasattr(payload, "eta_at") else None,
        "is_delayed": False,

        # DHL Timeline
        "events": [
            {
                "type": "CREATED",
                "created_at": now
            }
        ],

        "created_at": now,
        "updated_at": now
    })

    result = await db.tasks.insert_one(task)

    task["id"] = str(result.inserted_id)

    return task


# ======================================================
# Get Single Task
# ======================================================

async def get_task(task_id: str):

    db = await get_db()

    task = await db.tasks.find_one({"_id": ObjectId(task_id)})

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task["id"] = str(task["_id"])
    del task["_id"]

    return task


# ======================================================
# List All Tasks
# ======================================================

async def list_tasks():

    db = await get_db()

    cursor = db.tasks.find().sort("created_at", -1)

    tasks = []

    async for task in cursor:
        task["id"] = str(task["_id"])
        del task["_id"]
        tasks.append(task)

    return tasks


# ======================================================
# Move Task (DHL Tracking)
# ======================================================

async def move_task(task_id: str, to_department_id: str):

    db = await get_db()

    await validate_department_optional(to_department_id)

    task = await get_task(task_id)

    if task.get("current_department_id") == to_department_id:
        raise HTTPException(
            status_code=400,
            detail="Task already in this department"
        )

    event = {
        "type": "MOVED",
        "from_department_id": task.get("current_department_id"),
        "to_department_id": to_department_id,
        "created_at": datetime.utcnow()
    }

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "current_department_id": to_department_id,
                "updated_at": datetime.utcnow()
            },
            "$push": {
                "events": event
            }
        }
    )

    return True


# ======================================================
# Add Comment
# ======================================================

async def add_comment(task_id: str, message: str):

    db = await get_db()

    event = {
        "type": "COMMENT",
        "message": message,
        "created_at": datetime.utcnow()
    }

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$push": {"events": event},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )

    return True


# ======================================================
# Close Task (ETA Validation)
# ======================================================

async def close_task(task_id: str):

    db = await get_db()

    task = await get_task(task_id)

    completed_at = datetime.utcnow()

    # ETA evaluation
    is_delayed = False

    if task.get("eta_at"):
        if completed_at > task["eta_at"]:
            is_delayed = True

    event = {
        "type": "CLOSED",
        "created_at": completed_at,
        "is_delayed": is_delayed
    }

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "status": "closed",
                "completed_at": completed_at,
                "is_delayed": is_delayed,
                "updated_at": completed_at
            },
            "$push": {"events": event}
        }
    )

    return True
