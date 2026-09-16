from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import User, Department
from documents.models import Document
from tasks.models import Task
from meetings.models import Meeting


class Command(BaseCommand):
    help = 'Создает тестовые данные для СЭД "ЭСАСЫ ПИКИР"'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить существующие данные перед созданием',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Удаление существующих данных...'))
            Meeting.objects.all().delete()
            Task.objects.all().delete()
            Document.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            Department.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✅ Данные удалены'))

        self.stdout.write(self.style.SUCCESS('Создание тестовых данных...'))

        # Создать отделы
        dept1, _ = Department.objects.get_or_create(
            name='Руководство',
            defaults={'code': 'MGMT', 'description': 'Высшее руководство компании'}
        )
        dept2, _ = Department.objects.get_or_create(
            name='Бухгалтерия',
            defaults={'code': 'ACC', 'description': 'Бухгалтерия и финансы'}
        )
        dept3, _ = Department.objects.get_or_create(
            name='IT отдел',
            defaults={'code': 'IT', 'description': 'Информационные технологии'}
        )
        dept4, _ = Department.objects.get_or_create(
            name='Юридический отдел',
            defaults={'code': 'LEGAL', 'description': 'Юридическое сопровождение'}
        )
        dept5, _ = Department.objects.get_or_create(
            name='Отдел кадров',
            defaults={'code': 'HR', 'description': 'Управление персоналом'}
        )

        self.stdout.write(f'✅ Создано отделов: {Department.objects.count()}')

        # Создать пользователей
        admin, created = User.objects.get_or_create(
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
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()

        manager, created = User.objects.get_or_create(
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
            }
        )
        if created:
            manager.set_password('manager123')
            manager.save()

        user, created = User.objects.get_or_create(
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
            }
        )
        if created:
            user.set_password('user123')
            user.save()

        user2, created = User.objects.get_or_create(
            email='jurist@demo.tm',
            defaults={
                'username': 'jurist',
                'first_name': 'Сидоров',
                'last_name': 'Константин',
                'position': 'Юрист',
                'department': 'Юридический отдел',
                'role': 'user',
                'avatar': '⚖️',
                'is_active': True,
            }
        )
        if created:
            user2.set_password('jurist123')
            user2.save()

        self.stdout.write(f'✅ Создано пользователей: {User.objects.filter(is_superuser=False).count()}')

        # Создать документы
        doc1, _ = Document.objects.get_or_create(
            number='ВХ-2024-0156',
            defaults={
                'title': 'Договор поставки серверного оборудования',
                'description': 'Договор с ООО "ТехноСервис" на поставку серверного оборудования для модернизации ЦОД. Сумма: 2 450 000 руб.',
                'doc_type': 'incoming',
                'category': 'contract',
                'status': 'on_approval',
                'priority': 'high',
                'author': user,
                'correspondent': 'ООО "ТехноСервис"',
                'due_date': '2024-12-20',
                'tags': ['поставка', 'оборудование', 'ЦОД'],
            }
        )

        doc2, _ = Document.objects.get_or_create(
            number='ИСХ-2024-0089',
            defaults={
                'title': 'Письмо в адрес ООО "Партнёр"',
                'description': 'Исходящее письмо с предложением о пролонгации договора и пересмотре условий сотрудничества на 2025 год.',
                'doc_type': 'outgoing',
                'category': 'letter',
                'status': 'signed',
                'priority': 'normal',
                'author': user,
                'correspondent': 'ООО "Партнёр"',
                'tags': ['партнёр', 'пролонгация'],
            }
        )

        doc3, _ = Document.objects.get_or_create(
            number='ВН-2024-0234',
            defaults={
                'title': 'Служебная записка о необходимости модернизации IT-инфраструктуры',
                'description': 'Обоснование необходимости модернизации серверной инфраструктуры. Текущее оборудование выработало ресурс.',
                'doc_type': 'internal',
                'category': 'memo',
                'status': 'executed',
                'priority': 'high',
                'author': user,
                'tags': ['IT', 'модернизация', 'серверы'],
            }
        )

        doc4, _ = Document.objects.get_or_create(
            number='ВХ-2024-0162',
            defaults={
                'title': 'Акт выполненных работ по договору №45/2024',
                'description': 'Акт сдачи-приёмки работ по этапу 2 проекта автоматизации. Подрядчик: АО "ИнфоТех". Сумма: 780 000 руб.',
                'doc_type': 'incoming',
                'category': 'act',
                'status': 'on_approval',
                'priority': 'critical',
                'author': user,
                'correspondent': 'АО "ИнфоТех"',
                'due_date': '2024-12-16',
                'tags': ['акт', 'автоматизация'],
            }
        )

        doc5, _ = Document.objects.get_or_create(
            number='ВН-2024-0241',
            defaults={
                'title': 'Приказ о проведении годовой инвентаризации',
                'description': 'Приказ о проведении годовой инвентаризации основных средств и материальных ценностей. Срок: до 31.12.2024.',
                'doc_type': 'internal',
                'category': 'order',
                'status': 'draft',
                'priority': 'high',
                'author': manager,
                'due_date': '2024-12-18',
                'tags': ['инвентаризация', 'приказ'],
            }
        )

        self.stdout.write(f'✅ Создано документов: {Document.objects.count()}')

        # Создать задачи
        task1, _ = Task.objects.get_or_create(
            title='Подготовить ответ на письмо ООО "Партнёр"',
            defaults={
                'description': 'Подготовить проект ответа до конца недели',
                'status': 'in_progress',
                'priority': 'high',
                'assignee': user,
                'author': admin,
                'document': doc2,
                'due_date': '2024-12-15',
            }
        )

        task2, _ = Task.objects.get_or_create(
            title='Проверить договор поставки оборудования',
            defaults={
                'description': 'Юридическая экспертиза договора с ООО "ТехноСервис"',
                'status': 'completed',
                'priority': 'high',
                'assignee': user2,
                'author': admin,
                'document': doc1,
                'due_date': '2024-12-12',
                'completed_at': timezone.now(),
            }
        )

        task3, _ = Task.objects.get_or_create(
            title='Подготовить финансовое обоснование модернизации',
            defaults={
                'description': 'Рассчитать ROI и срок окупаемости',
                'status': 'new',
                'priority': 'normal',
                'assignee': manager,
                'author': admin,
                'document': doc3,
                'due_date': '2024-12-20',
            }
        )

        task4, _ = Task.objects.get_or_create(
            title='Организовать подписание акта с АО "ИнфоТех"',
            defaults={
                'description': 'Согласовать акт и организовать подписание',
                'status': 'new',
                'priority': 'critical',
                'assignee': user,
                'author': admin,
                'document': doc4,
                'due_date': '2024-12-16',
            }
        )

        task5, _ = Task.objects.get_or_create(
            title='Завершить инвентаризацию',
            defaults={
                'description': 'Провести инвентаризацию основных средств',
                'status': 'in_progress',
                'priority': 'high',
                'assignee': manager,
                'author': admin,
                'document': doc5,
                'due_date': '2024-12-31',
            }
        )

        self.stdout.write(f'✅ Создано задач: {Task.objects.count()}')

        # Создать совещания
        meeting1, _ = Meeting.objects.get_or_create(
            title='Заседание правления по итогам Q4 2024',
            defaults={
                'description': 'Обсуждение результатов 4 квартала и планов на 2025 год',
                'date': '2024-12-18',
                'time': '10:00',
                'duration': 120,
                'location': 'Конференц-зал А',
                'organizer': admin,
                'status': 'planned',
                'agenda': ['Итоги Q4 по подразделениям', 'Финансовые показатели', 'Планы на 2025', 'Бюджетирование'],
            }
        )
        meeting1.participants.add(admin, manager, user, user2)

        meeting2, _ = Meeting.objects.get_or_create(
            title='Совещание по проекту модернизации ЦОД',
            defaults={
                'description': 'Обсуждение хода проекта и согласование этапов',
                'date': '2024-12-16',
                'time': '14:00',
                'duration': 60,
                'location': 'Переговорная Б',
                'organizer': user,
                'status': 'planned',
                'agenda': ['Статус проекта', 'Согласование договора', 'Сроки поставки', 'Бюджет'],
            }
        )
        meeting2.participants.add(user, manager, user2)

        meeting3, _ = Meeting.objects.get_or_create(
            title='Еженедельное совещание руководителей',
            defaults={
                'description': 'Регулярное совещание по операционным вопросам',
                'date': '2024-12-14',
                'time': '09:00',
                'duration': 90,
                'location': 'Конференц-зал А',
                'organizer': admin,
                'status': 'completed',
                'agenda': ['Статус задач', 'Проблемные вопросы', 'Планы на неделю'],
                'protocol': 'Протокол утверждён. Поручения розданы.',
            }
        )
        meeting3.participants.add(admin, manager, user, user2)

        self.stdout.write(f'✅ Создано совещаний: {Meeting.objects.count()}')

        # Итоговая статистика
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('🎉 Тестовые данные успешно созданы!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\n📊 Статистика:'))
        self.stdout.write(f'  • Отделов: {Department.objects.count()}')
        self.stdout.write(f'  • Пользователей: {User.objects.filter(is_superuser=False).count()}')
        self.stdout.write(f'  • Документов: {Document.objects.count()}')
        self.stdout.write(f'  • Задач: {Task.objects.count()}')
        self.stdout.write(f'  • Совещаний: {Meeting.objects.count()}')
        
        self.stdout.write(self.style.SUCCESS('\n📧 Тестовые аккаунты:'))
        self.stdout.write(self.style.SUCCESS('  • admin@demo.tm / admin123 (Администратор)'))
        self.stdout.write(self.style.SUCCESS('  • manager@demo.tm / manager123 (Руководитель)'))
        self.stdout.write(self.style.SUCCESS('  • user@demo.tm / user123 (Пользователь)'))
        self.stdout.write(self.style.SUCCESS('  • jurist@demo.tm / jurist123 (Юрист)'))
        
        self.stdout.write(self.style.SUCCESS('\n🌐 Доступ:'))
        self.stdout.write(self.style.SUCCESS('  • API: http://127.0.0.1:8000/api/'))
        self.stdout.write(self.style.SUCCESS('  • Админка: http://127.0.0.1:8000/admin/'))
        self.stdout.write(self.style.SUCCESS('  • Документация: http://127.0.0.1:8000/api/docs/'))
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
