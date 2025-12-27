from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def sample():
    return [{"title": "Example", "status": "todo"}]
