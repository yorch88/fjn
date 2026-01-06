from fastapi import APIRouter, Depends
from typing import List

from app.core.security import get_current_user
from .models import EquipmentCreate, EquipmentOut, UsageLogCreate
from .service import create_equipment, list_equipment, add_usage

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