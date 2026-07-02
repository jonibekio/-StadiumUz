from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from apps.chat.models import ChatRoom, ChatMessage
from apps.chat.serializers import ChatRoomSerializer, ChatMessageSerializer
from apps.core.permissions import IsAdmin
from apps.core.pagination import StandardPagination


class ChatRoomListView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return ChatRoom.objects.all()
        return ChatRoom.objects.filter(booking__customer=user)


class ChatRoomDetailView(generics.RetrieveAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return ChatRoom.objects.all()
        return ChatRoom.objects.filter(booking__customer=user)


class ChatMessageListView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        room_id = self.kwargs.get('room_id')
        return ChatMessage.objects.filter(room_id=room_id)


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({'error': 'Chat xonasi topilmadi'}, status=status.HTTP_404_NOT_FOUND)

        # Check permission
        user = request.user
        if user.role != 'ADMIN' and room.booking.customer != user:
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)

        content = request.data.get('content', '')
        message_type = request.data.get('message_type', 'TEXT')

        if not content and message_type == 'TEXT':
            return Response({'error': 'Xabar bo\'sh bo\'lmasligi kerak'}, status=status.HTTP_400_BAD_REQUEST)

        message = ChatMessage.objects.create(
            room=room,
            sender=user,
            content=content,
            message_type=message_type,
        )

        # Handle file/image if provided
        if 'file' in request.FILES:
            message.file = request.FILES['file']
            message.message_type = 'FILE'
            message.save()
        if 'image' in request.FILES:
            message.image = request.FILES['image']
            message.message_type = 'IMAGE'
            message.save()

        room.save()  # Update updated_at

        return Response(ChatMessageSerializer(message).data, status=status.HTTP_201_CREATED)


class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        from django.utils import timezone
        updated = ChatMessage.objects.filter(
            room_id=room_id
        ).exclude(sender=request.user).update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'marked': updated})
