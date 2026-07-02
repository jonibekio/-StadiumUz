from datetime import date, time
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.bookings.models import BookingSlot, Booking

User = get_user_model()


class BookingSlotViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.admin = User.objects.create_user(
            phone='+998907654321', username='admin', password='adminpass123',
            role=User.Role.ADMIN
        )
        self.slot = BookingSlot.objects.create(
            date=date.today(),
            start_time=time(10, 0),
            end_time=time(11, 0),
            price='50000',
            status='AVAILABLE'
        )

    def test_list_slots(self):
        response = self.client.get('/api/bookings/slots/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_booking(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/bookings/', {
            'slot_id': str(self.slot.id)
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.slot.refresh_from_db()
        self.assertEqual(self.slot.status, 'BOOKED')

    def test_cancel_booking(self):
        self.client.force_authenticate(user=self.user)
        booking = Booking.objects.create(
            slot=self.slot, customer=self.user, total_price='50000',
            status='CONFIRMED'
        )
        response = self.client.post(f'/api/bookings/{booking.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_my_bookings(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/bookings/my/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_booking(self):
        response = self.client.post('/api/bookings/', {
            'slot_id': str(self.slot.id)
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AdminSlotViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            phone='+998907654321', username='admin', password='adminpass123',
            role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=self.admin)

    def test_admin_list_slots(self):
        response = self.client.get('/api/admin/slots/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_bulk_create_slots(self):
        response = self.client.post('/api/admin/slots/bulk/', {
            'date': date.today().isoformat(),
            'start_hour': 8,
            'end_hour': 12,
            'slot_duration_minutes': 60,
            'price': '50000',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BookingSlot.objects.count(), 4)
