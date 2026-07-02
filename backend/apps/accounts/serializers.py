from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'phone', 'username', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        validated_data['role'] = User.Role.CUSTOMER
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'username', 'first_name', 'last_name', 'email', 'role', 'avatar', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Joriy parol noto'g'ri")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    code = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
