from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Кастомная модель пользователя для СЭД"""
    
    ROLE_CHOICES = (
        ('admin', 'Администратор'),
        ('manager', 'Руководитель'),
        ('user', 'Пользователь'),
    )
    
    email = models.EmailField(unique=True, verbose_name='Email')
    position = models.CharField(max_length=200, blank=True, verbose_name='Должность')
    department = models.CharField(max_length=200, blank=True, verbose_name='Отдел')
    avatar = models.CharField(max_length=10, default='👤', verbose_name='Аватар (эмодзи)')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user', verbose_name='Роль')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    last_login_ip = models.GenericIPAddressField(null=True, blank=True, verbose_name='Последний IP')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def full_name(self):
        return self.get_full_name() or self.username


class Department(models.Model):
    """Модель отдела/подразделения"""
    
    name = models.CharField(max_length=200, unique=True, verbose_name='Название')
    code = models.CharField(max_length=50, unique=True, verbose_name='Код')
    description = models.TextField(blank=True, verbose_name='Описание')
    head = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                            related_name='headed_departments', verbose_name='Руководитель')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,
                              related_name='children', verbose_name='Родительский отдел')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    
    class Meta:
        verbose_name = 'Отдел'
        verbose_name_plural = 'Отделы'
        ordering = ['name']
    
    def __str__(self):
        return self.name
