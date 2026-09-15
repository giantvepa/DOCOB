import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, User, Calendar } from 'lucide-react';

export default function Approvals() {
  const { documents, users, currentUser } = useContext(AppContext);

  // Documents where current user needs to approve
  const pendingForMe = documents.filter(d =>
    d.status === 'pending' && d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting')
  );

  // Documents sent by current user that are pending
  const myPending = documents.filter(d =>
    d.authorId === currentUser.id && d.status === 'pending'
  );

  // Recently processed
  const recentlyProcessed = documents.filter(d =>
    d.approvals.some(a => a.userId === currentUser.id && a.status !== 'waiting' && a.completedAt)
  ).sort((a, b) => {
    const aDate = a.approvals.find(ap => ap.userId === currentUser.id)?.completedAt || '';
    const bDate = b.approvals.find(ap => ap.userId === currentUser.id)?.completedAt || '';
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).slice(0, 5);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const getAuthor = (id: string) => users.find(u => u.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Согласование</h1>
        <p className="text-sm text-slate-500">Документы, ожидающие вашего решения</p>
      </div>

      {/* Pending for me */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900">Ожидают моего решения</h2>
            {pendingForMe.length > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">{pendingForMe.length}</span>
            )}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingForMe.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Нет документов, ожидающих вашего решения</p>
            </div>
          ) : (
            pendingForMe.map(doc => {
              const author = getAuthor(doc.authorId);
              return (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition group">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={18} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition truncate">{doc.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <User size={10} /> {author?.name}
                      </span>
                      <span className="text-xs text-slate-500">{doc.number}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>
                  {doc.dueDate && (
                    <span className="text-[11px] text-red-500 font-medium flex-shrink-0">
                      Срок: {formatDate(doc.dueDate)}
                    </span>
                  )}
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 transition flex-shrink-0" />
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* My pending documents */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900">Мои документы на согласовании</h2>
            {myPending.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">{myPending.length}</span>
            )}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {myPending.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">Нет документов на согласовании</p>
            </div>
          ) : (
            myPending.map(doc => {
              const approvedCount = doc.approvals.filter(a => a.status === 'approved').length;
              const totalCount = doc.approvals.length;
              return (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.number} • {doc.category}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex -space-x-1.5">
                      {doc.approvals.map((a, i) => {
                        const approver = users.find(u => u.id === a.userId);
                        return (
                          <div key={a.id} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white ${
                            a.status === 'approved' ? 'bg-emerald-100' : a.status === 'rejected' ? 'bg-red-100' : 'bg-slate-100'
                          }`}>
                            {approver?.avatar}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs text-slate-500">{approvedCount}/{totalCount}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Recently processed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <h2 className="text-sm font-semibold text-slate-900">Недавно обработанные</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentlyProcessed.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">Пока нет обработанных документов</p>
            </div>
          ) : (
            recentlyProcessed.map(doc => {
              const myApproval = doc.approvals.find(a => a.userId === currentUser.id);
              return (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    myApproval?.status === 'approved' ? 'bg-emerald-50' : 'bg-red-50'
                  }`}>
                    {myApproval?.status === 'approved' ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {myApproval?.status === 'approved' ? 'Согласовано' : 'Отклонено'} • {myApproval?.completedAt ? formatDate(myApproval.completedAt) : ''}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
