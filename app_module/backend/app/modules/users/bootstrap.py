from app.core.db import get_db
from app.modules.users.auth import hash_password
from datetime import datetime, timezone
from app.core.config import settings
import os


async def create_admin_user():
    db = await get_db()

    email = os.getenv("ADMIN_EMAIL")

    if not email:
        print("ADMIN_EMAIL not defined, skipping admin creation")
        return

    exists = await db.users.find_one({"email": email})

    if exists:
        print("Admin user already exists")
        return

    admin_doc = {
        "name": os.getenv("ADMIN_NAME", "Admin"),
        "email": email,
        "clock_num": os.getenv("ADMIN_CLOCK", "0000"),
        "password_hash": hash_password(os.getenv("ADMIN_PASSWORD")),
        "position": ["admin"],
        "id_department": None,
        "id_manager": None,
        "id_plant": None,
        "last_activity": None,
        "level": ["superadmin"],
        "created_at": datetime.now(timezone.utc)
    }

    await db.users.insert_one(admin_doc)

    print("✅ Admin user created successfully")
