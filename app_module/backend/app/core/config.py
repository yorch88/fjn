import os
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    # =========================
    # Environment
    # =========================

    APP_ENV: str = Field(default="development")

    # =========================
    # Security
    # =========================

    SECRET_KEY: str = Field(default="change-me")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRE_MINUTES: int = Field(default=60)

    API_KEY: str | None = None

    # =========================
    # Database
    # =========================

    MONGO_URL: str = Field(default="mongodb://mongo:27017/support_dev")
    REDIS_URL: str = Field(default="redis://redis:6379/0")

    # =========================
    # Timezone
    # =========================

    TIMEZONE: str = Field(default="America/Mexico_City")

    # =========================
    # Helpers
    # =========================

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV == "development"

    @property
    def is_prod(self) -> bool:
        return self.APP_ENV == "production"

    # =========================
    # Startup Validation
    # =========================

    def validate_environment(self):
        """
        Prevent dangerous misconfiguration
        """

        if self.is_prod:
            if "support_dev" in self.MONGO_URL:
                raise RuntimeError(
                    "PRODUCTION is pointing to DEV database"
                )

            if self.SECRET_KEY == "change-me":
                raise RuntimeError(
                    "SECRET_KEY must be set in production"
                )


settings = Settings(
    APP_ENV=os.getenv("APP_ENV", "development"),
    SECRET_KEY=os.getenv("SECRET_KEY", "change-me"),
    JWT_ALGORITHM=os.getenv("JWT_ALGORITHM", "HS256"),
    JWT_EXPIRE_MINUTES=int(os.getenv("JWT_EXPIRE_MINUTES", 60)),
    API_KEY=os.getenv("API_KEY"),

    MONGO_URL=os.getenv("MONGO_URL", "mongodb://mongo:27017/support_dev"),
    REDIS_URL=os.getenv("REDIS_URL", "redis://redis:6379/0"),

    TIMEZONE=os.getenv("TZ", "America/Mexico_City"),
)

# Run validation once on import
settings.validate_environment()
