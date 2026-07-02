from datetime import timedelta
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from apps.tournaments.models import Tournament, Team, TeamMember, TournamentRegistration

User = get_user_model()


class TournamentViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.admin = User.objects.create_user(
            phone='+998907654321', username='admin', password='adminpass123',
            role=User.Role.ADMIN
        )
        self.tournament = Tournament.objects.create(
            title='Test Tournament',
            description='Test description',
            start_date=timezone.now() + timedelta(days=7),
            end_date=timezone.now() + timedelta(days=14),
            max_teams=8,
            entry_fee='100000',
            status='UPCOMING'
        )

    def test_list_tournaments(self):
        response = self.client.get('/api/tournaments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tournament_detail(self):
        response = self.client.get(f'/api/tournaments/{self.tournament.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Tournament')

    def test_admin_create_tournament(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/admin/tournaments/', {
            'title': 'New Tournament',
            'description': 'New description',
            'start_date': (timezone.now() + timedelta(days=30)).isoformat(),
            'end_date': (timezone.now() + timedelta(days=37)).isoformat(),
            'max_teams': 16,
            'entry_fee': '50000',
            'status': 'UPCOMING',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_delete_tournament(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/admin/tournaments/{self.tournament.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_non_admin_create_tournament(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/admin/tournaments/', {
            'title': 'Should Fail',
            'description': 'Nope',
            'start_date': timezone.now().isoformat(),
            'end_date': timezone.now().isoformat(),
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TeamViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_team(self):
        response = self.client.post('/api/tournaments/teams/', {'name': 'My Team'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)

    def test_my_teams(self):
        team = Team.objects.create(name='My Team', captain=self.user)
        TeamMember.objects.create(team=team, user=self.user)
        response = self.client.get('/api/tournaments/my-teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


class TournamentRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone='+998901234567', username='testuser', password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            title='Test Tournament',
            description='Test',
            start_date=timezone.now() + timedelta(days=7),
            end_date=timezone.now() + timedelta(days=14),
            max_teams=8,
            status='UPCOMING'
        )
        self.team = Team.objects.create(name='My Team', captain=self.user)

    def test_register_for_tournament(self):
        response = self.client.post(
            f'/api/tournaments/{self.tournament.id}/register/',
            {'team_id': str(self.team.id)},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TournamentRegistration.objects.count(), 1)

    def test_duplicate_registration(self):
        TournamentRegistration.objects.create(
            tournament=self.tournament, team=self.team, status='CONFIRMED'
        )
        response = self.client.post(
            f'/api/tournaments/{self.tournament.id}/register/',
            {'team_id': str(self.team.id)},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
