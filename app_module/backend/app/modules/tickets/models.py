from pydantic import BaseModel
from typing import Optional

class Ticket(BaseModel):
    id: Optional[str] = None
    title: str
    status: str = "open"
