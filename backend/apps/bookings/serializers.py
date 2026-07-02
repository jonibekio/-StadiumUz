from rest_framework import serializers
from apps.bookings.models import Booking, BookingSlot, Payment


class BookingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'price', 'status']


class BookingSerializer(serializers.ModelSerializer):
    slot = BookingSlotSerializer(read_only=True)
    customer_name = serializers.CharField(source='customer.first_name', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'slot', 'customer', 'customer_name', 'total_price', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class BookingCreateSerializer(serializers.Serializer):
    slot_id = serializers.UUIDField()

    def validate_slot_id(self, value):
        try:
            slot = BookingSlot.objects.get(id=value, status='AVAILABLE')
        except BookingSlot.DoesNotExist:
            raise serializers.ValidationError('Slot is not available.')
        return value


class BulkSlotCreateSerializer(serializers.Serializer):
    date = serializers.DateField()
    start_hour = serializers.IntegerField(min_value=0, max_value=23)
    end_hour = serializers.IntegerField(min_value=1, max_value=24)
    slot_duration_minutes = serializers.IntegerField(default=60, min_value=30, max_value=180)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)


class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'user_name', 'booking', 'amount', 'method',
            'status', 'transaction_id', 'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PaymentCreateSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField()
    method = serializers.ChoiceField(choices=Payment.Method.choices)
    description = serializers.CharField(required=False, default='')
