from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_data = {
            'phone': '+998901234567',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123',
        }

    def test_register_success(self):
        response = self.client.post('/api/auth/register/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['phone'], self.valid_data['phone'])

    def test_register_duplicate_phone(self):
        User.objects.create_user(phone='+998901234567', username='existing', password='pass123')
        response = self.client.post('/api/auth/register/', self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_short_password(self):
        data = {**self.valid_data, 'password': '123'}
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'phone': '+998901234567', 'password': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_login_wrong_password(self):
        response = self.client.post('/api/auth/login/', {
            'phone': '+998901234567', 'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        response = self.client.post('/api/auth/login/', {
            'phone': '+998999999999', 'password': 'pass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], self.user.phone)

    def test_update_profile(self):
        response = self.client.patch('/api/auth/me/', {'first_name': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_unauthenticated_profile(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ChangePasswordViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='oldpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        response = self.client.post('/api/auth/change-password/', {
            'old_password': 'oldpass123',
            'new_password': 'newpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))

    def test_change_password_wrong_old(self):
        response = self.client.post('/api/auth/change-password/', {
            'old_password': 'wrongpass',
            'new_password': 'newpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
