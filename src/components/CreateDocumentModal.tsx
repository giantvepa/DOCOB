import { useState } from 'react';
import { AppContext, Document, DocType, DocCategory, TaskPriority } from '../App';
import { useContext } from 'react';
import { X, Upload, FileText, Calendar, Users, Tag } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CreateDocumentModal({ onClose }: Props) {
  const { setDocuments, employees, currentUser } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'internal' as DocType,
    category: 'Другое' as DocCategory,
    correspondent: '',
    priority: 'normal' as TaskPriority,
    dueDate: '',
    tags: '',
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setUploading(true);

    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        number: `${formData.type === 'incoming' ? 'ВХ' : formData.type === 'outgoing' ? 'ИСХ' : 'ВН'}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        status: 'draft',
        priority: formData.priority,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: formData.dueDate || undefined,
        correspondent: formData.correspondent || undefined,
        fileSize: Math.floor(Math.random() * 5000000),
        fileName: `${formData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        comments: [],
        history: [{
          id: Math.random().toString(36).slice(2),
          action: 'created',
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          details: 'Документ создан',
        }],
        approvals: [],
        version: 1,
        relatedIds: [],
      };

      setDocuments(prev => [newDoc, ...prev]);
      setUploading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Создать документ</h2>
            <p className="text-sm text-gray-500 mt-1">Заполните информацию о документе</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название документа *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название документа"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип документа
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocType })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="incoming">Входящий</option>
                <option value="outgoing">Исходящий</option>
                <option value="internal">Внутренний</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as DocCategory })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишите документ..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Correspondent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Корреспондент
            </label>
            <input
              type="text"
              value={formData.correspondent}
              onChange={(e) => setFormData({ ...formData, correspondent: e.target.value })}
              placeholder="Название организации или ФИО"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="low">Низкий</option>
                <option value="normal">Обычный</option>
                <option value="high">Высокий</option>
                <option value="critical">Критичный</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок исполнения
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Теги (через запятую)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="договор, поставка, 2024"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* File Upload (Demo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Прикрепить файл (демо)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Нажмите для загрузки файла</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX до 50 МБ</p>
            </div>
          </div>

          {/* Actions */}
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
              disabled={uploading || !formData.title.trim()}
              className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
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
