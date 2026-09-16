import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useRef } from 'react';
import { AppContext, DocStatus } from '../App';
import { saveFile, getDocumentFiles, downloadFile, deleteFile, formatFileSize, getFileIcon, StoredFile } from '../utils/storage';
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, Download,
  Send, MessageSquare, Printer, Calendar, Paperclip,
  ChevronRight, Stamp, Check, Clock, Upload, Trash2
} from 'lucide-react';

// Компонент вкладки файлов с реальным хранилищем
function FilesTab({ docId }: { docId: string }) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загрузка файлов при монтировании
  useState(() => {
    getDocumentFiles(docId).then(setFiles);
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await saveFile(docId, fileList[i]);
      }
      const updatedFiles = await getDocumentFiles(docId);
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Удалить файл?')) return;
    try {
      await deleteFile(fileId);
      const updatedFiles = await getDocumentFiles(docId);
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-600">Загрузка...</p>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Нажмите для загрузки файлов</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, JPG, PNG до 50 МБ</p>
          </>
        )}
      </div>

      {/* Files list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Загруженные файлы ({files.length})</h4>
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => handleDownload(file.id)}
                className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                title="Скачать"
              >
                <Download size={14} className="text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition"
                title="Удалить"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !uploading && (
        <p className="text-center text-sm text-gray-400 py-4">Файлы не загружены</p>
      )}
    </div>
  );
}

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', icon: FileText },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  on_signing: { label: 'На подписании', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', icon: FileText },
};

export default function DocumentCard() {
  const { id } = useParams<{ id: string }>();
  const { documents, setDocuments, employees, currentUser, t } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [tab, setTab] = useState<'main' | 'content' | 'workflow' | 'approval' | 'history' | 'files'>('main');

  const doc = documents.find(d => d.id === id);
  if (!doc) return <div className="p-6 text-center"><p className="text-gray-500">Документ не найден</p><Link to="/documents" className="text-blue-600 text-sm">← К списку</Link></div>;

  const statusConf = STATUS_CONFIG[doc.status];
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
    { id: 'main' as const, label: t('doc.main_info') },
    { id: 'content' as const, label: t('doc.content') },
    { id: 'workflow' as const, label: t('doc.workflow') },
    { id: 'approval' as const, label: `${t('doc.approval')} (${doc.approvals.length})` },
    { id: 'history' as const, label: `${t('doc.history')} (${doc.history.length})` },
    { id: 'files' as const, label: t('doc.files') },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/documents" className="hover:text-blue-600 flex items-center gap-1 transition">
          <ArrowLeft size={16} /> {t('docs.title')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{doc.number}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConf.bg} ${statusConf.color}`}>
                  <statusConf.icon size={16} />
                  {statusConf.label}
                </span>
                <span className="text-sm text-gray-400">v{doc.version}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h1>
              <p className="text-sm text-gray-500">{doc.number} • {doc.category}{doc.correspondent ? ` • ${doc.correspondent}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              {doc.status === 'draft' && (
                <button onClick={handleSendToApproval} className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <Send size={16} /> {t('doc.to_approval')}
                </button>
              )}
              {canApprove && (
                <>
                  <button onClick={handleApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition">
                    <CheckCircle2 size={16} /> {t('doc.approve')}
                  </button>
                  <button onClick={handleReject} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2 transition">
                    <XCircle size={16} /> {t('doc.reject')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'main' && (
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: t('doc.reg_number'), value: doc.number },
                { label: t('doc.reg_date'), value: fmtDate(doc.createdAt) },
                { label: t('doc.doc_type'), value: doc.type === 'incoming' ? t('nav.incoming') : doc.type === 'outgoing' ? t('nav.outgoing') : t('nav.internal') },
                { label: t('doc.category'), value: doc.category },
                { label: t('docs.correspondent'), value: doc.correspondent || '—' },
                { label: t('docs.author'), value: `${author?.avatar} ${author?.name}` },
                { label: t('doc.department'), value: author?.department || '—' },
                { label: t('docs.status'), value: statusConf.label },
                { label: t('doc.due_date'), value: doc.dueDate ? fmtDate(doc.dueDate) : '—' },
                { label: t('doc.priority'), value: doc.priority === 'critical' ? '🔴 ' + t('priority.critical') : doc.priority === 'high' ? '🟠 ' + t('priority.high') : doc.priority === 'normal' ? '🔵 ' + t('priority.normal') : '⚪ ' + t('priority.low') },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{field.label}</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{field.value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('doc.description')}</label>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{doc.description}</p>
              </div>
            </div>
          )}

          {tab === 'workflow' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('doc.workflow_scheme')}</h3>
                <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {[
                      { label: t('doc.created'), icon: FileText, active: true },
                      { label: t('doc.approval_stage'), icon: CheckCircle2, active: doc.status !== 'draft' },
                      { label: t('doc.signed'), icon: Stamp, active: doc.status === 'signed' || doc.status === 'executed' },
                      { label: t('doc.executed'), icon: Check, active: doc.status === 'executed' },
                    ].map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            stage.active ? 'gradient-blue' : 'bg-gray-200'
                          }`}>
                            <stage.icon size={24} className="text-white" />
                          </div>
                          <p className="text-xs font-medium text-gray-700 mt-2">{stage.label}</p>
                        </div>
                        {idx < 3 && (
                          <div className={`w-12 h-1 rounded-full ${stage.active ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'approval' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('doc.approval_route')}</h3>
              {doc.approvals.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">{t('doc.no_route')}</p>
              ) : (
                <div className="space-y-3">
                  {doc.approvals.map((step, idx) => {
                    const approver = employees.find(e => e.id === step.userId);
                    return (
                      <div key={step.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{approver?.name}</p>
                          <p className="text-xs text-gray-500">{approver?.position}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            step.status === 'approved' ? 'bg-green-100 text-green-700' :
                            step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {step.status === 'approved' ? '✓ ' + t('doc.approved') : 
                             step.status === 'rejected' ? '✗ ' + t('doc.rejected_mark') : 
                             '⏳ ' + t('doc.pending')}
                          </span>
                          {step.completedAt && (
                            <p className="text-xs text-gray-400 mt-1">{fmtDate(step.completedAt)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {doc.approvals.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  {(() => {
                    const done = doc.approvals.filter(a => a.status === 'approved').length;
                    const total = doc.approvals.length;
                    const pct = Math.round((done / total) * 100);
                    return (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 font-medium">{t('doc.approval_progress')}</span>
                          <span className="font-bold text-gray-900">{done} {t('doc.of')} {total} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div className="h-full gradient-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {tab === 'files' && <FilesTab docId={doc.id} />}
        </div>
      </div>
    </div>
  );
}
