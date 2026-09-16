from django.contrib import admin
from .models import Document, DocumentComment, DocumentHistory, ApprovalStep


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'doc_type', 'category', 'status', 'priority', 'author', 'created_at']
    list_filter = ['status', 'doc_type', 'category', 'priority', 'created_at']
    search_fields = ['number', 'title', 'description', 'correspondent']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(DocumentComment)
class DocumentCommentAdmin(admin.ModelAdmin):
    list_display = ['document', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['text']


@admin.register(DocumentHistory)
class DocumentHistoryAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'action', 'created_at']
    list_filter = ['action', 'created_at']


@admin.register(ApprovalStep)
class ApprovalStepAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'step_order', 'status', 'completed_at']
    list_filter = ['status', 'completed_at']
