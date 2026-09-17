from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Создает тестовых пользователей с активными аккаунтами'

    def handle(self, *args, **options):
        # Создаем тестовых пользователей
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@demo.tm',
                'password': 'admin123',
                'first_name': 'Аннамыратов',
                'last_name': 'Сердар',
                'position': 'Генеральный директор',
                'department': 'Руководство',
                'role': 'admin',
                'avatar': '👔',
            },
            {
                'username': 'manager',
                'email': 'manager@demo.tm',
                'password': 'manager123',
                'first_name': 'Мергенджанова',
                'last_name': 'Айгуль',
                'position': 'Главный бухгалтер',
                'department': 'Бухгалтерия',
                'role': 'manager',
                'avatar': '👩‍💼',
            },
            {
                'username': 'user',
                'email': 'user@demo.tm',
                'password': 'user123',
                'first_name': 'Бердиев',
                'last_name': 'Гурбан',
                'position': 'Специалист',
                'department': 'IT отдел',
                'role': 'user',
                'avatar': '💻',
            },
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'position': user_data['position'],
                    'department': user_data['department'],
                    'role': user_data['role'],
                    'avatar': user_data['avatar'],
                    'is_active': True,  # ВАЖНО: Пользователь активен!
                }
            )
            
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'✅ Создан: {user.email}'))
            else:
                # Активируем существующего пользователя
                if not user.is_active:
                    user.is_active = True
                    user.save()
                    self.stdout.write(self.style.WARNING(f'⚠️  Активирован: {user.email}'))
                else:
                    self.stdout.write(f'ℹ️  Уже существует: {user.email}')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Тестовые пользователи созданы/активированы!'))
        self.stdout.write('\n📧 Данные для входа:')
        self.stdout.write('  admin@demo.tm / admin123')
        self.stdout.write('  manager@demo.tm / manager123')
        self.stdout.write('  user@demo.tm / user123')
