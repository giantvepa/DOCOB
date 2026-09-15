import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, Document, DocCategory, DocPriority } from '../App';
import { Upload, FileText, X, Check, Loader2, Paperclip, Users } from 'lucide-react';

const CATEGORIES: DocCategory[] = ['Договор', 'Счёт', 'Акт', 'Заявление', 'Приказ', 'Служебная записка', 'Доверенность', 'Прочее'];
const PRIORITIES: { value: DocPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Низкий', color: 'bg-slate-100 text-slate-600' },
  { value: 'medium', label: 'Средний', color: 'bg-blue-100 text-blue-600' },
  { value: 'high', label: 'Высокий', color: 'bg-amber-100 text-amber-600' },
  { value: 'urgent', label: 'Срочный', color: 'bg-red-100 text-red-600' },
];

export default function UploadDocument() {
  const { setDocuments, currentUser, users } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocCategory>('Договор');
  const [priority, setPriority] = useState<DocPriority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [approvers, setApprovers] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
      setStep(2);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
      setStep(2);
    }
  };

  const toggleApprover = (userId: string) => {
    setApprovers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handlePublish = () => {
    if (!title.trim() || !file) return;
    setUploading(true);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 20;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      const now = new Date().toISOString();
      const docNumber = `${category.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;

      const newDoc: Document = {
        id: Date.now().toString(),
        number: docNumber,
        title: title.trim(),
        description: description.trim(),
        category,
        status: 'draft',
        priority,
        authorId: currentUser.id,
        createdAt: now,
        updatedAt: now,
        dueDate: dueDate || undefined,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        comments: [],
        history: [{
          id: Math.random().toString(36).substring(2, 9),
          action: 'created',
          userId: currentUser.id,
          createdAt: now,
          details: 'Документ создан',
        }],
        approvals: approvers.map(userId => ({
          id: Math.random().toString(36).substring(2, 9),
          userId,
          status: 'waiting' as const,
        })),
        version: 1,
      };

      setDocuments(prev => [newDoc, ...prev]);
      setStep(3);
      setTimeout(() => navigate('/documents'), 1500);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Загрузка документа</h1>
        <p className="text-sm text-slate-500 mt-1">Создание нового документа в системе</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: 'Файл' },
          { n: 2, label: 'Детали' },
          { n: 3, label: 'Готово' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step >= s.n ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s.n ? <Check size={12} /> : s.n}
            </div>
            <span className={`text-xs font-medium ${step >= s.n ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
            {i < 2 && <div className={`w-10 h-px ${step > s.n ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" />
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-900 mb-1">Перетащите файл документа</p>
          <p className="text-xs text-slate-500 mb-4">или нажмите для выбора</p>
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            Выбрать файл
          </button>
          <p className="text-[11px] text-slate-400 mt-4">PDF, DOCX, XLSX, JPG, PNG • Макс. 50 МБ</p>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-5">
          {/* File info */}
          {file && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} КБ</p>
              </div>
              <button onClick={() => { setStep(1); setFile(null); }} className="w-7 h-7 rounded-md hover:bg-slate-200 flex items-center justify-center">
                <X size={14} className="text-slate-500" />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Название документа *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              placeholder="Введите название..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              placeholder="Краткое описание документа..."
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Приоритет</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 h-10 rounded-lg text-[11px] font-medium transition ${
                      priority === p.value ? p.color + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due date + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Срок исполнения</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Теги (через запятую)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="договор, поставка"
              />
            </div>
          </div>

          {/* Approvers */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Users size={12} /> Маршрут согласования
            </label>
            <div className="space-y-1.5">
              {users.filter(u => u.id !== currentUser.id).map(user => (
                <button
                  key={user.id}
                  onClick={() => toggleApprover(user.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition text-left ${
                    approvers.includes(user.id) ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">{user.avatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.position} • {user.department}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                    approvers.includes(user.id) ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {approvers.includes(user.id) && <Check size={10} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition">Назад</button>
            <button
              onClick={handlePublish}
              disabled={!title.trim() || uploading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 size={14} className="animate-spin" /> Загрузка {Math.round(progress)}%</>
              ) : (
                <><Upload size={14} /> Создать документ</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Документ создан!</h2>
          <p className="text-sm text-slate-500">Перенаправление в список документов...</p>
        </div>
      )}
    </div>
  );
}
