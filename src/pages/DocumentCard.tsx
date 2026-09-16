import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, DocStatus } from '../App';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Printer, User, Calendar, Paperclip,
  ChevronRight, Save, ArrowRightLeft, Stamp
} from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, employees, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [tab, setTab] = useState<'main' | 'content' | 'workflow' | 'approval' | 'history' | 'files'>('main');

  const doc = documents.find(d => d.id === id);
  if (!doc) return <div className="p-6 text-center"><p className="text-slate-500 text-sm">Документ не найден</p><Link to="/documents" className="text-blue-600 text-xs">← К списку</Link></div>;

  const s = STATUS_MAP[doc.status];
  const author = employees.find(e => e.id === doc.authorId);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtSize = (b: number) => b >= 1e6 ? `${(b / 1e6).toFixed(1)} МБ` : `${(b / 1e3).toFixed(0)} КБ`;

  const myApproval = doc.approvals.find(a => a.userId === currentUser.id);
  const canApprove = myApproval?.status === 'waiting';

  const handleApprove = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updated = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'approved' as const, completedAt: new Date().toISOString(), comment: 'Согласовано' } : a);
      const allDone = updated.every(a => a.status === 'approved');
      return { ...d, status: allDone ? 'signed' as DocStatus : d.status, approvals: updated, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'approved', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Документ согласован' }] };
    }));
  };

  const handleReject = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const updated = d.approvals.map(a => a.userId === currentUser.id ? { ...a, status: 'rejected' as const, completedAt: new Date().toISOString(), comment: 'Отклонено' } : a);
      return { ...d, status: 'rejected' as DocStatus, approvals: updated, history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'rejected', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Документ отклонён' }] };
    }));
  };

  const handleSendToApproval = () => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== doc.id) return d;
      const approvers = employees.filter(e => e.id !== currentUser.id && e.id !== doc.authorId).slice(0, 3);
      return { ...d, status: 'on_approval' as DocStatus, approvals: approvers.map(u => ({ id: Math.random().toString(36).slice(2), userId: u.id, status: 'waiting' as const })), history: [...d.history, { id: Math.random().toString(36).slice(2), action: 'sent', userId: currentUser.id, createdAt: new Date().toISOString(), details: 'Документ отправлен на согласование' }] };
    }));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    setDocuments(prev => prev.map(d => d.id !== doc.id ? d : { ...d, comments: [...d.comments, { id: Math.random().toString(36).slice(2), authorId: currentUser.id, text: commentText, createdAt: new Date().toISOString() }] }));
    setCommentText('');
  };

  const tabs = [
    { id: 'main' as const, label: 'Основная информация' },
    { id: 'content' as const, label: 'Содержание' },
    { id: 'workflow' as const, label: 'Маршрут' },
    { id: 'approval' as const, label: `Согласование (${doc.approvals.length})` },
    { id: 'history' as const, label: `История (${doc.history.length})` },
    { id: 'files' as const, label: 'Файлы' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-300 px-3 py-2 flex items-center gap-2 flex-shrink-0">
        <Link to="/documents" className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={11} /> Документы
        </Link>
        <ChevronRight size={10} className="text-slate-400" />
        <span className="text-[11px] font-bold text-slate-800">{doc.number}</span>
        <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
        <div className="ml-auto flex items-center gap-1">
          {doc.status === 'draft' && (
            <button onClick={handleSendToApproval} className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition">
              <Send size={11} /> На согласование
            </button>
          )}
          {canApprove && (
            <>
              <button onClick={handleApprove} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition">
                <CheckCircle2 size={11} /> Согласовать
              </button>
              <button onClick={handleReject} className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[11px] font-medium transition">
                <XCircle size={11} /> Отклонить
              </button>
            </>
          )}
          <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] transition">
            <Printer size={11} /> Печать
          </button>
          <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] transition">
            <Download size={11} /> Скачать
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e8eef5] border-b border-slate-300 flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-[11px] font-medium border-r border-slate-300 transition ${
              tab === t.id ? 'bg-white text-slate-800 border-b-2 border-b-blue-600 -mb-px' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#ececec] p-3">
        <div className="bg-white border border-slate-300 rounded-sm">
          {/* Card title */}
          <div className="px-4 py-2 border-b border-slate-200 bg-gradient-to-r from-[#f8f9fb] to-white">
            <h2 className="text-[13px] font-bold text-slate-800">{doc.title}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{doc.number} от {fmtDate(doc.createdAt)} | {doc.category} | {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}</p>
          </div>

          <div className="p-4">
            {tab === 'main' && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: 'Регистрационный номер', value: doc.number },
                  { label: 'Дата регистрации', value: fmtDate(doc.createdAt) },
                  { label: 'Тип документа', value: doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний' },
                  { label: 'Категория', value: doc.category },
                  { label: 'Корреспондент', value: doc.correspondent || '—' },
                  { label: 'Автор', value: `${author?.avatar} ${author?.name}` },
                  { label: 'Подразделение', value: author?.department || '—' },
                  { label: 'Статус', value: s.label },
                  { label: 'Срок исполнения', value: doc.dueDate ? fmtDate(doc.dueDate) : '—' },
                  { label: 'Приоритет', value: doc.priority === 'critical' ? 'Критичный' : doc.priority === 'high' ? 'Высокий' : doc.priority === 'normal' ? 'Обычный' : 'Низкий' },
                  { label: 'Последнее изменение', value: fmtDate(doc.updatedAt) },
                  { label: 'Версия', value: `v${doc.version}` },
                ].map(field => (
                  <div key={field.label} className="flex items-start gap-2">
                    <label className="text-[10px] text-slate-500 w-36 flex-shrink-0 pt-0.5">{field.label}:</label>
                    <span className="text-[11px] text-slate-800 font-medium">{field.value}</span>
                  </div>
                ))}
                <div className="col-span-2 flex items-start gap-2">
                  <label className="text-[10px] text-slate-500 w-36 flex-shrink-0 pt-0.5">Краткое содержание:</label>
                  <span className="text-[11px] text-slate-800">{doc.shortDescription || '—'}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <label className="text-[10px] text-slate-500 w-36 flex-shrink-0 pt-0.5">Описание:</label>
                  <span className="text-[11px] text-slate-700 leading-relaxed">{doc.description}</span>
                </div>
                {doc.tags.length > 0 && (
                  <div className="col-span-2 flex items-start gap-2">
                    <label className="text-[10px] text-slate-500 w-36 flex-shrink-0 pt-0.5">Теги:</label>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">#{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'workflow' && (
              <div className="space-y-4">
                <div className="mb-3">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Схема бизнес-процесса</p>
                </div>
                
                {/* Visual workflow diagram */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Stage 1: Created */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        doc.status === 'draft' ? 'border-blue-500 bg-blue-100' : 'border-emerald-500 bg-emerald-100'
                      }`}>
                        <FileText size={24} className={doc.status === 'draft' ? 'text-blue-600' : 'text-emerald-600'} />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mt-2">Создан</p>
                      <p className="text-[9px] text-slate-500">{fmtDate(doc.createdAt)}</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-12 h-1 ${doc.approvals.length > 0 || doc.status !== 'draft' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                      <div className={`w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent ${
                        doc.approvals.length > 0 || doc.status !== 'draft' ? 'border-l-emerald-400' : 'border-l-slate-300'
                      }`}></div>
                    </div>

                    {/* Stage 2: Approval */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        doc.status === 'on_approval' || doc.status === 'on_signing' ? 'border-amber-500 bg-amber-100 animate-pulse' :
                        doc.status === 'signed' || doc.status === 'executed' ? 'border-emerald-500 bg-emerald-100' :
                        doc.status === 'rejected' ? 'border-red-500 bg-red-100' :
                        'border-slate-300 bg-slate-100'
                      }`}>
                        <CheckCircle2 size={24} className={
                          doc.status === 'on_approval' || doc.status === 'on_signing' ? 'text-amber-600' :
                          doc.status === 'signed' || doc.status === 'executed' ? 'text-emerald-600' :
                          doc.status === 'rejected' ? 'text-red-600' :
                          'text-slate-400'
                        } />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mt-2">Согласование</p>
                      <p className="text-[9px] text-slate-500">
                        {doc.approvals.filter(a => a.status === 'approved').length}/{doc.approvals.length}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-12 h-1 ${doc.status === 'signed' || doc.status === 'executed' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                      <div className={`w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent ${
                        doc.status === 'signed' || doc.status === 'executed' ? 'border-l-emerald-400' : 'border-l-slate-300'
                      }`}></div>
                    </div>

                    {/* Stage 3: Signed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        doc.status === 'signed' ? 'border-blue-500 bg-blue-100 animate-pulse' :
                        doc.status === 'executed' ? 'border-emerald-500 bg-emerald-100' :
                        'border-slate-300 bg-slate-100'
                      }`}>
                        <Stamp size={24} className={
                          doc.status === 'signed' ? 'text-blue-600' :
                          doc.status === 'executed' ? 'text-emerald-600' :
                          'text-slate-400'
                        } />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mt-2">Подписан</p>
                      <p className="text-[9px] text-slate-500">ЭП</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-12 h-1 ${doc.status === 'executed' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                      <div className={`w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent ${
                        doc.status === 'executed' ? 'border-l-emerald-400' : 'border-l-slate-300'
                      }`}></div>
                    </div>

                    {/* Stage 4: Executed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        doc.status === 'executed' ? 'border-emerald-500 bg-emerald-100' :
                        'border-slate-300 bg-slate-100'
                      }`}>
                        <CheckCircle2 size={24} className={
                          doc.status === 'executed' ? 'text-emerald-600' : 'text-slate-400'
                        } />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mt-2">Исполнен</p>
                      <p className="text-[9px] text-slate-500">—</p>
                    </div>
                  </div>

                  {/* Rejected branch */}
                  {doc.status === 'rejected' && (
                    <div className="mt-6 pt-4 border-t border-red-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-red-500 bg-red-100 flex items-center justify-center">
                          <XCircle size={20} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-red-700">Отклонён</p>
                          <p className="text-[9px] text-red-600">Возврат на доработку</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-[10px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-100 border-2 border-emerald-500"></div>
                    <span>Завершено</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-100 border-2 border-amber-500"></div>
                    <span>В процессе</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-300"></div>
                    <span>Ожидает</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-500"></div>
                    <span>Отклонено</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Тема документа</label>
                  <p className="text-[12px] text-slate-800 font-medium">{doc.title}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Текст документа</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 leading-relaxed min-h-[120px]">
                    {doc.description}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Резолюция</label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 italic min-h-[60px]">
                    {doc.history.find(h => h.action === 'resolution')?.details || 'Резолюция не наложена'}
                  </div>
                </div>
              </div>
            )}

            {tab === 'approval' && (
              <div>
                <div className="mb-3">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Маршрут согласования</p>
                </div>
                {doc.approvals.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-6">Маршрут согласования не задан</p>
                ) : (
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200 w-8">№</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Согласующий</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Должность</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Статус</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Дата</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-slate-500">Комментарий</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {doc.approvals.map((step, idx) => {
                        const approver = employees.find(e => e.id === step.userId);
                        return (
                          <tr key={step.id} className="hover:bg-slate-50">
                            <td className="px-2 py-1.5 text-slate-400 border-r border-slate-100">{idx + 1}</td>
                            <td className="px-2 py-1.5 text-slate-800 font-medium border-r border-slate-100">{approver?.name}</td>
                            <td className="px-2 py-1.5 text-slate-600 border-r border-slate-100">{approver?.position}</td>
                            <td className="px-2 py-1.5 border-r border-slate-100">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                                step.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                step.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {step.status === 'approved' ? '✓ Согласовано' : step.status === 'rejected' ? '✗ Отклонено' : '⏳ Ожидает'}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-slate-500 border-r border-slate-100">{step.completedAt ? fmtDate(step.completedAt) : '—'}</td>
                            <td className="px-2 py-1.5 text-slate-600">{step.comment || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {/* Progress */}
                {doc.approvals.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded">
                    {(() => {
                      const done = doc.approvals.filter(a => a.status === 'approved').length;
                      const total = doc.approvals.length;
                      const pct = Math.round((done / total) * 100);
                      return (
                        <>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-600">Прогресс согласования</span>
                            <span className="font-bold text-slate-800">{done} из {total} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {tab === 'history' && (
              <div>
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200 w-8">№</th>
                      <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Дата/время</th>
                      <th className="text-left px-2 py-1.5 font-semibold text-slate-500 border-r border-slate-200">Пользователь</th>
                      <th className="text-left px-2 py-1.5 font-semibold text-slate-500">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...doc.history].reverse().map((entry, idx) => {
                      const u = employees.find(e => e.id === entry.userId);
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50">
                          <td className="px-2 py-1.5 text-slate-400 border-r border-slate-100">{idx + 1}</td>
                          <td className="px-2 py-1.5 text-slate-600 border-r border-slate-100">{fmtDate(entry.createdAt)}</td>
                          <td className="px-2 py-1.5 text-slate-800 border-r border-slate-100">{u?.name}</td>
                          <td className="px-2 py-1.5 text-slate-700">{entry.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'files' && (
              <div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Paperclip size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium text-slate-800">{doc.fileName}</p>
                    <p className="text-[10px] text-slate-500">{fmtSize(doc.fileSize)} • v{doc.version}</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium">
                    <Download size={10} /> Скачать
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">Вложение 1 из 1</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white border border-slate-300 rounded-sm mt-3">
          <div className="px-4 py-2 border-b border-slate-200 bg-gradient-to-r from-[#f8f9fb] to-white">
            <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare size={12} /> Комментарии ({doc.comments.length})
            </p>
          </div>
          <div className="p-3 space-y-2">
            {doc.comments.map(c => {
              const a = employees.find(e => e.id === c.authorId);
              return (
                <div key={c.id} className="flex gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] flex-shrink-0">{a?.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-800">{a?.name}</span>
                      <span className="text-[9px] text-slate-400">{fmtDate(c.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">{c.text}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] flex-shrink-0">{currentUser.avatar}</div>
              <div className="flex-1">
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Добавить комментарий..." rows={2} className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px] focus:outline-none focus:border-blue-400 resize-none" />
                <div className="flex justify-end mt-1">
                  <button onClick={handleComment} disabled={!commentText.trim()} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium disabled:opacity-50">Отправить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
