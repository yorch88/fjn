from app.core.config import settings

if settings.is_dev:
    print("Running in development mode")
    print("API KEY:", settings.API_KEY)
