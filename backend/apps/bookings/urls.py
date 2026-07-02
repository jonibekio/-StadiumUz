from django.urls import path
from apps.bookings import views

urlpatterns = [
    path('slots/', views.AvailableSlotsView.as_view(), name='available-slots'),
    path('', views.CreateBookingView.as_view(), name='create-booking'),
    path('my/', views.MyBookingsView.as_view(), name='my-bookings'),
    path('<uuid:pk>/cancel/', views.CancelBookingView.as_view(), name='cancel-booking'),
    path('<uuid:pk>/approve/', views.AdminBookingApproveView.as_view(), name='admin-booking-approve'),
    path('<uuid:pk>/reject/', views.AdminBookingRejectView.as_view(), name='admin-booking-reject'),
    # Payments
    path('payments/', views.PaymentListView.as_view(), name='payment-list'),
    path('payments/<uuid:pk>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('payments/create/', views.CreatePaymentView.as_view(), name='payment-create'),
]
