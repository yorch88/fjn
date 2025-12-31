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


def create_token(user_id: str, id_plant: str, expires_minutes: int = 60) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": user_id,       # 👈 aquí estará el ID de usuario
        "id_plant": id_plant, # 👈 planta
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
