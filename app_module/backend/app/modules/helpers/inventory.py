from datetime import datetime, timezone

def calculate_usage_hours(received_at):
    if received_at.tzinfo is None:
        received_at = received_at.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    return round((now - received_at).total_seconds() / 3600, 2)