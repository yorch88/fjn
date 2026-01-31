import os
import time
from pymongo import MongoClient
from pymongo.errors import OperationFailure

ROOT_USER = os.getenv("MONGO_ROOT_USER")
ROOT_PASS = os.getenv("MONGO_ROOT_PASS")
APP_USER = os.getenv("MONGO_APP_USER")
APP_PASS = os.getenv("MONGO_APP_PASS")
DB_NAME = os.getenv("MONGO_DB")

ROOT_URI = f"mongodb://{ROOT_USER}:{ROOT_PASS}@mongo:27017/admin"

print("⏳ Waiting for MongoDB...")

for i in range(20):
    try:
        client = MongoClient(ROOT_URI, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        print("✅ Mongo is ready")
        break
    except Exception:
        print("⏳ Mongo not ready yet...")
        time.sleep(3)
else:
    raise RuntimeError("Mongo never became ready")

db = client[DB_NAME]

try:
    users = db.command("usersInfo")["users"]
    exists = any(u["user"] == APP_USER for u in users)

    if exists:
        print("✅ Mongo app user already exists")
    else:
        print("🚀 Creating Mongo app user...")
        db.command(
            "createUser",
            APP_USER,
            pwd=APP_PASS,
            roles=[{"role": "readWrite", "db": DB_NAME}],
        )
        print("✅ Mongo app user created")

except OperationFailure as e:
    print("❌ Mongo bootstrap error:", e)
    raise
