from rest_framework import serializers
from apps.field.models import Stadium, StadiumFeature, StadiumPhoto, Advertisement, BroadcastLog


class StadiumFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = StadiumFeature
        fields = ['id', 'name', 'icon']


class StadiumPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StadiumPhoto
        fields = ['id', 'image', 'url', 'caption', 'order']


class StadiumListSerializer(serializers.ModelSerializer):
    features = StadiumFeatureSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    region_display = serializers.CharField(source='get_region_display', read_only=True)

    class Meta:
        model = Stadium
        fields = [
            'id', 'name', 'region', 'region_display', 'address', 'district',
            'field_type', 'surface_type', 'price_per_hour', 'rating',
            'reviews_count', 'is_active', 'is_premium', 'badge',
            'image_url', 'features', 'is_favorited',
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class StadiumDetailSerializer(serializers.ModelSerializer):
    features = StadiumFeatureSerializer(many=True, read_only=True)
    photos = StadiumPhotoSerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    region_display = serializers.CharField(source='get_region_display', read_only=True)

    class Meta:
        model = Stadium
        fields = [
            'id', 'name', 'description', 'region', 'region_display',
            'address', 'district', 'latitude', 'longitude', 'phone',
            'field_type', 'surface_type', 'price_per_hour', 'rating',
            'reviews_count', 'is_active', 'is_premium', 'badge', 'image_url',
            'working_hours_start', 'working_hours_end',
            'features', 'photos', 'comments', 'is_favorited',
            'created_at', 'updated_at',
        ]

    def get_comments(self, obj):
        from apps.comments.serializers import CommentSerializer
        comments = obj.comments.all()[:10]
        return CommentSerializer(comments, many=True).data

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class StadiumCreateUpdateSerializer(serializers.ModelSerializer):
    features = StadiumFeatureSerializer(many=True, required=False)
    generate_slots = serializers.BooleanField(default=True, write_only=True)

    class Meta:
        model = Stadium
        fields = [
            'name', 'description', 'region', 'address', 'district',
            'latitude', 'longitude', 'phone', 'field_type', 'surface_type',
            'price_per_hour', 'is_active', 'is_premium', 'badge', 'image_url',
            'working_days', 'working_hours_start', 'working_hours_end',
            'slot_duration_minutes', 'features', 'generate_slots',
        ]

    def create(self, validated_data):
        features_data = validated_data.pop('features', [])
        validated_data.pop('generate_slots', True)
        stadium = Stadium.objects.create(**validated_data)
        for feature_data in features_data:
            StadiumFeature.objects.create(stadium=stadium, **feature_data)
        return stadium

    def update(self, instance, validated_data):
        features_data = validated_data.pop('features', None)
        validated_data.pop('generate_slots', True)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if features_data is not None:
            instance.features.all().delete()
            for feature_data in features_data:
                StadiumFeature.objects.create(stadium=instance, **feature_data)
        return instance


class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'description', 'media_type', 'media_file',
            'link', 'is_active', 'show_on_website', 'show_on_telegram',
            'order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AdvertisementPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ['id', 'title', 'description', 'media_type', 'media_file', 'link']


class BroadcastLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BroadcastLog
        fields = ['id', 'broadcast_date', 'slots_sent', 'message_content', 'sent_at', 'success']
        read_only_fields = fields
