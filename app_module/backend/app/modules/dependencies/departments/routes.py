from fastapi import APIRouter
from typing import List
from .models import DepartmentCreate, DepartmentOut
from .service import create_department, get_department, list_departments

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("/", response_model=DepartmentOut)
async def create(dep: DepartmentCreate):
    return await create_department(dep)


@router.get("/{dep_id}", response_model=DepartmentOut)
async def get(dep_id: str):
    return await get_department(dep_id)

@router.get("/", response_model=List[DepartmentOut])
async def list_departments_endpoint():
    return await list_departments()
