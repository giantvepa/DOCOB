# 🚀 СЭД "ЭСАСЫ ПИКИР" - Полноценный Backend

## 📋 Архитектура бэкенда

Создан полноценный бэкенд-слой с архитектурой, аналогичной Express.js + SQLite:

```
src/backend/
├── api/                    # API endpoints (контроллеры)
│   ├── auth.ts            # Аутентификация (/api/auth/*)
│   ├── documents.ts       # Документы (/api/documents/*)
│   ├── tasks.ts           # Задачи (/api/tasks/*)
│   ├── meetings.ts        # Совещания (/api/meetings/*)
│   └── files.ts           # Файлы (/api/files/*)
├── middleware/             # Middleware
│   ├── auth.ts            # Проверка токена
│   ├── logger.ts          # Логирование запросов
│   └── validator.ts       # Валидация данных
├── models/                 # ORM-слой (аналог Sequelize/Prisma)
│   ├── User.ts            # Модель пользователя
│   ├── Document.ts        # Модель документа
│   ├── Task.ts            # Модель задачи
│   └── Meeting.ts         # Модель совещания
├── database/
│   ├── connection.ts      # Подключение к IndexedDB (SQLite)
│   └── seed.ts            # Начальные данные
├── utils/
│   ├── jwt.ts             # JWT токены
│   ├── hash.ts            # Хеширование паролей (SHA-256)
│   └── errors.ts          # Классы ошибок
├── types/
│   └── index.ts           # TypeScript типы
└── server.ts              # Главный роутер API
```

---

## 🔐 Аутентификация

### JWT-токены
- Генерация токенов с подписью
- Срок действия: 24 часа
- Хранение в localStorage
- Роли: admin, manager, user

### Хеширование паролей
- SHA-256 с солью
- Валидация сложности пароля
- Проверка email формата

---

## 📡 REST API Endpoints

### Аутентификация

#### POST /api/auth/register
Регистрация нового пользователя
```typescript
{
  email: string,
  password: string,
  name: string,
  position?: string,
  department?: string,
  avatar?: string
}
```
**Response:**
```typescript
{
  success: true,
  data: {
    token: string,
    user: User
  }
}
```

#### POST /api/auth/login
Вход в систему
```typescript
{
  email: string,
  password: string
}
```
**Response:**
```typescript
{
  success: true,
  data: {
    token: string,
    user: User
  }
}
```

#### GET /api/auth/me
Получить текущего пользователя (требует токен)

#### POST /api/auth/logout
Выход из системы

---

### Документы

#### GET /api/documents
Получить список документов с пагинацией и фильтрами
**Query params:**
- `page` (default: 1)
- `limit` (default: 50)
- `status` (draft, on_approval, signed, executed, rejected)
- `type` (incoming, outgoing, internal)
- `authorId`

**Response:**
```typescript
{
  success: true,
  data: Document[],
  meta: {
    total: number,
    page: number,
    limit: number,
    pages: number
  }
}
```

#### GET /api/documents/:id
Получить документ по ID

#### POST /api/documents
Создать документ (требует аутентификацию)
```typescript
{
  title: string,
  description?: string,
  type?: 'incoming' | 'outgoing' | 'internal',
  category?: string,
  priority?: 'low' | 'normal' | 'high' | 'critical',
  correspondent?: string,
  dueDate?: string,
  tags?: string[]
}
```

#### PUT /api/documents/:id
Обновить документ (только автор)

#### DELETE /api/documents/:id
Удалить документ (только автор)

#### POST /api/documents/:id/approve
Согласовать документ

#### POST /api/documents/:id/reject
Отклонить документ

---

### Задачи

#### GET /api/tasks
Получить список задач
**Query params:**
- `assigneeId`
- `status` (new, in_progress, completed, overdue, deferred)
- `authorId`

#### POST /api/tasks
Создать задачу
```typescript
{
  title: string,
  description?: string,
  assigneeId: string,
  priority?: 'low' | 'normal' | 'high' | 'critical',
  dueDate: string,
  documentId?: string
}
```

#### PUT /api/tasks/:id
Обновить задачу

#### DELETE /api/tasks/:id
Удалить задачу

#### POST /api/tasks/:id/complete
Отметить задачу как выполненную

---

### Совещания

#### GET /api/meetings
Получить список совещаний

#### POST /api/meetings
Создать совещание
```typescript
{
  title: string,
  description?: string,
  date: string,
  time: string,
  duration?: number,
  location?: string,
  participantIds?: string[],
  agenda?: string[]
}
```

#### PUT /api/meetings/:id
Обновить совещание

#### DELETE /api/meetings/:id
Удалить совещание

---

### Файлы

#### POST /api/files
Загрузить файл
```typescript
{
  documentId: string,
  name: string,
  type: string,
  size: number,
  data: ArrayBuffer
}
```

#### GET /api/files/:id
Скачать файл

#### DELETE /api/files/:id
Удалить файл

#### GET /api/files/document/:documentId
Получить все файлы документа

---

## 🗄️ База данных (IndexedDB)

### Таблицы

#### users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  passwordHash TEXT,
  name TEXT,
  position TEXT,
  department TEXT,
  avatar TEXT,
  role TEXT,
  isActive BOOLEAN,
  lastLogin TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

#### documents
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  number TEXT UNIQUE,
  title TEXT,
  description TEXT,
  type TEXT,
  category TEXT,
  status TEXT,
  priority TEXT,
  authorId TEXT,
  correspondent TEXT,
  dueDate TEXT,
  fileSize INTEGER,
  fileName TEXT,
  tags TEXT[],
  version INTEGER,
  createdAt TEXT,
  updatedAt TEXT
);
```

#### tasks
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  assigneeId TEXT,
  authorId TEXT,
  documentId TEXT,
  dueDate TEXT,
  completedAt TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

#### meetings
```sql
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  date TEXT,
  time TEXT,
  duration INTEGER,
  location TEXT,
  organizerId TEXT,
  participantIds TEXT[],
  status TEXT,
  agenda TEXT[],
  protocol TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

#### files
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  documentId TEXT,
  name TEXT,
  type TEXT,
  size INTEGER,
  data BLOB,
  uploadedBy TEXT,
  createdAt TEXT
);
```

#### comments
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  documentId TEXT,
  authorId TEXT,
  text TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

#### history
```sql
CREATE TABLE history (
  id TEXT PRIMARY KEY,
  documentId TEXT,
  userId TEXT,
  action TEXT,
  details TEXT,
  metadata JSON,
  createdAt TEXT
);
```

#### approvals
```sql
CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  documentId TEXT,
  userId TEXT,
  stepOrder INTEGER,
  status TEXT,
  comment TEXT,
  completedAt TEXT,
  createdAt TEXT
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  userId TEXT,
  type TEXT,
  title TEXT,
  message TEXT,
  documentId TEXT,
  taskId TEXT,
  meetingId TEXT,
  isRead BOOLEAN,
  createdAt TEXT
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  userId TEXT,
  action TEXT,
  resource TEXT,
  resourceId TEXT,
  details TEXT,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TEXT
);
```

#### api_logs
```sql
CREATE TABLE api_logs (
  id TEXT PRIMARY KEY,
  method TEXT,
  path TEXT,
  status INTEGER,
  duration INTEGER,
  userId TEXT,
  timestamp TEXT
);
```

---

## 🛡️ Middleware

### Аутентификация
```typescript
import { requireAuth, requireRole, requireAdmin } from './middleware/auth';

// Проверка аутентификации
const user = requireAuth();

// Проверка роли
const admin = requireAdmin();
const manager = requireManager();
const userOrManager = requireRole(['user', 'manager']);
```

### Валидация
```typescript
import { 
  validateUserRegistration, 
  validateDocumentCreation,
  validateTaskCreation,
  validateMeetingCreation 
} from './middleware/validator';

validateUserRegistration(data); // Бросает ValidationError
```

### Логирование
```typescript
import { logApiRequest, logAuditEvent } from './middleware/logger';

await logApiRequest('GET', '/api/documents', 200, 45, userId);
await logAuditEvent(userId, 'CREATE', 'document', docId, 'Created new document');
```

---

## ⚠️ Обработка ошибок

```typescript
import { 
  ApiError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError 
} from './utils/errors';

throw new ValidationError('Некорректный email');
throw new AuthenticationError('Неверный пароль');
throw new AuthorizationError('Недостаточно прав');
throw new NotFoundError('Документ');
throw new ConflictError('Документ с таким номером уже существует');
```

---

## 📊 Демо-аккаунты

После инициализации базы данных создаются:

### Admin
- **Email:** admin@demo.tm
- **Password:** admin123
- **Роль:** admin
- **Имя:** Аннамыратов Сердар
- **Должность:** Генеральный директор

### Manager
- **Email:** manager@demo.tm
- **Password:** manager123
- **Роль:** manager
- **Имя:** Мергенджанова Айгуль
- **Должность:** Главный бухгалтер

### User
- **Email:** user@demo.tm
- **Password:** user123
- **Роль:** user
- **Имя:** Бердиев Гурбан
- **Должность:** Специалист

---

## 🚀 Использование API

### Пример вызова API

```typescript
import { apiCall } from './backend/server';

// Вход
const loginResponse = await apiCall('POST', '/api/auth/login', {
  email: 'admin@demo.tm',
  password: 'admin123'
});

// Получить документы
const docsResponse = await apiCall('GET', '/api/documents', undefined, {
  status: 'on_approval',
  page: '1',
  limit: '10'
});

// Создать документ
const newDocResponse = await apiCall('POST', '/api/documents', {
  title: 'Новый документ',
  description: 'Описание документа',
  type: 'internal',
  priority: 'high'
});

// Согласовать документ
await apiCall('POST', `/api/documents/${docId}/approve`);

// Создать задачу
await apiCall('POST', '/api/tasks', {
  title: 'Новая задача',
  assigneeId: 'user-id',
  dueDate: '2024-12-31',
  priority: 'high'
});
```

---

## 📝 Логирование

Все API-запросы логируются:
```
[API] GET /api/documents - 200 (45ms) [User: user-id]
[API] POST /api/documents - 201 (120ms) [User: user-id]
```

Все действия пользователей записываются в audit_logs:
```
[Audit] CREATE on document:doc-id by user user-id
[Audit] APPROVE on document:doc-id by user user-id
```

---

## 🎯 Преимущества архитектуры

✅ **REST API** - стандартный интерфейс  
✅ **JWT аутентификация** - безопасная  
✅ **ORM-слой** - удобная работа с БД  
✅ **Middleware** - переиспользуемая логика  
✅ **Валидация** - защита от некорректных данных  
✅ **Логирование** - отслеживание действий  
✅ **Обработка ошибок** - понятные сообщения  
✅ **TypeScript** - типобезопасность  
✅ **Модульность** - легко расширять  
✅ **Тестируемость** - изолированные компоненты  

---

## 🔧 Расширение

### Добавить новый endpoint

1. Создать файл в `src/backend/api/`
2. Экспортировать функции для каждого метода
3. Добавить маршруты в `src/backend/server.ts`
4. Создать модель в `src/backend/models/` (если нужно)

### Добавить новую таблицу

1. Добавить создание таблицы в `src/backend/database/connection.ts`
2. Создать модель в `src/backend/models/`
3. Добавить типы в `src/backend/types/index.ts`

---

**СЭД "ЭСАСЫ ПИКИР"** - Полноценный бэкенд с REST API, аутентификацией, базой данных и логированием! 🚀
