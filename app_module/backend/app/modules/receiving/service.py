from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone

from app.core.db import get_db
from ..helpers.mongo import normalize_mongo_doc


# =====================
# RECEIPT
# =====================

async def create_receipt(data, user):
    db = await get_db()
    now = datetime.now(timezone.utc)

    exists = await db.receiving_receipts.find_one({
        "reference_number": data.reference_number,
        "id_plant": user["id_plant"]
    })

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Receipt reference already exists"
        )

    doc = {
        "reference_number": data.reference_number,
        "origin": data.origin,
        "destination": data.destination,
        "status": "OPEN",

        "id_user": user["id"],
        "id_plant": user["id_plant"],

        "created_at": now,
        "updated_at": now,
    }

    result = await db.receiving_receipts.insert_one(doc)

    doc["id"] = str(result.inserted_id)

    doc = normalize_mongo_doc(doc)

    return doc


async def list_receipts(user):
    db = await get_db()

    cursor = db.receiving_receipts.find({
        "id_plant": user["id_plant"]
    }).sort("created_at", -1)

    items = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        doc = normalize_mongo_doc(doc)

        items.append(doc)

    return items


# =====================
# PART NUMBERS
# =====================

async def add_part(receipt_id: str, data, user):
    db = await get_db()
    now = datetime.now(timezone.utc)

    receipt = await db.receiving_receipts.find_one({
        "_id": ObjectId(receipt_id),
        "id_plant": user["id_plant"]
    })

    if not receipt:
        raise HTTPException(404, "Receipt not found")

    exists = await db.receiving_parts.find_one({
        "receipt_id": ObjectId(receipt_id),
        "part_number": data.part_number
    })

    if exists:
        raise HTTPException(400, "Part number already added")

    doc = {
        "receipt_id": ObjectId(receipt_id),
        "part_number": data.part_number,
        "description": data.description,
        "expected_qty": data.expected_qty,
        "is_high_value": data.is_high_value,

        "id_plant": user["id_plant"],

        "created_at": now,
    }

    result = await db.receiving_parts.insert_one(doc)

    doc["id"] = str(result.inserted_id)

    doc = normalize_mongo_doc(doc)

    return doc


async def list_parts(receipt_id: str, user):
    db = await get_db()

    cursor = db.receiving_parts.find({
        "receipt_id": ObjectId(receipt_id),
        "id_plant": user["id_plant"]
    })

    items = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        doc = normalize_mongo_doc(doc)

        items.append(doc)

    return items


# =====================
# RECEIVING ITEMS (mini inventory)
# =====================

async def add_item(part_id: str, data, user):
    db = await get_db()
    now = datetime.now(timezone.utc)

    part = await db.receiving_parts.find_one({
        "_id": ObjectId(part_id),
        "id_plant": user["id_plant"]
    })

    if not part:
        raise HTTPException(404, "Part not found")

    # ==========================
    # SERIAL MODE (SCAN)
    # ==========================

    if data.serial_number:

        exists = await db.receiving_items.find_one({
            "serial_number": data.serial_number
        })

        if exists:
            raise HTTPException(400, "Serial already exists")
        qty = 1
        doc = {
            "receipt_part_id": ObjectId(part_id),
            "serial_number": data.serial_number,
            "asset_tag": data.asset_tag,
            "quantity": qty,
            "description": data.description,
            "status": "RECEIVED",

            "id_plant": user["id_plant"],
            "created_at": now,
        }

        result = await db.receiving_items.insert_one(doc)

        doc["id"] = str(result.inserted_id)

        doc = normalize_mongo_doc(doc)

        return doc


    # ==========================
    # BULK MODE (NO SERIAL)
    # ==========================

    if not data.quantity or data.quantity <= 0:
        raise HTTPException(400, "Quantity must be greater than zero")

    existing_bulk = await db.receiving_items.find_one({
        "receipt_part_id": ObjectId(part_id),
        "serial_number": None
    })

    # If bulk already exists -> UPDATE quantity
    if existing_bulk:

        await db.receiving_items.update_one(
            {"_id": existing_bulk["_id"]},
            {
                "$inc": {"quantity": data.quantity},
                "$set": {"updated_at": now}
            }
        )

        return {
            "message": "Bulk quantity updated"
        }

    # Create first bulk record

    doc = {
        "receipt_part_id": ObjectId(part_id),
        "serial_number": None,
        "quantity": data.quantity,
        "description": data.description,
        "status": "RECEIVED",

        "id_plant": user["id_plant"],

        "created_at": now,
    }

    result = await db.receiving_items.insert_one(doc)

    doc["id"] = str(result.inserted_id)

    doc = normalize_mongo_doc(doc)

    return doc


async def list_items(part_id: str, user):
    db = await get_db()

    cursor = db.receiving_items.find({
        "receipt_part_id": ObjectId(part_id),
        "id_plant": user["id_plant"]
    })

    items = []

    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        doc = normalize_mongo_doc(doc)

        items.append(doc)

    return items


# =====================
# SUMMARY (SUM quantity)
# =====================

async def receipt_summary(receipt_id: str, user):
    db = await get_db()

    pipeline = [
        {
            "$match": {
                "receipt_id": ObjectId(receipt_id),
                "id_plant": user["id_plant"]
            }
        },
        {
            "$lookup": {
                "from": "receiving_items",
                "localField": "_id",
                "foreignField": "receipt_part_id",
                "as": "items"
            }
        },
        {
            "$project": {
                "part_number": 1,
                "expected_qty": 1,
                "received_qty": {
                    "$sum": "$items.quantity"
                }
            }
        }
    ]

    result = []

    async for row in db.receiving_parts.aggregate(pipeline):
        row["id"] = str(row["_id"])
        del row["_id"]
        result.append(row)

    return result


async def update_item(item_id: str, data, user):
    db = await get_db()
    now = datetime.now(timezone.utc)

    item = await db.receiving_items.find_one({
        "_id": ObjectId(item_id),
        "id_plant": user["id_plant"]
    })

    if not item:
        raise HTTPException(404, "Item not found")

    update_fields = {}

    # =====================
    # SERIAL VALIDATION
    # =====================

    if data.serial_number is not None:

        if data.serial_number != item.get("serial_number"):

            exists = await db.receiving_items.find_one({
                "serial_number": data.serial_number,
                "_id": {"$ne": ObjectId(item_id)}
            })

            if exists:
                raise HTTPException(400, "Serial already exists")

        update_fields["serial_number"] = data.serial_number


    # =====================
    # ASSET TAG
    # =====================

    if data.asset_tag is not None:
        update_fields["asset_tag"] = data.asset_tag


    # =====================
    # DESCRIPTION
    # =====================

    if data.description is not None:
        update_fields["description"] = data.description


    # =====================
    # QUANTITY RULES
    # =====================

    is_serial_item = item.get("serial_number") is not None

    if data.quantity is not None:

        if is_serial_item:
            # Force serial items to always be qty=1
            update_fields["quantity"] = 1
        else:
            if data.quantity <= 0:
                raise HTTPException(400, "Quantity must be greater than zero")

            update_fields["quantity"] = data.quantity


    if not update_fields:
        raise HTTPException(400, "No fields to update")


    update_fields["updated_at"] = now

    await db.receiving_items.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_fields}
    )

    updated = await db.receiving_items.find_one(
        {"_id": ObjectId(item_id)}
    )

    updated["id"] = str(updated["_id"])
    del updated["_id"]

    updated = normalize_mongo_doc(updated)

    return updated
