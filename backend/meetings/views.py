from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Meeting
from .serializers import MeetingSerializer


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
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Начать совещание"""
        meeting = self.get_object()
        meeting.status = 'in_progress'
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Завершить совещание"""
        meeting = self.get_object()
        meeting.status = 'completed'
        meeting.protocol = request.data.get('protocol', '')
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отменить совещание"""
        meeting = self.get_object()
        meeting.status = 'cancelled'
        meeting.save()
        return Response(MeetingSerializer(meeting).data)
