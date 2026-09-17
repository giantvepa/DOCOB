from rest_framework import serializers
from .models import Document, DocumentComment, DocumentHistory, ApprovalStep


class DocumentCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentComment
        fields = ['id', 'author', 'author_name', 'text', 'created_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class DocumentHistorySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentHistory
        fields = ['id', 'user', 'user_name', 'action', 'details', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class ApprovalStepSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ApprovalStep
        fields = ['id', 'user', 'user_name', 'step_order', 'status', 'comment', 'completed_at', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class DocumentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    approvals_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'number', 'title', 'description', 'doc_type', 'category', 
                  'status', 'priority', 'author', 'author_name', 'correspondent', 
                  'due_date', 'file', 'tags', 'created_at', 'updated_at',
                  'comments_count', 'approvals_count']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.username
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_approvals_count(self, obj):
        return obj.approvals.count()


class DocumentDetailSerializer(DocumentSerializer):
    comments = DocumentCommentSerializer(many=True, read_only=True)
    history = DocumentHistorySerializer(many=True, read_only=True)
    approvals = ApprovalStepSerializer(many=True, read_only=True)
    
    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + ['comments', 'history', 'approvals']
