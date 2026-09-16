# 🎉 СЭД "ЭСАСЫ ПИКИР" - Полная система документооборота

Полноценная система электронного документооборота с React фронтендом и Django бэкендом.

## 📁 Структура проекта

```
esasy-pikir/
├── frontend/              # React фронтенд
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы
│   │   ├── backend/       # API клиент
│   │   └── utils/         # Утилиты
│   ├── package.json
│   └── README.md
│
├── backend/               # Django бэкенд
│   ├── users/            # Приложение пользователей
│   ├── documents/        # Приложение документов
│   ├── tasks/            # Приложение задач
│   ├── meetings/         # Приложение совещаний
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
└── README.md             # Этот файл
```

## 🚀 Быстрый старт

### 1. Клонировать проект

```bash
git clone <repository-url>
cd esasy-pikir
```

### 2. Запустить бэкенд

```bash
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
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Запустить сервер
python manage.py runserver
```

Бэкенд доступен: http://127.0.0.1:8000/

### 3. Запустить фронтенд

Откройте новый терминал:

```bash
cd frontend

# Установить зависимости
npm install

# Запустить сервер разработки
npm run dev
```

Фронтенд доступен: http://localhost:5173/

### 4. Открыть в браузере

Перейдите по адресу: http://localhost:5173/

Войдите с учетными данными, которые создали при настройке бэкенда.

## 🎯 Возможности системы

### 📄 Управление документами
- Создание, редактирование, удаление документов
- Загрузка файлов
- Согласование документов
- Комментарии и история изменений
- Поиск и фильтрация
- Экспорт в PDF

### ✅ Управление задачами
- Создание задач
- Назначение исполнителей
- Установка приоритетов и сроков
- Отслеживание статуса
- Фильтрация и поиск

### 📅 Совещания
- Планирование совещаний
- Управление участниками
- Повестка дня
- Протоколы совещаний

### 👥 Пользователи и отделы
- Регистрация пользователей
- Управление ролями (админ/руководитель/пользователь)
- Структура отделов
- Профили пользователей

### 🔐 Безопасность
- JWT аутентификация
- Ролевая модель доступа
- Шифрование паролей
- Аудит действий

### 📊 Аналитика
- Статистика документов
- Отчеты по задачам
- Графики и диаграммы
- Экспорт данных

## 🛠️ Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Tailwind CSS** - Стили
- **React Router** - Маршрутизация
- **Lucide React** - Иконки

### Backend
- **Django 5.0** - Веб-фреймворк
- **Django REST Framework** - API
- **SQLite** - База данных (по умолчанию)
- **PostgreSQL** - База данных (продакшен)
- **JWT** - Аутентификация
- **drf-spectacular** - API документация

## 📡 API Endpoints

### Аутентификация
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/me/` - Текущий пользователь

### Документы
- `GET /api/documents/` - Список документов
- `POST /api/documents/` - Создать документ
- `GET /api/documents/{id}/` - Детали документа
- `PUT /api/documents/{id}/` - Обновить документ
- `DELETE /api/documents/{id}/` - Удалить документ
- `POST /api/documents/{id}/send_to_approval/` - Отправить на согласование
- `POST /api/documents/{id}/approve/` - Согласовать
- `POST /api/documents/{id}/reject/` - Отклонить

### Задачи
- `GET /api/tasks/` - Список задач
- `POST /api/tasks/` - Создать задачу
- `POST /api/tasks/{id}/complete/` - Выполнить задачу

### Совещания
- `GET /api/meetings/` - Список совещаний
- `POST /api/meetings/` - Создать совещание
- `POST /api/meetings/{id}/start/` - Начать совещание

### Документация API
- `GET /api/docs/` - Swagger UI
- `GET /api/schema/` - OpenAPI схема

## 🗄️ База данных

### Модели

#### User (Пользователь)
- username, email, password
- first_name, last_name
- position, department, avatar
- role (admin/manager/user)

#### Document (Документ)
- number, title, description
- doc_type, category, status, priority
- author, correspondent
- due_date, file, tags

#### Task (Задача)
- title, description
- status, priority
- assignee, author, document
- due_date, completed_at

#### Meeting (Совещание)
- title, description
- date, time, duration, location
- status, organizer, participants
- agenda, protocol

## 🔧 Настройка

### Frontend

Измените API URL в `frontend/src/backend/server.ts`:

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
```

### Backend

Настройки в `backend/sed_project/settings.py`:

```python
# База данных
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Язык и часовой пояс
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Ashgabat'
```

## 🚢 Деплой

### Production Backend

```bash
cd backend

# Установить Gunicorn
pip install gunicorn

# Собрать статику
python manage.py collectstatic

# Запустить
gunicorn sed_project.wsgi:application --bind 0.0.0.0:8000
```

### Production Frontend

```bash
cd frontend

# Собрать билд
npm run build

# Разместить dist/ на веб-сервере
```

### Docker (опционально)

Создайте `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    volumes:
      - ./backend/db.sqlite3:/app/db.sqlite3

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🧪 Тестирование

### Backend тесты

```bash
cd backend
python manage.py test
```

### Frontend тесты

```bash
cd frontend
npm test
```

## 📊 Мониторинг

### Логи

Backend логи:
```bash
tail -f backend/logs/app.log
```

### Метрики

- Django Admin: http://127.0.0.1:8000/admin/
- API Docs: http://127.0.0.1:8000/api/docs/

## 🔐 Безопасность

### Checklist

- [ ] Изменить SECRET_KEY в production
- [ ] Установить DEBUG = False
- [ ] Настроить ALLOWED_HOSTS
- [ ] Использовать HTTPS
- [ ] Настроить CORS правильно
- [ ] Регулярно обновлять зависимости
- [ ] Делать бэкапы базы данных
- [ ] Настроить firewall

## 📝 Документация

- [Backend README](./backend/README.md) - Подробная документация бэкенда
- [Backend QUICKSTART](./backend/QUICKSTART.md) - Быстрый старт бэкенда
- [API Documentation](http://127.0.0.1:8000/api/docs/) - Swagger UI

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи backend и frontend
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки CORS
4. Очистите кэш браузера
5. Перезапустите серверы

## 📄 Лицензия

MIT License

## 👥 Авторы

СЭД "ЭСАСЫ ПИКИР" - Система электронного документооборота

---

**Версия:** 1.0.0  
**Frontend:** React 18 + TypeScript  
**Backend:** Django 5.0 + DRF  
**База данных:** SQLite / PostgreSQL

🎉 **Готово к использованию!**
