from rest_framework import serializers
from apps.tournaments.models import Tournament, Team, TeamMember, TournamentRegistration


class TournamentSerializer(serializers.ModelSerializer):
    registered_teams_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()

    class Meta:
        model = Tournament
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'max_teams', 'entry_fee', 'status', 'image', 'created_at',
            'registered_teams_count', 'is_full',
        ]
        read_only_fields = ['id', 'created_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'user', 'user_name', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class TeamSerializer(serializers.ModelSerializer):
    captain_name = serializers.CharField(source='captain.first_name', read_only=True)
    members = TeamMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'captain', 'captain_name', 'members', 'member_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_member_count(self, obj):
        return obj.members.count()


class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name']
        read_only_fields = ['id']


class TournamentRegistrationSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    tournament_title = serializers.CharField(source='tournament.title', read_only=True)

    class Meta:
        model = TournamentRegistration
        fields = ['id', 'tournament', 'team', 'tournament_title', 'team_name', 'status', 'paid', 'registered_at']
        read_only_fields = ['id', 'registered_at']


class TournamentRegistrationCreateSerializer(serializers.Serializer):
    team_id = serializers.UUIDField(required=True)

    def validate_team_id(self, value):
        try:
            team = Team.objects.get(id=value)
        except Team.DoesNotExist:
            raise serializers.ValidationError("Jamoa topilmadi")
        return value
