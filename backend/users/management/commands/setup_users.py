from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Создает тестовых пользователей с правильными правами'

    def handle(self, *args, **options):
        # Создаем суперпользователя (админ)
        admin_user, created = User.objects.get_or_create(
            email='admin@demo.tm',
            defaults={
                'username': 'admin',
                'first_name': 'Аннамыратов',
                'last_name': 'Сердар',
                'position': 'Генеральный директор',
                'department': 'Руководство',
                'role': 'admin',
                'avatar': '👔',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Создан: admin@demo.tm (суперпользователь)'))
        else:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.is_active = True
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Обновлён: admin@demo.tm (суперпользователь)'))
        
        # Создаем менеджера
        manager_user, created = User.objects.get_or_create(
            email='manager@demo.tm',
            defaults={
                'username': 'manager',
                'first_name': 'Мергенджанова',
                'last_name': 'Айгуль',
                'position': 'Главный бухгалтер',
                'department': 'Бухгалтерия',
                'role': 'manager',
                'avatar': '👩‍💼',
                'is_active': True,
                'is_staff': True,  # Может входить в админку
                'is_superuser': False,
            }
        )
        
        if created:
            manager_user.set_password('manager123')
            manager_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Создан: manager@demo.tm'))
        else:
            manager_user.is_staff = True
            manager_user.is_active = True
            manager_user.set_password('manager123')
            manager_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Обновлён: manager@demo.tm'))
        
        # Создаем обычного пользователя
        regular_user, created = User.objects.get_or_create(
            email='user@demo.tm',
            defaults={
                'username': 'user',
                'first_name': 'Бердиев',
                'last_name': 'Гурбан',
                'position': 'Специалист',
                'department': 'IT отдел',
                'role': 'user',
                'avatar': '💻',
                'is_active': True,
                'is_staff': False,  # Не может входить в админку
                'is_superuser': False,
            }
        )
        
        if created:
            regular_user.set_password('user123')
            regular_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Создан: user@demo.tm'))
        else:
            regular_user.is_active = True
            regular_user.set_password('user123')
            regular_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Обновлён: user@demo.tm'))
        
        self.stdout.write(self.style.SUCCESS('\n📧 Данные для входа:'))
        self.stdout.write(self.style.SUCCESS('  Админка (суперпользователь):'))
        self.stdout.write(self.style.SUCCESS('    Email: admin@demo.tm'))
        self.stdout.write(self.style.SUCCESS('    Пароль: admin123'))
        self.stdout.write(self.style.SUCCESS('    URL: http://127.0.0.1:8000/admin/'))
        self.stdout.write(self.style.SUCCESS('\n  API (все пользователи):'))
        self.stdout.write(self.style.SUCCESS('    admin@demo.tm / admin123'))
        self.stdout.write(self.style.SUCCESS('    manager@demo.tm / manager123'))
        self.stdout.write(self.style.SUCCESS('    user@demo.tm / user123'))
