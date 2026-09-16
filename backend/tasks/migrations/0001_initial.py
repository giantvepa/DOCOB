# Generated manually for tasks app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('documents', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('status', models.CharField(choices=[('new', 'Новая'), ('in_progress', 'В работе'), ('completed', 'Выполнена'), ('overdue', 'Просрочена'), ('deferred', 'Отложена')], default='new', max_length=20, verbose_name='Статус')),
                ('priority', models.CharField(choices=[('low', 'Низкий'), ('normal', 'Обычный'), ('high', 'Высокий'), ('critical', 'Критичный')], default='normal', max_length=20, verbose_name='Приоритет')),
                ('due_date', models.DateField(verbose_name='Срок выполнения')),
                ('completed_at', models.DateTimeField(blank=True, null=True, verbose_name='Дата выполнения')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создана')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлена')),
                ('assignee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Исполнитель')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Автор')),
                ('document', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tasks', to='documents.document', verbose_name='Связанный документ')),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['status'], name='tasks_task_status_idx'),
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['assignee'], name='tasks_task_assignee_idx'),
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['due_date'], name='tasks_task_due_date_idx'),
        ),
    ]
