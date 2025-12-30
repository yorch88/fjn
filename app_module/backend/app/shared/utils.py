from fastapi import HTTPException


def ensure_same_plant(user, resource_plant_id: str):
    if str(user["id_plant"]) != str(resource_plant_id):
        raise HTTPException(403, "Access denied for this plant")
