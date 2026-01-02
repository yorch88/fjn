from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class IssueBase(BaseModel):
    name: str = Field(..., description="Nombre del problema (ej: 'Falla impresora')")
    id_department: str = Field(..., description="Departamento responsable (ej: 'Ingeniería de pruebas')")
    description: Optional[str] = Field(None, description="Descripción opcional del issue")


class IssueCreate(IssueBase):
    pass


class Issue(IssueBase):
    id: str
    created_at: datetime
