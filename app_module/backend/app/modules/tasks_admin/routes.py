from fastapi import APIRouter, Depends
from typing import List
from app.core.security import get_current_user

from app.modules.tasks_admin.models import (
    TaskCreate,
    TaskMove,
    TaskComment,
    TaskOut
)

from app.modules.tasks_admin.service import (
    create_task,
    get_task,
    list_tasks,
    move_task,
    add_comment,
    close_task
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ----------------
# Create
# ----------------

@router.post("/", response_model=TaskCreate)
async def create_task_endpoint(payload: TaskCreate, user=Depends(get_current_user)):
    return await create_task(payload)


# ----------------
# Get
# ----------------

@router.get("/{task_id}", response_model=TaskOut)
async def get_task_endpoint(task_id: str, user=Depends(get_current_user)):
    return await get_task(task_id)

@router.get("/", response_model=List[TaskOut])
async def get_all_tasks_endpoint(user=Depends(get_current_user)):
    return await list_tasks()



# ----------------
# Move (Tracking)
# ----------------

@router.post("/{task_id}/move")
async def move_task_endpoint(task_id: str, payload: TaskMove, user=Depends(get_current_user)):
    await move_task(task_id, payload.to_department_id)
    return {"status": "ok"}


# ----------------
# Comment
# ----------------

@router.post("/{task_id}/comment")
async def comment_task_endpoint(task_id: str, payload: TaskComment, user=Depends(get_current_user)):
    await add_comment(task_id, payload.message)
    return {"status": "ok"}


# ----------------
# Close
# ----------------

@router.post("/{task_id}/close")
async def close_task_endpoint(task_id: str, user=Depends(get_current_user)):
    await close_task(task_id)
    return {"status": "ok"}
