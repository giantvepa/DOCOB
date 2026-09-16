from django.db import models
from django.conf import settings


class Task(models.Model):
    """Модель задачи"""
    
    STATUS_CHOICES = (
        ('new', 'Новая'),
        ('in_progress', 'В работе'),
        ('completed', 'Выполнена'),
        ('overdue', 'Просрочена'),
        ('deferred', 'Отложена'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Низкий'),
        ('normal', 'Обычный'),
        ('high', 'Высокий'),
        ('critical', 'Критичный'),
    )
    
    title = models.CharField(max_length=500, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name='Статус')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name='Приоритет')
    
    # Связи
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='assigned_tasks', verbose_name='Исполнитель')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                              related_name='created_tasks', verbose_name='Автор')
    document = models.ForeignKey('documents.Document', on_delete=models.SET_NULL,
                                null=True, blank=True, related_name='tasks', verbose_name='Связанный документ')
    
    # Сроки
    due_date = models.DateField(verbose_name='Срок выполнения')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата выполнения')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлена')
    
    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['assignee']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
    
    @property
    def is_overdue(self):
        from django.utils import timezone
        if self.status not in ['completed', 'deferred']:
            return self.due_date < timezone.now().date()
        return False
