import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, DocStatus } from '../App';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Printer, User, Calendar, Tag, Paperclip, ChevronRight
} from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', icon: FileText },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle2 },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', icon: FileText },
};

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, employees, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [tab, setTab] = useState<'main' | 'approval' | 'history'>('main');

  const doc = documents.find(d => d.id === id);
  if (!doc) return <div className="text-center py-20"><p className="text-slate-500">Документ не найден</p><Link to="/documents" className="text-blue-600 text-sm">← К списку</Link></div>;

  const s = STATUS_MAP[doc.status];
  const author = employees.find(e => e.id === doc.authorId);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtSize = (b: number) => b >= 1e6 ? `${(b / 1e6).toFixed(1)} МБ` : `${(b / 1e3).toFixed(0)} КБ`;

  const myApproval = doc.approvals.find(a => a.userId === currentUser.id);
  const canApprove = myApproval?.status === 'waiting';

  const handleApprove = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'approved' as const, completedAt: new Date().toISOString(), comment: 'Согласовано' } : a);
      const allDone = updatedApprovals.every(a => a.status === 'approved');
      return { ...d, status: allDone ? 'signed' as DocStatus : d.status, approvals: updatedApprovals, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'approved', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Согласовано' }] };
    }));
  };

  const handleReject = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'rejected' as const, completedAt: new Date().toISOString(), comment: 'Отклонено' } : a);
      return { ...d, status: 'rejected' as DocStatus, approvals: updatedApprovals, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'rejected', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Отклонено' }] };
    }));
  };

  const handleSendToApproval = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const approvers = employees.filter(e => e.id !== currentUser.id && e.id !== doc.authorId).slice(0, 3);
      return { ...d, status: 'on_approval' as DocStatus, approvals: approvers.map(u => ({ id: Math.random().toString(36).slice(2), userId: u.id, status: 'waiting' as const })), history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'sent', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Отправлен на согласование' }] };
    }));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, comments: [...d.comments, { id: Math.random().toString(36).slice(2), authorId: currentUser.id, text: commentText, createdAt: new Date().toISOString() }] }));
    setCommentText('');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/documents" className="hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={12} /> Документы</Link>
        <ChevronRight size={10} />
        <span className="text-slate-800 font-medium">{doc.number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card header */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                    <span className="text-[10px] text-slate-400">v{doc.version}</span>
                    <span className="text-[10px] text-slate-400">• {doc.type === 'incoming' ? '📥 Входящий' : doc.type === 'outgoing' ? '📤 Исходящий' : '📄 Внутренний'}</span>
                  </div>
                  <h1 className="text-base font-bold text-slate-800">{doc.title}</h1>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.number} • {doc.category}{doc.correspondent ? ` • ${doc.correspondent}` : ''}</p>
                </div>
              </div>
            </div>

            {/* File */}
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3 p-2.5 bg-white rounded border border-slate-200">
                <div className="w-9 h-9 rounded bg-blue-100 flex items-center justify-center"><Paperclip size={14} className="text-blue-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{doc.fileName}</p>
                  <p className="text-[10px] text-slate-500">{fmtSize(doc.fileSize)}</p>
                </div>
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium"><Download size={10} />Скачать</button>
              </div>
            </div>

            {/* Description */}
            <div className="p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Описание</p>
              <p className="text-xs text-slate-700 leading-relaxed">{doc.description}</p>
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {doc.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">#{t}</span>)}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex border-b border-slate-100">
              {[{ id: 'main' as const, label: 'Основные данные', icon: FileText }, { id: 'approval' as const, label: `Согласование (${doc.approvals.length})`, icon: CheckCircle2 }, { id: 'history' as const, label: `История (${doc.history.length})`, icon: Clock }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium border-b-2 transition ${tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  <t.icon size={12} />{t.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === 'main' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Автор', value: `${author?.avatar} ${author?.name}` },
                    { label: 'Подразделение', value: author?.department || '-' },
                    { label: 'Зарегистрирован', value: fmtDate(doc.createdAt) },
                    { label: 'Обновлён', value: fmtDate(doc.updatedAt) },
                    { label: 'Срок исполнения', value: doc.dueDate ? fmtDate(doc.dueDate) : 'Не указан' },
                    { label: 'Приоритет', value: doc.priority === 'critical' ? '🔴 Критичный' : doc.priority === 'high' ? '🟠 Высокий' : doc.priority === 'normal' ? '🔵 Обычный' : '⚪ Низкий' },
                  ].map(item => (
                    <div key={item.label} className="p-2.5 bg-slate-50 rounded">
                      <p className="text-[9px] text-slate-500 uppercase font-semibold">{item.label}</p>
                      <p className="text-xs font-medium text-slate-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'approval' && (
                <div className="space-y-2">
                  {doc.approvals.length === 0 ? <p className="text-xs text-slate-500 text-center py-4">Маршрут не задан</p> : doc.approvals.map((step, idx) => {
                    const approver = employees.find(e => e.id === step.userId);
                    return (
                      <div key={step.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded">
                        <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">{idx + 1}</div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-800">{approver?.name}</p>
                          <p className="text-[10px] text-slate-500">{approver?.position}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${step.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : step.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                          {step.status === 'approved' ? '✓ Согласовано' : step.status === 'rejected' ? '✗ Отклонено' : '⏳ Ожидает'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {tab === 'history' && (
                <div className="space-y-3">
                  {[...doc.history].reverse().map((entry) => {
                    const u = employees.find(e => e.id === entry.userId);
                    return (
                      <div key={entry.id} className="flex gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><User size={10} className="text-blue-600" /></div>
                        <div>
                          <p className="text-[11px] text-slate-800"><span className="font-medium">{u?.name.split(' ').slice(0, 2).join(' ')}</span> — {entry.details}</p>
                          <p className="text-[9px] text-slate-400">{fmtDate(entry.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare size={13} className="text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">Комментарии ({doc.comments.length})</span>
            </div>
            <div className="p-4 space-y-3">
              {doc.comments.map(c => {
                const a = employees.find(e => e.id === c.authorId);
                return (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs flex-shrink-0">{a?.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-800">{a?.name.split(' ').slice(0, 2).join(' ')}</span><span className="text-[9px] text-slate-400">{fmtDate(c.createdAt)}</span></div>
                      <p className="text-xs text-slate-700 mt-0.5">{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs flex-shrink-0">{currentUser.avatar}</div>
                <div className="flex-1">
                  <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Написать комментарий..." rows={2} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" />
                  <div className="flex justify-end mt-1.5">
                    <button onClick={handleComment} disabled={!commentText.trim()} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium disabled:opacity-50">Отправить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Действия</p>
            {doc.status === 'draft' && (
              <button onClick={handleSendToApproval} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition">
                <Send size={12} /> На согласование
              </button>
            )}
            {canApprove && (
              <>
                <button onClick={handleApprove} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition">
                  <CheckCircle2 size={12} /> Согласовать
                </button>
                <button onClick={handleReject} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-medium transition">
                  <XCircle size={12} /> Отклонить
                </button>
              </>
            )}
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition">
              <Download size={12} /> Скачать
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition">
              <Printer size={12} /> Печать
            </button>
          </div>

          {/* Approval progress */}
          {doc.approvals.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Прогресс</p>
              {(() => {
                const done = doc.approvals.filter(a => a.status === 'approved').length;
                const total = doc.approvals.length;
                const pct = Math.round((done / total) * 100);
                return (
                  <>
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-600">{done} из {total}</span><span className="font-medium">{pct}%</span></div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                  </>
                );
              })()}
            </div>
          )}

          {doc.dueDate && (
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-3">
              <p className="text-[10px] font-semibold text-amber-700 flex items-center gap-1"><Calendar size={10} /> Срок исполнения</p>
              <p className="text-xs font-medium text-amber-900 mt-1">{new Date(doc.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
