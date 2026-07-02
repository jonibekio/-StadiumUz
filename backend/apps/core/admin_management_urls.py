from django.urls import path
from apps.core import admin_management_views

urlpatterns = [
    # Bookings
    path('bookings/', admin_management_views.AdminBookingListView.as_view(), name='admin-booking-list'),
    path('bookings/<uuid:pk>/', admin_management_views.AdminBookingDetailView.as_view(), name='admin-booking-detail'),
    path('bookings/<uuid:pk>/<str:action>/', admin_management_views.AdminBookingActionView.as_view(), name='admin-booking-action'),
    # Users
    path('users/', admin_management_views.AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<uuid:pk>/', admin_management_views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/<uuid:pk>/toggle-active/', admin_management_views.AdminUserToggleActiveView.as_view(), name='admin-user-toggle'),
    # Payments
    path('payments/', admin_management_views.AdminPaymentListView.as_view(), name='admin-payment-list'),
    path('payments/<uuid:pk>/', admin_management_views.AdminPaymentDetailView.as_view(), name='admin-payment-detail'),
]
