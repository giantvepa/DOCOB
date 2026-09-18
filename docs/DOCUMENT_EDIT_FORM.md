# 📝 Форма редактирования документа

## 📋 Описание

Форма работы с документом с чётким разделением постоянных реквизитов (только для чтения) и рабочих действий пользователя (редактируемые поля).

---

## 🎯 Принципы дизайна

### Разделение на две зоны

**Левая колонка (2/3) - Рабочие действия:**
- ✅ Редактируемые поля
- ✅ Валидация данных
- ✅ Интерактивные элементы
- ✅ Кнопки сохранения

**Правая колонка (1/3) - Постоянные реквизиты:**
- 🔒 Только для чтения
- 🔒 Статус документа
- 🔒 Регистрационные данные
- 🔒 Информация об авторе

---

## 🎨 Интерфейс

### Структура формы

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Документы / ВХ-2024-0156 / Редактирование                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ✏️ Редактирование документа                                         │
│ ВХ-2024-0156                                                        │
│                                                                     │
│                                          [✕ Отмена] [💾 Сохранить] │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────┬──────────────────┐
│ ✏️ Рабочие поля                               │ 🔒 Статус        │
│                                               │                  │
│ Название документа *                          │ [⏳ На согл.]    │
│ [Договор поставки оборудования_______]        │ Изменить нельзя  │
│                                               │                  │
│ Описание                                      │ 🔒 Постоянные    │
│ [Договор с ООО "ТехноСервис" на              │    реквизиты     │
│  поставку серверного..._________________]    │                  │
│                                               │ Рег. номер       │
│ Категория *          Приоритет                │ ВХ-2024-0156     │
│ [Договор_________]   [🟠 Высокий_______]     │                  │
│                                               │ Дата регистрации │
│ Корреспондент        Срок исполнения         │ 15 дек 2024      │
│ [ООО "ТехноСервис"]  [2024-12-20]            │                  │
│                                               │ Тип документа    │
│ Теги                                          │ 📥 Входящий      │
│ [#договор] [#поставка] [#2024]               │                  │
│ [#серверы] [#IT] [#финансы]                  │ Версия           │
│                                               │ v2               │
│ Выбрано: [#договор ×] [#поставка ×]          │                  │
│                                               │ 🔒 Автор         │
│                                               │                  │
│                                               │ 👤 Бердиев Г.    │
│                                               │ Специалист       │
│                                               │ IT отдел         │
│                                               │ Изменить нельзя  │
└───────────────────────────────────────────────┴──────────────────┘
```

---

## 🔧 Рабочие поля (редактируемые)

### 1. Название документа
```typescript
<input
  type="text"
  value={formData.title}
  onChange={(e) => handleChange('title', e.target.value)}
  disabled={!canEdit}
  placeholder="Введите название документа"
/>
```

**Валидация:**
- ✅ Обязательное поле
- ✅ Минимум 3 символа
- ✅ Отображение ошибок

### 2. Описание
```typescript
<textarea
  value={formData.description}
  onChange={(e) => handleChange('description', e.target.value)}
  disabled={!canEdit}
  rows={5}
  placeholder="Введите описание документа"
/>
```

### 3. Категория
```typescript
<select
  value={formData.category}
  onChange={(e) => handleChange('category', e.target.value)}
  disabled={!canEdit}
>
  <option value="">Выберите категорию</option>
  <option value="Договор">Договор</option>
  <option value="Счёт">Счёт</option>
  <option value="Акт">Акт</option>
  {/* ... */}
</select>
```

**Валидация:**
- ✅ Обязательное поле

### 4. Приоритет
```typescript
<select
  value={formData.priority}
  onChange={(e) => handleChange('priority', e.target.value)}
  disabled={!canEdit}
>
  <option value="low">⚪ Низкий</option>
  <option value="normal">🔵 Обычный</option>
  <option value="high">🟠 Высокий</option>
  <option value="critical">🔴 Критичный</option>
</select>
```

### 5. Корреспондент
```typescript
<input
  type="text"
  value={formData.correspondent}
  onChange={(e) => handleChange('correspondent', e.target.value)}
  disabled={!canEdit}
  placeholder="Название организации"
/>
```

### 6. Срок исполнения
```typescript
<input
  type="date"
  value={formData.dueDate}
  onChange={(e) => handleChange('dueDate', e.target.value)}
  disabled={!canEdit}
/>
```

**Валидация:**
- ✅ Не может быть в прошлом

### 7. Теги
```typescript
<div className="flex flex-wrap gap-2">
  {['договор', 'поставка', '2024', 'серверы'].map(tag => (
    <button
      onClick={() => handleTagsChange(tag)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
        formData.tags.includes(tag)
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      #{tag}
    </button>
  ))}
</div>
```

**Особенности:**
- Кликабельные теги для добавления/удаления
- Визуальное выделение выбранных тегов

---

## 🔒 Постоянные реквизиты (только для чтения)

### 1. Статус документа
```typescript
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
    <StatusIcon size={24} className="text-white" />
  </div>
  <div>
    <p className="text-sm font-semibold">{statusConf.label}</p>
    <p className="text-xs text-gray-500">Изменить нельзя</p>
  </div>
</div>
```

### 2. Регистрационные данные
```typescript
<div className="space-y-3">
  <div className="pb-3 border-b border-gray-200">
    <p className="text-xs text-gray-500">Регистрационный номер</p>
    <p className="text-sm font-semibold">{doc.number}</p>
  </div>
  <div className="pb-3 border-b border-gray-200">
    <p className="text-xs text-gray-500">Дата регистрации</p>
    <p className="text-sm font-medium">{fmtDate(doc.createdAt)}</p>
  </div>
  <div className="pb-3 border-b border-gray-200">
    <p className="text-xs text-gray-500">Тип документа</p>
    <p className="text-sm font-medium">📥 Входящий</p>
  </div>
  <div>
    <p className="text-xs text-gray-500">Версия</p>
    <p className="text-sm font-medium">v{doc.version}</p>
  </div>
</div>
```

### 3. Информация об авторе
```typescript
<div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
    {author.avatar}
  </div>
  <div>
    <p className="text-sm font-semibold">{author.name}</p>
    <p className="text-xs text-gray-500">{author.position}</p>
    <p className="text-xs text-gray-500">🏢 {author.department}</p>
  </div>
</div>
<p className="text-xs text-gray-500 text-center">Изменить нельзя</p>
```

---

## 🔐 Проверка прав на редактирование

```typescript
const canEdit = String(doc.authorId || doc.author) === String(user?.id) && 
                (doc.status === 'draft' || doc.status === 'rejected');
```

**Условия:**
- ✅ Пользователь является автором документа
- ✅ Статус документа: "Черновик" или "Отклонён"

**Предупреждение при отсутствии прав:**
```typescript
{!canEdit && (
  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
    <AlertCircle size={20} className="text-amber-600" />
    <p className="text-sm text-amber-800 font-medium">Редактирование недоступно</p>
    <p className="text-xs text-amber-700">
      Вы можете редактировать только свои документы в статусе "Черновик" или "Отклонён"
    </p>
  </div>
)}
```

---

## ✅ Валидация формы

```typescript
const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Название документа обязательно';
  } else if (formData.title.length < 3) {
    newErrors.title = 'Название должно содержать минимум 3 символа';
  }

  if (!formData.category) {
    newErrors.category = 'Категория обязательна';
  }

  if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
    newErrors.dueDate = 'Срок исполнения не может быть в прошлом';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Отображение ошибок:**
```typescript
{errors.title && (
  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
    <AlertCircle size={12} />
    {errors.title}
  </p>
)}
```

---

## 💾 Сохранение изменений

```typescript
const handleSave = async () => {
  if (!validate()) return;

  setIsSaving(true);

  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;

      return {
        ...d,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        correspondent: formData.correspondent,
        priority: formData.priority,
        dueDate: formData.dueDate,
        tags: formData.tags,
        updatedAt: new Date().toISOString(),
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'updated',
            details: 'Документ обновлён',
            created_at: new Date().toISOString()
          }
        ]
      };
    }));

    setIsDirty(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      navigate(`/documents/${doc.id}`);
    }, 1500);
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  } finally {
    setIsSaving(false);
  }
};
```

**Особенности:**
- ✅ Валидация перед сохранением
- ✅ Индикатор загрузки
- ✅ Уведомление об успехе
- ✅ Автоматический переход к карточке
- ✅ Запись в историю изменений

---

## 🚫 Отмена изменений

```typescript
const handleCancel = () => {
  if (isDirty) {
    if (confirm('Вы уверены? Все несохранённые изменения будут потеряны.')) {
      navigate(`/documents/${doc.id}`);
    }
  } else {
    navigate(`/documents/${doc.id}`);
  }
};
```

**Особенности:**
- ✅ Проверка на несохранённые изменения
- ✅ Подтверждение перед отменой
- ✅ Возврат к карточке документа

---

## 🎨 Визуальные элементы

### Индикатор несохранённых изменений

```typescript
<button
  onClick={handleSave}
  disabled={!canEdit || isSaving || !isDirty}
  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
</button>
```

**Логика:**
- Кнопка активна только при наличии изменений (`isDirty`)
- Кнопка отключена при отсутствии прав (`!canEdit`)
- Индикатор загрузки при сохранении (`isSaving`)

### Уведомление об успехе

```typescript
{showSuccess && (
  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
    <CheckCircle2 size={20} className="text-green-600" />
    <span className="text-sm text-green-800 font-medium">
      Документ успешно сохранён
    </span>
  </div>
)}
```

### Отключение полей

```typescript
<input
  disabled={!canEdit}
  className="disabled:bg-gray-100 disabled:cursor-not-allowed"
/>
```

---

## 📊 Состояние формы

```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  correspondent: '',
  priority: 'normal',
  dueDate: '',
  tags: [] as string[],
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [isSaving, setIsSaving] = useState(false);
const [isDirty, setIsDirty] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
```

---

## 🔄 Обработчики изменений

```typescript
const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  setIsDirty(true);
  
  // Очистка ошибки при изменении
  if (errors[field]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};

const handleTagsChange = (tag: string) => {
  if (formData.tags.includes(tag)) {
    handleChange('tags', formData.tags.filter(t => t !== tag));
  } else {
    handleChange('tags', [...formData.tags, tag]);
  }
};
```

---

## 📱 Адаптивность

### Desktop (>1024px)

```
┌───────────────────────────────────────────────┬──────────────────┐
│ Рабочие поля (2/3)                            │ Постоянные (1/3) │
│                                               │                  │
│ [Название]                                    │ [Статус]         │
│ [Описание]                                    │                  │
│ [Категория] [Приоритет]                       │ [Реквизиты]      │
│ [Корреспондент] [Срок]                        │                  │
│ [Теги]                                        │ [Автор]          │
└───────────────────────────────────────────────┴──────────────────┘
```

### Tablet (768-1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ Рабочие поля (полная ширина)                                │
│                                                             │
│ [Название]                                                  │
│ [Описание]                                                  │
│ [Категория] [Приоритет]                                     │
│ [Корреспондент] [Срок]                                      │
│ [Теги]                                                      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Постоянные реквизиты (полная ширина)                        │
│                                                             │
│ [Статус] [Реквизиты] [Автор]                                │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

- Вертикальное расположение
- Уменьшенные отступы
- Упрощённый интерфейс

---

## ✅ Что реализовано

### Рабочие поля
- ✅ Название документа с валидацией
- ✅ Описание (многострочное поле)
- ✅ Категория с валидацией
- ✅ Приоритет
- ✅ Корреспондент
- ✅ Срок исполнения с валидацией
- ✅ Теги (кликабельные)

### Постоянные реквизиты
- ✅ Статус документа (только чтение)
- ✅ Регистрационный номер
- ✅ Дата регистрации
- ✅ Тип документа
- ✅ Версия
- ✅ Информация об авторе

### Функциональность
- ✅ Проверка прав на редактирование
- ✅ Валидация формы
- ✅ Индикатор несохранённых изменений
- ✅ Уведомление об успехе
- ✅ Подтверждение отмены
- ✅ Запись в историю изменений
- ✅ Автоматический переход после сохранения

### Визуальные элементы
- ✅ Двухколоночная структура
- ✅ Градиентные фоны
- ✅ Цветовое кодирование
- ✅ Иконки для разделов
- ✅ Индикаторы ошибок
- ✅ Отключение полей без прав

---

## 🎯 Преимущества

### 1. Чёткое разделение
- Рабочие поля слева
- Постоянные реквизиты справа
- Понятная структура

### 2. Безопасность
- Проверка прав на редактирование
- Валидация данных
- Защита от случайных изменений

### 3. Удобство использования
- Индикатор несохранённых изменений
- Подтверждение отмены
- Уведомление об успехе
- Автоматический переход

### 4. Визуальная ясность
- Градиентные фоны для разделов
- Цветовое кодирование статусов
- Иконки для каждого раздела
- Чёткие разделители

---

**Форма редактирования документа готова!** 🎉

Интерфейс чётко разделяет постоянные реквизиты (только для чтения) и рабочие действия пользователя (редактируемые поля). Форма включает валидацию, проверку прав, индикаторы состояния и уведомления.
