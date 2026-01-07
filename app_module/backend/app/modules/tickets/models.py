from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime 


class Ticket(BaseModel):
    id: Optional[str] = None
    title: str

class TicketCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    area: Optional[str] = None
    id_department: Optional[str] = None
    station: Optional[str] = None
    issue_id: Optional[str] = None


class TicketInDB(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    requester: str
    id_plant: str
    created_at: datetime

class Comment(BaseModel):
    user_clock: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChangeLog(BaseModel):
    field: str
    old_value: str | None = None
    new_value: str | None = None
    changed_by: str
    reason: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TicketOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    status: str
    requester: Optional[str] = None
    id_plant: str
    comments: List[Comment] = []
    area: Optional[str] = None
    station: Optional[str] = None
    created_at: Optional[datetime] = None
    history: List[ChangeLog] = []
    issue_id: Optional[str] = None
    id_department: str
    assigned_to: str | None = None
    assignment_history: list[dict] = []
    
class TicketUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    description: str | None = None
    area: str | None = None
    station: str | None = None
    reason: str | None = None

class AssignBody(BaseModel):
    user_id: str
    note: str | None = None
