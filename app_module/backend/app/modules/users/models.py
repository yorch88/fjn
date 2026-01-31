from pydantic import BaseModel, EmailStr
from typing import List, Optional, Literal
from datetime import datetime

Role = Literal["admin", "superadmin", "viewer", "editor"]

class Users(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    id_department: Optional[str] = None
    id_plant: Optional[str] = None
    level: List[Role] = ["viewer"]


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    password: str
    position: List[str] = []
    id_manager: Optional[str] = None
    id_department: Optional[str] = None 
    id_plant: Optional[str] = None
    level: List[Role] = ["viewer"]


class UserDB(BaseModel):
    id: str
    name: str
    email: EmailStr
    clock_num: str
    password_hash: str
    position: List[str]
    id_department: Optional[str] = None 
    id_manager: Optional[str] = None
    id_plant: Optional[str] = None
    level: List[Role] = ["viewer"]
    last_activity: datetime | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str