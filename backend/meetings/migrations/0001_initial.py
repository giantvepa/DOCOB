# Generated manually for meetings app

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
            name='Meeting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('date', models.DateField(verbose_name='Дата')),
                ('time', models.TimeField(verbose_name='Время')),
                ('duration', models.PositiveIntegerField(default=60, verbose_name='Длительность (мин)')),
                ('location', models.CharField(blank=True, max_length=300, verbose_name='Место')),
                ('status', models.CharField(choices=[('planned', 'Запланировано'), ('in_progress', 'Идёт'), ('completed', 'Завершено'), ('cancelled', 'Отменено')], default='planned', max_length=20, verbose_name='Статус')),
                ('agenda', models.JSONField(blank=True, default=list, verbose_name='Повестка')),
                ('protocol', models.TextField(blank=True, verbose_name='Протокол')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organized_meetings', to=settings.AUTH_USER_MODEL, verbose_name='Организатор')),
                ('participants', models.ManyToManyField(blank=True, related_name='meeting_participations', to=settings.AUTH_USER_MODEL, verbose_name='Участники')),
            ],
            options={
                'verbose_name': 'Совещание',
                'verbose_name_plural': 'Совещания',
                'ordering': ['date', 'time'],
            },
        ),
        migrations.AddIndex(
            model_name='meeting',
            index=models.Index(fields=['status'], name='meetings_me_status_idx'),
        ),
        migrations.AddIndex(
            model_name='meeting',
            index=models.Index(fields=['date'], name='meetings_me_date_idx'),
        ),
        migrations.AddIndex(
            model_name='meeting',
            index=models.Index(fields=['organizer'], name='meetings_me_organizer_idx'),
        ),
    ]
