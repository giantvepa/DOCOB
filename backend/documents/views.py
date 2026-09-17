from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Document, DocumentComment, DocumentHistory, ApprovalStep
from .serializers import DocumentSerializer, DocumentDetailSerializer, DocumentCommentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet для документов"""
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'doc_type', 'category', 'priority', 'author']
    search_fields = ['number', 'title', 'description', 'correspondent', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority', 'number']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DocumentDetailSerializer
        return DocumentSerializer
    
    def perform_create(self, serializer):
        document = serializer.save(author=self.request.user)
        
        # Генерируем номер документа
        if not document.number:
            year = timezone.now().year
            count = Document.objects.filter(created_at__year=year).count()
            document.number = f"DOC-{year}-{count:04d}"
            document.save()
        
        # Записываем в историю
        DocumentHistory.objects.create(
            document=document,
            user=self.request.user,
            action='created',
            details='Документ создан'
        )
    
    def perform_update(self, serializer):
        document = serializer.save()
        DocumentHistory.objects.create(
            document=document,
            user=self.request.user,
            action='updated',
            details='Документ обновлён'
        )
    
    def perform_destroy(self, instance):
        DocumentHistory.objects.create(
            document=instance,
            user=self.request.user,
            action='deleted',
            details=f'Документ удалён: {instance.title}'
        )
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def send_to_approval(self, request, pk=None):
        """Отправить документ на согласование"""
        document = self.get_object()
        
        if document.status != 'draft':
            return Response(
                {'error': 'Документ должен быть в статусе "Черновик"'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        approvers_ids = request.data.get('approvers', [])
        
        if not approvers_ids:
            return Response(
                {'error': 'Необходимо указать согласующих'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for idx, user_id in enumerate(approvers_ids):
            ApprovalStep.objects.create(
                document=document,
                user_id=user_id,
                step_order=idx + 1,
                status='waiting'
            )
        
        document.status = 'on_approval'
        document.save()
        
        DocumentHistory.objects.create(
            document=document,
            user=request.user,
            action='sent_to_approval',
            details=f'Отправлен на согласование. Согласующие: {len(approvers_ids)}'
        )
        
        return Response(DocumentDetailSerializer(document).data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Согласовать документ"""
        document = self.get_object()
        
        approval = document.approvals.filter(user=request.user, status='waiting').first()
        
        if not approval:
            return Response(
                {'error': 'Вы не найдены в списке согласующих или уже согласовали'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = request.data.get('comment', '')
        
        approval.status = 'approved'
        approval.comment = comment
        approval.completed_at = timezone.now()
        approval.save()
        
        all_approved = not document.approvals.filter(status='waiting').exists()
        
        if all_approved:
            document.status = 'signed'
            document.save()
        
        DocumentHistory.objects.create(
            document=document,
            user=request.user,
            action='approved',
            details=f'Согласовано. Комментарий: {comment}'
        )
        
        return Response(DocumentDetailSerializer(document).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Отклонить документ"""
        document = self.get_object()
        
        approval = document.approvals.filter(user=request.user, status='waiting').first()
        
        if not approval:
            return Response(
                {'error': 'Вы не найдены в списке согласующих'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = request.data.get('comment', '')
        
        approval.status = 'rejected'
        approval.comment = comment
        approval.completed_at = timezone.now()
        approval.save()
        
        document.status = 'rejected'
        document.save()
        
        DocumentHistory.objects.create(
            document=document,
            user=request.user,
            action='rejected',
            details=f'Отклонено. Причина: {comment}'
        )
        
        return Response(DocumentDetailSerializer(document).data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Добавить комментарий к документу"""
        document = self.get_object()
        
        serializer = DocumentCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(document=document, author=request.user)
            
            DocumentHistory.objects.create(
                document=document,
                user=request.user,
                action='commented',
                details='Добавлен комментарий'
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Архивировать документ"""
        document = self.get_object()
        document.status = 'archived'
        document.save()
        
        DocumentHistory.objects.create(
            document=document,
            user=request.user,
            action='archived',
            details='Документ перемещён в архив'
        )
        
        return Response(DocumentSerializer(document).data)
