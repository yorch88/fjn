from datetime import datetime
from fastapi import HTTPException

from .models import Users, UserCreate
from .auth import hash_password, verify_password, create_token
from app.core.db import get_db


async def register_user(data: UserCreate):
    db = await get_db()

    # ¿email ya registrado?
    exists = await db.users.find_one({"email": data.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    doc = data.model_dump()
    # password -> hash
    raw_password = doc.pop("password")
    doc["password_hash"] = hash_password(raw_password)
    doc["last_activity"] = None

    result = await db.users.insert_one(doc)
    return {"id": str(result.inserted_id)}


async def login_user(email: str, password: str):
    db = await get_db()

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(
        user_id=str(user["_id"]),
        id_plant=user["id_plant"],
    )

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_activity": datetime.utcnow()}},
    )

    return {"access_token": token, "token_type": "bearer"}


async def list_users():
    db = await get_db()
    cursor = db.users.find({})
    users: list[Users] = []
    async for u in cursor:
        u["id"] = str(u["_id"])
        users.append(Users(**u))
    return users
