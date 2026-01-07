# app/modules/inventory/models.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class EquipmentCreate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    serial_number: str
    part_number: Optional[str] = None
    family: Optional[str] = None
    model: Optional[str] = None

    # id_user: Optional[str] = None      # optional — we do NOT trust it
    grade: str                 # GOLDEN | SILVER
    consignment_type: str      # JUNIPER / FOXCONN...

    purchaser: Optional[str] = None
    current_owner: Optional[str] = None
    shipped_by: Optional[str] = None

    usage_hours_limit: float | None = 400
    received_at: datetime | None = None


class EquipmentOut(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

    id: str
    id_user: str

    serial_number: str
    part_number: Optional[str]
    family: Optional[str]
    model: Optional[str]

    grade: str
    status: str = "ACTIVE"                 # default value

    consignment_type: str
    purchaser: Optional[str]
    current_owner: Optional[str]
    shipped_by: Optional[str]

    total_usage_hours: float
    usage_hours_limit: float | None

    last_recal_date: Optional[datetime] = None      # optional
    next_recal_due_date: Optional[datetime] = None  # optional

    created_at: datetime
    updated_at: datetime


class UsageLogCreate(BaseModel):
    equipment_id: str
    fixture_code: Optional[str] = None
    started_at: datetime
    ended_at: datetime


class UsageLogOut(BaseModel):
    id: str
    equipment_id: str
    fixture_code: Optional[str]
    duration_hours: float
    created_at: datetime


class OwnershipHistoryOut(BaseModel):
    id: str
    owner: str
    from_date: datetime
    to_date: Optional[datetime]


class EquipmentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    serial_number: str | None = None
    part_number: str | None = None
    family: str | None = None
    model: str | None = None
    grade: str | None = None           # SILVER / GOLDEN
    status: str | None = None          # ACTIVE / INACTIVE
    consignment_type: str | None = None
    purchaser: str | None = None
    current_owner: str | None = None
    shipped_by: str | None = None
    usage_hours_limit: float | None = None
    received_at: datetime | None = None
    last_recal_date: datetime | None = None
    next_recal_due_date: datetime | None = None
    reason: str | None = None          # explanation of the change
