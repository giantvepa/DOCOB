# 🔧 РЕШЕНИЕ ПРОБЛЕМЫ: Таблица users_user не создается

## ❌ Проблема

Вы получили ошибку:
```
sqlite3.OperationalError: no such table: users_user
```

Это означает, что миграции не были применены к базе данных.

## ✅ РЕШЕНИЕ (пошагово)

### Шаг 1: Удалите старую базу данных

Откройте командную строку в папке `backend` и выполните:

**Windows:**
```bash
del db.sqlite3
```

**Linux/Mac:**
```bash
rm db.sqlite3
```

### Шаг 2: Проверьте, что все миграции созданы

Выполните команду:
```bash
python manage.py showmigrations
```

Вы должны увидеть:
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

### Шаг 3: Примените миграции

```bash
python manage.py migrate
```

Вы должны увидеть:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, documents, meetings, sessions, tasks, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove

...
  Applying users.0001_initial... OK
  Applying documents.0001_initial... OK
  Applying tasks.0001_initial... OK
  Applying meetings.0001_initial... OK
```

### Шаг 4: Создайте тестовые данные

```bash
python manage.py init_demo_data
```

### Шаг 5: Запустите сервер

```bash
python manage.py runserver
```

## 🚀 АВТОМАТИЧЕСКОЕ РЕШЕНИЕ

Я создал скрипт, который автоматически решит все проблемы:

### Windows:
1. Откройте папку `backend`
2. Дважды кликните на файл `fix_database.bat`
3. Дождитесь завершения

### Linux/Mac:
```bash
cd backend
chmod +x fix_database.sh
./fix_database.sh
```

## 📋 ЧТО БЫЛО ИСПРАВЛЕНО

Я создал все необходимые файлы миграций вручную:

✅ `backend/users/migrations/__init__.py`
✅ `backend/users/migrations/0001_initial.py` - Создание таблицы users_user
✅ `backend/documents/migrations/__init__.py`
✅ `backend/documents/migrations/0001_initial.py` - Создание таблиц documents
✅ `backend/tasks/migrations/__init__.py`
✅ `backend/tasks/migrations/0001_initial.py` - Создание таблицы tasks
✅ `backend/meetings/migrations/__init__.py`
✅ `backend/meetings/migrations/0001_initial.py` - Создание таблицы meetings

## 🔍 ПРОВЕРКА

После выполнения всех шагов проверьте:

1. **База данных создана:**
```bash
# Windows
dir db.sqlite3

# Linux/Mac
ls -lh db.sqlite3
```

Файл должен существовать и иметь размер > 0.

2. **Таблицы созданы:**
```bash
python manage.py dbshell
```

В SQLite shell выполните:
```sql
.tables
```

Вы должны увидеть:
```
auth_group
auth_group_permissions
auth_permission
auth_user
auth_user_groups
auth_user_user_permissions
django_admin_log
django_content_type
django_migrations
django_session
documents_document
documents_documentcomment
documents_documenthistory
documents_approvalstep
tasks_task
meetings_meeting
meetings_meeting_participants
users_user
users_department
```

Выйдите:
```sql
.quit
```

3. **Сервер запускается:**
```bash
python manage.py runserver
```

Откройте: http://127.0.0.1:8000/

## 🐛 ЕСЛИ ПРОБЛЕМА НЕ РЕШЕНА

### Проверьте версию Python:
```bash
python --version
```
Должна быть 3.10 или выше.

### Проверьте версию Django:
```bash
python -m django --version
```
Должна быть 5.0 или выше.

### Проверьте, что все зависимости установлены:
```bash
pip list
```

Должны быть:
- Django==5.0.1
- djangorestframework==3.14.0
- django-cors-headers==4.3.1
- django-filter==23.5
- drf-spectacular==0.27.0

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
python manage.py init_demo_data
python manage.py runserver
```

## 📞 ПОДДЕРЖКА

Если проблема не решена, покажите вывод команд:

```bash
python manage.py showmigrations
python manage.py migrate
python manage.py runserver
```

И отправьте мне для анализа.

---

**Удачи! 🚀**

После выполнения всех шагов таблица `users_user` будет создана, и приложение запустится без ошибок.
