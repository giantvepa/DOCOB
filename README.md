# 🎉 СЭД "ЭСАСЫ ПИКИР"

**Полноценная система электронного документооборота с современным интерфейсом**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 О проекте

СЭД "ЭСАСЫ ПИКИР" - это современная система электронного документооборота, разработанная с использованием React + TypeScript для frontend и Django + Django REST Framework для backend.

### ✨ Основные возможности

- 📄 **Управление документами** - создание, согласование, утверждение, архивирование
- ✅ **Задачи и поручения** - постановка, контроль выполнения, приоритеты
- 📅 **Совещания** - планирование, проведение, протоколы
- 👥 **Сотрудники** - справочник, отделы, роли
- 📊 **Отчёты** - статистика, аналитика, диаграммы
- 🌍 **Многоязычность** - русский и туркменский языки
- 🔐 **Безопасность** - JWT аутентификация, ролевая модель

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+ 
- Python 3.10+
- npm или yarn

### Установка

#### 1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd esasy-pikir
```

#### 2. Установите frontend зависимости

```bash
npm install
```

#### 3. Настройте backend

```bash
cd backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте (Windows)
venv\Scripts\activate

# Активируйте (Linux/Mac)
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Создайте миграции
python manage.py makemigrations

# Примените миграции
python manage.py migrate

# Создайте тестовых пользователей
python manage.py setup_users
```

#### 4. Запустите систему

**Backend (в одном терминале):**
```bash
cd backend
python manage.py runserver
```

**Frontend (в другом терминале):**
```bash
npm run dev
```

#### 5. Откройте в браузере

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin panel: http://localhost:8000/admin/

### Тестовые аккаунты

- **admin@demo.tm** / admin123 (Администратор)
- **manager@demo.tm** / manager123 (Руководитель)
- **user@demo.tm** / user123 (Пользователь)

---

## 📁 Структура проекта

```
esasy-pikir/
├── src/                          # Frontend (React)
│   ├── api/                      # API клиент
│   │   └── djangoClient.ts       # Клиент для Django API
│   ├── components/               # React компоненты
│   │   ├── DocumentTable.tsx     # 🎯 Универсальная таблица
│   │   ├── Layout.tsx            # Основной макет
│   │   ├── LoginScreen.tsx       # Экран входа
│   │   └── ...
│   ├── pages/                    # Страницы
│   │   ├── HomePage.tsx          # Главная
│   │   ├── Documents.tsx         # Документы
│   │   ├── Tasks.tsx             # Задачи
│   │   ├── Meetings.tsx          # Совещания
│   │   ├── Registry.tsx          # Канцелярия
│   │   ├── Drafts.tsx            # Черновики
│   │   ├── Employees.tsx         # Сотрудники
│   │   └── Reports.tsx           # Отчёты
│   ├── contexts/                 # React контексты
│   │   └── AuthContext.tsx       # Аутентификация
│   ├── types.ts                  # TypeScript типы
│   └── App.tsx                   # Главный компонент
│
├── backend/                      # Backend (Django)
│   ├── sed_project/              # Главный проект
│   │   ├── settings.py           # Настройки
│   │   ├── urls.py               # Маршруты
│   │   └── wsgi.py               # WSGI
│   ├── users/                    # Приложение пользователей
│   │   ├── models.py             # Модели
│   │   ├── serializers.py        # Сериализаторы
│   │   └── views.py              # API endpoints
│   ├── documents/                # Приложение документов
│   ├── tasks/                    # Приложение задач
│   ├── meetings/                 # Приложение совещаний
│   ├── manage.py                 # Управление Django
│   └── requirements.txt          # Python зависимости
│
├── docs/                         # Документация
│   ├── DOCUMENT_TABLE_COMPONENT.md
│   ├── NAVIGATION.md
│   ├── MAIN_SCREEN.md
│   └── ...
│
├── package.json                  # Frontend зависимости
├── tsconfig.json                 # TypeScript конфиг
└── README.md                     # Этот файл
```

---

## 🎯 Ключевые компоненты

### 1. Универсальная таблица документов (DocumentTable)

Единый компонент для всех реестров документов с настраиваемыми колонками, фильтрами и функциями.

**Используется в:**
- Все документы
- Канцелярия (входящие/исходящие/внутренние)
- Черновики
- На согласовании
- Архив

**Возможности:**
- 🔍 Полнотекстовый поиск
- 📂 Фильтрация по типу, статусу, приоритету
- 🔄 Сортировка по колонкам
- ☑️ Массовые действия
- 📊 Два вида: таблица и карточки

### 2. Основной макет (Layout)

Классический корпоративный интерфейс с:
- Верхней панелью (поиск, профиль, уведомления)
- Боковой навигацией (группировка разделов)
- Центральной рабочей областью

### 3. Главная страница (HomePage)

Виджеты для быстрого доступа:
- Ожидают моего решения
- Мои задачи
- Последние документы
- Ближайшие совещания
- Статистика

---

## 📡 API Endpoints

### Аутентификация

```bash
# Регистрация
POST /api/auth/register/
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "Иван",
  "last_name": "Иванов"
}

# Вход
POST /api/auth/login/
{
  "email": "user@example.com",
  "password": "password123"
}

# Текущий пользователь
GET /api/auth/me/
Authorization: Token <your-token>
```

### Документы

```bash
# Список документов
GET /api/documents/

# Создать документ
POST /api/documents/
{
  "title": "Новый документ",
  "description": "Описание",
  "type": "internal",
  "priority": "normal"
}

# Согласовать документ
POST /api/documents/:id/approve/
```

### Задачи

```bash
# Список задач
GET /api/tasks/

# Создать задачу
POST /api/tasks/
{
  "title": "Новая задача",
  "assignee": 1,
  "priority": "high",
  "due_date": "2024-12-31"
}

# Выполнить задачу
POST /api/tasks/:id/complete/
```

### Совещания

```bash
# Список совещаний
GET /api/meetings/

# Создать совещание
POST /api/meetings/
{
  "title": "Совещание",
  "date": "2024-12-20",
  "time": "14:00",
  "participants": [1, 2, 3]
}
```

---

## 🎨 Дизайн

### Цветовая схема

```css
.gradient-blue:   #667eea → #764ba2
.gradient-green:  #11998e → #38ef7d
.gradient-orange: #f093fb → #f5576c
.gradient-purple: #4facfe → #00f2fe
```

### Статусы документов

| Статус | Цвет | Иконка |
|--------|------|--------|
| Черновик | Серый | 📄 |
| На согласовании | Янтарный | ⏳ |
| Подписан | Зелёный | ✅ |
| Исполнен | Изумрудный | ✅ |
| Отклонён | Красный | ❌ |

### Приоритеты

| Приоритет | Цвет |
|-----------|------|
| Критичный | 🔴 Красный |
| Высокий | 🟠 Янтарный |
| Обычный | 🔵 Синий |
| Низкий | ⚪ Серый |

---

## 📱 Адаптивность

### Desktop (>1024px)
- Полная навигация
- Все колонки таблиц
- Карточки в 3 колонки

### Tablet (768-1024px)
- Скрытая навигация
- Горизонтальная прокрутка
- Карточки в 2 колонки

### Mobile (<768px)
- Бургер-меню
- Карточный вид
- Карточки в 1 колонку

---

## 🌍 Многоязычность

Поддерживаются два языка:
- 🇷🇺 Русский (по умолчанию)
- 🇹🇲 Туркменский

Переключение в верхней панели.

---

## 🔐 Безопасность

- ✅ JWT аутентификация
- ✅ Хеширование паролей (SHA-256)
- ✅ Ролевая модель (admin/manager/user)
- ✅ Проверка прав доступа
- ✅ CORS настройки

---

## 📊 Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **React Router** - маршрутизация
- **Lucide React** - иконки

### Backend
- **Django 5.0** - веб-фреймворк
- **Django REST Framework** - API
- **SQLite** - база данных (по умолчанию)
- **JWT** - аутентификация

---

## 📚 Документация

### Компоненты
- [Универсальная таблица документов](./docs/DOCUMENT_TABLE_COMPONENT.md)
- [Навигационное меню](./docs/NAVIGATION.md)
- [Основной рабочий экран](./docs/MAIN_SCREEN.md)

### Система
- [Полное описание системы](./docs/COMPLETE_SYSTEM.md)
- [API документация](./docs/BACKEND_API.md)
- [Финальная сводка](./docs/FINAL_SUMMARY.md)

### Руководства
- [Быстрый старт](./docs/QUICK_START.md)
- [Установка](./docs/INSTALL.md)
- [Решение проблем](./docs/TROUBLESHOOTING.md)

---

## 🛠️ Разработка

### Запуск в режиме разработки

```bash
# Frontend
npm run dev

# Backend (в другом терминале)
cd backend
python manage.py runserver
```

### Сборка для продакшена

```bash
npm run build
```

Готовые файлы будут в папке `dist/`.

### Тестирование

```bash
# Frontend тесты
npm test

# Backend тесты
cd backend
python manage.py test
```

---

## 📈 Статистика

### Frontend
- **Компонентов:** 10+
- **Страниц:** 9
- **Строк кода:** ~3000+
- **Размер бандла:** ~278 KB (gzip: 77 KB)

### Backend
- **Приложений:** 4
- **Моделей:** 10+
- **API endpoints:** 20+
- **Строк кода:** ~2000+

---

## 🤝 Вклад

Приветствуется любой вклад в проект!

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для подробностей.

---

## 👥 Авторы

**СЭД "ЭСАСЫ ПИКИР"** - Система электронного документооборота

Разработано с ❤️ для эффективного управления документами.

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте [документацию](./docs/)
2. Проверьте логи в консоли браузера (F12)
3. Проверьте логи Django backend
4. Используйте кнопку "Сбросить данные" в меню профиля

---

## 🎯 Roadmap

### Фаза 1 (Текущая) ✅
- [x] Базовый функционал документооборота
- [x] Универсальная таблица документов
- [x] Аутентификация
- [x] Django backend

### Фаза 2 (Следующая)
- [ ] Электронная подпись
- [ ] Уведомления (email, push)
- [ ] Интеграция с 1С
- [ ] Мобильное приложение

### Фаза 3 (Будущее)
- [ ] Искусственный интеллект
- [ ] Автоматическая классификация
- [ ] Распознавание текста (OCR)
- [ ] Голосовое управление

---

## 🎉 Благодарности

Спасибо всем, кто участвовал в разработке и тестировании системы!

---

**СЭД "ЭСАСЫ ПИКИР"** - Полноценная система электронного документооборота с современным интерфейсом и мощным backend! 🚀

---

<div align="center">

**[Документация](./docs/)** • **[Установка](./docs/INSTALL.md)** • **[API](./docs/BACKEND_API.md)** • **[Поддержка](#-поддержка)**

Made with ❤️ by СЭД "ЭСАСЫ ПИКИР" Team

</div>
