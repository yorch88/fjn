from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user


def require_roles(allowed_roles: list[str]):
    async def role_checker(
        current_user=Depends(get_current_user),
    ):
        user_roles = current_user.get("level", [])

        if not any(role in user_roles for role in allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return current_user

    return role_checker
