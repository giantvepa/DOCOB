# 🔧 ПОЛНАЯ ПЕРЕУСТАНОВКА БАЗЫ ДАННЫХ

## ⚡ БЫСТРОЕ РЕШЕНИЕ (Windows)

1. Откройте папку `backend`
2. Дважды кликните на файл **`reinstall.bat`**
3. Дождитесь завершения
4. Готово!

---

## 📝 РУЧНАЯ УСТАНОВКА (пошагово)

### Шаг 1: Активируйте виртуальное окружение

```bash
venv\Scripts\activate
```

### Шаг 2: Удалите старую базу данных

```bash
del db.sqlite3
```

### Шаг 3: Удалите старые миграции

```bash
del users\migrations\0001_initial.py
del documents\migrations\0001_initial.py
del tasks\migrations\0001_initial.py
del meetings\migrations\0001_initial.py
```

### Шаг 4: Создайте новые миграции

```bash
python manage.py makemigrations users
python manage.py makemigrations documents
python manage.py makemigrations tasks
python manage.py makemigrations meetings
```

Вы должны увидеть:
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

### Шаг 5: Примените миграции

```bash
python manage.py migrate
```

Вы должны увидеть:
```
Operations to perform:
  Apply all migrations: admin, auth, authtoken, contenttypes, documents, meetings, sessions, tasks, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
  Applying users.0001_initial... OK
  Applying documents.0001_initial... OK
  Applying tasks.0001_initial... OK
  Applying meetings.0001_initial... OK
```

### Шаг 6: Проверьте миграции

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

Все миграции должны быть отмечены `[X]`.

### Шаг 7: Создайте тестовые данные

```bash
python manage.py init_demo_data
```

### Шаг 8: Запустите сервер

```bash
python manage.py runserver
```

Откройте: http://127.0.0.1:8000/

---

## 🐛 ЕСЛИ ПРОБЛЕМА НЕ РЕШЕНА

### Проверка 1: Убедитесь, что приложения в INSTALLED_APPS

Откройте файл `backend/sed_project/settings.py` и проверьте:

```python
INSTALLED_APPS = [
    # ... другие приложения ...
    
    # Local apps
    'users.apps.UsersConfig',
    'documents.apps.DocumentsConfig',
    'tasks.apps.TasksConfig',
    'meetings.apps.MeetingsConfig',
]
```

### Проверка 2: Убедитесь, что файлы apps.py существуют

Проверьте наличие файлов:
- `backend/users/apps.py`
- `backend/documents/apps.py`
- `backend/tasks/apps.py`
- `backend/meetings/apps.py`

### Проверка 3: Убедитесь, что файлы __init__.py существуют

Проверьте наличие файлов:
- `backend/users/__init__.py`
- `backend/documents/__init__.py`
- `backend/tasks/__init__.py`
- `backend/meetings/__init__.py`
- `backend/users/migrations/__init__.py`
- `backend/documents/migrations/__init__.py`
- `backend/tasks/migrations/__init__.py`
- `backend/meetings/migrations/__init__.py`

### Проверка 4: Попробуйте создать миграции заново

```bash
python manage.py makemigrations
```

Если увидите ошибку, покажите её мне.

---

## 📋 ПОЛНАЯ ПРОВЕРКА

После выполнения всех шагов выполните:

```bash
python manage.py showmigrations
```

Вы должны увидеть ВСЕ приложения:
- admin
- auth
- authtoken
- contenttypes
- **documents** ← должно быть!
- **meetings** ← должно быть!
- sessions
- **tasks** ← должно быть!
- **users** ← должно быть!

Если каких-то приложений нет, покажите мне вывод команды.

---

## 🆘 НУЖНА ПОМОЩЬ?

Если проблема не решена, выполните эти команды и покажите мне результат:

```bash
python --version
python manage.py showmigrations
python manage.py makemigrations
```

---

**Удачи! 🚀**
