import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { X, FileText } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CreateDocumentModal({ onClose }: Props) {
  const { setDocuments, employees } = useContext(AppContext);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'internal' as 'incoming' | 'outgoing' | 'internal',
    category: 'Другое',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'critical',
    correspondent: '',
    dueDate: '',
  });

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsCreating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newDoc = {
        id: Date.now().toString(),
        number: `${formData.type === 'incoming' ? 'ВХ' : formData.type === 'outgoing' ? 'ИСХ' : 'ВН'}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        status: 'draft' as const,
        priority: formData.priority,
        authorId: user?.id || 1,
        correspondent: formData.correspondent,
        dueDate: formData.dueDate,
        file_size: 0,
        file_name: '',
        tags: [],
        version: 1,
        comments: [],
        history: [{
          id: Date.now().toString(),
          userId: user?.id || 1,
          action: 'created',
          details: 'Документ создан',
          created_at: new Date().toISOString()
        }],
        approvals: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setDocuments(prev => [newDoc, ...prev]);
      onClose();
    } catch (error) {
      console.error('Ошибка создания:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Создать документ</h2>
              <p className="text-sm text-gray-500">Заполните информацию о документе</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название документа <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Введите название документа"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              placeholder="Опишите документ..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип документа</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="incoming">📥 Входящий</option>
                <option value="outgoing">📤 Исходящий</option>
                <option value="internal">📄 Внутренний</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="low">⚪ Низкий</option>
                <option value="normal">🔵 Обычный</option>
                <option value="high">🟠 Высокий</option>
                <option value="critical">🔴 Критичный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Срок исполнения</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Корреспондент</label>
            <input
              type="text"
              value={formData.correspondent}
              onChange={(e) => setFormData({ ...formData, correspondent: e.target.value })}
              className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              placeholder="Название организации или ФИО"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Создание...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Создать документ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
