from fastapi import Request, HTTPException
from jose import jwt, JWTError
from app.core.config import settings
from app.core.db import get_db
from bson import ObjectId


async def get_current_user(request: Request):
    auth = request.headers.get("Authorization")

    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(401, "Missing token")

    token = auth.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, settings.API_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(401, "Invalid token")

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(401, "Invalid token payload")

    db = await get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(401, "User not found")

    request.state.user = user
    return user
