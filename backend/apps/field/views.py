import uuid
from datetime import date
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Avg, Count
from apps.field.models import Stadium, StadiumFeature, StadiumPhoto, Advertisement, BroadcastLog, UserFavorite
from apps.field.serializers import (
    StadiumListSerializer, StadiumDetailSerializer, StadiumCreateUpdateSerializer,
    StadiumPhotoSerializer,
    AdvertisementSerializer, AdvertisementPublicSerializer,
    BroadcastLogSerializer
)
from apps.core.permissions import IsAdmin
from apps.core.pagination import StandardPagination


# ── Stadium Public Views ──────────────────────────────────────────────

class StadiumListView(generics.ListAPIView):
    serializer_class = StadiumListSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Stadium.objects.filter(is_active=True)

        # Search by name, address, or district
        search = self.request.query_params.get('search', '')
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(address__icontains=search) |
                Q(district__icontains=search) |
                Q(description__icontains=search)
            )

        # Filter by region
        region = self.request.query_params.get('region', '')
        if region:
            qs = qs.filter(region=region)

        # Filter by district
        district = self.request.query_params.get('district', '')
        if district:
            qs = qs.filter(district__icontains=district)

        # Filter by field type
        field_type = self.request.query_params.get('field_type', '')
        if field_type:
            qs = qs.filter(field_type=field_type)

        # Filter by surface type
        surface_type = self.request.query_params.get('surface_type', '')
        if surface_type:
            qs = qs.filter(surface_type=surface_type)

        # Filter by min rating
        min_rating = self.request.query_params.get('min_rating', '')
        if min_rating:
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass

        # Filter by max price
        max_price = self.request.query_params.get('max_price', '')
        if max_price:
            try:
                qs = qs.filter(price_per_hour__lte=float(max_price))
            except (ValueError, TypeError):
                pass

        # Filter by availability
        available = self.request.query_params.get('available', '')
        if available == 'true':
            qs = qs.filter(is_active=True)

        # Sort
        sort = self.request.query_params.get('sort', '-created_at')
        if sort in ['price_per_hour', '-price_per_hour', 'rating', '-rating', 'name', '-name', 'created_at', '-created_at']:
            qs = qs.order_by(sort)

        return qs


class StadiumDetailView(generics.RetrieveAPIView):
    serializer_class = StadiumDetailSerializer
    permission_classes = [AllowAny]
    queryset = Stadium.objects.filter(is_active=True)


class StadiumFeaturedView(generics.ListAPIView):
    serializer_class = StadiumListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Stadium.objects.filter(is_active=True).order_by('-rating')[:8]


# ── Stadium Admin Views ───────────────────────────────────────────────

class AdminStadiumListView(generics.ListAPIView):
    serializer_class = StadiumListSerializer
    permission_classes = [IsAdmin]
    pagination_class = StandardPagination
    queryset = Stadium.objects.all()


class AdminStadiumCreateView(generics.CreateAPIView):
    serializer_class = StadiumCreateUpdateSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        stadium = serializer.save()
        # Auto-generate slots for the next 30 days
        from apps.bookings.services import BookingService
        slots = BookingService.generate_slots_for_stadium(stadium, days=30)
        return stadium


class AdminStadiumDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StadiumCreateUpdateSerializer
    permission_classes = [IsAdmin]
    queryset = Stadium.objects.all()

    def perform_update(self, serializer):
        stadium = serializer.save()
        # Regenerate slots if working schedule changed
        if 'working_days' in serializer.validated_data or 'working_hours_start' in serializer.validated_data:
            from apps.bookings.models import BookingSlot
            from datetime import date, timedelta
            # Delete future available slots
            BookingSlot.objects.filter(
                stadium=stadium,
                date__gte=date.today(),
                status='AVAILABLE'
            ).delete()
            # Regenerate
            from apps.bookings.services import BookingService
            BookingService.generate_slots_for_stadium(stadium, days=30)


# ── Stadium Photos ────────────────────────────────────────────────────

class StadiumPhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = StadiumPhotoSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        stadium_id = self.kwargs.get('stadium_id')
        return StadiumPhoto.objects.filter(stadium_id=stadium_id)

    def perform_create(self, serializer):
        stadium = Stadium.objects.get(id=self.kwargs['stadium_id'])
        serializer.save(stadium=stadium)


class StadiumPhotoDeleteView(generics.DestroyAPIView):
    serializer_class = StadiumPhotoSerializer
    permission_classes = [IsAdmin]
    queryset = StadiumPhoto.objects.all()


# ── User Favorites ────────────────────────────────────────────────────

class UserFavoriteListView(generics.ListAPIView):
    serializer_class = StadiumListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Stadium.objects.filter(favorited_by__user=self.request.user)


class UserFavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, stadium_id):
        try:
            stadium = Stadium.objects.get(id=stadium_id)
        except Stadium.DoesNotExist:
            return Response({'error': 'Stadion topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        fav, created = UserFavorite.objects.get_or_create(
            user=request.user, stadium=stadium
        )
        if not created:
            fav.delete()
            return Response({'is_favorited': False})
        return Response({'is_favorited': True}, status=status.HTTP_201_CREATED)


# ── Field Info (Legacy singleton for backward compat) ─────────────────

class FieldInfoPublicView(generics.RetrieveAPIView):
    serializer_class = StadiumListSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        stadium = Stadium.objects.filter(is_active=True).first()
        if not stadium:
            from django.http import Http404
            raise Http404
        return stadium


# ── Advertisement Views ───────────────────────────────────────────────

class AdvertisementListView(generics.ListAPIView):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdmin]
    queryset = Advertisement.objects.all()


class AdvertisementPublicView(generics.ListAPIView):
    serializer_class = AdvertisementPublicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Advertisement.objects.filter(is_active=True, show_on_website=True)


class AdvertisementCreateView(generics.CreateAPIView):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdmin]


class AdvertisementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdmin]
    queryset = Advertisement.objects.all()


# ── Broadcast Log Views ───────────────────────────────────────────────

class BroadcastLogListView(generics.ListAPIView):
    serializer_class = BroadcastLogSerializer
    permission_classes = [IsAdmin]
    queryset = BroadcastLog.objects.all()


class BroadcastTodayView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        today = date.today()
        log = BroadcastLog.objects.filter(broadcast_date=today).first()
        if log:
            return Response({
                'broadcasted': True,
                'slots_sent': log.slots_sent,
                'sent_at': log.sent_at,
                'message': log.message_content,
            })
        return Response({'broadcasted': False})
