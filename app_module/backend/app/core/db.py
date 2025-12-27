from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient | None = None

async def get_db():
    return client.get_default_database()

async def connect():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URL)

async def close():
    client.close()
