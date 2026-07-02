from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.comments.models import Comment
from apps.comments.serializers import CommentSerializer, CommentCreateSerializer
from apps.core.permissions import IsOwnerOrAdmin
from apps.core.pagination import StandardPagination


class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination

    def get_queryset(self):
        qs = Comment.objects.filter(is_approved=True, is_hidden=False)
        stadium_id = self.request.query_params.get('stadium')
        if stadium_id:
            qs = qs.filter(stadium_id=stadium_id)
        return qs


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        # Update stadium rating
        if comment.stadium:
            comment.stadium.update_rating()


class CommentDeleteView(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrAdmin]
    queryset = Comment.objects.all()


class AdminCommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get_queryset(self):
        from apps.core.permissions import IsAdmin
        if not self.request.user.role == 'ADMIN':
            return Comment.objects.none()
        return Comment.objects.all()


class AdminCommentApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)
        try:
            comment = Comment.objects.get(id=pk)
            comment.is_approved = True
            comment.save()
            return Response({'status': 'approved'})
        except Comment.DoesNotExist:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)


class AdminCommentHideView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Ruxsat yo\'q'}, status=status.HTTP_403_FORBIDDEN)
        try:
            comment = Comment.objects.get(id=pk)
            comment.is_hidden = not comment.is_hidden
            comment.save()
            return Response({'is_hidden': comment.is_hidden})
        except Comment.DoesNotExist:
            return Response({'error': 'Topilmadi'}, status=status.HTTP_404_NOT_FOUND)
