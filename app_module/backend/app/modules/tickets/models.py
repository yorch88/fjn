from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime 


class Ticket(BaseModel):
    id: Optional[str] = None
    title: str

class TicketCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    area: Optional[str] = None
    station: Optional[str] = None


class TicketInDB(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    requester: str
    id_plant: str
    created_at: datetime


class TicketOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    status: str
    requester: Optional[str] = None
    id_plant: str
    area: Optional[str] = None
    station: Optional[str] = None
    created_at: Optional[datetime] = None