from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MAX_LEN = 72


def hash_password(password: str) -> str:
    return pwd_context.hash(password[:MAX_LEN])


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password[:MAX_LEN], hashed)


def create_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.API_KEY,
        algorithm="HS256"
    )
