import uuid
from django.db import models
from django.conf import settings


class Notification(models.Model):
    class Type(models.TextChoices):
        BOOKING_PENDING = 'BOOKING_PENDING', 'Booking Pending'
        BOOKING_CONFIRMED = 'BOOKING_CONFIRMED', 'Booking Confirmed'
        BOOKING_REJECTED = 'BOOKING_REJECTED', 'Booking Rejected'
        BOOKING_CANCELLED = 'BOOKING_CANCELLED', 'Booking Cancelled'
        BOOKING_COMPLETED = 'BOOKING_COMPLETED', 'Booking Completed'
        NEW_USER = 'NEW_USER', 'New User'
        PAYMENT = 'PAYMENT', 'Payment'
        SYSTEM = 'SYSTEM', 'System'
        CHAT_MESSAGE = 'CHAT_MESSAGE', 'Chat Message'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=Type.choices)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user}"
