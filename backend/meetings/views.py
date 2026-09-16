from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Meeting
from .serializers import MeetingSerializer


@extend_schema_view(
    list=extend_schema(summary='Список совещаний'),
    retrieve=extend_schema(summary='Совещание по ID'),
    create=extend_schema(summary='Создать совещание'),
    update=extend_schema(summary='Обновить совещание'),
    partial_update=extend_schema(summary='Частично обновить совещание'),
    destroy=extend_schema(summary='Удалить совещание'),
)
class MeetingViewSet(viewsets.ModelViewSet):
    """ViewSet для совещаний"""
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'organizer', 'date']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'time', 'created_at']
    ordering = ['date', 'time']
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)
    
    @extend_schema(summary='Начать совещание')
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Начать совещание"""
        meeting = self.get_object()
        meeting.status = 'in_progress'
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
    
    @extend_schema(summary='Завершить совещание')
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Завершить совещание"""
        meeting = self.get_object()
        meeting.status = 'completed'
        meeting.protocol = request.data.get('protocol', '')
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
    
    @extend_schema(summary='Отменить совещание')
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отменить совещание"""
        meeting = self.get_object()
        meeting.status = 'cancelled'
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
