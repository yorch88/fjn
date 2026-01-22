from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

    origin_department_id: Optional[str] = None
    destination_department_id: Optional[str] = None
    current_department_id: Optional[str] = None

    priority: Optional[str] = None
    eta_at: Optional[datetime] = None


class TaskMove(BaseModel):
    to_department_id: str


class TaskComment(BaseModel):
    message: str


class TaskEventOut(BaseModel):
    type: str
    created_at: datetime

    # For comment event
    message: Optional[str] = None

    # For move / close events
    comment: Optional[str] = None

    from_department_id: Optional[str] = None
    to_department_id: Optional[str] = None

class TaskOut(BaseModel):

    id: str

    title: str
    description: Optional[str] = None

    status: str

    origin_department_id: Optional[str] = None
    destination_department_id: Optional[str] = None
    current_department_id: Optional[str] = None

    eta_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    is_delayed: Optional[bool] = False

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    events: List[TaskEventOut] = []


class TaskETAUpdate(BaseModel):
    eta_at: datetime

class MoveTaskPayload(BaseModel):
    to_department_id: str
    comment: Optional[str] = None

class CloseTaskPayload(BaseModel):
    comment: Optional[str] = None
