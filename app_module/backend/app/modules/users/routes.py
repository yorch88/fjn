from fastapi import APIRouter
from .service import register_user, login_user
from .models import UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(body: UserCreate):
    return await register_user(body)


@router.post("/login")
async def login(email: str, password: str):
    return await login_user(email, password)
