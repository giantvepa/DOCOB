# 🔌 Подключение фронтенда к Django Backend

## ✅ Готово! API клиент создан

Файл: `src/api/djangoClient.ts`

## 🚀 Как использовать

### 1. Запустите Django backend

```bash
cd backend
python manage.py runserver
```

Backend должен работать на: **http://localhost:8000**

### 2. Запустите фронтенд

```bash
npm run dev
```

Фронтенд работает на: **http://localhost:5173**

### 3. Проверьте подключение

Откройте в браузере: **http://localhost:8000/api/docs/**

Если видите Swagger документацию - backend работает! ✅

## 📝 Примеры использования API

### Вход в систему

```typescript
import { djangoApi } from './api/djangoClient';

// Вход
const response = await djangoApi.login('admin@demo.tm', 'admin123');
console.log('Токен:', response.token);
console.log('Пользователь:', response.user);
```

### Получить список документов

```typescript
const documents = await djangoApi.getDocuments();
console.log('Документы:', documents);
```

### Создать документ

```typescript
const newDoc = await djangoApi.createDocument({
  title: 'Новый документ',
  description: 'Описание документа',
  doc_type: 'internal',
  category: 'memo',
  priority: 'normal',
});
console.log('Создан документ:', newDoc);
```

### Согласовать документ

```typescript
await djangoApi.approveDocument(1, 'Согласовано');
```

### Отклонить документ

```typescript
await djangoApi.rejectDocument(1, 'Требуется доработка');
```

### Получить задачи

```typescript
const tasks = await djangoApi.getTasks();
console.log('Задачи:', tasks);
```

### Создать задачу

```typescript
const newTask = await djangoApi.createTask({
  title: 'Новая задача',
  description: 'Описание задачи',
  assignee: 1, // ID пользователя
  priority: 'high',
  due_date: '2024-12-31',
});
```

### Выполнить задачу

```typescript
await djangoApi.completeTask(1);
```

### Получить совещания

```typescript
const meetings = await djangoApi.getMeetings();
console.log('Совещания:', meetings);
```

### Создать совещание

```typescript
const newMeeting = await djangoApi.createMeeting({
  title: 'Совещание по проекту',
  description: 'Обсуждение хода проекта',
  date: '2024-12-20',
  time: '14:00',
  duration: 60,
  location: 'Переговорная Б',
  participants: [1, 2, 3], // ID участников
  agenda: ['Статус проекта', 'Сроки', 'Бюджет'],
});
```

## 🔐 Аутентификация

После входа токен автоматически сохраняется в `localStorage` и добавляется к каждому запросу в заголовке `Authorization: Token ...`.

### Проверить текущего пользователя

```typescript
const user = await djangoApi.getMe();
console.log('Текущий пользователь:', user);
```

### Выход

```typescript
await djangoApi.logout();
```

## 📋 Доступные методы API

### Аутентификация
- `login(email, password)` - Вход
- `register(data)` - Регистрация
- `logout()` - Выход
- `getMe()` - Текущий пользователь
- `updateProfile(data)` - Обновить профиль
- `changePassword(oldPassword, newPassword)` - Сменить пароль

### Пользователи
- `getUsers()` - Список пользователей
- `getUser(id)` - Пользователь по ID
- `getDepartments()` - Список отделов

### Документы
- `getDocuments(params?)` - Список документов
- `getDocument(id)` - Документ по ID
- `createDocument(data)` - Создать документ
- `updateDocument(id, data)` - Обновить документ
- `deleteDocument(id)` - Удалить документ
- `sendToApproval(id, approvers)` - Отправить на согласование
- `approveDocument(id, comment?)` - Согласовать
- `rejectDocument(id, comment?)` - Отклонить
- `addComment(id, text)` - Добавить комментарий
- `archiveDocument(id)` - Архивировать

### Задачи
- `getTasks(params?)` - Список задач
- `getTask(id)` - Задача по ID
- `createTask(data)` - Создать задачу
- `updateTask(id, data)` - Обновить задачу
- `deleteTask(id)` - Удалить задачу
- `completeTask(id)` - Выполнить задачу
- `startTask(id)` - Взять в работу
- `deferTask(id)` - Отложить задачу

### Совещания
- `getMeetings()` - Список совещаний
- `getMeeting(id)` - Совещание по ID
- `createMeeting(data)` - Создать совещание
- `updateMeeting(id, data)` - Обновить совещание
- `deleteMeeting(id)` - Удалить совещание
- `startMeeting(id)` - Начать совещание
- `completeMeeting(id, protocol?)` - Завершить совещание
- `cancelMeeting(id)` - Отменить совещание

### Проверка
- `checkConnection()` - Проверить подключение к серверу

## 🐛 Решение проблем

### Ошибка: "Не удалось подключиться к серверу"

**Решение:**
1. Убедитесь, что Django backend запущен: `python manage.py runserver`
2. Проверьте, что backend работает на http://localhost:8000
3. Проверьте CORS настройки в `backend/sed_project/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
```

### Ошибка: "Необходима авторизация"

**Решение:**
1. Войдите в систему: `await djangoApi.login(email, password)`
2. Проверьте, что токен сохранен в localStorage
3. Перезагрузите страницу

### Ошибка CORS

**Решение:**
1. Убедитесь, что `corsheaders` установлен: `pip install django-cors-headers`
2. Добавьте в `INSTALLED_APPS`: `'corsheaders'`
3. Добавьте в `MIDDLEWARE`: `'corsheaders.middleware.CorsMiddleware'`
4. Настройте `CORS_ALLOWED_ORIGINS` в settings.py

## 📊 Тестирование API

### Через браузер

Откройте: **http://localhost:8000/api/docs/**

Вы увидите интерактивную документацию Swagger, где можно тестировать все endpoints.

### Через curl

```bash
# Вход
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@demo.tm", "password": "admin123"}'

# Получить документы (с токеном)
curl http://localhost:8000/api/documents/ \
  -H "Authorization: Token ваш_токен"
```

### Через Postman

1. Создайте новый запрос
2. URL: `http://localhost:8000/api/auth/login/`
3. Method: `POST`
4. Body → raw → JSON:
```json
{
  "email": "admin@demo.tm",
  "password": "admin123"
}
```
5. Нажмите Send
6. Скопируйте токен из ответа
7. Для следующих запросов добавьте заголовок:
   - Key: `Authorization`
   - Value: `Token ваш_токен`

## ✅ Чеклист подключения

- [ ] Django backend запущен на http://localhost:8000
- [ ] Фронтенд запущен на http://localhost:5173
- [ ] API документация доступна: http://localhost:8000/api/docs/
- [ ] CORS настроен правильно
- [ ] Тестовые данные созданы: `python manage.py init_demo_data`
- [ ] Вход работает: `admin@demo.tm` / `admin123`
- [ ] API клиент импортирован: `import { djangoApi } from './api/djangoClient'`

## 🎯 Следующие шаги

1. Обновите компоненты React для использования `djangoApi`
2. Замените localStorage на API вызовы
3. Добавьте обработку ошибок
4. Добавьте индикаторы загрузки
5. Протестируйте все функции

## 📚 Документация

- **Backend API:** http://localhost:8000/api/docs/
- **Backend README:** `backend/README.md`
- **Backend QUICKSTART:** `backend/QUICKSTART.md`

---

**Готово! Фронтенд подключен к Django backend!** 🚀

Теперь вы можете использовать все методы API для работы с документами, задачами и совещаниями через Django backend.
