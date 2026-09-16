from rest_framework import serializers
from .models import Document, DocumentComment, DocumentHistory, ApprovalStep


class DocumentCommentSerializer(serializers.ModelSerializer):
    """Сериализатор комментариев"""
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentComment
        fields = ['id', 'author', 'author_name', 'author_avatar', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.full_name
    
    def get_author_avatar(self, obj):
        return obj.author.avatar


class DocumentHistorySerializer(serializers.ModelSerializer):
    """Сериализатор истории"""
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentHistory
        fields = ['id', 'user', 'user_name', 'action', 'details', 'metadata', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name


class ApprovalStepSerializer(serializers.ModelSerializer):
    """Сериализатор шага согласования"""
    user_name = serializers.SerializerMethodField()
    user_position = serializers.SerializerMethodField()
    
    class Meta:
        model = ApprovalStep
        fields = ['id', 'user', 'user_name', 'user_position', 'step_order', 'status', 
                  'comment', 'completed_at', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name
    
    def get_user_position(self, obj):
        return obj.user.position


class DocumentSerializer(serializers.ModelSerializer):
    """Сериализатор документа"""
    author_name = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    approvals_count = serializers.SerializerMethodField()
    approved_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'number', 'title', 'description', 'doc_type', 'category',
            'status', 'priority', 'author', 'author_name', 'author_avatar',
            'correspondent', 'due_date', 'file', 'file_size', 'tags', 'version',
            'created_at', 'updated_at', 'comments_count', 'approvals_count', 'approved_count'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'version']
    
    def get_author_name(self, obj):
        return obj.author.full_name
    
    def get_author_avatar(self, obj):
        return obj.author.avatar
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_approvals_count(self, obj):
        return obj.approvals.count()
    
    def get_approved_count(self, obj):
        return obj.approvals.filter(status='approved').count()


class DocumentDetailSerializer(DocumentSerializer):
    """Детальный сериализатор документа"""
    comments = DocumentCommentSerializer(many=True, read_only=True)
    history = DocumentHistorySerializer(many=True, read_only=True)
    approvals = ApprovalStepSerializer(many=True, read_only=True)
    
    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + ['comments', 'history', 'approvals']
