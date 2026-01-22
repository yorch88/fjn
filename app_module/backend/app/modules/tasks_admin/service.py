from bson import ObjectId
from datetime import datetime, timezone
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

from datetime import datetime, timezone

async def create_task(payload, user):

    db = await get_db()

    # Validate optional departments
    await validate_department_optional(payload.origin_department_id)
    await validate_department_optional(payload.destination_department_id)
    await validate_department_optional(payload.current_department_id)

    task = payload.model_dump()

    now = datetime.now(timezone.utc)

    eta = payload.eta_at
    if eta:
        if eta.tzinfo is None:
            eta = eta.replace(tzinfo=timezone.utc)

        if eta <= now:
            raise HTTPException(
                status_code=400,
                detail="ETA must be in the future"
            )

    task.update({

        # Ownership
        "created_by": user["id"],

        # Status
        "status": "open",

        # ETA
        "eta_at": eta,
        "is_delayed": False,

        # Events
        "events": [
            {
                "type": "CREATED",
                "created_at": now,
                "user_id": user["id"]
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

async def get_task(task_id: str, user):

    db = await get_db()

    task = await db.tasks.find_one({"_id": ObjectId(task_id)})

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["created_by"] != user["id"]:
        raise HTTPException(403, "Not authorized")

    # ============================
    # LIVE DELAY CALCULATION
    # ============================

    if task.get("status") == "open" and task.get("eta_at"):
        now = datetime.utcnow()
        task["is_delayed"] = now > task["eta_at"]

    task["id"] = str(task["_id"])
    del task["_id"]

    return task



# ======================================================
# List All Tasks
# ======================================================

async def list_tasks(user):

    db = await get_db()

    cursor = db.tasks.find(
        {"created_by": user["id"]}
    ).sort("created_at", -1)

    tasks = []
    now = datetime.utcnow()

    async for task in cursor:

        # ============================
        # LIVE DELAY CALCULATION
        # ============================

        if task.get("status") == "open" and task.get("eta_at"):
            task["is_delayed"] = now > task["eta_at"]

        task["id"] = str(task["_id"])
        del task["_id"]

        tasks.append(task)

    return tasks


# ======================================================
# Move Task (DHL Tracking)
# ======================================================
async def move_task(
    task_id: str,
    to_department_id: str,
    user,
    comment: str = None
):

    db = await get_db()

    # ============================
    # Validate Department
    # ============================

    await validate_department_optional(to_department_id)

    # ============================
    # Load + Ownership validation
    # ============================

    task = await get_task(task_id, user)

    # ============================
    # Business rules
    # ============================

    if task.get("status") == "closed":
        raise HTTPException(
            status_code=400,
            detail="Closed tasks cannot be moved"
        )

    if task.get("current_department_id") == to_department_id:
        raise HTTPException(
            status_code=400,
            detail="Task already in this department"
        )

    now = datetime.utcnow()

    # ============================
    # Tracking Event
    # ============================

    event = {
        "type": "MOVED",

        "from_department_id": task.get("current_department_id"),
        "to_department_id": to_department_id,

        "comment": comment,
        "created_at": now,

        # Audit trail
        "user_id": user["id"]
    }

    # ============================
    # Update DB
    # ============================

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "current_department_id": to_department_id,
                "updated_at": now
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

async def add_comment(task_id: str, user, message: str):

    db = await get_db()

    task = await get_task(task_id, user)

    event = {
        "type": "COMMENT",
        "message": message,
        "created_at": datetime.utcnow(),
        "user_id": user["id"]
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
async def close_task(task_id: str, user, comment: str = None):

    db = await get_db()

    # ============================
    # Load & Authorization
    # ============================

    task = await get_task(task_id, user)

    if task["status"] == "closed":
        raise HTTPException(400, "Task already closed")

    completed_at = datetime.utcnow()
    eta = task.get("eta_at")

    # ============================
    # ETA evaluation
    # ============================

    is_delayed = False
    if eta:
        if eta.replace(tzinfo=None) < completed_at:
            is_delayed = True
    if task.get("eta_at"):
        if completed_at > task["eta_at"]:
            is_delayed = True

    # ============================
    # Tracking Event
    # ============================

    event = {
        "type": "CLOSED",
        "comment": comment,
        "created_at": completed_at,
        "is_delayed": is_delayed,

        # Audit trail
        "user_id": user["id"]
    }

    # ============================
    # DB Update
    # ============================

    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "status": "closed",
                "completed_at": completed_at,
                "is_delayed": is_delayed,
                "updated_at": completed_at
            },
            "$push": {
                "events": event
            }
        }
    )

    return True
