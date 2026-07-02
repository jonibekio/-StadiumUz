from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.comments.models import Comment

User = get_user_model()


class CommentViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )

    def test_list_comments(self):
        response = self.client.get('/api/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_comment(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/comments/create/', {
            'text': 'Great field!',
            'rating': 5,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

    def test_create_comment_invalid_rating(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/comments/create/', {
            'text': 'Bad rating',
            'rating': 10,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_low_rating(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/comments/create/', {
            'text': 'Zero rating',
            'rating': 0,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_own_comment(self):
        self.client.force_authenticate(user=self.user)
        comment = Comment.objects.create(user=self.user, rating=5, text='My review')
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_comment(self):
        response = self.client.post('/api/comments/create/', {
            'text': 'Anonymous',
            'rating': 5,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
