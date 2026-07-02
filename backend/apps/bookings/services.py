from datetime import datetime, timedelta, time, date
from django.utils import timezone
from django.db import transaction
from apps.bookings.models import BookingSlot, Booking


class BookingService:

    @staticmethod
    def generate_slots_for_stadium(stadium, start_date=None, days=30):
        """Auto-generate slots for a stadium based on its working schedule."""
        if not start_date:
            start_date = date.today()

        slots_created = []
        current_date = start_date

        # Convert string times to time objects if needed
        ws = stadium.working_hours_start
        we = stadium.working_hours_end
        if isinstance(ws, str):
            h, m = map(int, ws.split(':'))
            ws = time(h, m)
        if isinstance(we, str):
            h, m = map(int, we.split(':'))
            we = time(h, m)

        for _ in range(days):
            weekday = current_date.weekday()
            if stadium.working_days and weekday not in stadium.working_days:
                current_date += timedelta(days=1)
                continue

            current_time = datetime.combine(current_date, ws)
            end_time = datetime.combine(current_date, we)
            duration = timedelta(minutes=stadium.slot_duration_minutes)

            while current_time + duration <= end_time:
                slot_end = current_time + duration

                slot, created = BookingSlot.objects.get_or_create(
                    stadium=stadium,
                    date=current_date,
                    start_time=current_time.time(),
                    defaults={
                        'end_time': slot_end.time(),
                        'price': stadium.price_per_hour,
                        'status': BookingSlot.Status.AVAILABLE,
                    }
                )
                if created:
                    slots_created.append(slot)

                current_time = slot_end

            current_date += timedelta(days=1)

        return slots_created

    @staticmethod
    def get_stadium_slots(stadium_id, query_date=None):
        """Get all slots for a specific stadium."""
        qs = BookingSlot.objects.filter(stadium_id=stadium_id)
        if query_date:
            qs = qs.filter(date=query_date)
        return qs.order_by('date', 'start_time')

    @staticmethod
    def get_available_slots(date, stadium_id=None):
        """Get available slots, optionally filtered by stadium."""
        qs = BookingSlot.objects.filter(
            date=date,
            status=BookingSlot.Status.AVAILABLE
        )
        if stadium_id:
            qs = qs.filter(stadium_id=stadium_id)
        return qs.order_by('start_time')

    @staticmethod
    @transaction.atomic
    def create_booking(customer, slot_id):
        slot = BookingSlot.objects.select_for_update().get(id=slot_id)
        if slot.status != BookingSlot.Status.AVAILABLE:
            raise ValueError('Slot is not available.')
        slot.status = BookingSlot.Status.BOOKED
        slot.save()
        booking = Booking.objects.create(
            slot=slot,
            customer=customer,
            total_price=slot.price,
            status=Booking.Status.PENDING,
        )

        # Notify admin
        from apps.notifications.models import Notification
        from apps.accounts.models import CustomUser
        admin_users = CustomUser.objects.filter(role='ADMIN')
        for admin in admin_users:
            Notification.objects.create(
                user=admin,
                title='Yangi bron so\'rovi',
                message=f'{customer.first_name} {slot.stadium.name} stadionida {slot.date} kuni {slot.start_time.strftime("%H:%M")}-{slot.end_time.strftime("%H:%M")} vaqt oralig\'ini band qilmoqchi.',
                type='BOOKING_PENDING',
                link='/admin/bronlar',
            )

        # Notify customer
        Notification.objects.create(
            user=customer,
            title='Bron yaratildi',
            message=f'{slot.stadium.name} stadionida {slot.date} kuni {slot.start_time.strftime("%H:%M")}-{slot.end_time.strftime("%H:%M")} uchun bron so\'rovi yuborildi.',
            type='BOOKING_PENDING',
        )

        return booking

    @staticmethod
    @transaction.atomic
    def approve_booking(booking_id, admin=None):
        booking = Booking.objects.select_for_update().get(id=booking_id)
        booking.status = Booking.Status.CONFIRMED
        booking.save()

        # Create chat room
        from apps.chat.models import ChatRoom
        ChatRoom.objects.get_or_create(booking=booking)

        # Notify customer
        from apps.notifications.models import Notification
        Notification.objects.create(
            user=booking.customer,
            title='Bron tasdiqlandi',
            message=f'{booking.slot.stadium.name} stadionida {booking.slot.date} kuni {booking.slot.start_time.strftime("%H:%M")}-{booking.slot.end_time.strftime("%H:%M")} uchun bron tasdiqlandi.',
            type='BOOKING_CONFIRMED',
        )

        return booking

    @staticmethod
    @transaction.atomic
    def reject_booking(booking_id, reason='', admin=None):
        booking = Booking.objects.select_for_update().get(id=booking_id)
        booking.status = Booking.Status.REJECTED
        booking.admin_note = reason
        booking.save()

        # Free the slot
        booking.slot.status = BookingSlot.Status.AVAILABLE
        booking.slot.save()

        # Notify customer
        from apps.notifications.models import Notification
        Notification.objects.create(
            user=booking.customer,
            title='Bron rad etildi',
            message=f'{booking.slot.stadium.name} stadionida {booking.slot.date} kuni uchun bron rad etildi. {reason}',
            type='BOOKING_REJECTED',
        )

        return booking

    @staticmethod
    @transaction.atomic
    def cancel_booking(booking_id, user=None):
        booking = Booking.objects.select_for_update().get(id=booking_id)
        if user and booking.customer != user and not user.is_admin:
            raise PermissionError('Not authorized.')
        booking.status = Booking.Status.CANCELLED
        booking.cancelled_at = timezone.now()
        booking.save()
        booking.slot.status = BookingSlot.Status.AVAILABLE
        booking.slot.save()
        return booking

    @staticmethod
    @transaction.atomic
    def bulk_create_slots(date, start_hour, end_hour, duration_minutes, price, stadium=None):
        slots = []
        current = datetime.combine(date, time(start_hour, 0))
        end = datetime.combine(date, time(min(end_hour, 23), 59))

        while current + timedelta(minutes=duration_minutes) <= end:
            slot_end = current + timedelta(minutes=duration_minutes)
            defaults = {
                'end_time': slot_end.time(),
                'price': price,
                'status': BookingSlot.Status.AVAILABLE,
            }
            if stadium:
                defaults['stadium'] = stadium
            slot, created = BookingSlot.objects.get_or_create(
                date=date,
                start_time=current.time(),
                defaults=defaults,
            )
            if created:
                slots.append(slot)
            current = slot_end

        return slots
