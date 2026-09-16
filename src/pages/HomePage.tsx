import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, Calendar, CheckSquare, TrendingUp, Users, Inbox, Send, BookOpen
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
  const { documents, tasks, meetings, currentUser } = useContext(AppContext);

  const myPendingDocs = documents.filter(d =>
    d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting')
  );
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed');
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Добро пожаловать, {currentUser.name.split(' ')[1] || currentUser.name.split(' ')[0]}!</h1>
          <p className="text-xs text-slate-500 mt-0.5">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Документов на согласовании', value: documents.filter(d => d.status === 'on_approval').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', link: '/documents' },
          { label: 'Моих задач', value: myTasks.length, icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50', link: '/tasks' },
          { label: 'Совещаний на неделе', value: meetings.filter(m => m.status === 'planned').length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', link: '/meetings' },
          { label: 'Всего документов', value: documents.length, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100', link: '/documents' },
        ].map(stat => (
          <Link key={stat.label} to={stat.link} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-3">{stat.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My pending approvals */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              Ожидают моего решения
            </h2>
            <Link to="/documents" className="text-[11px] text-blue-600 hover:underline">Все →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myPendingDocs.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={28} className="text-emerald-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Нет документов, ожидающих вашего решения</p>
              </div>
            ) : (
              myPendingDocs.slice(0, 5).map(doc => {
                const s = STATUS_MAP[doc.status];
                return (
                  <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition">
                    <div className={`w-8 h-8 rounded ${s.bg} flex items-center justify-center flex-shrink-0`}>
                      <FileText size={14} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{doc.title}</p>
                      <p className="text-[10px] text-slate-500">{doc.number} • {doc.category}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color} flex-shrink-0`}>
                      {s.label}
                    </span>
                    {doc.dueDate && (
                      <span className="text-[10px] text-red-500 flex items-center gap-0.5 flex-shrink-0">
                        <Calendar size={9} />{fmtDateShort(doc.dueDate)}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* My tasks */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CheckSquare size={14} className="text-blue-500" />
                Мои задачи
              </h2>
              <Link to="/tasks" className="text-[11px] text-blue-600 hover:underline">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {myTasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Нет активных задач</p>
              ) : (
                myTasks.slice(0, 4).map(task => (
                  <div key={task.id} className="px-4 py-2.5">
                    <p className="text-xs font-medium text-slate-800 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority === 'critical' ? 'Критичный' : task.priority === 'high' ? 'Высокий' : task.priority === 'normal' ? 'Обычный' : 'Низкий'}
                      </span>
                      <span className="text-[10px] text-slate-400">до {fmtDateShort(task.dueDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming meetings */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Calendar size={14} className="text-purple-500" />
                Ближайшие совещания
              </h2>
              <Link to="/meetings" className="text-[11px] text-blue-600 hover:underline">Все →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {upcomingMeetings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Нет запланированных совещаний</p>
              ) : (
                upcomingMeetings.map(m => (
                  <div key={m.id} className="px-4 py-2.5">
                    <p className="text-xs font-medium text-slate-800 truncate">{m.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {fmtDateShort(m.date)} в {m.time} • {m.location}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Inbox, label: 'Входящие', desc: 'Регистрация и обработка', color: 'from-blue-500 to-blue-600', link: '/registry' },
          { icon: Send, label: 'Исходящие', desc: 'Подготовка и отправка', color: 'from-emerald-500 to-emerald-600', link: '/documents?type=outgoing' },
          { icon: BookOpen, label: 'Канцелярия', desc: 'Реестр документов', color: 'from-purple-500 to-purple-600', link: '/registry' },
          { icon: Users, label: 'Сотрудники', desc: 'Справочник организации', color: 'from-amber-500 to-amber-600', link: '/employees' },
        ].map(item => (
          <Link key={item.label} to={item.link} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition group">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon size={18} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">{item.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
