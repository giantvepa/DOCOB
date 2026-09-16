import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, Calendar, CheckSquare, TrendingUp, Users,
  Inbox, Send, BookOpen, Stamp, Eye, PenTool, ArrowUpCircle,
  Bell, BarChart3, Plus, Filter
} from 'lucide-react';

const STATUS_MAP = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function HomePage() {
  const { documents, tasks, meetings, currentUser, employees } = useContext(AppContext);

  const myPendingDocs = documents.filter(d =>
    d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting')
  );
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed');
  const myOverdueTasks = myTasks.filter(t => new Date(t.dueDate) < new Date());
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Рабочий стол</h1>
          <p className="text-xs text-slate-500">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded text-xs font-medium transition">
            <Filter size={12} /> Настроить виджеты
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition">
            <Plus size={12} /> Новый документ
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Мои входящие', value: documents.filter(d => d.type === 'incoming').length, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50', link: '/documents?type=incoming' },
          { label: 'На согласовании', value: documents.filter(d => d.status === 'on_approval').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/documents' },
          { label: 'Мои задачи', value: myTasks.length, icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50', link: '/tasks' },
          { label: 'Просрочено', value: myOverdueTasks.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', link: '/tasks' },
          { label: 'Совещания', value: meetings.filter(m => m.status === 'planned').length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/meetings' },
        ].map(stat => (
          <Link key={stat.label} to={stat.link} className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={14} className={stat.color} />
              </div>
              <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-xl font-bold text-slate-800 mt-2">{stat.value}</p>
            <p className="text-[10px] text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Main widgets */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pending approvals widget */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-transparent">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={13} className="text-amber-500" />
                Документы, ожидающие моего решения
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">{myPendingDocs.length}</span>
              </h2>
              <Link to="/documents" className="text-[10px] text-blue-600 hover:underline font-medium">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {myPendingDocs.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={24} className="text-emerald-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Нет документов, ожидающих вашего решения</p>
                </div>
              ) : (
                myPendingDocs.slice(0, 5).map(doc => {
                  const s = STATUS_MAP[doc.status];
                  return (
                    <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group">
                      <div className={`w-8 h-8 rounded ${s.bg} flex items-center justify-center flex-shrink-0`}>
                        <FileText size={13} className={s.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-800 truncate group-hover:text-blue-600 transition">{doc.title}</p>
                        <p className="text-[9px] text-slate-500">{doc.number} • {doc.category} • от {fmtDateShort(doc.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {doc.dueDate && (
                          <span className={`text-[9px] flex items-center gap-0.5 ${new Date(doc.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                            <Calendar size={9} />{fmtDateShort(doc.dueDate)}
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* My tasks widget */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-transparent">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <CheckSquare size={13} className="text-purple-500" />
                Мои задачи
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">{myTasks.length}</span>
              </h2>
              <Link to="/tasks" className="text-[10px] text-blue-600 hover:underline font-medium">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {myTasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Нет активных задач</p>
              ) : (
                myTasks.slice(0, 5).map(task => {
                  const isOverdue = new Date(task.dueDate) < new Date();
                  return (
                    <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'critical' ? 'bg-red-500' :
                        task.priority === 'high' ? 'bg-amber-500' :
                        task.priority === 'normal' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-800 truncate">{task.title}</p>
                        <p className="text-[9px] text-slate-500">
                          {task.status === 'new' ? 'Новая' : task.status === 'in_progress' ? 'В работе' : task.status === 'overdue' ? 'Просрочена' : task.status}
                          {task.documentId && ' • связана с документом'}
                        </p>
                      </div>
                      <span className={`text-[9px] flex items-center gap-0.5 flex-shrink-0 ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                        <Calendar size={9} />{fmtDateShort(task.dueDate)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent documents */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <FileText size={13} className="text-blue-500" />
                Последние документы
              </h2>
              <Link to="/documents" className="text-[10px] text-blue-600 hover:underline font-medium">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentDocs.map(doc => {
                const s = STATUS_MAP[doc.status];
                const author = getEmp(doc.authorId);
                return (
                  <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition group">
                    <span className="text-xs flex-shrink-0">{doc.type === 'incoming' ? '📥' : doc.type === 'outgoing' ? '📤' : '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-slate-800 truncate group-hover:text-blue-600">{doc.title}</p>
                      <p className="text-[9px] text-slate-500">{doc.number} • {author?.name.split(' ').slice(0, 2).join(' ')}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 flex-shrink-0">{fmtDate(doc.updatedAt)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${s.bg} ${s.color} flex-shrink-0`}>{s.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column - Secondary widgets */}
        <div className="space-y-4">
          {/* Meetings */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-transparent">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={13} className="text-emerald-500" />
                Совещания
              </h2>
              <Link to="/meetings" className="text-[10px] text-blue-600 hover:underline font-medium">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {upcomingMeetings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">Нет запланированных</p>
              ) : (
                upcomingMeetings.map(m => (
                  <div key={m.id} className="px-4 py-2.5">
                    <p className="text-[11px] font-medium text-slate-800 truncate">{m.title}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      {fmtDateShort(m.date)} в {m.time} • {m.location}
                    </p>
                    <div className="flex -space-x-1 mt-1.5">
                      {m.participantIds.slice(0, 4).map(pid => {
                        const p = getEmp(pid);
                        return p ? (
                          <div key={pid} className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px]" title={p.name}>{p.avatar}</div>
                        ) : null;
                      })}
                      {m.participantIds.length > 4 && <div className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[7px] text-slate-600">+{m.participantIds.length - 4}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Быстрые действия</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { icon: Inbox, label: 'Регистрация', color: 'bg-blue-50 text-blue-600', link: '/registry' },
                { icon: Send, label: 'Исходящее', color: 'bg-emerald-50 text-emerald-600', link: '/documents' },
                { icon: CheckSquare, label: 'Задача', color: 'bg-purple-50 text-purple-600', link: '/tasks' },
                { icon: Calendar, label: 'Совещание', color: 'bg-amber-50 text-amber-600', link: '/meetings' },
                { icon: BarChart3, label: 'Отчёты', color: 'bg-pink-50 text-pink-600', link: '/reports' },
                { icon: Users, label: 'Сотрудники', color: 'bg-indigo-50 text-indigo-600', link: '/employees' },
              ].map(action => (
                <Link key={action.label} to={action.link} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 transition">
                  <div className={`w-7 h-7 rounded ${action.color} flex items-center justify-center`}>
                    <action.icon size={12} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Bell size={10} /> Уведомления</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 p-1.5 bg-blue-50 rounded text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                <p className="text-slate-700">Новый документ <b>ВХ-2024-0162</b> требует вашего согласования</p>
              </div>
              <div className="flex items-start gap-2 p-1.5 bg-amber-50 rounded text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                <p className="text-slate-700">Задача <b>"Обновить график отпусков"</b> просрочена</p>
              </div>
              <div className="flex items-start gap-2 p-1.5 bg-emerald-50 rounded text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-slate-700">Документ <b>ИСХ-2024-0089</b> подписан и готов к отправке</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
