from pydantic import BaseModel
from typing import Optional


class DepartmentBase(BaseModel):
    name: str           # Ej: Ingeniería de pruebas
    description: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentOut(DepartmentBase):
    id: str
    name: str           # Ej: Ingeniería de pruebas
    description: Optional[str] = None