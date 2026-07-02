from datetime import date
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.bookings.models import Booking, BookingSlot, Payment
from apps.bookings.serializers import BookingSerializer, BookingSlotSerializer, PaymentSerializer
from apps.core.permissions import IsAdmin
from apps.core.pagination import StandardPagination


# ── Admin Booking Management ────────────────────────────────────────

class AdminBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Booking.objects.select_related('customer', 'slot').all()

        # Filter by status
        booking_status = self.request.query_params.get('status', '')
        if booking_status:
            qs = qs.filter(status=booking_status)

        # Filter by date
        booking_date = self.request.query_params.get('date', '')
        if booking_date:
            qs = qs.filter(slot__date=booking_date)

        # Search by customer name or phone
        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(
                Q(customer__first_name__icontains=search) |
                Q(customer__last_name__icontains=search) |
                Q(customer__phone__icontains=search)
            )

        return qs


class AdminBookingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdmin]
    queryset = Booking.objects.all()


class AdminBookingActionView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk, action):
        try:
            booking = Booking.objects.get(id=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Bron topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        if action == 'confirm':
            booking.status = 'CONFIRMED'
            if booking.slot:
                booking.slot.status = 'BOOKED'
                booking.slot.save()
        elif action == 'cancel':
            booking.status = 'CANCELLED'
            from django.utils import timezone
            booking.cancelled_at = timezone.now()
            if booking.slot:
                booking.slot.status = 'AVAILABLE'
                booking.slot.save()
        elif action == 'complete':
            booking.status = 'COMPLETED'
        else:
            return Response({'error': "Noto'g'ri harakat"}, status=status.HTTP_400_BAD_REQUEST)

        booking.save()
        return Response(BookingSerializer(booking).data)


# ── Admin User Management ───────────────────────────────────────────

class AdminUserListView(generics.ListAPIView):
    serializer_class = None
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        from apps.accounts.serializers import UserSerializer
        return UserSerializer

    def get_queryset(self):
        from apps.accounts.models import CustomUser
        qs = CustomUser.objects.all().order_by('-created_at')

        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(phone__icontains=search) |
                Q(username__icontains=search)
            )

        role = self.request.query_params.get('role', '')
        if role:
            qs = qs.filter(role=role)

        return qs


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        from apps.accounts.serializers import UserSerializer
        return UserSerializer

    def get_queryset(self):
        from apps.accounts.models import CustomUser
        return CustomUser.objects.all()


class AdminUserToggleActiveView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        from apps.accounts.models import CustomUser
        from apps.accounts.serializers import UserSerializer
        try:
            user = CustomUser.objects.get(id=pk)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Foydalanuvchi topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
        return Response(UserSerializer(user).data)


# ── Admin Payment Management ────────────────────────────────────────

class AdminPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Payment.objects.select_related('user', 'booking').all()

        payment_status = self.request.query_params.get('status', '')
        if payment_status:
            qs = qs.filter(status=payment_status)

        method = self.request.query_params.get('method', '')
        if method:
            qs = qs.filter(method=method)

        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(
                Q(transaction_id__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__phone__icontains=search)
            )

        return qs


class AdminPaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]
    queryset = Payment.objects.all()
