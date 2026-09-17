from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Активирует всех пользователей в системе'

    def handle(self, *args, **options):
        count = User.objects.filter(is_active=False).update(is_active=True)
        self.stdout.write(
            self.style.SUCCESS(f'Активировано пользователей: {count}')
        )
        
        # Показать всех пользователей
        users = User.objects.all()
        self.stdout.write('\nСписок пользователей:')
        for user in users:
            status = '✅ Активен' if user.is_active else '❌ Деактивирован'
            self.stdout.write(f'  {user.email}: {status}')
