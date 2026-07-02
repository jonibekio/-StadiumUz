from django.urls import path
from apps.tournaments import views

urlpatterns = [
    path('', views.AdminTournamentCreateView.as_view(), name='admin-tournament-create'),
    path('<uuid:pk>/', views.AdminTournamentDetailView.as_view(), name='admin-tournament-detail'),
]
