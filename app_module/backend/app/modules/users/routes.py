from fastapi import APIRouter, Depends
from .service import register_user, login_user, list_users
from .models import Users, UserCreate, LoginRequest
from app.core.security import security
from app.core.config import settings
from app.modules.users.auth import add_token_to_blacklist
from jose import jwt
from app.core.config import settings
from app.modules.users.auth import add_token_to_blacklist
from app.core.security import get_current_user, security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(tags=["Auth"]) 


@router.post("/register")
async def register(body: UserCreate):
    return await register_user(body)


@router.post("/login")
async def login(data: LoginRequest):
    return await login_user(data)

@router.get("/", response_model=list[Users])
async def get_all():
    return await list_users()

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )

    exp = payload.get("exp")
    if not exp:
        raise HTTPException(status_code=400, detail="Invalid token")

    add_token_to_blacklist(token, exp)

    return {"detail": "Logged out successfully"}
