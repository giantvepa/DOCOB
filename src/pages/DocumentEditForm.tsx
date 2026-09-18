import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft, Save, X, AlertCircle, CheckCircle2, FileText,
  Calendar, User, Building2, Tag, Clock, Edit3, Lock
} from 'lucide-react';

// Конфигурация статусов
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; gradient: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', gradient: 'from-gray-400 to-gray-500', icon: FileText },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-400 to-orange-500', icon: Clock },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', gradient: 'from-green-400 to-emerald-500', icon: CheckCircle2 },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-400 to-teal-500', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', gradient: 'from-red-400 to-rose-500', icon: X },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', gradient: 'from-slate-400 to-slate-500', icon: Lock },
};

export default function DocumentEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, setDocuments, employees } = useContext(AppContext);
  const { user } = useAuth();

  const doc = documents.find(d => String(d.id) === String(id));

  // Состояние формы
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

  // Инициализация формы
  useEffect(() => {
    if (doc) {
      setFormData({
        title: doc.title || '',
        description: doc.description || '',
        category: doc.category || '',
        correspondent: doc.correspondent || '',
        priority: doc.priority || 'normal',
        dueDate: doc.dueDate || doc.due_date || '',
        tags: doc.tags || [],
      });
    }
  }, [doc]);

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Документ не найден</h2>
        <Link to="/documents" className="text-blue-600 hover:text-blue-700 text-sm">
          ← Вернуться к списку документов
        </Link>
      </div>
    );
  }

  const author = employees.find(e => String(e.id) === String(doc.authorId || doc.author));
  const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConf.icon;

  // Проверка прав на редактирование
  const canEdit = String(doc.authorId || doc.author) === String(user?.id) && 
                  (doc.status === 'draft' || doc.status === 'rejected');

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Обработчики изменений
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

  // Валидация
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

  // Сохранение
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      // Имитация задержки сохранения
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

  // Отмена
  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Вы уверены? Все несохранённые изменения будут потеряны.')) {
        navigate(`/documents/${doc.id}`);
      }
    } else {
      navigate(`/documents/${doc.id}`);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/documents" className="hover:text-blue-600 flex items-center gap-1 transition">
          <ArrowLeft size={16} /> Документы
        </Link>
        <span className="text-gray-400">/</span>
        <Link to={`/documents/${doc.id}`} className="hover:text-blue-600 transition">
          {doc.number}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Редактирование</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-modern p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Edit3 size={24} className="text-blue-600" />
              Редактирование документа
            </h1>
            <p className="text-sm text-gray-500 mt-1">{doc.number}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <X size={16} />
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!canEdit || isSaving || !isDirty}
              className="btn-primary px-6 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </div>

        {/* Уведомление об успехе */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={20} className="text-green-600" />
            <span className="text-sm text-green-800 font-medium">Документ успешно сохранён</span>
          </div>
        )}

        {/* Предупреждение о правах */}
        {!canEdit && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-600" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Редактирование недоступно</p>
              <p className="text-xs text-amber-700 mt-1">
                Вы можете редактировать только свои документы в статусе "Черновик" или "Отклонён"
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - Рабочие действия */}
        <div className="lg:col-span-2 space-y-6">
          {/* Рабочие поля */}
          <div className="bg-white rounded-2xl shadow-modern p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 size={20} className="text-blue-600" />
              Рабочие поля
            </h2>

            <div className="space-y-5">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название документа <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  disabled={!canEdit}
                  className={`w-full h-11 px-4 border rounded-xl text-sm transition ${
                    errors.title
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="Введите название документа"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={!canEdit}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Введите описание документа"
                />
              </div>

              {/* Категория и Приоритет */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    disabled={!canEdit}
                    className={`w-full h-11 px-4 border rounded-xl text-sm transition ${
                      errors.category
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  >
                    <option value="">Выберите категорию</option>
                    <option value="Договор">Договор</option>
                    <option value="Счёт">Счёт</option>
                    <option value="Акт">Акт</option>
                    <option value="Письмо">Письмо</option>
                    <option value="Приказ">Приказ</option>
                    <option value="Заявление">Заявление</option>
                    <option value="Служебная записка">Служебная записка</option>
                    <option value="Протокол">Протокол</option>
                    <option value="Доверенность">Доверенность</option>
                    <option value="Другое">Другое</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Приоритет
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    disabled={!canEdit}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="low">⚪ Низкий</option>
                    <option value="normal">🔵 Обычный</option>
                    <option value="high">🟠 Высокий</option>
                    <option value="critical">🔴 Критичный</option>
                  </select>
                </div>
              </div>

              {/* Корреспондент и Срок */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Корреспондент
                  </label>
                  <input
                    type="text"
                    value={formData.correspondent}
                    onChange={(e) => handleChange('correspondent', e.target.value)}
                    disabled={!canEdit}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Название организации"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок исполнения
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    disabled={!canEdit}
                    className={`w-full h-11 px-4 border rounded-xl text-sm transition ${
                      errors.dueDate
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Теги */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Теги
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['договор', 'поставка', '2024', 'серверы', 'IT', 'финансы', 'HR', 'юридический'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => canEdit && handleTagsChange(tag)}
                      disabled={!canEdit}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        formData.tags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                        #{tag}
                        {canEdit && (
                          <button
                            onClick={() => handleTagsChange(tag)}
                            className="hover:text-blue-900"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - Постоянные реквизиты */}
        <div className="space-y-6">
          {/* Статус документа */}
          <div className="bg-white rounded-2xl shadow-modern p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              Статус документа
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConf.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center shadow-lg`}>
                <StatusIcon size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${statusConf.color}`}>{statusConf.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">Изменить нельзя</p>
              </div>
            </div>
          </div>

          {/* Постоянные реквизиты */}
          <div className="bg-white rounded-2xl shadow-modern p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              Постоянные реквизиты
            </h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Регистрационный номер</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{doc.number}</p>
              </div>
              <div className="pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Дата регистрации</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{fmtDate(doc.createdAt)}</p>
              </div>
              <div className="pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Тип документа</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {doc.type === 'incoming' ? '📥 Входящий' : doc.type === 'outgoing' ? '📤 Исходящий' : '📄 Внутренний'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Версия</p>
                <p className="text-sm font-medium text-gray-900 mt-1">v{doc.version || 1}</p>
              </div>
            </div>
          </div>

          {/* Информация об авторе */}
          <div className="bg-white rounded-2xl shadow-modern p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-600" />
              Автор документа
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {author?.avatar || (author?.first_name || author?.name || '?').charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {author ? `${author.first_name || author.name || ''} ${author.last_name || ''}`.trim() : 'Неизвестно'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{author?.position || '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Building2 size={10} />
                  {author?.department || '—'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Изменить нельзя
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
