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


from datetime import datetime, timedelta
from jose import jwt

from app.core.config import settings

# =========================
#  TOKEN BLACKLIST (simple)
# =========================
TOKEN_BLACKLIST: dict[str, datetime] = {}

def add_token_to_blacklist(token: str, expires_in_seconds: int):
    """
    Guardamos el token como inválido hasta que expire.
    """
    expire_at = datetime.utcfromtimestamp(expires_in_seconds)
    TOKEN_BLACKLIST[token] = expire_at
    


def is_token_blacklisted(token: str) -> bool:
    """
    Revisa si el token está revocado.
    Limpia automáticamente tokens expirados.
    """
    exp = TOKEN_BLACKLIST.get(token)
    if not exp:
        return False

    if exp < datetime.utcnow():
        TOKEN_BLACKLIST.pop(token, None)
        return False

    return True
