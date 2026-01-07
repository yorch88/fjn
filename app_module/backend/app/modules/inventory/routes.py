from fastapi import APIRouter, Depends
from typing import List

from app.core.security import get_current_user
from .models import EquipmentCreate, EquipmentOut, UsageLogCreate, EquipmentUpdate
from .service import create_equipment, list_equipment, add_usage, update_equipment
from .reports.general_report import get_report
from .reports.silver_report import get_silver_hours_report

router = APIRouter()


@router.post("/", response_model=EquipmentOut)
async def create_equipment_ep(body: EquipmentCreate, current_user = Depends(get_current_user)):
    return await create_equipment(body, current_user)


@router.post("/usage")
async def log_usage_ep(body: UsageLogCreate, current_user = Depends(get_current_user)):
    return await add_usage(body, current_user)

@router.get("/")
async def list_equipment_ep(current_user = Depends(get_current_user)):
    return await list_equipment(current_user)


@router.get("/report")
async def report(
    field: str,
    op: str,
    value: str | None = None,
    current_user = Depends(get_current_user)
):
    return await get_report(field, op, value, current_user)

@router.patch("/{equipment_id}")
async def update_equipment_ep(
    equipment_id: str,
    body: EquipmentUpdate,
    current_user = Depends(get_current_user),
):
    return await update_equipment(equipment_id, body, current_user)

@router.get("/report/silver-hours")
async def silver_hours_report(
    threshold: float = 50,
    current_user = Depends(get_current_user),
):
    return await get_silver_hours_report(current_user, threshold)