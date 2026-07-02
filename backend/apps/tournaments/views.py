from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.tournaments.models import Tournament, Team, TeamMember, TournamentRegistration
from apps.tournaments.serializers import (
    TournamentSerializer, TeamSerializer, TeamCreateSerializer,
    TournamentRegistrationSerializer, TournamentRegistrationCreateSerializer,
)
from apps.core.permissions import IsAdmin
from apps.core.pagination import StandardPagination


class TournamentListView(generics.ListAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    queryset = Tournament.objects.all()


class TournamentDetailView(generics.RetrieveAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]
    queryset = Tournament.objects.all()


class AdminTournamentCreateView(generics.CreateAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [IsAdmin]


class AdminTournamentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [IsAdmin]
    queryset = Tournament.objects.all()


# ── Team Views ────────────────────────────────────────────────────────

class TeamListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TeamCreateSerializer
        return TeamSerializer

    def get_queryset(self):
        return Team.objects.filter(captain=self.request.user)

    def perform_create(self, serializer):
        team = serializer.save(captain=self.request.user)
        TeamMember.objects.create(team=team, user=self.request.user)


class TeamDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(captain=self.request.user)


class TeamAddMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            team = Team.objects.get(id=pk, captain=request.user)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Jamoa topilmadi yoki siz uning kapitani emassiz'},
                status=status.HTTP_404_NOT_FOUND
            )

        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id kiritilishi shart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Foydalanuvchi topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

        member, created = TeamMember.objects.get_or_create(team=team, user=user)
        if not created:
            return Response(
                {'error': 'Foydalanuvchi allaqachon jamoa a\'zosi'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({'message': "A'zo qo'shildi"}, status=status.HTTP_201_CREATED)


# ── Tournament Registration Views ─────────────────────────────────────

class TournamentRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            tournament = Tournament.objects.get(id=pk)
        except Tournament.DoesNotExist:
            return Response(
                {'error': 'Turnir topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

        if tournament.status != 'UPCOMING':
            return Response(
                {'error': 'Faqat kelayotgan turnirlarga yozilish mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if tournament.is_full:
            return Response(
                {'error': "Turnir to'lgan"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TournamentRegistrationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        team = Team.objects.get(id=serializer.validated_data['team_id'])

        if team.captain != request.user:
            return Response(
                {'error': "Faqat jamoa kapitani ro'yxatdan o'ta oladi"},
                status=status.HTTP_403_FORBIDDEN
            )

        registration, created = TournamentRegistration.objects.get_or_create(
            tournament=tournament,
            team=team,
            defaults={'status': 'CONFIRMED' if tournament.entry_fee == 0 else 'PENDING'}
        )

        if not created:
            return Response(
                {'error': 'Jamoa allaqachon ro\'yxatdan o\'tgan'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            TournamentRegistrationSerializer(registration).data,
            status=status.HTTP_201_CREATED
        )


class TournamentRegistrationListView(generics.ListAPIView):
    serializer_class = TournamentRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TournamentRegistration.objects.filter(
            team__captain=self.request.user
        )


class MyTeamsView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(members__user=self.request.user).distinct()
