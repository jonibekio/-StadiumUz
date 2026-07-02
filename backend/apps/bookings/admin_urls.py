from django.urls import path
from apps.bookings import views

urlpatterns = [
    path('', views.AdminSlotListView.as_view(), name='admin-slot-list'),
    path('create/', views.AdminSlotCreateView.as_view(), name='admin-slot-create'),
    path('bulk/', views.AdminBulkSlotCreateView.as_view(), name='admin-slot-bulk-create'),
    path('<uuid:pk>/', views.AdminSlotDetailView.as_view(), name='admin-slot-detail'),
]
