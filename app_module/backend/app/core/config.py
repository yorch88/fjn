import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    APP_ENV: str = os.getenv("APP_ENV", "development")

    # API key if you need it for other purposes
    API_KEY: str | None = os.getenv("API_KEY")

    JWT_EXPIRE_MINUTES: int | None = os.getenv("JWT_EXPIRE_MINUTES")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-.env")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # DB / Redis
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://mongo:27017/support")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV == "development"


settings = Settings()
