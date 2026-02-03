from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =====================
# RECEIPT
# =====================

class ReceiptCreate(BaseModel):
    reference_number: str
    origin: str
    destination: str


class ReceiptOut(BaseModel):
    id: str
    reference_number: str
    origin: str
    destination: str
    status: str
    created_at: datetime


# =====================
# PART NUMBER
# =====================

class ReceiptPartCreate(BaseModel):
    part_number: str
    description: Optional[str] = None
    expected_qty: int
    is_high_value: bool = False


class ReceiptPartOut(BaseModel):
    id: str
    receipt_id: str
    part_number: str
    description: Optional[str] = None
    expected_qty: int
    is_high_value: bool
    created_at: datetime


# =====================
# RECEIVING ITEM (mini-inventory)
# serial_number is optional:
# - If serial_number provided => quantity forced to 1 in service
# - If serial_number is None => quantity can be > 1 but ONLY one bulk record per part
# =====================

class ReceivingItemCreate(BaseModel):
    serial_number: Optional[str] = None
    asset_tag: Optional[str] = None
    quantity: int = 1
    description: Optional[str] = None


class ReceivingItemOut(BaseModel):
    id: str
    receipt_part_id: str
    serial_number: Optional[str] = None
    asset_tag: Optional[str] = None
    quantity: int
    description: Optional[str] = None
    status: str
    created_at: datetime

class ReceivingItemUpdate(BaseModel):
    serial_number: Optional[str] = None
    asset_tag: Optional[str] = None
    quantity: Optional[int] = None
    description: Optional[str] = None