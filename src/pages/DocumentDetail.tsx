import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, DocStatus } from '../App';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Send as SendIcon, User, Calendar, Tag,
  AlertCircle, ChevronRight, Paperclip, Printer, MoreHorizontal
} from 'lucide-react';

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', icon: FileText },
  pending: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  approved: { label: 'Утверждён', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', icon: FileText },
};

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, users, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'approvals'>('info');

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="text-center py-20">
        <FileText size={40} className="text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Документ не найден</p>
        <Link to="/documents" className="text-blue-600 text-sm mt-2 inline-block hover:underline">← Вернуться к документам</Link>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[doc.status];
  const author = users.find(u => u.id === doc.authorId);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const formatFileSize = (bytes: number) => bytes >= 1000000 ? `${(bytes / 1000000).toFixed(1)} МБ` : `${(bytes / 1000).toFixed(0)} КБ`;

  const handleSendToApproval = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      return {
        ...d,
        status: 'pending' as DocStatus,
        approvals: users.filter(u => u.id !== currentUser.id && u.id !== doc.authorId).slice(0, 2).map(u => ({
          id: Math.random().toString(36).substring(2, 9),
          userId: u.id,
          status: 'waiting' as const,
        })),
        history: [...d.history, {
          id: Math.random().toString(36).substring(2, 9),
          action: 'sent_to_approval',
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          details: 'Отправлен на согласование',
        }],
      };
    }));
  };

  const handleApprove = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a =>
        a.userId === currentUser.id ? { ...a, status: 'approved' as const, completedAt: new Date().toISOString(), comment: 'Согласовано' } : a
      );
      const allApproved = updatedApprovals.every(a => a.status === 'approved');
      return {
        ...d,
        status: allApproved ? 'approved' as DocStatus : d.status,
        approvals: updatedApprovals,
        history: [...d.history, {
          id: Math.random().toString(36).substring(2, 9),
          action: 'approved',
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          details: 'Согласовано',
        }],
      };
    }));
  };

  const handleReject = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a =>
        a.userId === currentUser.id ? { ...a, status: 'rejected' as const, completedAt: new Date().toISOString(), comment: 'Отклонено' } : a
      );
      return {
        ...d,
        status: 'rejected' as DocStatus,
        approvals: updatedApprovals,
        history: [...d.history, {
          id: Math.random().toString(36).substring(2, 9),
          action: 'rejected',
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          details: 'Отклонено',
        }],
      };
    }));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      return {
        ...d,
        comments: [...d.comments, {
          id: Math.random().toString(36).substring(2, 9),
          authorId: currentUser.id,
          text: commentText,
          createdAt: new Date().toISOString(),
        }],
        history: [...d.history, {
          id: Math.random().toString(36).substring(2, 9),
          action: 'commented',
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          details: 'Добавлен комментарий',
        }],
      };
    }));
    setCommentText('');
  };

  const myApproval = doc.approvals.find(a => a.userId === currentUser.id);
  const canApprove = myApproval && myApproval.status === 'waiting';

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/documents" className="hover:text-blue-600 transition flex items-center gap-1">
          <ArrowLeft size={14} /> Документы
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-medium truncate">{doc.number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Document Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConf.bg} ${statusConf.color}`}>
                      <statusConf.icon size={12} />
                      {statusConf.label}
                    </span>
                    <span className="text-xs text-slate-400">v{doc.version}</span>
                  </div>
                  <h1 className="text-lg font-bold text-slate-900">{doc.title}</h1>
                  <p className="text-sm text-slate-500 mt-1">{doc.number} • {doc.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
                    <Printer size={14} className="text-slate-500" />
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
                    <MoreHorizontal size={14} className="text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* File preview */}
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(doc.fileSize)} • {doc.fileType.split('/').pop()?.toUpperCase()}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition">
                  <Download size={12} />
                  Скачать
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Описание</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{doc.description}</p>
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {doc.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex border-b border-slate-100">
              {[
                { id: 'info' as const, label: 'Информация', icon: FileText },
                { id: 'approvals' as const, label: `Согласование (${doc.approvals.length})`, icon: CheckCircle2 },
                { id: 'history' as const, label: `История (${doc.history.length})`, icon: Clock },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-5 py-3 text-xs font-medium border-b-2 transition ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Автор', value: `${author?.avatar} ${author?.name}`, sub: author?.position },
                    { label: 'Отдел', value: author?.department || '-' },
                    { label: 'Создан', value: formatDate(doc.createdAt) },
                    { label: 'Обновлён', value: formatDate(doc.updatedAt) },
                    { label: 'Срок', value: doc.dueDate ? formatDate(doc.dueDate) : 'Не указан' },
                    { label: 'Приоритет', value: doc.priority === 'urgent' ? '🔴 Срочный' : doc.priority === 'high' ? '🟠 Высокий' : doc.priority === 'medium' ? '🔵 Средний' : '⚪ Низкий' },
                  ].map(item => (
                    <div key={item.label} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{item.value}</p>
                      {item.sub && <p className="text-[11px] text-slate-500">{item.sub}</p>}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'approvals' && (
                <div className="space-y-3">
                  {doc.approvals.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Маршрут согласования не задан</p>
                  ) : (
                    doc.approvals.map((step, idx) => {
                      const approver = users.find(u => u.id === step.userId);
                      return (
                        <div key={step.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-xs font-bold text-slate-500">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{approver?.name}</p>
                            <p className="text-[11px] text-slate-500">{approver?.position}</p>
                          </div>
                          <div className="text-right">
                            {step.status === 'waiting' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-medium">
                                <Clock size={10} /> Ожидает
                              </span>
                            )}
                            {step.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
                                <CheckCircle2 size={10} /> Согласовано
                              </span>
                            )}
                            {step.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-medium">
                                <XCircle size={10} /> Отклонено
                              </span>
                            )}
                            {step.completedAt && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(step.completedAt)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-0">
                  {[...doc.history].reverse().map((entry, idx) => {
                    const entryUser = users.find(u => u.id === entry.userId);
                    return (
                      <div key={entry.id} className="flex gap-3 pb-4 relative">
                        {idx < doc.history.length - 1 && (
                          <div className="absolute left-[13px] top-7 bottom-0 w-px bg-slate-200" />
                        )}
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 z-10">
                          <User size={12} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-900">
                            <span className="font-medium">{entryUser?.name}</span>
                            <span className="text-slate-500"> — {entry.details}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(entry.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <MessageSquare size={16} className="text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Комментарии ({doc.comments.length})</h3>
            </div>
            <div className="p-5 space-y-4">
              {doc.comments.map(comment => {
                const commentAuthor = users.find(u => u.id === comment.authorId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                      {commentAuthor?.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{commentAuthor?.name}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-700 mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Add comment */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs flex-shrink-0">
                  {currentUser.avatar}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Написать комментарий..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SendIcon size={11} /> Отправить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Действия</h3>
            
            {doc.status === 'draft' && (
              <button
                onClick={handleSendToApproval}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                <Send size={14} />
                Отправить на согласование
              </button>
            )}

            {canApprove && (
              <>
                <button
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                >
                  <CheckCircle2 size={14} />
                  Согласовать
                </button>
                <button
                  onClick={handleReject}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition"
                >
                  <XCircle size={14} />
                  Отклонить
                </button>
              </>
            )}

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">
              <Download size={14} />
              Скачать файл
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">
              <Printer size={14} />
              Печать
            </button>
          </div>

          {/* Approval progress */}
          {doc.approvals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Прогресс согласования</h3>
              <div className="space-y-2">
                {(() => {
                  const approved = doc.approvals.filter(a => a.status === 'approved').length;
                  const total = doc.approvals.length;
                  const percent = Math.round((approved / total) * 100);
                  return (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{approved} из {total} согласовано</span>
                        <span className="font-medium text-slate-900">{percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Deadline */}
          {doc.dueDate && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">Срок исполнения</span>
              </div>
              <p className="text-sm font-medium text-amber-900 mt-1">
                {new Date(doc.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
