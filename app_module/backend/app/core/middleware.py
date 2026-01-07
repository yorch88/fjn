from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from jose import jwt
from app.core.config import settings

PUBLIC_PATHS = [
    "/auth/login",
    "/auth/register",
    "/tickets/public",

    # Internal FastAPI / Swagger routes
    "/docs",
    "/openapi.json",
    "/redoc",
]

class PlantGuardMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        path = request.url.path

        # If the route is allowed, we do not check the token
        if any(path.startswith(p) for p in PUBLIC_PATHS):
            return await call_next(request)

        token = request.headers.get("Authorization")

        if not token:
            raise HTTPException(status_code=401, detail="Missing token")

        token = token.replace("Bearer ", "")

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")

        request.state.user = {
            "id": payload.get("sub"),
            "id_plant": payload.get("id_plant"),
        }

        return await call_next(request)
