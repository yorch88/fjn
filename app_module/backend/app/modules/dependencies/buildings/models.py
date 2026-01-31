from pydantic import BaseModel
from typing import Optional


class BuildingBase(BaseModel):
    name: str
    description: Optional[str] = None


class BuildingBaseCreate(BuildingBase):
    pass


class BuildingBaseOut(BuildingBase):
    id: str
    name: str
    description: Optional[str] = None