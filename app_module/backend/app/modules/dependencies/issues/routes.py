from fastapi import APIRouter
from typing import List

from .service import create_issue, list_issues, get_issue
from .models import IssueCreate, Issue


router = APIRouter(prefix="/issues", tags=["Issues"])


@router.post("/", response_model=Issue)
async def create_issue_endpoint(body: IssueCreate):
    return await create_issue(body)


@router.get("/", response_model=List[Issue])
async def list_issues_endpoint():
    return await list_issues()


@router.get("/{issue_id}", response_model=Issue)
async def get_issue_endpoint(issue_id: str):
    return await get_issue(issue_id)
