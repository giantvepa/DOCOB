import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import {
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, Calendar, CheckSquare, Users, Inbox, Send,
  Mail, Star, TrendingUp, Bell, ChevronRight
} from 'lucide-react';

const STATUS_MAP = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
};

export default function HomePage() {
  const { documents, tasks, meetings, currentUser } = useContext(AppContext);

  const myPendingDocs = documents.filter(d => d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting'));
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed');
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const fmtDateTime = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-3 space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[11px] text-slate-500">
        <span className="text-slate-800 font-medium">Главная</span>
        <span className="text-slate-400 ml-auto">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Widgets grid — like TEZIS desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Widget: My pending approvals */}
        <div className="bg-white border border-slate-300 rounded-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#e8f0f8] to-[#dce8f4] border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-600" />
              <span className="text-[11px] font-bold text-slate-700">Документы, ожидающие моего решения</span>
            </div>
            <Link to="/documents" className="text-[10px] text-blue-600 hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {myPendingDocs.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-slate-400">
                <CheckCircle2 size={20} className="mx-auto mb-1 text-emerald-300" />
                Нет документов, ожидающих вашего решения
              </div>
            ) : (
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Номер</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Название</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Дата</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPendingDocs.map(doc => {
                    const s = STATUS_MAP[doc.status];
                    return (
                      <tr key={doc.id} className="hover:bg-blue-50 cursor-pointer">
                        <td className="px-2 py-1">
                          <Link to={`/documents/${doc.id}`} className="text-blue-600 hover:underline font-medium">{doc.number}</Link>
                        </td>
                        <td className="px-2 py-1 text-slate-700 truncate max-w-[200px]">{doc.title}</td>
                        <td className="px-2 py-1 text-slate-500">{fmtDate(doc.createdAt)}</td>
                        <td className="px-2 py-1">
                          <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500">
            Всего: {myPendingDocs.length}
          </div>
        </div>

        {/* Widget: My tasks */}
        <div className="bg-white border border-slate-300 rounded-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#e8f0f8] to-[#dce8f4] border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <CheckSquare size={12} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">Мои задачи</span>
            </div>
            <Link to="/tasks" className="text-[10px] text-blue-600 hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {myTasks.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-slate-400">Нет активных задач</div>
            ) : (
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Задача</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Срок</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Приоритет</th>
                    <th className="text-left px-2 py-1 font-semibold text-slate-500">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myTasks.map(task => (
                    <tr key={task.id} className="hover:bg-blue-50 cursor-pointer">
                      <td className="px-2 py-1 text-slate-700 truncate max-w-[180px]">{task.title}</td>
                      <td className="px-2 py-1 text-slate-500">{fmtDate(task.dueDate)}</td>
                      <td className="px-2 py-1">
                        <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${
                          task.priority === 'critical' ? 'bg-red-50 text-red-700' :
                          task.priority === 'high' ? 'bg-amber-50 text-amber-700' :
                          task.priority === 'normal' ? 'bg-blue-50 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority === 'critical' ? 'Критичный' : task.priority === 'high' ? 'Высокий' : task.priority === 'normal' ? 'Обычный' : 'Низкий'}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${
                          task.status === 'new' ? 'bg-blue-50 text-blue-700' :
                          task.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                          task.status === 'overdue' ? 'bg-red-50 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {task.status === 'new' ? 'Новая' : task.status === 'in_progress' ? 'В работе' : task.status === 'overdue' ? 'Просрочена' : task.status === 'completed' ? 'Выполнена' : 'Отложена'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500">
            Всего: {myTasks.length}
          </div>
        </div>

        {/* Widget: Recent documents */}
        <div className="bg-white border border-slate-300 rounded-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#e8f0f8] to-[#dce8f4] border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-slate-600" />
              <span className="text-[11px] font-bold text-slate-700">Последние документы</span>
            </div>
            <Link to="/documents" className="text-[10px] text-blue-600 hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-2 py-1 font-semibold text-slate-500">Номер</th>
                  <th className="text-left px-2 py-1 font-semibold text-slate-500">Название</th>
                  <th className="text-left px-2 py-1 font-semibold text-slate-500">Обновлён</th>
                  <th className="text-left px-2 py-1 font-semibold text-slate-500">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDocs.map(doc => {
                  const s = STATUS_MAP[doc.status];
                  return (
                    <tr key={doc.id} className="hover:bg-blue-50 cursor-pointer">
                      <td className="px-2 py-1">
                        <Link to={`/documents/${doc.id}`} className="text-blue-600 hover:underline font-medium">{doc.number}</Link>
                      </td>
                      <td className="px-2 py-1 text-slate-700 truncate max-w-[200px]">{doc.title}</td>
                      <td className="px-2 py-1 text-slate-500">{fmtDateTime(doc.updatedAt)}</td>
                      <td className="px-2 py-1">
                        <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500">
            Всего: {documents.length}
          </div>
        </div>

        {/* Widget: Meetings */}
        <div className="bg-white border border-slate-300 rounded-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#e8f0f8] to-[#dce8f4] border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-purple-600" />
              <span className="text-[11px] font-bold text-slate-700">Ближайшие совещания</span>
            </div>
            <Link to="/meetings" className="text-[10px] text-blue-600 hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {upcomingMeetings.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-slate-400">Нет запланированных совещаний</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingMeetings.map(m => (
                  <div key={m.id} className="px-3 py-2 hover:bg-blue-50 cursor-pointer">
                    <p className="text-[11px] font-medium text-slate-700">{m.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500">
                      <span>{fmtDate(m.date)} в {m.time}</span>
                      <span>{m.location}</span>
                      <span className="flex items-center gap-0.5"><Users size={9} />{m.participantIds.length} чел.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500">
            Запланировано: {meetings.filter(m => m.status === 'planned').length}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-300 rounded-sm">
        <div className="px-3 py-1.5 bg-gradient-to-r from-[#e8f0f8] to-[#dce8f4] border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-700">Быстрый доступ</span>
        </div>
        <div className="p-3 flex flex-wrap gap-2">
          {[
            { icon: Inbox, label: 'Зарегистрировать входящий', color: 'bg-blue-600', link: '/registry' },
            { icon: Send, label: 'Подготовить исходящий', color: 'bg-emerald-600', link: '/documents' },
            { icon: FileText, label: 'Создать внутренний документ', color: 'bg-purple-600', link: '/documents' },
            { icon: CheckSquare, label: 'Поставить задачу', color: 'bg-amber-600', link: '/tasks' },
            { icon: Calendar, label: 'Организовать совещание', color: 'bg-pink-600', link: '/meetings' },
            { icon: Star, label: 'Утвердить документ', color: 'bg-teal-600', link: '/documents' },
          ].map(action => (
            <Link key={action.label} to={action.link} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-700 transition">
              <div className={`w-5 h-5 rounded ${action.color} flex items-center justify-center`}>
                <action.icon size={10} className="text-white" />
              </div>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
