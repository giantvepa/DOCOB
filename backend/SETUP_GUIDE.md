# 🔧 Решение ошибки "no such table: users_user"

## ❌ Проблема

Вы получили ошибку:
```
sqlite3.OperationalError: no such table: users_user
```

Это означает, что база данных не создана или миграции не применены.

## ✅ Решение

### Шаг 1: Удалите старую базу данных (если есть)

```bash
# Windows
del db.sqlite3

# Linux/Mac
rm db.sqlite3
```

### Шаг 2: Создайте миграции

```bash
python manage.py makemigrations
```

Должно появиться:
```
Migrations for 'users':
  users\migrations\0001_initial.py
    - Create model User
    - Create model Department
Migrations for 'documents':
  documents\migrations\0001_initial.py
    - Create model Document
    - Create model DocumentComment
    - Create model DocumentHistory
    - Create model ApprovalStep
Migrations for 'tasks':
  tasks\migrations\0001_initial.py
    - Create model Task
Migrations for 'meetings':
  meetings\migrations\0001_initial.py
    - Create model Meeting
```

### Шаг 3: Примените миграции

```bash
python manage.py migrate
```

Должно появиться:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, documents, meetings, sessions, tasks, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
  Applying users.0001_initial... OK
  Applying documents.0001_initial... OK
  Applying tasks.0001_initial... OK
  Applying meetings.0001_initial... OK
```

### Шаг 4: Создайте суперпользователя

```bash
python manage.py createsuperuser
```

Введите:
- Username: `admin`
- Email: `admin@demo.tm`
- Password: `admin123`
- Password (again): `admin123`

### Шаг 5: Запустите сервер

```bash
python manage.py runserver
```

Откройте: http://127.0.0.1:8000/

## 🚀 Быстрый старт (все команды)

```bash
# Перейти в папку backend
cd backend

# Активировать виртуальное окружение
venv\Scripts\activate

# Удалить старую базу (если есть)
del db.sqlite3

# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver
```

## 📝 Автоматическая инициализация

Если хотите автоматически создать тестовые данные, выполните:

```bash
python manage.py shell
```

Затем вставьте:

```python
from users.models import User, Department
from documents.models import Document
from tasks.models import Task
from meetings.models import Meeting
from django.utils import timezone

# Создать отделы
dept1 = Department.objects.create(name='Руководство', code='MGMT')
dept2 = Department.objects.create(name='Бухгалтерия', code='ACC')
dept3 = Department.objects.create(name='IT отдел', code='IT')

# Создать пользователей
admin = User.objects.create_user(
    username='admin',
    email='admin@demo.tm',
    password='admin123',
    first_name='Аннамыратов',
    last_name='Сердар',
    position='Генеральный директор',
    department='Руководство',
    role='admin'
)

manager = User.objects.create_user(
    username='manager',
    email='manager@demo.tm',
    password='manager123',
    first_name='Мергенджанова',
    last_name='Айгуль',
    position='Главный бухгалтер',
    department='Бухгалтерия',
    role='manager'
)

user = User.objects.create_user(
    username='user',
    email='user@demo.tm',
    password='user123',
    first_name='Бердиев',
    last_name='Гурбан',
    position='Специалист',
    department='IT отдел',
    role='user'
)

# Создать документы
doc1 = Document.objects.create(
    number='ВХ-2024-0156',
    title='Договор поставки серверного оборудования',
    description='Договор с ООО "ТехноСервис" на поставку серверного оборудования',
    doc_type='incoming',
    category='contract',
    status='on_approval',
    priority='high',
    author=user,
    correspondent='ООО "ТехноСервис"',
    due_date='2024-12-20'
)

doc2 = Document.objects.create(
    number='ИСХ-2024-0089',
    title='Письмо в адрес ООО "Партнёр"',
    description='Исходящее письмо с предложением о пролонгации договора',
    doc_type='outgoing',
    category='letter',
    status='signed',
    priority='normal',
    author=user,
    correspondent='ООО "Партнёр"'
)

# Создать задачи
task1 = Task.objects.create(
    title='Подготовить ответ на письмо ООО "Партнёр"',
    description='Подготовить проект ответа до конца недели',
    status='in_progress',
    priority='high',
    assignee=user,
    author=admin,
    due_date='2024-12-15'
)

task2 = Task.objects.create(
    title='Проверить договор поставки оборудования',
    description='Юридическая экспертиза договора',
    status='completed',
    priority='high',
    assignee=manager,
    author=admin,
    due_date='2024-12-12',
    completed_at=timezone.now()
)

# Создать совещания
meeting1 = Meeting.objects.create(
    title='Заседание правления по итогам Q4 2024',
    description='Обсуждение результатов 4 квартала',
    date='2024-12-18',
    time='10:00',
    duration=120,
    location='Конференц-зал А',
    organizer=admin,
    agenda=['Итоги Q4', 'Финансовые показатели', 'Планы на 2025']
)
meeting1.participants.add(admin, manager, user)

print('✅ Тестовые данные созданы!')
print('📧 Пользователи:')
print('  - admin@demo.tm / admin123')
print('  - manager@demo.tm / manager123')
print('  - user@demo.tm / user123')
```

Выйдите из shell:
```python
exit()
```

## 🔍 Проверка

После запуска сервера проверьте:

1. **Админка:** http://127.0.0.1:8000/admin/
   - Войдите с учетными данными суперпользователя
   - Должны видеть модели: Users, Documents, Tasks, Meetings

2. **API:** http://127.0.0.1:8000/api/
   - Должен вернуть список endpoints

3. **Документация:** http://127.0.0.1:8000/api/docs/
   - Swagger UI с описанием всех endpoints

## 🐛 Если ошибка повторяется

### Проверьте, что миграции созданы:

```bash
python manage.py showmigrations
```

Должно быть:
```
users
 [X] 0001_initial
documents
 [X] 0001_initial
tasks
 [X] 0001_initial
meetings
 [X] 0001_initial
```

Если видите `[ ]` вместо `[X]`, выполните:
```bash
python manage.py migrate
```

### Проверьте, что база данных создана:

```bash
# Windows
dir db.sqlite3

# Linux/Mac
ls -lh db.sqlite3
```

Файл должен существовать и иметь размер > 0.

### Полная переустановка:

```bash
# Удалить всё
del db.sqlite3
rmdir /s /q users\migrations
rmdir /s /q documents\migrations
rmdir /s /q tasks\migrations
rmdir /s /q meetings\migrations

# Создать заново
python manage.py makemigrations users documents tasks meetings
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 📞 Поддержка

Если проблема не решена:

1. Проверьте версию Python: `python --version` (должна быть 3.10+)
2. Проверьте версию Django: `python -m django --version` (должна быть 5.0+)
3. Проверьте, что все зависимости установлены: `pip list`
4. Проверьте логи ошибок в консоли

---

**Удачи! 🚀**
