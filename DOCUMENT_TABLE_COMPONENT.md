# 📋 Универсальный компонент таблицы документов

## 📋 Описание

Универсальный переиспользуемый компонент `DocumentTable` для отображения списков документов во всех реестрах системы. Обеспечивает единый шаблон таблиц с настраиваемыми колонками, фильтрами и функциями.

---

## 🎯 Назначение

Компонент используется в:
- ✅ **Все документы** (`/documents`) - полный список
- ✅ **Канцелярия** (`/registry`) - входящие, исходящие, внутренние
- ✅ **Черновики** (`/drafts`) - только черновики
- ✅ **На согласовании** - документы на согласовании
- ✅ **Архив** - архивные документы
- ✅ **Любые другие реестры** - через настройку props

---

## 🔧 Использование

### Базовый пример

```typescript
import DocumentTable from '../components/DocumentTable';

<DocumentTable
  title="Все документы"
  documents={documents}
  employees={employees}
/>
```

### Полный пример с настройками

```typescript
<DocumentTable
  // Основные данные
  title="Входящие документы"
  documents={filteredDocs}
  employees={employees}
  totalCount={filteredDocs.length}
  
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
    defaultStatus: 'all',
  }}
  
  // Поведение
  searchable={true}
  sortable={true}
  selectable={true}
  linkPrefix="/documents"
  
  // Действия
  createButtonLabel="Зарегистрировать документ"
  onCreateClick={() => console.log('Создание документа')}
  onBulkAction={(action, ids) => console.log(action, ids)}
/>
```

---

## 📊 Props

### Обязательные props

| Prop | Тип | Описание |
|------|-----|----------|
| `title` | `string` | Заголовок страницы |
| `documents` | `DocumentRecord[]` | Массив документов |
| `employees` | `EmployeeRecord[]` | Массив сотрудников |

### Необязательные props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `totalCount` | `number` | `documents.length` | Общее количество документов |
| `columns` | `object` | см. ниже | Настройка видимости колонок |
| `filters` | `object` | см. ниже | Настройка фильтров |
| `searchable` | `boolean` | `true` | Показывать поиск |
| `sortable` | `boolean` | `true` | Включить сортировку |
| `selectable` | `boolean` | `true` | Включить выбор документов |
| `linkPrefix` | `string` | `'/documents'` | Префикс ссылки на документ |
| `createButtonLabel` | `string` | `'Создать'` | Текст кнопки создания |
| `onCreateClick` | `() => void` | - | Обработчик клика по кнопке создания |
| `onBulkAction` | `(action, ids) => void` | - | Обработчик массовых действий |

### Настройка колонок

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

**По умолчанию:**
```typescript
{
  showCheckbox: true,
  showType: true,
  showPriority: true,
  showCorrespondent: true,
  showDueDate: true,
  showAuthor: true,
}
```

### Настройка фильтров

```typescript
filters?: {
  showTypeFilter?: boolean;     // Фильтр по типу
  showStatusFilter?: boolean;   // Фильтр по статусу
  showPriorityFilter?: boolean; // Фильтр по приоритету
  defaultType?: string;         // Значение по умолчанию для типа
  defaultStatus?: string;       // Значение по умолчанию для статуса
}
```

**По умолчанию:**
```typescript
{
  showTypeFilter: true,
  showStatusFilter: true,
  showPriorityFilter: true,
  defaultType: 'all',
  defaultStatus: 'all',
}
```

---

## 🎨 Примеры использования

### 1. Все документы

```typescript
<DocumentTable
  title="Все документы"
  documents={documents}
  employees={employees}
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
/>
```

### 2. Входящие документы (Канцелярия)

```typescript
<DocumentTable
  title="Входящие документы"
  documents={incomingDocs}
  employees={employees}
  columns={{
    showCheckbox: true,
    showType: false, // Не показываем тип, т.к. уже отфильтровано
    showPriority: true,
    showCorrespondent: true,
    showDueDate: true,
    showAuthor: true,
  }}
  filters={{
    showTypeFilter: false, // Скрываем фильтр типа
    showStatusFilter: true,
    showPriorityFilter: true,
    defaultType: 'incoming', // Фильтр по типу "входящие"
  }}
/>
```

### 3. Черновики

```typescript
<DocumentTable
  title="Черновики"
  documents={draftDocs}
  employees={employees}
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
    showStatusFilter: false, // Скрываем фильтр статуса
    showPriorityFilter: true,
    defaultStatus: 'draft', // Фильтр по статусу "черновик"
  }}
/>
```

### 4. Документы на согласовании

```typescript
<DocumentTable
  title="Документы на согласовании"
  documents={pendingDocs}
  employees={employees}
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
    showStatusFilter: false,
    showPriorityFilter: true,
    defaultStatus: 'on_approval',
  }}
  onBulkAction={(action, ids) => {
    if (action === 'approve') {
      // Согласовать выбранные документы
    }
  }}
/>
```

### 5. Архив документов

```typescript
<DocumentTable
  title="Архив документов"
  documents={archivedDocs}
  employees={employees}
  columns={{
    showCheckbox: false, // Не нужен выбор в архиве
    showType: true,
    showPriority: false, // Приоритет не важен в архиве
    showCorrespondent: true,
    showDueDate: false, // Сроки не важны в архиве
    showAuthor: true,
  }}
  filters={{
    showTypeFilter: true,
    showStatusFilter: false,
    showPriorityFilter: false,
    defaultStatus: 'archived',
  }}
  searchable={true}
  sortable={true}
  selectable={false} // Отключаем выбор
/>
```

---

## 🎯 Функции компонента

### 🔍 Поиск

- Полнотекстовый поиск по:
  - Номеру документа
  - Названию
  - Корреспонденту
  - Описанию
- Мгновенная фильтрация при вводе

### 📂 Фильтрация

**Тип документа:**
- Все типы
- 📥 Входящие
- 📤 Исходящие
- 📄 Внутренние

**Статус:**
- Все статусы
- Черновик
- На согласовании
- На подписании
- Подписан
- Исполнен
- Отклонён
- В архиве

**Приоритет:**
- Все приоритеты
- 🔴 Критичный
- 🟠 Высокий
- 🔵 Обычный
- ⚪ Низкий

### 🔄 Сортировка

**Сортируемые колонки:**
- Рег. номер
- Тема документа
- Обновлено

**Направления:**
- ▲ По возрастанию
- ▼ По убыванию

### ☑️ Массовые действия

**Панель действий (появляется при выборе):**
- Согласовать
- Экспорт
- Удалить
- Отменить выбор

**Выбор документов:**
- Чекбокс "Выбрать все"
- Клик по строке
- Индивидуальный выбор

### 🔄 Переключение вида

**Таблица:**
- Детальный просмотр
- Все колонки видны
- Сортировка и фильтрация

**Карточки:**
- Визуальный просмотр
- Компактное отображение
- Адаптивная сетка (1/2/3 колонки)

---

## 🎨 Визуальные элементы

### Статусы документов

| Статус | Иконка | Цвет |
|--------|--------|------|
| Черновик | 📄 | Серый |
| На согласовании | ⏳ | Янтарный |
| На подписании | ⏳ | Синий |
| Подписан | ✅ | Зелёный |
| Исполнен | ✅ | Изумрудный |
| Отклонён | ❌ | Красный |
| В архиве | 🗄️ | Серый |

### Приоритеты

| Приоритет | Цвет |
|-----------|------|
| Критичный | 🔴 Красный |
| Высокий | 🟠 Янтарный |
| Обычный | 🔵 Синий |
| Низкий | ⚪ Серый |

### Типы документов

| Тип | Иконка | Цвет фона |
|-----|--------|-----------|
| Входящий | 📥 | Синий |
| Исходящий | 📤 | Зелёный |
| Внутренний | 📄 | Фиолетовый |

---

## 📱 Адаптивность

### Desktop (>1024px)
- Полная таблица со всеми колонками
- Карточки в 3 колонки

### Tablet (768-1024px)
- Горизонтальная прокрутка таблицы
- Карточки в 2 колонки

### Mobile (<768px)
- Рекомендуется карточный вид
- Карточки в 1 колонку
- Компактные фильтры

---

## 🚀 Производительность

### Оптимизации:

1. **useMemo для фильтрации и сортировки**
   - Фильтрация выполняется только при изменении данных
   - Кэширование результатов

2. **Оптимизированные рендеры**
   - Минимальные перерисовки
   - Локальное состояние фильтров

3. **Lazy loading (будущее)**
   - Загрузка документов по страницам
   - Виртуализация для больших списков

---

## ✅ Преимущества

### 1. Единый шаблон
- Одинаковый вид во всех реестрах
- Предсказуемое поведение
- Легко поддерживать

### 2. Гибкая настройка
- Включение/отключение колонок
- Настройка фильтров
- Кастомизация действий

### 3. Переиспользование
- Один компонент для всех реестров
- Меньше дублирования кода
- Легко добавлять новые реестры

### 4. Консистентность
- Одинаковые фильтры везде
- Единая сортировка
- Стандартные массовые действия

---

## 📝 Примеры страниц

### Страница "Все документы"

```typescript
// src/pages/Documents.tsx
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
      onCreateClick={() => console.log('Создание документа')}
      onBulkAction={(action, ids) => console.log(action, ids)}
    />
  );
}
```

### Страница "Канцелярия"

```typescript
// src/pages/Registry.tsx
export default function Registry() {
  const { documents, employees } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'internal'>('incoming');

  const filteredDocs = documents.filter(d => d.type === activeTab);

  return (
    <DocumentTable
      title={`${activeTab === 'incoming' ? 'Входящие' : activeTab === 'outgoing' ? 'Исходящие' : 'Внутренние'} документы`}
      documents={filteredDocs}
      employees={employees}
      columns={{
        showType: false, // Не показываем тип
      }}
      filters={{
        showTypeFilter: false, // Скрываем фильтр типа
        defaultType: activeTab,
      }}
    />
  );
}
```

### Страница "Черновики"

```typescript
// src/pages/Drafts.tsx
export default function Drafts() {
  const { documents, employees } = useContext(AppContext);
  const draftDocs = documents.filter(d => d.status === 'draft');

  return (
    <DocumentTable
      title="Черновики"
      documents={draftDocs}
      employees={employees}
      filters={{
        showStatusFilter: false,
        defaultStatus: 'draft',
      }}
    />
  );
}
```

---

## 🎯 Итог

Универсальный компонент `DocumentTable` обеспечивает:

✅ **Единый шаблон** для всех реестров  
✅ **Гибкую настройку** через props  
✅ **Переиспользование** кода  
✅ **Консистентность** интерфейса  
✅ **Простоту поддержки**  
✅ **Масштабируемость**  

Компонент готов к использованию во всех реестрах системы СЭД "ЭСАСЫ ПИКИР"! 🎉
