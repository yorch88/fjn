from celery import Celery
from app.core.config import settings

celery = Celery("workers", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

@celery.task
def notify(ticket_id: str):
    return f"notify {ticket_id}"
