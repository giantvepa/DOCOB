from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Сериализатор задачи"""
    assignee_name = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'assignee', 'assignee_name', 'author', 'author_name',
            'document', 'due_date', 'completed_at', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'completed_at']
    
    def get_assignee_name(self, obj):
        return obj.assignee.full_name
    
    def get_author_name(self, obj):
        return obj.author.full_name
