from django.urls import path
from apps.tournaments import views

urlpatterns = [
    path('', views.TournamentListView.as_view(), name='tournament-list'),
    path('<uuid:pk>/', views.TournamentDetailView.as_view(), name='tournament-detail'),
    path('<uuid:pk>/register/', views.TournamentRegisterView.as_view(), name='tournament-register'),
    path('my-registrations/', views.TournamentRegistrationListView.as_view(), name='my-registrations'),
    path('teams/', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<uuid:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('teams/<uuid:pk>/add-member/', views.TeamAddMemberView.as_view(), name='team-add-member'),
    path('my-teams/', views.MyTeamsView.as_view(), name='my-teams'),
]
