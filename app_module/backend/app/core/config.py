import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings(BaseModel):
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_KEY: str | None = os.getenv("API_KEY")

    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://mongo:27017/support")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV == "development"

settings = Settings()
