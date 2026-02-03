from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.permissions import require_roles
from .service import update_item
from .models import (
    ReceiptCreate,
    ReceiptOut,
    ReceiptPartCreate,
    ReceiptPartOut,
    ReceivingItemCreate,
    ReceivingItemOut,
    ReceivingItemUpdate
)

from .service import (
    create_receipt,
    list_receipts,
    add_part,
    list_parts,
    add_item,
    list_items,
    receipt_summary
)


router = APIRouter(prefix="/receiving")


# =====================
# RECEIPTS
# =====================

@router.post("/receipt", response_model=ReceiptOut)
async def create_receipt_ep(
    body: ReceiptCreate,
    current_user=Depends(get_current_user)
):
    return await create_receipt(body, current_user)


@router.get("/receipt")
async def list_receipts_ep(
    current_user=Depends(get_current_user)
):
    return await list_receipts(current_user)


# =====================
# PART NUMBERS
# =====================

@router.post("/receipt/{receipt_id}/part", response_model=ReceiptPartOut)
async def add_part_ep(
    receipt_id: str,
    body: ReceiptPartCreate,
    current_user=Depends(get_current_user)
):
    return await add_part(receipt_id, body, current_user)


@router.get("/receipt/{receipt_id}/part")
async def list_parts_ep(
    receipt_id: str,
    current_user=Depends(get_current_user)
):
    return await list_parts(receipt_id, current_user)


# =====================
# RECEIVING ITEMS (mini inventory)
# =====================

@router.post("/part/{part_id}/item", response_model=dict)
async def add_item_ep(
    part_id: str,
    body: ReceivingItemCreate,
    current_user=Depends(get_current_user)
):
    return await add_item(part_id, body, current_user)


@router.get("/part/{part_id}/item")
async def list_items_ep(
    part_id: str,
    current_user=Depends(get_current_user)
):
    return await list_items(part_id, current_user)


# =====================
# SUMMARY
# =====================

@router.get("/receipt/{receipt_id}/summary")
async def receipt_summary_ep(
    receipt_id: str,
    current_user=Depends(get_current_user)
):
    return await receipt_summary(receipt_id, current_user)


@router.patch("/item/{item_id}", response_model=ReceivingItemOut)
async def update_item_ep(
    item_id: str,
    body: ReceivingItemUpdate,
    current_user=Depends(require_roles(["admin", "editor"]))
):
    return await update_item(item_id, body, current_user)