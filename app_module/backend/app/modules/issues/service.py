from app.core.db import get_db
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException

from .models import Issue, IssueCreate


async def create_issue(data: IssueCreate) -> Issue:
    db = await get_db()

    doc = {
        "name": data.name,
        "department": data.department,
        "description": data.description,
        "created_at": datetime.utcnow(),
    }

    result = await db.issues.insert_one(doc)
    doc["id"] = str(result.inserted_id)

    return Issue(**doc)


async def list_issues() -> list[Issue]:
    db = await get_db()
    cursor = db.issues.find().sort("name", 1)

    issues = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        issues.append(Issue(**doc))

    return issues


async def get_issue(issue_id: str) -> Issue:
    db = await get_db()
    
    doc = await db.issues.find_one({"_id": ObjectId(issue_id)})

    if not doc:
        raise HTTPException(status_code=404, detail="Issue not found")

    doc["id"] = str(doc["_id"])
    del doc["_id"]

    return Issue(**doc)
