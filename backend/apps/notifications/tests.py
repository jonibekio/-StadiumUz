from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.notifications.models import Notification
from apps.notifications.services import create_notification

User = get_user_model()


class NotificationViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_list_notifications(self):
        Notification.objects.create(
            user=self.user, title='Test', message='Hello',
            type='ANNOUNCEMENT'
        )
        response = self.client.get('/api/notifications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_read(self):
        notif = Notification.objects.create(
            user=self.user, title='Test', message='Hello',
            type='ANNOUNCEMENT', is_read=False
        )
        response = self.client.put(f'/api/notifications/{notif.id}/read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)

    def test_mark_all_read(self):
        for i in range(3):
            Notification.objects.create(
                user=self.user, title=f'Test {i}', message='Hello',
                type='ANNOUNCEMENT', is_read=False
            )
        response = self.client.post('/api/notifications/read-all/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Notification.objects.filter(is_read=False).exists())


class NotificationServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )

    def test_create_notification(self):
        notif = create_notification(
            self.user, 'Test Title', 'Test Message', 'BOOKING_CONFIRMED'
        )
        self.assertIsNotNone(notif)
        self.assertEqual(notif.user, self.user)
        self.assertEqual(notif.title, 'Test Title')
