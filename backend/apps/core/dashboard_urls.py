from django.urls import path
from apps.core import dashboard_views

urlpatterns = [
    path('', dashboard_views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('charts/', dashboard_views.DashboardChartsView.as_view(), name='dashboard-charts'),
    path('analytics/', dashboard_views.AnalyticsView.as_view(), name='dashboard-analytics'),
]
