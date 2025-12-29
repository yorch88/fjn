from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException

from .models import UserCreate
from .auth import hash_password, verify_password, create_token
from ...core.db import get_db


async def register_user(data: UserCreate):
    db = await get_db()

    exists = await db.users.find_one({"email": data.email})
    if exists:
        raise HTTPException(400, "Email already registered")

    user_doc = data.model_dump()
    user_doc["password_hash"] = hash_password(data.password)
    del user_doc["password"]

    await db.users.insert_one(user_doc)

    return {"message": "User created"}


async def login_user(email: str, password: str):
    db = await get_db()

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "user_id": str(user["_id"]),
        "plant_id": user["id_plant"]
    })

    return {"access_token": token}
