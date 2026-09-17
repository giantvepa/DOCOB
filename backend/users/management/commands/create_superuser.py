from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Создает суперпользователя для доступа к админке'

    def handle(self, *args, **options):
        # Создаем суперпользователя
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
                'is_staff': True,      # ВАЖНО: Доступ к админке
                'is_superuser': True,  # ВАЖНО: Полные права
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Суперпользователь создан!'))
        else:
            # Обновляем существующего пользователя
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.is_active = True
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('✅ Суперпользователь обновлён!'))
        
        self.stdout.write(self.style.SUCCESS('\n📧 Данные для входа в админку:'))
        self.stdout.write(self.style.SUCCESS('  Email: admin@demo.tm'))
        self.stdout.write(self.style.SUCCESS('  Пароль: admin123'))
        self.stdout.write(self.style.SUCCESS('\n🌐 Откройте: http://127.0.0.1:8000/admin/'))
