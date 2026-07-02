from rest_framework import serializers
from apps.chat.models import ChatRoom, ChatMessage, Attachment


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'filename', 'file_size']


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.first_name', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'room', 'sender', 'sender_name', 'sender_role',
            'message_type', 'content', 'file', 'image',
            'attachments', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'booking', 'created_at', 'updated_at', 'last_message', 'unread_count', 'other_user']

    def get_last_message(self, obj):
        msg = obj.last_message
        if msg:
            return ChatMessageSerializer(msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user.role == 'ADMIN':
                return {
                    'id': str(obj.booking.customer.id),
                    'name': obj.booking.customer.first_name,
                }
            else:
                return {'name': 'Admin'}
        return None
