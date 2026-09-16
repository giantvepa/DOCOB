# 🚀 Быстрый старт Django Backend

## Установка (один раз)

```bash
# Перейти в папку backend
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
venv\Scripts\activate

# Активировать (Linux/Mac)
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя (админа)
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver
```

## Ежедневный запуск

```bash
cd backend
venv\Scripts\activate  # или source venv/bin/activate
python manage.py runserver
```

## Доступ

- **API:** http://127.0.0.1:8000/api/
- **Админка:** http://127.0.0.1:8000/admin/
- **Документация API:** http://127.0.0.1:8000/api/docs/

## Тестовые данные

Создайте тестовые данные через админку или API:

```bash
# Создать пользователя через API
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Тест",
    "last_name": "Пользователь"
  }'

# Войти
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

## Структура API

### Аутентификация
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/me/` - Текущий пользователь

### Документы
- `GET /api/documents/` - Список
- `POST /api/documents/` - Создать
- `GET /api/documents/{id}/` - Детали
- `PUT /api/documents/{id}/` - Обновить
- `DELETE /api/documents/{id}/` - Удалить
- `POST /api/documents/{id}/send_to_approval/` - На согласование
- `POST /api/documents/{id}/approve/` - Согласовать
- `POST /api/documents/{id}/reject/` - Отклонить

### Задачи
- `GET /api/tasks/` - Список
- `POST /api/tasks/` - Создать
- `POST /api/tasks/{id}/complete/` - Выполнить

### Совещания
- `GET /api/meetings/` - Список
- `POST /api/meetings/` - Создать
- `POST /api/meetings/{id}/start/` - Начать
- `POST /api/meetings/{id}/complete/` - Завершить

## Подключение фронтенда

В `src/backend/server.ts` измените базовый URL:

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

## Полезные команды

```bash
# Создать миграции после изменения моделей
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Запустить сервер разработки
python manage.py runserver

# Открыть shell
python manage.py shell

# Создать суперпользователя
python manage.py createsuperuser

# Запустить тесты
python manage.py test

# Собрать статику
python manage.py collectstatic
```

## Решение проблем

### Ошибка: "No module named 'django'"
```bash
pip install -r requirements.txt
```

### Ошибка: "Port 8000 already in use"
```bash
python manage.py runserver 8001
```

### Ошибка миграций
```bash
# Удалить все миграции и создать заново
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate
```

### Очистить базу данных
```bash
# Удалить файл базы данных
rm db.sqlite3  # Linux/Mac
del db.sqlite3  # Windows

# Создать заново
python manage.py migrate
python manage.py createsuperuser
```

## Дополнительная информация

Полная документация: [backend/README.md](./README.md)

API документация (Swagger): http://127.0.0.1:8000/api/docs/
