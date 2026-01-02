from fastapi import APIRouter
from .service import register_user, login_user, list_users
from .models import Users, UserCreate

router = APIRouter(tags=["Auth"]) 


@router.post("/register")
async def register(body: UserCreate):
    return await register_user(body)


@router.post("/login")
async def login(email: str, password: str):
    return await login_user(email, password)


@router.get("/", response_model=list[Users])
async def get_all():
    return await list_users()