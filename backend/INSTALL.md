# 🚀 БЫСТРАЯ УСТАНОВКА BACKEND

## ⚡ Самый быстрый способ (Windows)

1. Откройте папку `backend`
2. Дважды кликните на файл `setup.bat`
3. Дождитесь завершения установки
4. Готово! Тестовые данные создадутся автоматически

## ⚡ Самый быстрый способ (Linux/Mac)

1. Откройте терминал в папке `backend`
2. Выполните команды:
```bash
chmod +x setup.sh
./setup.sh
```
3. Готово!

## 📝 Ручная установка (пошагово)

### Шаг 1: Перейдите в папку backend
```bash
cd backend
```

### Шаг 2: Создайте виртуальное окружение
```bash
python -m venv venv
```

### Шаг 3: Активируйте виртуальное окружение

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Шаг 4: Установите зависимости
```bash
pip install -r requirements.txt
```

### Шаг 5: Создайте миграции
```bash
python manage.py makemigrations
```

Вы должны увидеть:
```
Migrations for 'users':
  users\migrations\0001_initial.py
Migrations for 'documents':
  documents\migrations\0001_initial.py
Migrations for 'tasks':
  tasks\migrations\0001_initial.py
Migrations for 'meetings':
  meetings\migrations\0001_initial.py
```

### Шаг 6: Примените миграции
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
  ...
  Applying users.0001_initial... OK
  Applying documents.0001_initial... OK
  Applying tasks.0001_initial... OK
  Applying meetings.0001_initial... OK
```

### Шаг 7: Создайте тестовые данные
```bash
python manage.py init_demo_data
```

Вы должны увидеть:
```
✅ Создано отделов: 5
✅ Создано пользователей: 4
✅ Создано документов: 5
✅ Создано задач: 5
✅ Создано совещаний: 3

🎉 Тестовые данные успешно созданы!

📧 Тестовые аккаунты:
  • admin@demo.tm / admin123 (Администратор)
  • manager@demo.tm / manager123 (Руководитель)
  • user@demo.tm / user123 (Пользователь)
  • jurist@demo.tm / jurist123 (Юрист)
```

### Шаг 8: Запустите сервер
```bash
python manage.py runserver
```

Вы должны увидеть:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Шаг 9: Откройте в браузере

Перейдите по адресу: **http://127.0.0.1:8000/**

## 🔐 Вход в систему

### Через API (для фронтенда)

Используйте один из тестовых аккаунтов:

**Администратор:**
- Email: `admin@demo.tm`
- Пароль: `admin123`

**Руководитель:**
- Email: `manager@demo.tm`
- Пароль: `manager123`

**Пользователь:**
- Email: `user@demo.tm`
- Пароль: `user123`

**Юрист:**
- Email: `jurist@demo.tm`
- Пароль: `jurist123`

### Через админку Django

1. Откройте: http://127.0.0.1:8000/admin/
2. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```
3. Войдите с учетными данными суперпользователя

## 📡 Проверка API

Откройте в браузере:
- **API:** http://127.0.0.1:8000/api/
- **Документация:** http://127.0.0.1:8000/api/docs/

## 🐛 Решение проблем

### Ошибка: "no such table: users_user"

**Решение:** Выполните миграции:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Ошибка: "Port 8000 already in use"

**Решение:** Используйте другой порт:
```bash
python manage.py runserver 8001
```

### Ошибка: "ModuleNotFoundError: No module named 'django'"

**Решение:** Активируйте виртуальное окружение и установите зависимости:
```bash
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### Ошибка: "Permission denied" (Linux/Mac)

**Решение:** Дайте права на выполнение:
```bash
chmod +x setup.sh
```

## 🔄 Полный сброс

Если хотите начать заново:

```bash
# Удалить базу данных
del db.sqlite3  # Windows
rm db.sqlite3  # Linux/Mac

# Удалить миграции
rmdir /s /q users\migrations  # Windows
rmdir /s /q documents\migrations
rmdir /s /q tasks\migrations
rmdir /s /q meetings\migrations

# Linux/Mac
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Создать заново
python manage.py makemigrations
python manage.py migrate
python manage.py init_demo_data
python manage.py runserver
```

## 📞 Поддержка

Если проблема не решена:

1. Проверьте версию Python: `python --version` (должна быть 3.10+)
2. Проверьте версию Django: `python -m django --version` (должна быть 5.0+)
3. Проверьте, что все зависимости установлены: `pip list`
4. Посмотрите файл `backend/SETUP_GUIDE.md` для подробной информации

## ✅ Чеклист

- [ ] Python 3.10+ установлен
- [ ] Виртуальное окружение создано
- [ ] Виртуальное окружение активировано
- [ ] Зависимости установлены (`pip install -r requirements.txt`)
- [ ] Миграции созданы (`python manage.py makemigrations`)
- [ ] Миграции применены (`python manage.py migrate`)
- [ ] Тестовые данные созданы (`python manage.py init_demo_data`)
- [ ] Сервер запущен (`python manage.py runserver`)
- [ ] Сайт открывается по адресу http://127.0.0.1:8000/

---

**Удачи! 🚀**

Если все сделано правильно, вы увидите работающуюую систему СЭД "ЭСАСЫ ПИКИР"!
