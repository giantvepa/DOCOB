import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, DocStatus } from '../App';
import { FileText, Clock, CheckCircle2, XCircle, AlertTriangle, TrendingUp, ArrowRight, Calendar } from 'lucide-react';

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', icon: FileText },
  pending: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  approved: { label: 'Утверждён', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', icon: FileText },
};

export default function Dashboard() {
  const { documents, currentUser } = useContext(AppContext);

  const stats = {
    total: documents.length,
    draft: documents.filter(d => d.status === 'draft').length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  
  const urgentDocs = documents.filter(d => d.priority === 'urgent' || d.priority === 'high').filter(d => d.status !== 'approved' && d.status !== 'archived');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} МБ`;
    return `${(bytes / 1000).toFixed(0)} КБ`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Добро пожаловать, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500 mt-1">Обзор системы электронного документооборота</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          <FileText size={16} />
          Создать документ
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Всего', value: stats.total, icon: FileText, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' },
          { label: 'Черновики', value: stats.draft, icon: FileText, color: 'from-slate-400 to-slate-500', textColor: 'text-slate-600' },
          { label: 'На согласовании', value: stats.pending, icon: Clock, color: 'from-amber-400 to-amber-500', textColor: 'text-amber-600' },
          { label: 'Утверждено', value: stats.approved, icon: CheckCircle2, color: 'from-emerald-400 to-emerald-500', textColor: 'text-emerald-600' },
          { label: 'Отклонено', value: stats.rejected, icon: XCircle, color: 'from-red-400 to-red-500', textColor: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-bold mt-3 text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Последние документы</h2>
            <Link to="/documents" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Все документы <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDocs.map(doc => {
              const statusConf = STATUS_CONFIG[doc.status];
              return (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
                  <div className={`w-10 h-10 rounded-lg ${statusConf.bg} flex items-center justify-center flex-shrink-0`}>
                    <statusConf.icon size={18} className={statusConf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.number} • {doc.category} • {formatFileSize(doc.fileSize)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:block">{formatDate(doc.updatedAt)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Urgent / Attention */}
        <div className="space-y-4">
          {/* Urgent docs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">Требуют внимания</h2>
            </div>
            <div className="p-3 space-y-2">
              {urgentDocs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Нет срочных документов</p>
              ) : (
                urgentDocs.slice(0, 4).map(doc => (
                  <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">{doc.title}</p>
                      <p className="text-[10px] text-slate-500">{doc.number}</p>
                    </div>
                    {doc.dueDate && (
                      <span className="text-[10px] text-red-500 flex items-center gap-0.5 flex-shrink-0">
                        <Calendar size={10} />
                        {new Date(doc.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Быстрые действия</h2>
            <div className="space-y-2">
              <Link to="/upload" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition group">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">Новый документ</span>
              </Link>
              <Link to="/approvals" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-amber-50 transition group">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-amber-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-amber-600">Мои согласования</span>
              </Link>
              <Link to="/archive" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText size={14} className="text-slate-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-slate-600">Архив документов</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
