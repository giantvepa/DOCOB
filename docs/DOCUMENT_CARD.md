# 📄 Карточка документа

## 📋 Описание

Карточка документа - один из ключевых экранов СЭД "ЭСАСЫ ПИКИР". Предоставляет полную информацию о документе, позволяет выполнять действия над ним и отслеживать историю изменений.

---

## 🎯 Основные возможности

### 1. Полные реквизиты документа
- 📋 Регистрационный номер
- 📅 Дата регистрации
- 🏢 Категория
- 🤝 Корреспондент
- 👤 Автор и подразделение
- ⏰ Срок исполнения
- 🕐 Последнее изменение
- 📝 Описание
- 🏷️ Теги

### 2. Действия над документом
- ✅ Согласование
- ❌ Отклонение
- 📤 Отправка на согласование
- 🗄️ Архивирование
- ✏️ Редактирование
- 📋 Дублирование
- 🔗 Поделиться
- 🖨️ Печать

### 3. Вкладки информации
- 📄 **Основная информация** - реквизиты документа
- ✅ **Согласование** - маршрут и статус согласования
- 🕐 **История** - все изменения документа
- 📎 **Файлы** - вложения документа
- 💬 **Комментарии** - обсуждения и замечания

### 4. Визуализация маршрута согласования
- Прогресс-бар согласования
- Статус каждого согласующего
- Комментарии согласующих
- Даты согласования

---

## 🎨 Интерфейс

### Шапка карточки

```
┌─────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████████ │ ← Статусная полоса
│                                                             │
│ 📄 Договор поставки оборудования                            │
│    ВХ-2024-0156 • 📥 Входящий                               │
│                                                             │
│ [⏳ На согласовании] [🟠 Высокий приоритет] [v2]           │
│                                                             │
│                              [📤 На согласование] [✅ Соглас.]│
│                              [❌ Отклонить] [⋮]             │
├─────────────────────────────────────────────────────────────┤
│ [📄 Основная] [✅ Согласование] [🕐 История] [📎 Файлы] [💬 Комментарии] │
└─────────────────────────────────────────────────────────────┘
```

### Вкладка "Основная информация"

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Реквизиты документа                                      │
├─────────────────────────────────────────────────────────────┤
│ Регистрационный номер          Дата регистрации             │
│ ВХ-2024-0156                   15 декабря 2024              │
│                                                             │
│ Категория                      Корреспондент                │
│ Договор                        ООО "ТехноСервис"            │
│                                                             │
│ Автор                          Подразделение                │
│ 👤 Бердиев Гурбан              IT отдел                     │
│                                                             │
│ Срок исполнения                Последнее изменение          │
│ 20 декабря 2024                15 декабря 2024, 14:20       │
│                                                             │
│ Описание                                                        │
│ Договор с ООО "ТехноСервис" на поставку серверного...       │
│                                                             │
│ 🏷️ Теги                                                         │
│ [#договор] [#поставка] [#2024] [#серверы]                   │
└─────────────────────────────────────────────────────────────┘
```

### Вкладка "Согласование"

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Маршрут согласования                                     │
├─────────────────────────────────────────────────────────────┤
│ ① 👤 Сидоров Константин                                     │
│    Юрист                                                    │
│                                    [✓ Согласовано]          │
│                                    11 декабря 2024          │
│                                                             │
│ ② 👤 Мергенджанова Айгуль                                   │
│    Главный бухгалтер                                        │
│                                    [✓ Согласовано]          │
│                                    12 декабря 2024          │
│                                                             │
│ ③ 👤 Аннамыратов Сердар                                     │
│    Генеральный директор                                     │
│                                    [⏳ Ожидает]             │
│                                                             │
│ Прогресс согласования              2 из 3 (67%)             │
│ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
```

### Вкладка "История"

```
┌─────────────────────────────────────────────────────────────┐
│ 🕐 История изменений                                        │
├─────────────────────────────────────────────────────────────┤
│ 👤 Бердиев Гурбан — Добавлен комментарий                   │
│    15 декабря 2024, 14:20                                   │
│                                                             │
│ 👤 Мергенджанова Айгуль — Документ согласован              │
│    12 декабря 2024, 14:20                                   │
│                                                             │
│ 👤 Сидоров Константин — Документ согласован                │
│    11 декабря 2024, 10:00                                   │
│                                                             │
│ 👤 Бердиев Гурбан — Документ отправлен на согласование     │
│    10 декабря 2024, 14:00                                   │
│                                                             │
│ 👤 Бердиев Гурбан — Документ создан                        │
│    10 декабря 2024, 09:30                                   │
└─────────────────────────────────────────────────────────────┘
```

### Вкладка "Комментарии"

```
┌─────────────────────────────────────────────────────────────┐
│ 💬 Комментарии                                              │
├─────────────────────────────────────────────────────────────┤
│ 👤 Сидоров Константин                        11 дек, 10:00 │
│    Юридическая экспертиза проведена. Замечаний нет.        │
│                                                             │
│ 👤 Мергенджанова Айгуль                      12 дек, 14:20 │
│    Бюджет согласован. Средства зарезервированы.            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 👤 Добавить комментарий...                              ││
│ │                                                         ││
│ │                                            [Отправить]  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Использование

### Навигация к карточке

```typescript
// Из списка документов
<Link to={`/documents/${doc.id}`}>
  {doc.number}
</Link>

// Программная навигация
navigate(`/documents/${doc.id}`);
```

### Получение данных документа

```typescript
const { id } = useParams<{ id: string }>();
const doc = documents.find(d => String(d.id) === String(id));
```

### Действия над документом

```typescript
// Согласование
const handleApprove = () => {
  setDocuments(prev => prev.map(d => {
    if (d.id !== doc.id) return d;
    
    const updatedApprovals = d.approvals.map(a => 
      a.userId === user.id
        ? { ...a, status: 'approved', completedAt: new Date().toISOString() }
        : a
    );
    
    return { ...d, approvals: updatedApprovals };
  }));
};

// Отклонение
const handleReject = () => {
  const reason = prompt('Укажите причину отклонения:');
  if (!reason) return;
  
  // ... логика отклонения
};

// Отправка на согласование
const handleSendToApproval = () => {
  const approvers = employees.filter(e => e.id !== user.id).slice(0, 3);
  
  setDocuments(prev => prev.map(d => {
    if (d.id !== doc.id) return d;
    
    return {
      ...d,
      status: 'on_approval',
      approvals: approvers.map((u, idx) => ({
        id: Date.now().toString() + idx,
        userId: u.id,
        status: 'waiting',
        step_order: idx + 1,
      }))
    };
  }));
};
```

---

## 🎨 Визуальные элементы

### Статусная полоса

Цветная полоса вверху карточки показывает статус документа:

```typescript
const STATUS_GRADIENTS = {
  draft: 'from-gray-400 to-gray-500',
  on_approval: 'from-amber-400 to-orange-500',
  on_signing: 'from-blue-400 to-blue-500',
  signed: 'from-green-400 to-emerald-500',
  executed: 'from-emerald-400 to-teal-500',
  rejected: 'from-red-400 to-rose-500',
  archived: 'from-slate-400 to-slate-500',
};
```

### Иконка статуса

Большая иконка с градиентом:

```typescript
<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConf.gradient} flex items-center justify-center shadow-lg`}>
  <StatusIcon size={24} className="text-white" />
</div>
```

### Бейджи

**Статус:**
```typescript
<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
  <StatusIcon size={12} />
  {statusConf.label}
</span>
```

**Приоритет:**
```typescript
<span className={`px-3 py-1.5 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
  {priorityConf.label} приоритет
</span>
```

**Версия:**
```typescript
<span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
  v{doc.version || 1}
</span>
```

---

## 🔐 Права доступа

### Проверка прав на согласование

```typescript
const canApprove = doc.approvals?.some(a => 
  String(a.userId || a.user) === String(user?.id) && a.status === 'waiting'
);
```

### Проверка прав на редактирование

```typescript
const canEdit = String(doc.authorId || doc.author) === String(user?.id) && doc.status === 'draft';
```

### Условное отображение кнопок

```typescript
{doc.status === 'draft' && (
  <button onClick={handleSendToApproval}>
    На согласование
  </button>
)}

{canApprove && (
  <>
    <button onClick={handleApprove}>Согласовать</button>
    <button onClick={handleReject}>Отклонить</button>
  </>
)}
```

---

## 📊 Прогресс согласования

```typescript
const done = doc.approvals.filter(a => a.status === 'approved').length;
const total = doc.approvals.length;
const pct = Math.round((done / total) * 100);

<div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
  <div className="flex justify-between text-sm mb-2">
    <span className="text-gray-700 font-medium">Прогресс согласования</span>
    <span className="font-bold text-gray-900">{done} из {total} ({pct}%)</span>
  </div>
  <div className="h-2 bg-white rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" 
      style={{ width: `${pct}%` }} 
    />
  </div>
</div>
```

---

## 💬 Комментарии

### Добавление комментария

```typescript
const handleAddComment = () => {
  if (!commentText.trim()) return;
  
  setDocuments(prev => prev.map(d => {
    if (d.id !== doc.id) return d;
    
    return {
      ...d,
      comments: [
        ...(d.comments || []),
        {
          id: Date.now().toString(),
          authorId: user.id,
          text: commentText,
          created_at: new Date().toISOString()
        }
      ]
    };
  }));
  
  setCommentText('');
};
```

### Отображение комментариев

```typescript
{(doc.comments || []).map(comment => {
  const commentAuthor = employees.find(e => e.id === comment.authorId);
  
  return (
    <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
        {commentAuthor?.avatar || commentAuthor?.name?.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">
            {commentAuthor?.name}
          </span>
          <span className="text-[10px] text-gray-400">
            {fmtDate(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
      </div>
    </div>
  );
})}
```

---

## 🕐 История изменений

### Автоматическая запись действий

Каждое действие записывается в историю:

```typescript
history: [
  ...(d.history || []),
  {
    id: Date.now().toString(),
    userId: user.id,
    action: 'approved',
    details: 'Документ согласован',
    created_at: new Date().toISOString()
  }
]
```

### Отображение истории

```typescript
{[...doc.history].reverse().map((entry, idx) => {
  const entryUser = employees.find(e => e.id === entry.userId);
  
  return (
    <div key={entry.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        <User size={14} className="text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-900">
          <span className="font-medium">{entryUser?.name}</span>
          <span className="text-gray-500"> — {entry.details}</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {fmtDate(entry.created_at)}
        </p>
      </div>
    </div>
  );
})}
```

---

## 🎯 Типы действий

### Действия в меню "⋮"

```typescript
<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2">
  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <Edit3 size={16} /> Редактировать
  </button>
  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <Copy size={16} /> Дублировать
  </button>
  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <Share2 size={16} /> Поделиться
  </button>
  <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <Printer size={16} /> Печать
  </button>
  <button onClick={handleArchive} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
    <Archive size={16} /> В архив
  </button>
</div>
```

---

## 📱 Адаптивность

### Desktop (>1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ [← Документы] > ВХ-2024-0156                                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 📄 Договор поставки...                                  ││
│ │ [⏳ На согласовании] [🟠 Высокий] [v2]                 ││
│ │                              [📤 На согласование] [⋮]  ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ [📄 Основная] [✅ Согласование] [🕐 История] [📎 Файлы]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Реквизиты документа                                     ││
│ │ [Номер] [Дата] [Категория] [Корреспондент]             ││
│ │ [Автор] [Подразделение] [Срок] [Изменение]             ││
│ │ [Описание]                                              ││
│ │ [Теги]                                                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768-1024px)

- Горизонтальная прокрутка для вкладок
- 1 колонка для реквизитов

### Mobile (<768px)

- Вертикальное расположение элементов
- Скрытые второстепенные действия
- Упрощённый интерфейс

---

## ✅ Что реализовано

- ✅ Полные реквизиты документа
- ✅ 5 вкладок информации
- ✅ Действия над документом (согласование, отклонение, архивирование)
- ✅ Визуализация маршрута согласования
- ✅ Прогресс-бар согласования
- ✅ История изменений
- ✅ Комментарии с возможностью добавления
- ✅ Проверка прав доступа
- ✅ Статусная полоса с градиентом
- ✅ Бейджи статуса, приоритета, версии
- ✅ Меню дополнительных действий
- ✅ Адаптивный дизайн
- ✅ Плавные анимации
- ✅ Цветовое кодирование

---

**Карточка документа готова!** 🎉

Это один из ключевых экранов СЭД, предоставляющий полный функционал для работы с документами.
