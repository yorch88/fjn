from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class Users(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    id_department: Optional[str] = None
    id_plant: Optional[str] = None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    clock_num: str
    password: str
    position: List[str] = []
    id_manager: Optional[str] = None
    id_department: Optional[str] = None 
    id_plant: Optional[str] = None


class UserDB(BaseModel):
    id: str
    name: str
    email: EmailStr
    clock_num: str
    password_hash: str
    position: List[str]
    id_department: Optional[str] = None 
    id_manager: Optional[str]
    id_department: Optional[str] = None 
    last_activity: datetime | None = None
