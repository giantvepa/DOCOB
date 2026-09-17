# 🚀 СЭД "ЭСАСЫ ПИКИР" - Django Backend

Полноценный backend для системы электронного документооборота на Django 5.0 + Django REST Framework.

## 📋 Структура проекта

```
backend/
├── manage.py                 # Управление проектом
├── requirements.txt          # Зависимости Python
├── sed_project/              # Главный проект
│   ├── settings.py          # Настройки
│   ├── urls.py              # Главный роутер
│   ├── wsgi.py              # WSGI
│   └── asgi.py              # ASGI
├── users/                    # Приложение пользователей
│   ├── models.py            # Модели User, Department
│   ├── views.py             # API endpoints
│   ├── serializers.py       # Сериализаторы
│   └── urls.py              # Маршруты
├── documents/                # Приложение документов
│   ├── models.py            # Модели Document, Comment, History, Approval
│   ├── views.py             # API endpoints
│   ├── serializers.py       # Сериализаторы
│   └── urls.py              # Маршруты
├── tasks/                    # Приложение задач
│   ├── models.py            # Модель Task
│   ├── views.py             # API endpoints
│   ├── serializers.py       # Сериализаторы
│   └── urls.py              # Маршруты
└── meetings/                 # Приложение совещаний
    ├── models.py            # Модель Meeting
    ├── views.py             # API endpoints
    ├── serializers.py       # Сериализаторы
    └── urls.py              # Маршруты
```

## 🚀 Установка и запуск

### 1. Создание виртуального окружения

```bash
cd backend
python -m venv venv
```

### 2. Активация виртуального окружения

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 4. Миграции базы данных

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Создание суперпользователя

```bash
python manage.py createsuperuser
```

### 6. Запуск сервера

```bash
python manage.py runserver
```

Сервер будет доступен по адресу: http://127.0.0.1:8000/

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/me/` - Текущий пользователь
- `PUT /api/auth/me/` - Обновить профиль
- `POST /api/auth/change-password/` - Сменить пароль

### Пользователи
- `GET /api/auth/users/` - Список пользователей
- `GET /api/auth/users/{id}/` - Пользователь по ID

### Отделы
- `GET /api/auth/departments/` - Список отделов
- `POST /api/auth/departments/` - Создать отдел
- `GET /api/auth/departments/{id}/` - Отдел по ID
- `PUT /api/auth/departments/{id}/` - Обновить отдел
- `DELETE /api/auth/departments/{id}/` - Удалить отдел

### Документы
- `GET /api/documents/` - Список документов
- `POST /api/documents/` - Создать документ
- `GET /api/documents/{id}/` - Документ по ID
- `PUT /api/documents/{id}/` - Обновить документ
- `DELETE /api/documents/{id}/` - Удалить документ
- `POST /api/documents/{id}/send_to_approval/` - Отправить на согласование
- `POST /api/documents/{id}/approve/` - Согласовать
- `POST /api/documents/{id}/reject/` - Отклонить
- `POST /api/documents/{id}/add_comment/` - Добавить комментарий
- `POST /api/documents/{id}/archive/` - Архивировать

### Задачи
- `GET /api/tasks/` - Список задач
- `POST /api/tasks/` - Создать задачу
- `GET /api/tasks/{id}/` - Задача по ID
- `PUT /api/tasks/{id}/` - Обновить задачу
- `DELETE /api/tasks/{id}/` - Удалить задачу
- `POST /api/tasks/{id}/complete/` - Отметить как выполненную
- `POST /api/tasks/{id}/start/` - Взять в работу
- `POST /api/tasks/{id}/defer/` - Отложить

### Совещания
- `GET /api/meetings/` - Список совещаний
- `POST /api/meetings/` - Создать совещание
- `GET /api/meetings/{id}/` - Совещание по ID
- `PUT /api/meetings/{id}/` - Обновить совещание
- `DELETE /api/meetings/{id}/` - Удалить совещание
- `POST /api/meetings/{id}/start/` - Начать совещание
- `POST /api/meetings/{id}/complete/` - Завершить совещание
- `POST /api/meetings/{id}/cancel/` - Отменить совещание

### Документация API
- `GET /api/docs/` - Swagger UI (интерактивная документация)
- `GET /api/schema/` - OpenAPI схема

## 🗄️ Модели базы данных

### User (Пользователь)
- username, email, password
- first_name, last_name
- position, department, avatar
- role (admin/manager/user)
- phone, is_active

### Department (Отдел)
- name, code, description
- head (руководитель)
- parent (родительский отдел)

### Document (Документ)
- number, title, description
- doc_type (incoming/outgoing/internal)
- category (contract/invoice/act/letter/order/application/memo/protocol/power_of_attorney/other)
- status (draft/on_approval/on_signing/signed/executed/rejected/archived)
- priority (low/normal/high/critical)
- author, correspondent
- due_date, file, file_size
- tags, version

### DocumentComment (Комментарий)
- document, author, text

### DocumentHistory (История)
- document, user, action, details, metadata

### ApprovalStep (Шаг согласования)
- document, user, step_order
- status (waiting/approved/rejected)
- comment, completed_at

### Task (Задача)
- title, description
- status (new/in_progress/completed/overdue/deferred)
- priority (low/normal/high/critical)
- assignee, author, document
- due_date, completed_at

### Meeting (Совещание)
- title, description
- date, time, duration, location
- status (planned/in_progress/completed/cancelled)
- organizer, participants
- agenda, protocol

## 🔧 Настройки

### Основные настройки (sed_project/settings.py)

```python
# База данных (по умолчанию SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Для PostgreSQL:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'esasy_pikir',
#         'USER': 'postgres',
#         'PASSWORD': 'your_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# CORS (для фронтенда)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# Язык и часовой пояс
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Ashgabat'
```

## 🧪 Тестирование

```bash
# Запустить все тесты
python manage.py test

# Запустить тесты конкретного приложения
python manage.py test documents

# Запустить с подробным выводом
python manage.py test -v 2
```

## 📊 Админ-панель

Доступна по адресу: http://127.0.0.1:8000/admin/

Войдите с учетными данными суперпользователя.

## 🚢 Деплой

### Подготовка к продакшену

1. Измените `SECRET_KEY` в settings.py
2. Установите `DEBUG = False`
3. Настройте `ALLOWED_HOSTS`
4. Настройте базу данных (PostgreSQL рекомендуется)
5. Соберите статические файлы:
   ```bash
   python manage.py collectstatic
   ```

### Использование Gunicorn

```bash
pip install gunicorn
gunicorn sed_project.wsgi:application --bind 0.0.0.0:8000
```

### Docker (опционально)

Создайте `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "sed_project.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🔐 Безопасность

- Используйте HTTPS в продакшене
- Регулярно обновляйте зависимости
- Настройте CORS правильно
- Используйте сильные пароли
- Включите двухфакторную аутентификацию
- Регулярно делайте бэкапы базы данных

## 📝 Лицензия

MIT License

## 👥 Авторы

СЭД "ЭСАСЫ ПИКИР" - Система электронного документооборота

---

**Версия:** 1.0.0  
**Django:** 5.0.1  
**Python:** 3.10+
