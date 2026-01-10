from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from .models import LocationCreate, LocationUpdate, LocationOut
from .service import (
    create_location, list_locations, get_location, update_location, delete_location
)

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/", response_model=list[LocationOut])
async def list_ep(user=Depends(get_current_user)):
    return await list_locations(user)

@router.post("/", response_model=LocationOut)
async def create_ep(body: LocationCreate, user=Depends(get_current_user)):
    return await create_location(body, user)

@router.get("/{location_id}", response_model=LocationOut)
async def get_ep(location_id: str, user=Depends(get_current_user)):
    return await get_location(location_id, user)

@router.patch("/{location_id}", response_model=LocationOut)
async def update_ep(location_id: str, body: LocationUpdate, user=Depends(get_current_user)):
    return await update_location(location_id, body, user)

@router.delete("/{location_id}")
async def delete_ep(location_id: str, user=Depends(get_current_user)):
    return await delete_location(location_id, user)
