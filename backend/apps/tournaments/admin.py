from django.contrib import admin
from apps.tournaments.models import Tournament


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_date', 'end_date', 'status']
    list_filter = ['status']
