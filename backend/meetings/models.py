from django.db import models
from django.conf import settings


class Meeting(models.Model):
    """Модель совещания"""
    
    STATUS_CHOICES = (
        ('planned', 'Запланировано'),
        ('in_progress', 'Идёт'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
    )
    
    title = models.CharField(max_length=500, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    date = models.DateField(verbose_name='Дата')
    time = models.TimeField(verbose_name='Время')
    duration = models.PositiveIntegerField(default=60, verbose_name='Длительность (мин)')
    location = models.CharField(max_length=300, blank=True, verbose_name='Место')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned', verbose_name='Статус')
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_meetings', verbose_name='Организатор')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='meeting_participations', verbose_name='Участники', blank=True)
    agenda = models.JSONField(default=list, blank=True, verbose_name='Повестка')
    protocol = models.TextField(blank=True, verbose_name='Протокол')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    
    class Meta:
        verbose_name = 'Совещание'
        verbose_name_plural = 'Совещания'
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.title} ({self.date} {self.time})"
