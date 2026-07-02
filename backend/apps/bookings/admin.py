from django.contrib import admin
from apps.bookings.models import BookingSlot, Booking


@admin.register(BookingSlot)
class BookingSlotAdmin(admin.ModelAdmin):
    list_display = ['date', 'start_time', 'end_time', 'price', 'status']
    list_filter = ['status', 'date']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer', 'slot', 'total_price', 'status', 'created_at']
    list_filter = ['status']
