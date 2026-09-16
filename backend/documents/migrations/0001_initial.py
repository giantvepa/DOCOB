# Generated manually for documents app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(max_length=100, unique=True, verbose_name='Регистрационный номер')),
                ('title', models.CharField(max_length=500, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('doc_type', models.CharField(choices=[('incoming', 'Входящий'), ('outgoing', 'Исходящий'), ('internal', 'Внутренний')], default='internal', max_length=20, verbose_name='Тип')),
                ('category', models.CharField(choices=[('contract', 'Договор'), ('invoice', 'Счёт'), ('act', 'Акт'), ('letter', 'Письмо'), ('order', 'Приказ'), ('application', 'Заявление'), ('memo', 'Служебная записка'), ('protocol', 'Протокол'), ('power_of_attorney', 'Доверенность'), ('other', 'Другое')], default='other', max_length=30, verbose_name='Категория')),
                ('status', models.CharField(choices=[('draft', 'Черновик'), ('on_approval', 'На согласовании'), ('on_signing', 'На подписании'), ('signed', 'Подписан'), ('executed', 'Исполнен'), ('rejected', 'Отклонён'), ('archived', 'В архиве')], default='draft', max_length=20, verbose_name='Статус')),
                ('priority', models.CharField(choices=[('low', 'Низкий'), ('normal', 'Обычный'), ('high', 'Высокий'), ('critical', 'Критичный')], default='normal', max_length=20, verbose_name='Приоритет')),
                ('correspondent', models.CharField(blank=True, max_length=300, verbose_name='Корреспондент')),
                ('due_date', models.DateField(blank=True, null=True, verbose_name='Срок исполнения')),
                ('file', models.FileField(blank=True, null=True, upload_to='documents/%Y/%m/', verbose_name='Файл')),
                ('file_size', models.BigIntegerField(default=0, verbose_name='Размер файла')),
                ('tags', models.JSONField(blank=True, default=list, verbose_name='Теги')),
                ('version', models.PositiveIntegerField(default=1, verbose_name='Версия')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлён')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='authored_documents', to=settings.AUTH_USER_MODEL, verbose_name='Автор')),
            ],
            options={
                'verbose_name': 'Документ',
                'verbose_name_plural': 'Документы',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['status'], name='documents_d_status_idx'),
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['doc_type'], name='documents_d_doc_typ_idx'),
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['author'], name='documents_d_author_idx'),
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['created_at'], name='documents_d_created_idx'),
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['number'], name='documents_d_number_idx'),
        ),
        migrations.CreateModel(
            name='DocumentComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Текст комментария')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлён')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_comments', to=settings.AUTH_USER_MODEL, verbose_name='Автор')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='documents.document', verbose_name='Документ')),
            ],
            options={
                'verbose_name': 'Комментарий',
                'verbose_name_plural': 'Комментарии',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='DocumentHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=100, verbose_name='Действие')),
                ('details', models.TextField(blank=True, verbose_name='Детали')),
                ('metadata', models.JSONField(blank=True, default=dict, verbose_name='Метаданные')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='documents.document', verbose_name='Документ')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_history', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Запись истории',
                'verbose_name_plural': 'Записи истории',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ApprovalStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step_order', models.PositiveIntegerField(default=0, verbose_name='Порядок шага')),
                ('status', models.CharField(choices=[('waiting', 'Ожидает'), ('approved', 'Согласовано'), ('rejected', 'Отклонено')], default='waiting', max_length=20, verbose_name='Статус')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('completed_at', models.DateTimeField(blank=True, null=True, verbose_name='Завершено')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='approvals', to='documents.document', verbose_name='Документ')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='approval_steps', to=settings.AUTH_USER_MODEL, verbose_name='Согласующий')),
            ],
            options={
                'verbose_name': 'Шаг согласования',
                'verbose_name_plural': 'Шаги согласования',
                'ordering': ['step_order', 'created_at'],
            },
        ),
    ]
