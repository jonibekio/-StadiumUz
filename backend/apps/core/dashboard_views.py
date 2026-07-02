from datetime import date, timedelta
from django.db import models
from django.db.models import Sum, Count, Q, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.permissions import IsAdmin
from apps.bookings.models import Booking, BookingSlot, Payment
from apps.field.models import Stadium
from apps.accounts.models import CustomUser


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        today = date.today()
        today_bookings = Booking.objects.filter(
            slot__date=today, status='CONFIRMED'
        ).count()
        monthly_income = Booking.objects.filter(
            slot__date__year=today.year,
            slot__date__month=today.month,
            status='CONFIRMED'
        ).aggregate(total=Sum('total_price'))['total'] or 0
        available_today = BookingSlot.objects.filter(
            date=today, status='AVAILABLE'
        ).count()
        booked_today = BookingSlot.objects.filter(
            date=today, status='BOOKED'
        ).count()
        total_users = CustomUser.objects.count()
        total_stadiums = Stadium.objects.filter(is_active=True).count()
        total_bookings = Booking.objects.count()

        return Response({
            'today_bookings': today_bookings,
            'monthly_income': float(monthly_income),
            'available_today': available_today,
            'booked_today': booked_today,
            'total_users': total_users,
            'total_stadiums': total_stadiums,
            'total_bookings': total_bookings,
        })


class DashboardChartsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        period = request.query_params.get('period', 'week')
        today = date.today()

        if period == 'month':
            start_date = today - timedelta(days=29)
            delta = timedelta(days=1)
            fmt = '%b %d'
        elif period == 'year':
            start_date = today - timedelta(days=364)
            delta = timedelta(days=7)
            fmt = '%b %d'
        else:  # week
            start_date = today - timedelta(days=6)
            delta = timedelta(days=1)
            fmt = '%b %d'

        bookings_data = (
            Booking.objects.filter(
                slot__date__gte=start_date,
                slot__date__lte=today,
                status__in=['CONFIRMED', 'COMPLETED'],
            )
            .values('slot__date')
            .annotate(total_bookings=Count('id'), total_income=Sum('total_price'))
            .order_by('slot__date')
        )

        data_map = {
            item['slot__date']: {
                'bookings': item['total_bookings'],
                'income': float(item['total_income'] or 0),
            }
            for item in bookings_data
        }

        if period == 'year':
            # Group by weeks
            days = []
            booking_counts = []
            income_data = []
            current = start_date
            while current <= today:
                week_end = min(current + timedelta(days=6), today)
                week_bookings = 0
                week_income = 0
                d = current
                while d <= week_end:
                    wd = data_map.get(d, {'bookings': 0, 'income': 0})
                    week_bookings += wd['bookings']
                    week_income += wd['income']
                    d += timedelta(days=1)
                days.append(current.strftime(fmt))
                booking_counts.append(week_bookings)
                income_data.append(week_income)
                current += timedelta(days=7)
        else:
            days = []
            booking_counts = []
            income_data = []
            current = start_date
            while current <= today:
                day_data = data_map.get(current, {'bookings': 0, 'income': 0})
                days.append(current.strftime(fmt))
                booking_counts.append(day_data['bookings'])
                income_data.append(day_data['income'])
                current += delta

        return Response({
            'labels': days,
            'bookings': booking_counts,
            'income': income_data,
        })


class AnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        today = date.today()

        # Top stadiums by bookings
        top_stadiums = (
            Booking.objects.filter(status__in=['CONFIRMED', 'COMPLETED'])
            .values('slot__date')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        # Actually get stadium names
        stadium_stats = (
            BookingSlot.objects.filter(
                booking__status__in=['CONFIRMED', 'COMPLETED']
            )
            .values('booking__customer__first_name')
            .annotate(count=Count('id'), total_spent=Sum('booking__total_price'))
            .order_by('-count')[:10]
        )

        # Monthly income for last 12 months
        monthly_data = []
        for i in range(11, -1, -1):
            month_date = today.replace(day=1) - timedelta(days=i * 30)
            month_start = month_date.replace(day=1)
            if month_start.month == 12:
                month_end = month_start.replace(year=month_start.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                month_end = month_start.replace(month=month_start.month + 1, day=1) - timedelta(days=1)

            income = Booking.objects.filter(
                slot__date__gte=month_start,
                slot__date__lte=month_end,
                status__in=['CONFIRMED', 'COMPLETED']
            ).aggregate(total=Sum('total_price'))['total'] or 0

            booking_count = Booking.objects.filter(
                slot__date__gte=month_start,
                slot__date__lte=month_end,
                status__in=['CONFIRMED', 'COMPLETED']
            ).count()

            monthly_data.append({
                'month': month_start.strftime('%b %Y'),
                'income': float(income),
                'bookings': booking_count,
            })

        # Cancelled bookings
        cancelled_count = Booking.objects.filter(status='CANCELLED').count()
        total_bookings = Booking.objects.count()
        cancel_rate = round((cancelled_count / total_bookings * 100), 1) if total_bookings > 0 else 0

        # Average booking price
        avg_price = Booking.objects.filter(
            status__in=['CONFIRMED', 'COMPLETED']
        ).aggregate(avg=Avg('total_price'))['avg'] or 0

        return Response({
            'monthly_data': monthly_data,
            'cancelled_count': cancelled_count,
            'cancel_rate': cancel_rate,
            'avg_booking_price': float(avg_price),
            'total_bookings': total_bookings,
            'total_revenue': float(
                Booking.objects.filter(
                    status__in=['CONFIRMED', 'COMPLETED']
                ).aggregate(total=Sum('total_price'))['total'] or 0
            ),
        })
