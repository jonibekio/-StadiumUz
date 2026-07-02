from rest_framework import serializers
from apps.comments.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'stadium', 'booking', 'title', 'rating', 'text', 'image', 'is_approved', 'is_hidden', 'created_at']
        read_only_fields = ['id', 'user', 'is_approved', 'is_hidden', 'created_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['stadium', 'booking', 'title', 'rating', 'text', 'image']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Reyting 1-5 orasida bo'lishi kerak")
        return value

    def validate_text(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Sharh kamida 5 ta belgi bo'lishi kerak")
        return value
