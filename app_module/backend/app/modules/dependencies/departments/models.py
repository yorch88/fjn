from pydantic import BaseModel
from typing import Optional


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentOut(DepartmentBase):
    id: str
    name: str
    description: Optional[str] = None