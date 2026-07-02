from datetime import date
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.bookings.models import BookingSlot, Booking, Payment
from apps.bookings.serializers import (
    BookingSlotSerializer, BookingSerializer,
    BookingCreateSerializer, BulkSlotCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer,
)
from apps.bookings.services import BookingService
from apps.core.permissions import IsAdmin
from apps.core.pagination import StandardPagination


class AvailableSlotsView(generics.ListAPIView):
    serializer_class = BookingSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query_date = self.request.query_params.get('date', date.today().isoformat())
        stadium_id = self.request.query_params.get('stadium', None)
        try:
            query_date = date.fromisoformat(query_date)
        except ValueError:
            query_date = date.today()
        return BookingService.get_available_slots(query_date, stadium_id)


class StadiumSlotsView(generics.ListAPIView):
    """Get all slots for a specific stadium (available, booked, blocked)."""
    serializer_class = BookingSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        stadium_id = self.kwargs.get('stadium_id')
        query_date = self.request.query_params.get('date', None)
        try:
            query_date = date.fromisoformat(query_date) if query_date else None
        except ValueError:
            query_date = None
        return BookingService.get_stadium_slots(stadium_id, query_date)


class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            booking = BookingService.create_booking(
                customer=request.user,
                slot_id=serializer.validated_data['slot_id']
            )
            return Response(
                BookingSerializer(booking).data,
                status=status.HTTP_201_CREATED
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Booking.objects.filter(customer=self.request.user)
        booking_status = self.request.query_params.get('status', '')
        if booking_status:
            qs = qs.filter(status=booking_status)
        return qs


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = BookingService.cancel_booking(pk, request.user)
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        except PermissionError:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)


# ── Admin Booking Actions ────────────────────────────────────────────

class AdminBookingApproveView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            booking = BookingService.approve_booking(pk, request.user)
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Bron topilmadi'}, status=status.HTTP_404_NOT_FOUND)


class AdminBookingRejectView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        reason = request.data.get('reason', '')
        try:
            booking = BookingService.reject_booking(pk, reason, request.user)
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Bron topilmadi'}, status=status.HTTP_404_NOT_FOUND)


# ── Payment Views ────────────────────────────────────────────────────

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking_id = serializer.validated_data['booking_id']
        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Bron topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(booking, 'payment'):
            return Response({'error': "To'lov allaqachon yaratilgan"}, status=status.HTTP_400_BAD_REQUEST)

        import uuid
        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=booking.total_price,
            method=serializer.validated_data['method'],
            description=serializer.validated_data.get('description', ''),
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            status=Payment.Status.COMPLETED,
        )

        # Notify admin
        from apps.notifications.models import Notification
        from apps.accounts.models import CustomUser
        for admin in CustomUser.objects.filter(role='ADMIN'):
            Notification.objects.create(
                user=admin,
                title="Yangi to'lov",
                message=f"{request.user.first_name} {booking.total_price} so'm to'lov amalga oshirdi.",
                type='PAYMENT',
            )

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


# ── Admin Views ──────────────────────────────────────────────────────

class AdminSlotListView(generics.ListAPIView):
    serializer_class = BookingSlotSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination
    queryset = BookingSlot.objects.all()


class AdminSlotCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = BookingSlotSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminBulkSlotCreateView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = BulkSlotCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        slots = BookingService.bulk_create_slots(
            date=serializer.validated_data['date'],
            start_hour=serializer.validated_data['start_hour'],
            end_hour=serializer.validated_data['end_hour'],
            duration_minutes=serializer.validated_data['slot_duration_minutes'],
            price=serializer.validated_data['price'],
        )
        return Response(
            BookingSlotSerializer(slots, many=True).data,
            status=status.HTTP_201_CREATED
        )


class AdminSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSlotSerializer
    permission_classes = [IsAdmin]
    queryset = BookingSlot.objects.all()


class AdminBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Booking.objects.select_related('customer', 'slot').all()
        booking_status = self.request.query_params.get('status', '')
        if booking_status:
            qs = qs.filter(status=booking_status)
        search = self.request.query_params.get('search', '')
        if search:
            from django.db.models import Q
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
