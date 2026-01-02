from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class Users(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    id_department: str
    id_plant: str


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    password: str
    position: List[str] = []
    id_department: str
    id_manager: Optional[str] = None
    id_plant: str


class UserDB(BaseModel):
    id: str
    name: str
    email: EmailStr
    clock_num: str
    password_hash: str
    position: List[str]
    id_department: str
    id_manager: Optional[str]
    id_plant: str
    last_activity: datetime | None = None
