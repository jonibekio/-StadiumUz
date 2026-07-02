from apps.notifications.models import Notification


def create_notification(user, title, message, notif_type):
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type=notif_type,
    )
