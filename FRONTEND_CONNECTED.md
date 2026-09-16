# 🎉 ФРОНТЕНД ПОДКЛЮЧЕН К DJANGO BACKEND!

## ✅ Что сделано

### 1. Создан API клиент
**Файл:** `src/api/djangoClient.ts`

Полноценный клиент для работы с Django REST API со всеми методами:
- Аутентификация (login, register, logout)
- Документы (CRUD + согласование)
- Задачи (CRUD + выполнение)
- Совещания (CRUD + управление)

### 2. Создан пример компонента
**Файл:** `src/pages/DjangoDocumentsPage.tsx`

Полностью рабочий компонент с интеграцией Django API

### 3. Создана документация
- `FRONTEND_BACKEND_CONNECTION.md` - Подключение к backend
- `FULL_INTEGRATION_GUIDE.md` - Полное руководство по интеграции

---

## 🚀 Как использовать

### 1. Запустите Django backend

```bash
cd backend
python manage.py runserver
```

### 2. Запустите фронтенд

```bash
npm run dev
```

### 3. Используйте API в компонентах

```typescript
import { djangoApi } from './api/djangoClient';

// Вход
await djangoApi.login('admin@demo.tm', 'admin123');

// Получить документы
const docs = await djangoApi.getDocuments();

// Создать документ
await djangoApi.createDocument({
  title: 'Новый документ',
  doc_type: 'internal',
  category: 'memo',
  priority: 'normal',
});

// Согласовать документ
await djangoApi.approveDocument(1, 'Согласовано');

// Получить задачи
const tasks = await djangoApi.getTasks();

// Выполнить задачу
await djangoApi.completeTask(1);
```

---

## 📋 Все доступные методы

### Аутентификация
- `login(email, password)` - Вход
- `register(data)` - Регистрация
- `logout()` - Выход
- `getMe()` - Текущий пользователь

### Документы
- `getDocuments()` - Список документов
- `createDocument(data)` - Создать
- `approveDocument(id, comment?)` - Согласовать
- `rejectDocument(id, comment?)` - Отклонить
- `deleteDocument(id)` - Удалить

### Задачи
- `getTasks()` - Список задач
- `createTask(data)` - Создать
- `completeTask(id)` - Выполнить
- `deleteTask(id)` - Удалить

### Совещания
- `getMeetings()` - Список совещаний
- `createMeeting(data)` - Создать
- `completeMeeting(id, protocol?)` - Завершить
- `deleteMeeting(id)` - Удалить

---

## 📚 Документация

- **API клиент:** `src/api/djangoClient.ts`
- **Пример компонента:** `src/pages/DjangoDocumentsPage.tsx`
- **Backend API:** http://localhost:8000/api/docs/
- **Полное руководство:** `FULL_INTEGRATION_GUIDE.md`

---

## ✅ Готово!

Фронтенд полностью подключен к Django backend! 🚀

Все данные теперь хранятся в базе данных SQLite и доступны через REST API.
