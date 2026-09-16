import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, DocStatus } from '../App';
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Printer, User, Calendar, Paperclip,
  ChevronRight, Stamp, ArrowRight
} from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Черновик', color: 'text-[#666]', bg: 'bg-[#e8e8e8]' },
  on_approval: { label: 'На согласовании', color: 'text-[#cc6600]', bg: 'bg-[#fff3e0]' },
  on_signing: { label: 'На подписании', color: 'text-[#0066cc]', bg: 'bg-[#e3f2fd]' },
  signed: { label: 'Подписан', color: 'text-[#2e7d32]', bg: 'bg-[#e8f5e9]' },
  executed: { label: 'Исполнен', color: 'text-[#1b5e20]', bg: 'bg-[#c8e6c9]' },
  rejected: { label: 'Отклонён', color: 'text-[#c62828]', bg: 'bg-[#ffebee]' },
  archived: { label: 'В архиве', color: 'text-[#666]', bg: 'bg-[#f5f5f5]' },
};

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, employees, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [tab, setTab] = useState<'main' | 'content' | 'workflow' | 'approval' | 'history' | 'files'>('main');

  const doc = documents.find(d => d.id === id);
  if (!doc) return <div className="p-6 text-center"><p className="text-[#888] text-[11px]">Документ не найден</p><Link to="/documents" className="text-[#0066cc] text-[10px]">← К списку</Link></div>;

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
      <div className="bg-white border-b border-[#aaa] px-2 py-1 flex items-center gap-2 flex-shrink-0">
        <Link to="/documents" className="text-[10px] text-[#0066cc] hover:underline flex items-center gap-0.5">
          <ArrowLeft size={10} /> Документы
        </Link>
        <ChevronRight size={9} className="text-[#888]" />
        <span className="text-[10px] font-bold text-[#333]">{doc.number}</span>
        <span className={`ml-1 px-1 py-0.5 rounded-sm text-[8px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
        <div className="ml-auto flex items-center gap-1">
          {doc.status === 'draft' && (
            <button onClick={handleSendToApproval} className="flex items-center gap-0.5 px-2 py-0.5 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm text-[10px] font-medium border border-[#004499]">
              <Send size={9} /> На согласование
            </button>
          )}
          {canApprove && (
            <>
              <button onClick={handleApprove} className="flex items-center gap-0.5 px-2 py-0.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white rounded-sm text-[10px] font-medium border border-[#1b5e20]">
                <CheckCircle2 size={9} /> Согласовать
              </button>
              <button onClick={handleReject} className="flex items-center gap-0.5 px-2 py-0.5 bg-[#ffebee] hover:bg-[#ffcdd2] text-[#c62828] border border-[#ef9a9a] rounded-sm text-[10px] font-medium">
                <XCircle size={9} /> Отклонить
              </button>
            </>
          )}
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#333] rounded-sm text-[10px] border border-[#aaa]">
            <Printer size={9} /> Печать
          </button>
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#333] rounded-sm text-[10px] border border-[#aaa]">
            <Download size={9} /> Скачать
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e8e8e8] border-b border-[#aaa] flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-2.5 py-1 text-[10px] font-medium border-r border-[#bbb] transition ${
              tab === t.id ? 'bg-white text-[#333] border-b-2 border-b-[#0066cc] -mb-px' : 'text-[#555] hover:bg-[#f0f0f0]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#ece9e0] p-2">
        <div className="bg-white border border-[#aaa] shadow-sm">
          {/* Card title */}
          <div className="px-3 py-1.5 border-b border-[#aaa] bg-gradient-to-r from-[#f8f9fb] to-white">
            <h2 className="text-[12px] font-bold text-[#333]">{doc.title}</h2>
            <p className="text-[9px] text-[#666] mt-0.5">{doc.number} от {fmtDate(doc.createdAt)} | {doc.category} | {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}</p>
          </div>

          <div className="p-3">
            {tab === 'main' && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                  <div key={field.label} className="flex items-start gap-1.5">
                    <label className="text-[9px] text-[#666] w-32 flex-shrink-0 pt-0.5 font-medium">{field.label}:</label>
                    <span className="text-[10px] text-[#333] font-medium">{field.value}</span>
                  </div>
                ))}
                <div className="col-span-2 flex items-start gap-1.5">
                  <label className="text-[9px] text-[#666] w-32 flex-shrink-0 pt-0.5 font-medium">Описание:</label>
                  <span className="text-[10px] text-[#555] leading-relaxed">{doc.description}</span>
                </div>
                {doc.tags.length > 0 && (
                  <div className="col-span-2 flex items-start gap-1.5">
                    <label className="text-[9px] text-[#666] w-32 flex-shrink-0 pt-0.5 font-medium">Теги:</label>
                    <div className="flex flex-wrap gap-0.5">
                      {doc.tags.map(t => <span key={t} className="px-1 py-0.5 bg-[#f0f0f0] border border-[#ccc] rounded-sm text-[9px] text-[#555]">#{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'content' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-[#666] uppercase font-bold block mb-0.5">Тема документа</label>
                  <p className="text-[11px] text-[#333] font-medium">{doc.title}</p>
                </div>
                <div>
                  <label className="text-[9px] text-[#666] uppercase font-bold block mb-0.5">Текст документа</label>
                  <div className="p-2 bg-[#f9f9f9] border border-[#ccc] rounded-sm text-[10px] text-[#555] leading-relaxed min-h-[100px]">
                    {doc.description}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-[#666] uppercase font-bold block mb-0.5">Резолюция</label>
                  <div className="p-2 bg-[#fff8e1] border border-[#ffe082] rounded-sm text-[10px] text-[#cc6600] italic min-h-[50px]">
                    {doc.history.find(h => h.action === 'resolution')?.details || 'Резолюция не наложена'}
                  </div>
                </div>
              </div>
            )}

            {tab === 'workflow' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-[#666] uppercase font-bold block mb-2">Схема бизнес-процесса</label>
                </div>
                
                {/* Visual workflow diagram */}
                <div className="p-4 bg-gradient-to-br from-[#f8f9fb] to-[#e8eef5] border border-[#ccc] rounded-sm">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    {/* Stage 1: Created */}
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center ${
                        doc.status === 'draft' ? 'border-[#0066cc] bg-[#e3f2fd]' : 'border-[#2e7d32] bg-[#e8f5e9]'
                      }`}>
                        <FileText size={20} className={doc.status === 'draft' ? 'text-[#0066cc]' : 'text-[#2e7d32]'} />
                      </div>
                      <p className="text-[9px] font-bold text-[#333] mt-1">Создан</p>
                      <p className="text-[8px] text-[#666]">{fmtDate(doc.createdAt)}</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-10 h-0.5 ${doc.approvals.length > 0 || doc.status !== 'draft' ? 'bg-[#2e7d32]' : 'bg-[#ccc]'}`}></div>
                      <div className={`w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent ${
                        doc.approvals.length > 0 || doc.status !== 'draft' ? 'border-l-[#2e7d32]' : 'border-l-[#ccc]'
                      }`}></div>
                    </div>

                    {/* Stage 2: Approval */}
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center ${
                        doc.status === 'on_approval' || doc.status === 'on_signing' ? 'border-[#cc6600] bg-[#fff3e0] animate-pulse' :
                        doc.status === 'signed' || doc.status === 'executed' ? 'border-[#2e7d32] bg-[#e8f5e9]' :
                        doc.status === 'rejected' ? 'border-[#c62828] bg-[#ffebee]' :
                        'border-[#ccc] bg-[#f5f5f5]'
                      }`}>
                        <CheckCircle2 size={20} className={
                          doc.status === 'on_approval' || doc.status === 'on_signing' ? 'text-[#cc6600]' :
                          doc.status === 'signed' || doc.status === 'executed' ? 'text-[#2e7d32]' :
                          doc.status === 'rejected' ? 'text-[#c62828]' :
                          'text-[#999]'
                        } />
                      </div>
                      <p className="text-[9px] font-bold text-[#333] mt-1">Согласование</p>
                      <p className="text-[8px] text-[#666]">
                        {doc.approvals.filter(a => a.status === 'approved').length}/{doc.approvals.length}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-10 h-0.5 ${doc.status === 'signed' || doc.status === 'executed' ? 'bg-[#2e7d32]' : 'bg-[#ccc]'}`}></div>
                      <div className={`w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent ${
                        doc.status === 'signed' || doc.status === 'executed' ? 'border-l-[#2e7d32]' : 'border-l-[#ccc]'
                      }`}></div>
                    </div>

                    {/* Stage 3: Signed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center ${
                        doc.status === 'signed' ? 'border-[#0066cc] bg-[#e3f2fd] animate-pulse' :
                        doc.status === 'executed' ? 'border-[#2e7d32] bg-[#e8f5e9]' :
                        'border-[#ccc] bg-[#f5f5f5]'
                      }`}>
                        <Stamp size={20} className={
                          doc.status === 'signed' ? 'text-[#0066cc]' :
                          doc.status === 'executed' ? 'text-[#2e7d32]' :
                          'text-[#999]'
                        } />
                      </div>
                      <p className="text-[9px] font-bold text-[#333] mt-1">Подписан</p>
                      <p className="text-[8px] text-[#666]">ЭП</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className={`w-10 h-0.5 ${doc.status === 'executed' ? 'bg-[#2e7d32]' : 'bg-[#ccc]'}`}></div>
                      <div className={`w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent ${
                        doc.status === 'executed' ? 'border-l-[#2e7d32]' : 'border-l-[#ccc]'
                      }`}></div>
                    </div>

                    {/* Stage 4: Executed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center ${
                        doc.status === 'executed' ? 'border-[#2e7d32] bg-[#e8f5e9]' :
                        'border-[#ccc] bg-[#f5f5f5]'
                      }`}>
                        <CheckCircle2 size={20} className={
                          doc.status === 'executed' ? 'text-[#2e7d32]' : 'text-[#999]'
                        } />
                      </div>
                      <p className="text-[9px] font-bold text-[#333] mt-1">Исполнен</p>
                      <p className="text-[8px] text-[#666]">—</p>
                    </div>
                  </div>

                  {/* Rejected branch */}
                  {doc.status === 'rejected' && (
                    <div className="mt-4 pt-3 border-t border-[#ef9a9a]">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full border-3 border-[#c62828] bg-[#ffebee] flex items-center justify-center">
                          <XCircle size={16} className="text-[#c62828]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#c62828]">Отклонён</p>
                          <p className="text-[8px] text-[#c62828]">Возврат на доработку</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[9px] text-[#555]">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e8f5e9] border-2 border-[#2e7d32]"></div>
                    <span>Завершено</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#fff3e0] border-2 border-[#cc6600]"></div>
                    <span>В процессе</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f5f5f5] border-2 border-[#ccc]"></div>
                    <span>Ожидает</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffebee] border-2 border-[#c62828]"></div>
                    <span>Отклонено</span>
                  </div>
                </div>
              </div>
            )}

            {tab === 'approval' && (
              <div>
                <label className="text-[9px] text-[#666] uppercase font-bold block mb-2">Маршрут согласования</label>
                {doc.approvals.length === 0 ? (
                  <p className="text-[10px] text-[#888] text-center py-4">Маршрут согласования не задан</p>
                ) : (
                  <table className="w-full text-[10px] border-collapse border border-[#ccc]">
                    <thead>
                      <tr className="bg-[#e8eef5] border-b border-[#aaa]">
                        <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-6">№</th>
                        <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Согласующий</th>
                        <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Должность</th>
                        <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-20">Статус</th>
                        <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-24">Дата</th>
                        <th className="text-left px-1.5 py-1 font-bold text-[#333]">Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.approvals.map((step, idx) => {
                        const approver = employees.find(e => e.id === step.userId);
                        return (
                          <tr key={step.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-[#eee]`}>
                            <td className="px-1.5 py-1 text-[#888] border-r border-[#eee]">{idx + 1}</td>
                            <td className="px-1.5 py-1 text-[#333] font-medium border-r border-[#eee]">{approver?.name}</td>
                            <td className="px-1.5 py-1 text-[#555] border-r border-[#eee]">{approver?.position}</td>
                            <td className="px-1.5 py-1 border-r border-[#eee]">
                              <span className={`px-1 py-0.5 rounded-sm text-[8px] font-medium ${
                                step.status === 'approved' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                                step.status === 'rejected' ? 'bg-[#ffebee] text-[#c62828]' :
                                'bg-[#fff3e0] text-[#cc6600]'
                              }`}>
                                {step.status === 'approved' ? '✓ Согласовано' : step.status === 'rejected' ? '✗ Отклонено' : '⏳ Ожидает'}
                              </span>
                            </td>
                            <td className="px-1.5 py-1 text-[#555] border-r border-[#eee]">{step.completedAt ? fmtDate(step.completedAt) : '—'}</td>
                            <td className="px-1.5 py-1 text-[#555]">{step.comment || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {/* Progress */}
                {doc.approvals.length > 0 && (
                  <div className="mt-3 p-2 bg-[#f9f9f9] border border-[#ccc] rounded-sm">
                    {(() => {
                      const done = doc.approvals.filter(a => a.status === 'approved').length;
                      const total = doc.approvals.length;
                      const pct = Math.round((done / total) * 100);
                      return (
                        <>
                          <div className="flex justify-between text-[9px] mb-1">
                            <span className="text-[#555] font-medium">Прогресс согласования</span>
                            <span className="font-bold text-[#333]">{done} из {total} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-[#e0e0e0] rounded-sm overflow-hidden border border-[#ccc]">
                            <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#2e7d32] rounded-sm" style={{ width: `${pct}%` }} />
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
                <label className="text-[9px] text-[#666] uppercase font-bold block mb-2">История изменений</label>
                <table className="w-full text-[10px] border-collapse border border-[#ccc]">
                  <thead>
                    <tr className="bg-[#e8eef5] border-b border-[#aaa]">
                      <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-6">№</th>
                      <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-32">Дата/время</th>
                      <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Пользователь</th>
                      <th className="text-left px-1.5 py-1 font-bold text-[#333]">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...doc.history].reverse().map((entry, idx) => {
                      const u = employees.find(e => e.id === entry.userId);
                      return (
                        <tr key={entry.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-[#eee]`}>
                          <td className="px-1.5 py-1 text-[#888] border-r border-[#eee]">{idx + 1}</td>
                          <td className="px-1.5 py-1 text-[#555] border-r border-[#eee]">{fmtDate(entry.createdAt)}</td>
                          <td className="px-1.5 py-1 text-[#333] border-r border-[#eee]">{u?.name}</td>
                          <td className="px-1.5 py-1 text-[#555]">{entry.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'files' && (
              <div>
                <label className="text-[9px] text-[#666] uppercase font-bold block mb-2">Вложения</label>
                <div className="flex items-center gap-2 p-2 bg-[#f9f9f9] border border-[#ccc] rounded-sm">
                  <div className="w-8 h-8 rounded-sm bg-[#e3f2fd] flex items-center justify-center flex-shrink-0 border border-[#bbdefb]">
                    <Paperclip size={14} className="text-[#0066cc]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-[#333]">{doc.fileName}</p>
                    <p className="text-[9px] text-[#666]">{fmtSize(doc.fileSize)} • v{doc.version}</p>
                  </div>
                  <button className="flex items-center gap-0.5 px-2 py-1 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm text-[9px] font-medium border border-[#004499]">
                    <Download size={9} /> Скачать
                  </button>
                </div>
                <p className="text-[9px] text-[#888] mt-1 text-center">Вложение 1 из 1</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white border border-[#aaa] shadow-sm mt-2">
          <div className="px-3 py-1 border-b border-[#aaa] bg-gradient-to-r from-[#f8f9fb] to-white">
            <p className="text-[10px] font-bold text-[#333] flex items-center gap-1">
              <MessageSquare size={10} /> Комментарии ({doc.comments.length})
            </p>
          </div>
          <div className="p-2 space-y-1.5">
            {doc.comments.map(c => {
              const a = employees.find(e => e.id === c.authorId);
              return (
                <div key={c.id} className="flex gap-1.5 p-1.5 bg-[#f9f9f9] rounded-sm border border-[#eee]">
                  <div className="w-5 h-5 rounded-sm bg-[#e0e0e0] flex items-center justify-center text-[9px] flex-shrink-0 border border-[#ccc]">{a?.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-[#333]">{a?.name}</span>
                      <span className="text-[8px] text-[#888]">{fmtDate(c.createdAt)}</span>
                    </div>
                    <p className="text-[10px] text-[#555] mt-0.5">{c.text}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-1.5 pt-1.5 border-t border-[#eee]">
              <div className="w-5 h-5 rounded-sm bg-[#e3f2fd] flex items-center justify-center text-[9px] flex-shrink-0 border border-[#bbdefb]">{currentUser.avatar}</div>
              <div className="flex-1">
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Добавить комментарий..." rows={2} className="w-full px-1.5 py-1 bg-white border border-[#aaa] rounded-sm text-[10px] focus:outline-none focus:border-[#0066cc] resize-none" />
                <div className="flex justify-end mt-1">
                  <button onClick={handleComment} disabled={!commentText.trim()} className="px-2 py-0.5 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm text-[9px] font-medium border border-[#004499] disabled:opacity-50">Отправить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
