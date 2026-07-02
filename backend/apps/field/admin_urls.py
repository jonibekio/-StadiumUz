from django.urls import path
from apps.field import views

urlpatterns = [
    path('stadiums/', views.AdminStadiumListView.as_view(), name='admin-stadium-list'),
    path('stadiums/create/', views.AdminStadiumCreateView.as_view(), name='admin-stadium-create'),
    path('stadiums/<uuid:pk>/', views.AdminStadiumDetailView.as_view(), name='admin-stadium-detail'),
    path('stadiums/<uuid:stadium_id>/photos/', views.StadiumPhotoListCreateView.as_view(), name='admin-stadium-photos'),
    path('photos/<uuid:pk>/', views.StadiumPhotoDeleteView.as_view(), name='admin-photo-delete'),
    path('advertisements/', views.AdvertisementListView.as_view(), name='admin-ad-list'),
    path('advertisements/create/', views.AdvertisementCreateView.as_view(), name='admin-ad-create'),
    path('advertisements/<uuid:pk>/', views.AdvertisementDetailView.as_view(), name='admin-ad-detail'),
    path('broadcast/today/', views.BroadcastTodayView.as_view(), name='admin-broadcast-today'),
    path('broadcast/log/', views.BroadcastLogListView.as_view(), name='admin-broadcast-log'),
]
