from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


client: AsyncIOMotorClient | None = None
db = None


async def connect():
    global client, db

    client = AsyncIOMotorClient(
        settings.MONGO_URL,
        serverSelectionTimeoutMS=5000,
    )

    # Fuerza conexión real
    await client.admin.command("ping")

    db = client.get_default_database()

    print("✅ MongoDB connected successfully")


async def get_db():
    if db is None:
        raise RuntimeError("Database not initialized. Call connect() first.")
    return db


async def close():
    if client:
        client.close()
        print("MongoDB connection closed")
