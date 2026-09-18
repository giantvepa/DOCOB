# 📋 Использование универсальной таблицы документов

## 🎯 Что такое DocumentTable?

`DocumentTable` - это универсальный переиспользуемый компонент для отображения списков документов во всех реестрах системы. Он обеспечивает единый шаблон таблиц с настраиваемыми колонками, фильтрами и функциями.

---

## 🚀 Быстрый старт

### 1. Импорт компонента

```typescript
import DocumentTable from '../components/DocumentTable';
```

### 2. Базовое использование

```typescript
<DocumentTable
  title="Все документы"
  documents={documents}
  employees={employees}
/>
```

### 3. Полная настройка

```typescript
<DocumentTable
  title="Входящие документы"
  documents={incomingDocs}
  employees={employees}
  totalCount={incomingDocs.length}
  
  // Настройка колонок
  columns={{
    showCheckbox: true,
    showType: false,
    showPriority: true,
    showCorrespondent: true,
    showDueDate: true,
    showAuthor: true,
  }}
  
  // Настройка фильтров
  filters={{
    showTypeFilter: false,
    showStatusFilter: true,
    showPriorityFilter: true,
    defaultType: 'incoming',
  }}
  
  // Действия
  onCreateClick={() => console.log('Создание документа')}
  onBulkAction={(action, ids) => console.log(action, ids)}
/>
```

---

## 📊 Примеры использования

### Пример 1: Все документы

```typescript
// src/pages/Documents.tsx
import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function Documents() {
  const { documents, employees } = useContext(AppContext);

  return (
    <DocumentTable
      title="Все документы"
      documents={documents}
      employees={employees}
      totalCount={documents.length}
      columns={{
        showCheckbox: true,
        showType: true,
        showPriority: true,
        showCorrespondent: true,
        showDueDate: true,
        showAuthor: true,
      }}
      filters={{
        showTypeFilter: true,
        showStatusFilter: true,
        showPriorityFilter: true,
      }}
      onCreateClick={() => {
        // Открыть модальное окно создания
      }}
      onBulkAction={(action, ids) => {
        // Массовые действия
      }}
    />
  );
}
```

### Пример 2: Канцелярия (входящие/исходящие/внутренние)

```typescript
// src/pages/Registry.tsx
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';
import { Inbox, Send, FileText } from 'lucide-react';

export default function Registry() {
  const { documents, employees } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'internal'>('incoming');

  // Фильтрация по типу
  const filteredDocs = documents.filter(d => d.type === activeTab);

  // Статистика
  const stats = {
    incoming: documents.filter(d => d.type === 'incoming').length,
    outgoing: documents.filter(d => d.type === 'outgoing').length,
    internal: documents.filter(d => d.type === 'internal').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Вкладки */}
      <div className="bg-white rounded-2xl shadow-modern p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'incoming'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inbox size={18} />
            <span>Входящие</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold">
              {stats.incoming}
            </span>
          </button>
          {/* Аналогично для outgoing и internal */}
        </div>
      </div>

      {/* Таблица */}
      <DocumentTable
        title={`${activeTab === 'incoming' ? 'Входящие' : activeTab === 'outgoing' ? 'Исходящие' : 'Внутренние'} документы`}
        documents={filteredDocs}
        employees={employees}
        columns={{
          showType: false, // Не показываем тип, т.к. уже отфильтровано
        }}
        filters={{
          showTypeFilter: false, // Скрываем фильтр типа
          defaultType: activeTab,
        }}
      />
    </div>
  );
}
```

### Пример 3: Черновики

```typescript
// src/pages/Drafts.tsx
import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function Drafts() {
  const { documents, employees } = useContext(AppContext);

  // Фильтрация только черновиков
  const draftDocs = documents.filter(d => d.status === 'draft');

  return (
    <DocumentTable
      title="Черновики"
      documents={draftDocs}
      employees={employees}
      filters={{
        showStatusFilter: false, // Скрываем фильтр статуса
        defaultStatus: 'draft',
      }}
    />
  );
}
```

### Пример 4: Документы на согласовании

```typescript
// src/pages/PendingApproval.tsx
import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function PendingApproval() {
  const { documents, employees } = useContext(AppContext);

  // Фильтрация документов на согласовании
  const pendingDocs = documents.filter(d => d.status === 'on_approval');

  return (
    <DocumentTable
      title="Документы на согласовании"
      documents={pendingDocs}
      employees={employees}
      filters={{
        showStatusFilter: false,
        defaultStatus: 'on_approval',
      }}
      onBulkAction={(action, ids) => {
        if (action === 'approve') {
          // Согласовать выбранные документы
          console.log('Согласование документов:', ids);
        }
      }}
    />
  );
}
```

### Пример 5: Архив документов

```typescript
// src/pages/Archive.tsx
import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function Archive() {
  const { documents, employees } = useContext(AppContext);

  // Фильтрация архивных документов
  const archivedDocs = documents.filter(d => d.status === 'archived');

  return (
    <DocumentTable
      title="Архив документов"
      documents={archivedDocs}
      employees={employees}
      columns={{
        showCheckbox: false, // Не нужен выбор в архиве
        showPriority: false, // Приоритет не важен
        showDueDate: false, // Сроки не важны
      }}
      filters={{
        showStatusFilter: false,
        showPriorityFilter: false,
        defaultStatus: 'archived',
      }}
      selectable={false} // Отключаем выбор
    />
  );
}
```

---

## 🎨 Настройка колонок

### Доступные колонки

```typescript
columns?: {
  showCheckbox?: boolean;      // Чекбокс для выбора
  showType?: boolean;          // Тип документа
  showPriority?: boolean;      // Приоритет
  showCorrespondent?: boolean; // Корреспондент
  showDueDate?: boolean;       // Срок исполнения
  showAuthor?: boolean;        // Автор
}
```

### Примеры конфигураций

**Полная таблица:**
```typescript
columns={{
  showCheckbox: true,
  showType: true,
  showPriority: true,
  showCorrespondent: true,
  showDueDate: true,
  showAuthor: true,
}}
```

**Компактная таблица:**
```typescript
columns={{
  showCheckbox: false,
  showType: false,
  showPriority: false,
  showCorrespondent: false,
  showDueDate: false,
  showAuthor: false,
}}
```

**Таблица для архива:**
```typescript
columns={{
  showCheckbox: false,
  showType: true,
  showPriority: false,
  showCorrespondent: true,
  showDueDate: false,
  showAuthor: true,
}}
```

---

## 🔍 Настройка фильтров

### Доступные фильтры

```typescript
filters?: {
  showTypeFilter?: boolean;     // Фильтр по типу
  showStatusFilter?: boolean;   // Фильтр по статусу
  showPriorityFilter?: boolean; // Фильтр по приоритету
  defaultType?: string;         // Значение по умолчанию
  defaultStatus?: string;       // Значение по умолчанию
}
```

### Примеры конфигураций

**Все фильтры:**
```typescript
filters={{
  showTypeFilter: true,
  showStatusFilter: true,
  showPriorityFilter: true,
}}
```

**Только статус и приоритет:**
```typescript
filters={{
  showTypeFilter: false,
  showStatusFilter: true,
  showPriorityFilter: true,
}}
```

**С предустановленным типом:**
```typescript
filters={{
  showTypeFilter: false,
  showStatusFilter: true,
  showPriorityFilter: true,
  defaultType: 'incoming',
}}
```

---

## ⚙️ Настройка поведения

### Поиск

```typescript
searchable={true}  // Включить поиск (по умолчанию)
searchable={false} // Отключить поиск
```

### Сортировка

```typescript
sortable={true}  // Включить сортировку (по умолчанию)
sortable={false} // Отключить сортировку
```

### Выбор документов

```typescript
selectable={true}  // Включить выбор (по умолчанию)
selectable={false} // Отключить выбор
```

### Ссылки

```typescript
linkPrefix="/documents"  // Ссылки на /documents/:id
linkPrefix="/archive"    // Ссылки на /archive/:id
```

---

## 🎯 Обработчики событий

### Создание документа

```typescript
onCreateClick={() => {
  // Открыть модальное окно
  setShowCreateModal(true);
  
  // Или перейти на страницу создания
  navigate('/documents/create');
  
  // Или вызвать API
  api.createDocument(data);
}}
```

### Массовые действия

```typescript
onBulkAction={(action, ids) => {
  switch (action) {
    case 'approve':
      // Согласовать документы
      api.approveDocuments(ids);
      break;
    
    case 'export':
      // Экспортировать документы
      api.exportDocuments(ids);
      break;
    
    case 'delete':
      // Удалить документы
      if (confirm(`Удалить ${ids.length} документов?`)) {
        api.deleteDocuments(ids);
      }
      break;
  }
}}
```

---

## 📊 Типы данных

### DocumentRecord

```typescript
interface DocumentRecord {
  id: string | number;
  number: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  authorId?: string | number;
  author?: string | number;
  correspondent?: string;
  dueDate?: string;
  due_date?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}
```

### EmployeeRecord

```typescript
interface EmployeeRecord {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  position?: string;
  [key: string]: any;
}
```

---

## 🎨 Кастомизация

### Изменение стилей

Компонент использует Tailwind CSS. Вы можете переопределить стили:

```typescript
<DocumentTable
  // ... props
  className="custom-table"
/>
```

### Изменение цветов

Цвета определены в `src/index.css`:

```css
.gradient-blue:   #667eea → #764ba2
.gradient-green:  #11998e → #38ef7d
.gradient-orange: #f093fb → #f5576c
.gradient-purple: #4facfe → #00f2fe
```

### Изменение иконок

Иконки из `lucide-react`:

```typescript
import { Inbox, Send, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
```

---

## 🐛 Решение проблем

### Проблема: Таблица не отображается

**Решение:**
- Проверьте, что `documents` и `employees` не пустые
- Проверьте консоль браузера на ошибки
- Убедитесь, что компонент импортирован правильно

### Проблема: Фильтры не работают

**Решение:**
- Проверьте, что `filters` настроены правильно
- Убедитесь, что данные имеют нужные поля
- Проверьте консоль на ошибки

### Проблема: Сортировка не работает

**Решение:**
- Проверьте, что `sortable={true}`
- Убедитесь, что данные имеют поля для сортировки
- Проверьте, что `sortField` и `sortDirection` корректны

---

## 📚 Дополнительные ресурсы

- [Документация компонента](./DOCUMENT_TABLE_COMPONENT.md)
- [API документация](./BACKEND_API.md)
- [Главная документация](../README.md)

---

## ✅ Чеклист

При использовании `DocumentTable` убедитесь, что:

- [ ] Импортирован компонент
- [ ] Переданы обязательные props (`title`, `documents`, `employees`)
- [ ] Настроены колонки (`columns`)
- [ ] Настроены фильтры (`filters`)
- [ ] Настроено поведение (`searchable`, `sortable`, `selectable`)
- [ ] Добавлены обработчики событий (`onCreateClick`, `onBulkAction`)
- [ ] Протестирована работа компонента

---

**Универсальная таблица документов готова к использованию!** 🎉
