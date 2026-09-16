from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Task
from .serializers import TaskSerializer


@extend_schema_view(
    list=extend_schema(summary='Список задач'),
    retrieve=extend_schema(summary='Задача по ID'),
    create=extend_schema(summary='Создать задачу'),
    update=extend_schema(summary='Обновить задачу'),
    partial_update=extend_schema(summary='Частично обновить задачу'),
    destroy=extend_schema(summary='Удалить задачу'),
)
class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet для задач"""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'priority', 'assignee', 'author']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @extend_schema(summary='Отметить задачу как выполненную')
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Отметить задачу как выполненную"""
        task = self.get_object()
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.save()
        return Response(TaskSerializer(task).data)
    
    @extend_schema(summary='Взять задачу в работу')
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Взять задачу в работу"""
        task = self.get_object()
        task.status = 'in_progress'
        task.save()
        return Response(TaskSerializer(task).data)
    
    @extend_schema(summary='Отложить задачу')
    @action(detail=True, methods=['post'])
    def defer(self, request, pk=None):
        """Отложить задачу"""
        task = self.get_object()
        task.status = 'deferred'
        task.save()
        return Response(TaskSerializer(task).data)
