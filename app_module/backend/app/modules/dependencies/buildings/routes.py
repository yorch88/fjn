from fastapi import APIRouter
from typing import List
from .models import BuildingBaseCreate, BuildingBaseOut
from .service import create_BuildingBase, get_BuildingBase, list_BuildingBases

router = APIRouter(prefix="/buildings", tags=["Buildings"])


@router.post("/", response_model=BuildingBaseOut)
async def create(dep: BuildingBaseCreate):
    return await create_BuildingBase(dep)


@router.get("/{dep_id}", response_model=BuildingBaseOut)
async def get(dep_id: str):
    return await get_BuildingBase(dep_id)

@router.get("/", response_model=List[BuildingBaseOut])
async def list_BuildingBases_endpoint():
    return await list_BuildingBases()
