from django.urls import path
from apps.field import views
from apps.bookings.views import StadiumSlotsView

urlpatterns = [
    # Public stadium endpoints
    path('stadiums/', views.StadiumListView.as_view(), name='stadium-list'),
    path('stadiums/featured/', views.StadiumFeaturedView.as_view(), name='stadium-featured'),
    path('stadiums/<uuid:pk>/', views.StadiumDetailView.as_view(), name='stadium-detail'),
    path('stadiums/<uuid:stadium_id>/photos/', views.StadiumPhotoListCreateView.as_view(), name='stadium-photos'),
    path('stadiums/<uuid:stadium_id>/slots/', StadiumSlotsView.as_view(), name='stadium-slots'),

    # User favorites
    path('favorites/', views.UserFavoriteListView.as_view(), name='favorite-list'),
    path('favorites/<uuid:stadium_id>/toggle/', views.UserFavoriteToggleView.as_view(), name='favorite-toggle'),

    # Advertisements
    path('advertisements/', views.AdvertisementPublicView.as_view(), name='field-advertisements'),

    # Legacy field info
    path('', views.FieldInfoPublicView.as_view(), name='field-info'),
]
