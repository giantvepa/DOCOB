import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { X, CheckSquare } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CreateTaskModal({ onClose }: Props) {
  const { setTasks, employees } = useContext(AppContext);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'critical',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Выберите исполнителя';
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

      const newTask = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: 'new' as const,
        priority: formData.priority,
        assigneeId: formData.assigneeId,
        authorId: user?.id || 1,
        dueDate: formData.dueDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTasks(prev => [newTask, ...prev]);
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
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
              <CheckSquare size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Создать задачу</h2>
              <p className="text-sm text-gray-500">Поставьте задачу сотруднику</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название задачи <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Введите название задачи"
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
              placeholder="Опишите задачу подробнее..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Исполнитель <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                errors.assigneeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Выберите исполнителя</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim()} - {emp.position}
                </option>
              ))}
            </select>
            {errors.assigneeId && <p className="mt-1 text-xs text-red-600">{errors.assigneeId}</p>}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Срок выполнения</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
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
                  <CheckSquare size={16} />
                  Создать задачу
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
