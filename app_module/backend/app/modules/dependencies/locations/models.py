from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LocationBase(BaseModel):
    zone: str
    aisle: str
    rack: str
    level: str
    position: str
    description: str = ""
    capacity: Optional[int] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    zone: Optional[str] = None
    aisle: Optional[str] = None
    rack: Optional[str] = None
    level: Optional[str] = None
    position: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None

class LocationOut(LocationBase):
    id: str
    id_plant: str
    created_at: datetime
    updated_at: datetime
