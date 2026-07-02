from django.urls import path
from apps.comments import views

urlpatterns = [
    path('', views.CommentListView.as_view(), name='comment-list'),
    path('create/', views.CommentCreateView.as_view(), name='comment-create'),
    path('<uuid:pk>/', views.CommentDeleteView.as_view(), name='comment-delete'),
    path('admin/', views.AdminCommentListView.as_view(), name='admin-comment-list'),
    path('admin/<uuid:pk>/approve/', views.AdminCommentApproveView.as_view(), name='admin-comment-approve'),
    path('admin/<uuid:pk>/hide/', views.AdminCommentHideView.as_view(), name='admin-comment-hide'),
]
