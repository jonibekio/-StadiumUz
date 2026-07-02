from django.contrib import admin
from apps.chat.models import ChatRoom, ChatMessage, Attachment


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'booking', 'created_at', 'updated_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'room', 'sender', 'message_type', 'content', 'is_read', 'created_at']
    list_filter = ['message_type', 'is_read']


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'message', 'filename', 'file_size']
