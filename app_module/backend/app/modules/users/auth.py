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


def create_token(user_id: str, id_plant: str, clock_num: str) -> str:
    payload = {
        "sub": user_id,
        "id_plant": id_plant,
        "clock_num": str(clock_num),
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(
        minutes=int(settings.JWT_EXPIRE_MINUTES)),
    }

    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)