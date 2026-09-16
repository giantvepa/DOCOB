import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, DocStatus } from '../App';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Printer, User, Calendar, Tag, Paperclip,
  ChevronRight, GitBranch, Eye, PenTool, Stamp, ArrowUpCircle,
  AlertCircle, Link2, History, FileCheck
} from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string; icon: any; border: string }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', icon: FileText, border: 'border-slate-300' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock, border: 'border-amber-300' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50', icon: PenTool, border: 'border-blue-300' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: Stamp, border: 'border-emerald-300' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2, border: 'border-green-300' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle, border: 'border-red-300' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', icon: FileText, border: 'border-slate-300' },
};

// Process stages for visual scheme
const PROCESS_STAGES = [
  { id: 'created', label: 'Создание', icon: FileText },
  { id: 'approval', label: 'Согласование', icon: CheckCircle2 },
  { id: 'signing', label: 'Подписание', icon: PenTool },
  { id: 'reading', label: 'Ознакомление', icon: Eye },
  { id: 'executed', label: 'Исполнение', icon: ArrowUpCircle },
];

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, employees, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  const [tab, setTab] = useState<'main' | 'approval' | 'process' | 'history' | 'related'>('main');

  const doc = documents.find(d => d.id === id);
  if (!doc) return <div className="text-center py-20"><p className="text-slate-500">Документ не найден</p><Link to="/documents" className="text-blue-600 text-sm">← К списку</Link></div>;

  const s = STATUS_MAP[doc.status];
  const author = employees.find(e => e.id === doc.authorId);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtSize = (b: number) => b >= 1e6 ? `${(b / 1e6).toFixed(1)} МБ` : `${(b / 1e3).toFixed(0)} КБ`;

  const myApproval = doc.approvals.find(a => a.userId === currentUser.id);
  const canApprove = myApproval?.status === 'waiting';

  // Determine current process stage
  const getCurrentStage = () => {
    if (doc.status === 'draft') return 'created';
    if (doc.status === 'on_approval') return 'approval';
    if (doc.status === 'on_signing') return 'signing';
    if (doc.status === 'signed') return 'reading';
    if (doc.status === 'executed') return 'executed';
    if (doc.status === 'rejected') return 'approval';
    return 'created';
  };
  const currentStage = getCurrentStage();

  const handleApprove = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'approved' as const, completedAt: new Date().toISOString(), comment: 'Согласовано' } : a);
      const allDone = updatedApprovals.every(a => a.status === 'approved');
      return { ...d, status: allDone ? 'on_signing' as DocStatus : d.status, approvals: updatedApprovals, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'approved', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Согласовано' }] };
    }));
  };

  const handleReject = () => {
    const reason = prompt('Укажите причину отклонения:');
    if (!reason) return;
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updatedApprovals = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'rejected' as const, completedAt: new Date().toISOString(), comment: reason } : a);
      return { ...d, status: 'rejected' as DocStatus, approvals: updatedApprovals, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'rejected', userId: currentUser.id, createdAt: new Date().toISOString(), details: `Отклонено: ${reason}` }] };
    }));
  };

  const handleSendToApproval = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const approvers = employees.filter(e => e.id !== currentUser.id && e.id !== doc.authorId).slice(0, 3);
      return { ...d, status: 'on_approval' as DocStatus, approvals: approvers.map(u => ({ id: Math.random().toString(36).slice(2), userId: u.id, status: 'waiting' as const })), history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'sent', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Отправлен на согласование' }] };
    }));
  };

  const handleSign = () => {
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, status: 'signed' as DocStatus, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'signed', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Подписано электронной подписью' }] }));
  };

  const handleFamiliarize = () => {
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, status: 'executed' as DocStatus, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'familiarized', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Ознакомлен с документом' }] }));
  };

  const handleResolution = () => {
    if (!resolutionText.trim()) return;
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'resolution', userId: currentUser.id, createdAt: new Date().toISOString(), details: `Резолюция: ${resolutionText}` }] }));
    setResolutionText('');
    setShowResolution(false);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, comments: [...d.comments, { id: Math.random().toString(36).slice(2), authorId: currentUser.id, text: commentText, createdAt: new Date().toISOString() }] }));
    setCommentText('');
  };

  const relatedDocs = documents.filter(d => doc.relatedIds.includes(d.id));

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/documents" className="hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={12} /> Документы</Link>
        <ChevronRight size={10} />
        <span className="text-slate-800 font-medium">{doc.number}</span>
      </div>

      {/* Document Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2a5a8c] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <s.icon size={18} className="text-white/80" />
            <div>
              <h1 className="text-sm font-bold text-white">{doc.title}</h1>
              <p className="text-[10px] text-blue-200/80 mt-0.5">{doc.number} от {fmtDateShort(doc.createdAt)} • {doc.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white border border-white/30`}>{s.label}</span>
            <span className="text-[10px] text-blue-200/60">v{doc.version}</span>
          </div>
        </div>

        {/* Process stages visual */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {PROCESS_STAGES.map((stage, idx) => {
              const stageOrder = ['created', 'approval', 'signing', 'reading', 'executed'];
              const currentIdx = stageOrder.indexOf(currentStage);
              const stageIdx = stageOrder.indexOf(stage.id);
              const isCompleted = stageIdx < currentIdx || (doc.status === 'rejected' && stageIdx < currentIdx);
              const isCurrent = stage.id === currentStage;
              const isRejected = doc.status === 'rejected' && stage.id === 'approval';

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                      isRejected ? 'bg-red-500 border-red-500 text-white' :
                      isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                      isCurrent ? 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100' :
                      'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isRejected ? <XCircle size={14} /> : isCompleted ? <CheckCircle2 size={14} /> : <stage.icon size={13} />}
                    </div>
                    <span className={`text-[9px] mt-1 font-medium text-center ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {idx < PROCESS_STAGES.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${stageIdx < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration card fields */}
        <div className="p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Рег. номер', value: doc.number },
              { label: 'Дата регистрации', value: fmtDateShort(doc.createdAt) },
              { label: 'Тип документа', value: doc.type === 'incoming' ? '📥 Входящий' : doc.type === 'outgoing' ? '📤 Исходящий' : '📄 Внутренний' },
              { label: 'Вид документа', value: doc.category },
              { label: 'Автор', value: `${author?.avatar} ${author?.name}` },
              { label: 'Подразделение', value: author?.department || '-' },
              { label: 'Корреспондент', value: doc.correspondent || '—' },
              { label: 'Краткое содержание', value: doc.shortDescription || '—' },
              { label: 'Срок исполнения', value: doc.dueDate ? fmtDateShort(doc.dueDate) : '—' },
              { label: 'Приоритет', value: doc.priority === 'critical' ? '🔴 Критичный' : doc.priority === 'high' ? '🟠 Высокий' : doc.priority === 'normal' ? '🔵 Обычный' : '⚪ Низкий' },
              { label: 'Последнее изменение', value: fmtDate(doc.updatedAt) },
              { label: 'Версия', value: `v${doc.version}` },
            ].map(field => (
              <div key={field.label} className="border border-slate-200 rounded px-2.5 py-1.5">
                <p className="text-[9px] text-slate-500 uppercase font-semibold leading-tight">{field.label}</p>
                <p className="text-[11px] font-medium text-slate-800 mt-0.5 truncate">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* File + Description */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0"><Paperclip size={16} className="text-blue-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{doc.fileName}</p>
                  <p className="text-[10px] text-slate-500">{fmtSize(doc.fileSize)} • {doc.fileName.split('.').pop()?.toUpperCase()}</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium"><Download size={10} />Скачать</button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Описание / Краткое содержание</p>
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
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {[
                { id: 'main' as const, label: 'Карточка', icon: FileText },
                { id: 'approval' as const, label: `Согласование (${doc.approvals.length})`, icon: CheckCircle2 },
                { id: 'process' as const, label: 'Бизнес-процесс', icon: GitBranch },
                { id: 'history' as const, label: `Журнал (${doc.history.length})`, icon: History },
                { id: 'related' as const, label: `Связанные (${relatedDocs.length})`, icon: Link2 },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium border-b-2 transition whitespace-nowrap ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  <t.icon size={12} />{t.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === 'main' && (
                <div className="space-y-4">
                  {/* Resolution */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Stamp size={10} />Резолюции</p>
                      {currentUser.role === 'admin' && (
                        <button onClick={() => setShowResolution(!showResolution)} className="text-[10px] text-blue-600 hover:underline">+ Добавить</button>
                      )}
                    </div>
                    {showResolution && (
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={resolutionText} onChange={(e) => setResolutionText(e.target.value)} placeholder="Текст резолюции..." className="flex-1 h-8 px-2.5 bg-amber-50 border border-amber-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                        <button onClick={handleResolution} className="px-3 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-medium">Наложить</button>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {doc.history.filter(h => h.action === 'resolution').map(r => {
                        const u = employees.find(e => e.id === r.userId);
                        return (
                          <div key={r.id} className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Stamp size={10} className="text-amber-600" />
                              <span className="font-semibold text-amber-800">{u?.name.split(' ').slice(0, 2).join(' ')}</span>
                              <span className="text-[9px] text-amber-600">{fmtDate(r.createdAt)}</span>
                            </div>
                            <p className="text-amber-900 italic">{r.details.replace('Резолюция: ', '')}</p>
                          </div>
                        );
                      })}
                      {doc.history.filter(h => h.action === 'resolution').length === 0 && (
                        <p className="text-[10px] text-slate-400 italic">Резолюции не наложены</p>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MessageSquare size={10} />Комментарии ({doc.comments.length})</p>
                    <div className="space-y-2">
                      {doc.comments.map(c => {
                        const a = employees.find(e => e.id === c.authorId);
                        return (
                          <div key={c.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] flex-shrink-0">{a?.avatar}</div>
                            <div className="flex-1 bg-slate-50 rounded p-2">
                              <div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-slate-800">{a?.name.split(' ').slice(0, 2).join(' ')}</span><span className="text-[9px] text-slate-400">{fmtDate(c.createdAt)}</span></div>
                              <p className="text-[11px] text-slate-700 mt-0.5">{c.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] flex-shrink-0">{currentUser.avatar}</div>
                      <div className="flex-1">
                        <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Добавить комментарий..." rows={2} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" />
                        <div className="flex justify-end mt-1">
                          <button onClick={handleComment} disabled={!commentText.trim()} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium disabled:opacity-50">Отправить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'approval' && (
                <div className="space-y-2">
                  {doc.approvals.length === 0 ? <p className="text-xs text-slate-500 text-center py-4">Маршрут согласования не задан</p> : doc.approvals.map((step, idx) => {
                    const approver = employees.find(e => e.id === step.userId);
                    return (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded border ${step.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : step.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="w-7 h-7 rounded-full bg-white border-2 border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {step.status === 'approved' ? '✓' : step.status === 'rejected' ? '✗' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-800">{approver?.name}</p>
                          <p className="text-[10px] text-slate-500">{approver?.position} • {approver?.department}</p>
                          {step.comment && <p className="text-[10px] text-slate-600 italic mt-0.5">«{step.comment}»</p>}
                        </div>
                        <div className="text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${step.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : step.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {step.status === 'approved' ? 'Согласовано' : step.status === 'rejected' ? 'Отклонено' : 'Ожидает'}
                          </span>
                          {step.completedAt && <p className="text-[9px] text-slate-400 mt-0.5">{fmtDateShort(step.completedAt)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'process' && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Схема бизнес-процесса</p>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="space-y-3">
                      {PROCESS_STAGES.map((stage, idx) => {
                        const stageOrder = ['created', 'approval', 'signing', 'reading', 'executed'];
                        const currentIdx = stageOrder.indexOf(currentStage);
                        const stageIdx = stageOrder.indexOf(stage.id);
                        const isCompleted = stageIdx < currentIdx;
                        const isCurrent = stage.id === currentStage;
                        const isRejected = doc.status === 'rejected' && stage.id === 'approval';

                        return (
                          <div key={stage.id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isRejected ? 'bg-red-500 text-white' :
                                isCompleted ? 'bg-emerald-500 text-white' :
                                isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-100' :
                                'bg-white border-2 border-slate-300 text-slate-400'
                              }`}>
                                {isRejected ? <XCircle size={14} /> : <stage.icon size={14} />}
                              </div>
                              {idx < PROCESS_STAGES.length - 1 && <div className={`w-0.5 h-6 ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>{stage.label}</p>
                              {isCurrent && <p className="text-[10px] text-blue-500 mt-0.5">← Текущий этап</p>}
                              {isCompleted && <p className="text-[10px] text-emerald-500 mt-0.5">Завершён</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'history' && (
                <div className="space-y-2">
                  {[...doc.history].reverse().map((entry) => {
                    const u = employees.find(e => e.id === entry.userId);
                    const isResolution = entry.action === 'resolution';
                    return (
                      <div key={entry.id} className={`flex gap-2.5 p-2 rounded ${isResolution ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isResolution ? 'bg-amber-200' : 'bg-blue-100'}`}>
                          {isResolution ? <Stamp size={10} className="text-amber-700" /> : <User size={10} className="text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] text-slate-800"><span className="font-medium">{u?.name.split(' ').slice(0, 2).join(' ')}</span></p>
                          <p className="text-[10px] text-slate-600">{entry.details}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{fmtDate(entry.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'related' && (
                <div>
                  {relatedDocs.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Нет связанных документов</p>
                  ) : (
                    <div className="space-y-2">
                      {relatedDocs.map(rd => {
                        const rs = STATUS_MAP[rd.status];
                        return (
                          <Link key={rd.id} to={`/documents/${rd.id}`} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition">
                            <rs.icon size={14} className={rs.color} />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-slate-800">{rd.title}</p>
                              <p className="text-[10px] text-slate-500">{rd.number} • {rd.category}</p>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${rs.bg} ${rs.color}`}>{rs.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Действия с документом</p>

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
            {doc.status === 'on_signing' && (
              <button onClick={handleSign} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition">
                <Stamp size={12} /> Подписать ЭП
              </button>
            )}
            {doc.status === 'signed' && (
              <button onClick={handleFamiliarize} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition">
                <Eye size={12} /> Ознакомиться
              </button>
            )}
            {currentUser.role === 'admin' && doc.status !== 'draft' && (
              <button onClick={() => setShowResolution(true)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs font-medium transition">
                <Stamp size={12} /> Наложить резолюцию
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition">
                <Download size={11} /> Скачать файл
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition">
                <Printer size={11} /> Печать
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-medium transition">
                <FileCheck size={11} /> Печатная форма
              </button>
            </div>
          </div>

          {/* Approval progress */}
          {doc.approvals.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Прогресс согласования</p>
              {(() => {
                const done = doc.approvals.filter(a => a.status === 'approved').length;
                const total = doc.approvals.length;
                const pct = Math.round((done / total) * 100);
                return (
                  <>
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-600">{done} из {total} согласовано</span><span className="font-bold text-slate-800">{pct}%</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Deadline warning */}
          {doc.dueDate && (
            <div className={`rounded-lg border p-3 ${new Date(doc.dueDate) < new Date() ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-[10px] font-semibold flex items-center gap-1 ${new Date(doc.dueDate) < new Date() ? 'text-red-700' : 'text-amber-700'}`}>
                <AlertCircle size={10} /> {new Date(doc.dueDate) < new Date() ? 'Срок просрочен!' : 'Срок исполнения'}
              </p>
              <p className={`text-xs font-medium mt-0.5 ${new Date(doc.dueDate) < new Date() ? 'text-red-900' : 'text-amber-900'}`}>
                {fmtDateShort(doc.dueDate)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
