import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, Download, Send,
  MessageSquare, Printer, Calendar, Paperclip, ChevronRight,
  Stamp, Check, Clock, Upload, Trash2, Edit3, Archive, MoreVertical,
  User, Building2, Tag, AlertCircle, Copy, Share2, Eye
} from 'lucide-react';

// Конфигурация статусов
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any; gradient: string }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', icon: FileText, gradient: 'from-gray-400 to-gray-500' },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock, gradient: 'from-amber-400 to-orange-500' },
  on_signing: { label: 'На подписании', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock, gradient: 'from-blue-400 to-blue-500' },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2, gradient: 'from-green-400 to-emerald-500' },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2, gradient: 'from-emerald-400 to-teal-500' },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle, gradient: 'from-red-400 to-rose-500' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', icon: Archive, gradient: 'from-slate-400 to-slate-500' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-gray-600', bg: 'bg-gray-100' },
  normal: { label: 'Обычный', color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { label: 'Высокий', color: 'text-amber-600', bg: 'bg-amber-100' },
  critical: { label: 'Критичный', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, setDocuments, employees } = useContext(AppContext);
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'main' | 'approval' | 'history' | 'files' | 'comments'>('main');
  const [commentText, setCommentText] = useState('');
  const [showActions, setShowActions] = useState(false);

  const doc = documents.find(d => String(d.id) === String(id));

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Документ не найден</h2>
        <p className="text-sm text-gray-500 mb-4">Документ с таким ID не существует</p>
        <Link to="/documents" className="text-blue-600 hover:text-blue-700 text-sm">
          ← Вернуться к списку документов
        </Link>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
  const priorityConf = PRIORITY_CONFIG[doc.priority] || PRIORITY_CONFIG.normal;
  const author = employees.find(e => String(e.id) === String(doc.authorId || doc.author));
  const StatusIcon = statusConf.icon;

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Обработчики действий
  const handleApprove = () => {
    if (!confirm('Согласовать документ?')) return;
    
    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;
      
      const updatedApprovals = (d.approvals || []).map(a => 
        String(a.userId || a.user) === String(user?.id)
          ? { ...a, status: 'approved' as const, completedAt: new Date().toISOString(), comment: 'Согласовано' }
          : a
      );
      
      const allApproved = updatedApprovals.every(a => a.status === 'approved');
      
      return {
        ...d,
        status: allApproved ? 'signed' as any : d.status,
        approvals: updatedApprovals,
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'approved',
            details: 'Документ согласован',
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const handleReject = () => {
    const reason = prompt('Укажите причину отклонения:');
    if (!reason) return;
    
    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;
      
      const updatedApprovals = (d.approvals || []).map(a => 
        String(a.userId || a.user) === String(user?.id)
          ? { ...a, status: 'rejected' as const, completedAt: new Date().toISOString(), comment: reason }
          : a
      );
      
      return {
        ...d,
        status: 'rejected' as any,
        approvals: updatedApprovals,
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'rejected',
            details: `Документ отклонён. Причина: ${reason}`,
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const handleSendToApproval = () => {
    if (!confirm('Отправить документ на согласование?')) return;
    
    const approvers = employees.filter(e => String(e.id) !== String(user?.id)).slice(0, 3);
    
    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;
      
      return {
        ...d,
        status: 'on_approval' as any,
        approvals: approvers.map((u, idx) => ({
          id: Date.now().toString() + idx,
          userId: u.id,
          status: 'waiting' as const,
          step_order: idx + 1,
          created_at: new Date().toISOString()
        })),
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'sent_to_approval',
            details: `Документ отправлен на согласование. Согласующие: ${approvers.length}`,
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const handleArchive = () => {
    if (!confirm('Архивировать документ?')) return;
    
    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;
      
      return {
        ...d,
        status: 'archived' as any,
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'archived',
            details: 'Документ перемещён в архив',
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    setDocuments(prev => prev.map(d => {
      if (String(d.id) !== String(doc.id)) return d;
      
      return {
        ...d,
        comments: [
          ...(d.comments || []),
          {
            id: Date.now().toString(),
            authorId: user?.id,
            text: commentText,
            created_at: new Date().toISOString()
          }
        ],
        history: [
          ...(d.history || []),
          {
            id: Date.now().toString(),
            userId: user?.id,
            action: 'commented',
            details: 'Добавлен комментарий',
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
    
    setCommentText('');
  };

  // Проверка прав
  const canApprove = doc.approvals?.some(a => 
    String(a.userId || a.user) === String(user?.id) && a.status === 'waiting'
  );

  const canEdit = String(doc.authorId || doc.author) === String(user?.id) && doc.status === 'draft';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/documents" className="hover:text-blue-600 flex items-center gap-1 transition">
          <ArrowLeft size={16} /> Документы
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{doc.number}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
        {/* Status Banner */}
        <div className={`h-2 bg-gradient-to-r ${statusConf.gradient}`}></div>
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConf.gradient} flex items-center justify-center shadow-lg`}>
                  <StatusIcon size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {doc.number} • {doc.type === 'incoming' ? '📥 Входящий' : doc.type === 'outgoing' ? '📤 Исходящий' : '📄 Внутренний'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <StatusIcon size={12} />
                  {statusConf.label}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                  {priorityConf.label} приоритет
                </span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  v{doc.version || 1}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {doc.status === 'draft' && (
                <button
                  onClick={handleSendToApproval}
                  className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2"
                >
                  <Send size={16} /> На согласование
                </button>
              )}
              
              {canApprove && (
                <>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition"
                  >
                    <CheckCircle2 size={16} /> Согласовать
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2 transition"
                  >
                    <XCircle size={16} /> Отклонить
                  </button>
                </>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition">
                      <Edit3 size={16} /> Редактировать
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition">
                      <Copy size={16} /> Дублировать
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition">
                      <Share2 size={16} /> Поделиться
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition">
                      <Printer size={16} /> Печать
                    </button>
                    <button
                      onClick={handleArchive}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition"
                    >
                      <Archive size={16} /> В архив
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {[
              { id: 'main', label: 'Основная информация', icon: FileText },
              { id: 'approval', label: `Согласование (${doc.approvals?.length || 0})`, icon: CheckCircle2 },
              { id: 'history', label: `История (${doc.history?.length || 0})`, icon: Clock },
              { id: 'files', label: 'Файлы', icon: Paperclip },
              { id: 'comments', label: `Комментарии (${doc.comments?.length || 0})`, icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-modern p-6">
        {/* Main Info Tab */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Реквизиты документа
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Регистрационный номер</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{doc.number}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Дата регистрации</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{fmtDateShort(doc.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Категория</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{doc.category}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Корреспондент</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{doc.correspondent || '—'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Автор</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {author?.avatar || (author?.first_name || author?.name || '?').charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {author ? `${author.first_name || author.name || ''} ${author.last_name || ''}`.trim() : '—'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Подразделение</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{author?.department || '—'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Срок исполнения</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {doc.dueDate || doc.due_date ? fmtDateShort(doc.dueDate || doc.due_date) : '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Последнее изменение</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{fmtDate(doc.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Описание</label>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{doc.description || '—'}</p>
            </div>

            {doc.tags && doc.tags.length > 0 && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Tag size={12} /> Теги
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {doc.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Approval Tab */}
        {activeTab === 'approval' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Маршрут согласования
              </h3>
              
              {(!doc.approvals || doc.approvals.length === 0) ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">Маршрут согласования не задан</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doc.approvals.map((step, idx) => {
                    const approver = employees.find(e => String(e.id) === String(step.userId || step.user));
                    return (
                      <div key={step.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {approver ? `${approver.first_name || approver.name || ''} ${approver.last_name || ''}`.trim() : 'Неизвестно'}
                          </p>
                          <p className="text-xs text-gray-500">{approver?.position || '—'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            step.status === 'approved' ? 'bg-green-100 text-green-700' :
                            step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {step.status === 'approved' ? '✓ Согласовано' :
                             step.status === 'rejected' ? '✗ Отклонено' :
                             '⏳ Ожидает'}
                          </span>
                          {step.completedAt && (
                            <p className="text-xs text-gray-400 mt-1">{fmtDateShort(step.completedAt)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {doc.approvals && doc.approvals.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                {(() => {
                  const done = doc.approvals.filter(a => a.status === 'approved').length;
                  const total = doc.approvals.length;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Прогресс согласования</span>
                        <span className="font-bold text-gray-900">{done} из {total} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              История изменений
            </h3>
            
            {(!doc.history || doc.history.length === 0) ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">История пуста</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...doc.history].reverse().map((entry, idx) => {
                  const entryUser = employees.find(e => String(e.id) === String(entry.userId || entry.user));
                  return (
                    <div key={entry.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-900">
                          <span className="font-medium">{entryUser?.first_name || entryUser?.name || 'Пользователь'}</span>
                          <span className="text-gray-500"> — {entry.details}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(entry.created_at || entry.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Paperclip size={16} className="text-purple-600" />
              Файлы документа
            </h3>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Paperclip size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{doc.fileName || doc.file_name || 'document.pdf'}</p>
                <p className="text-xs text-gray-500">{doc.fileSize || doc.file_size || 0} байт</p>
              </div>
              <button className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                <Download size={16} /> Скачать
              </button>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-green-600" />
              Комментарии
            </h3>
            
            <div className="space-y-3">
              {(doc.comments || []).map(comment => {
                const commentAuthor = employees.find(e => String(e.id) === String(comment.authorId || comment.author));
                return (
                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {commentAuthor?.avatar || (commentAuthor?.first_name || commentAuthor?.name || '?').charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">
                          {commentAuthor ? `${commentAuthor.first_name || commentAuthor.name || ''} ${commentAuthor.last_name || ''}`.trim() : 'Пользователь'}
                        </span>
                        <span className="text-[10px] text-gray-400">{fmtDate(comment.created_at || comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.avatar || '👤'}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Добавить комментарий..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
