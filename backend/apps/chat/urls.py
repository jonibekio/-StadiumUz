from django.urls import path
from apps.chat import views

urlpatterns = [
    path('rooms/', views.ChatRoomListView.as_view(), name='chat-room-list'),
    path('rooms/<uuid:pk>/', views.ChatRoomDetailView.as_view(), name='chat-room-detail'),
    path('rooms/<uuid:room_id>/messages/', views.ChatMessageListView.as_view(), name='chat-message-list'),
    path('rooms/<uuid:room_id>/send/', views.SendMessageView.as_view(), name='chat-send-message'),
    path('rooms/<uuid:room_id>/read/', views.MarkAsReadView.as_view(), name='chat-mark-read'),
]
