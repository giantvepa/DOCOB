from django.db import models
from django.conf import settings


class Document(models.Model):
    """Модель документа"""
    
    TYPE_CHOICES = (
        ('incoming', 'Входящий'),
        ('outgoing', 'Исходящий'),
        ('internal', 'Внутренний'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Черновик'),
        ('on_approval', 'На согласовании'),
        ('on_signing', 'На подписании'),
        ('signed', 'Подписан'),
        ('executed', 'Исполнен'),
        ('rejected', 'Отклонён'),
        ('archived', 'В архиве'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Низкий'),
        ('normal', 'Обычный'),
        ('high', 'Высокий'),
        ('critical', 'Критичный'),
    )
    
    CATEGORY_CHOICES = (
        ('contract', 'Договор'),
        ('invoice', 'Счёт'),
        ('act', 'Акт'),
        ('letter', 'Письмо'),
        ('order', 'Приказ'),
        ('application', 'Заявление'),
        ('memo', 'Служебная записка'),
        ('protocol', 'Протокол'),
        ('other', 'Другое'),
    )
    
    number = models.CharField(max_length=100, unique=True, verbose_name='Номер')
    title = models.CharField(max_length=500, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='internal', verbose_name='Тип')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other', verbose_name='Категория')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name='Статус')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name='Приоритет')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents', verbose_name='Автор')
    correspondent = models.CharField(max_length=300, blank=True, verbose_name='Корреспондент')
    due_date = models.DateField(null=True, blank=True, verbose_name='Срок исполнения')
    file = models.FileField(upload_to='documents/%Y/%m/', null=True, blank=True, verbose_name='Файл')
    tags = models.JSONField(default=list, blank=True, verbose_name='Теги')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')
    
    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.number}: {self.title}"


class DocumentComment(models.Model):
    """Комментарий к документу"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='comments', verbose_name='Документ')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments', verbose_name='Автор')
    text = models.TextField(verbose_name='Текст')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']


class DocumentHistory(models.Model):
    """История изменений документа"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='history', verbose_name='Документ')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='document_history', verbose_name='Пользователь')
    action = models.CharField(max_length=100, verbose_name='Действие')
    details = models.TextField(blank=True, verbose_name='Детали')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    
    class Meta:
        verbose_name = 'Запись истории'
        verbose_name_plural = 'Записи истории'
        ordering = ['-created_at']


class ApprovalStep(models.Model):
    """Шаг согласования документа"""
    STATUS_CHOICES = (
        ('waiting', 'Ожидает'),
        ('approved', 'Согласовано'),
        ('rejected', 'Отклонено'),
    )
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='approvals', verbose_name='Документ')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='approval_steps', verbose_name='Согласующий')
    step_order = models.PositiveIntegerField(default=0, verbose_name='Порядок шага')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting', verbose_name='Статус')
    comment = models.TextField(blank=True, verbose_name='Комментарий')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Завершено')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    
    class Meta:
        verbose_name = 'Шаг согласования'
        verbose_name_plural = 'Шаги согласования'
        ordering = ['step_order', 'created_at']
