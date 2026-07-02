from django.urls import path, include

urlpatterns = [
    path('field/', include('apps.field.admin_urls')),
    path('slots/', include('apps.bookings.admin_urls')),
    path('tournaments/', include('apps.tournaments.admin_urls')),
    path('dashboard/', include('apps.core.dashboard_urls')),
    path('', include('apps.core.admin_management_urls')),
]
