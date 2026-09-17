from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Кастомная модель пользователя"""
    
    ROLE_CHOICES = (
        ('admin', 'Администратор'),
        ('manager', 'Руководитель'),
        ('user', 'Пользователь'),
    )
    
    email = models.EmailField(unique=True, verbose_name='Email')
    position = models.CharField(max_length=200, blank=True, verbose_name='Должность')
    department = models.CharField(max_length=200, blank=True, verbose_name='Отдел')
    avatar = models.CharField(max_length=10, default='👤', verbose_name='Аватар')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user', verbose_name='Роль')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
