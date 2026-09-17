import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Clock, CheckCircle2, AlertTriangle, Calendar, Users, ArrowRight, Plus } from 'lucide-react';

export default function HomePage() {
  const { documents, tasks, meetings, t } = useContext(AppContext);
  const { user } = useAuth();

  const myPendingDocs = documents.filter(d => d.approvals.some(a => a.userId === user?.id && a.status === 'waiting'));
  const myTasks = tasks.filter(task => task.assigneeId === user?.id && task.status !== 'completed');
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const fmtDateTime = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[10px] text-[#666] bg-[#f0f0f0] border border-[#999] px-2 py-1">
        <span>🏠</span> <span>{t('home.title')}</span>
        <span className="ml-auto">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Widget: Pending Documents */}
        <div className="bg-white border border-[#999]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-[#cc6600]" />
              <span className="text-[11px] font-bold text-[#333]">{t('home.pending_docs')}</span>
              {myPendingDocs.length > 0 && (
                <span className="text-[9px] bg-[#cc6600] text-white px-1 rounded">{myPendingDocs.length}</span>
              )}
            </div>
            <Link to="/documents?status=on_approval" className="text-[9px] text-[#0066cc] hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {myPendingDocs.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-[#888]">
                <CheckCircle2 size={20} className="mx-auto mb-1 text-[#4caf50]" />
                {t('home.no_pending')}
              </div>
            ) : (
              <table className="w-full text-[10px] border-collapse">
                <thead className="sticky top-0">
                  <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd]">Номер</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd]">Название</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd] w-14">Дата</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] w-20">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {myPendingDocs.map((doc, i) => (
                    <tr key={doc.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                      <td className="px-2 py-1 border-r border-[#eee]">
                        <Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium">{doc.number}</Link>
                      </td>
                      <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[180px]">{doc.title}</td>
                      <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDate(doc.createdAt)}</td>
                      <td className="px-2 py-1">
                        <span className="px-1 py-0.5 bg-[#fff3e0] text-[#cc6600] rounded text-[8px] font-medium">
                          {t('status.on_approval')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-3 py-1 bg-[#f5f5f5] border-t border-[#ddd] text-[9px] text-[#666]">
            Всего: {myPendingDocs.length}
          </div>
        </div>

        {/* Widget: My Tasks */}
        <div className="bg-white border border-[#999]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-[#0066cc]" />
              <span className="text-[11px] font-bold text-[#333]">{t('home.my_tasks')}</span>
              {myTasks.length > 0 && (
                <span className="text-[9px] bg-[#0066cc] text-white px-1 rounded">{myTasks.length}</span>
              )}
            </div>
            <Link to="/tasks" className="text-[9px] text-[#0066cc] hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {myTasks.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-[#888]">{t('home.no_tasks')}</div>
            ) : (
              <table className="w-full text-[10px] border-collapse">
                <thead className="sticky top-0">
                  <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd]">Задача</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd] w-14">Срок</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd] w-14">Приоритет</th>
                    <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] w-16">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task, i) => (
                    <tr key={task.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                      <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[150px]">{task.title}</td>
                      <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDate(task.dueDate)}</td>
                      <td className="px-2 py-1 border-r border-[#eee]">
                        <span className={`px-1 py-0.5 rounded text-[8px] font-medium ${
                          task.priority === 'critical' ? 'bg-[#ffebee] text-[#c62828]' :
                          task.priority === 'high' ? 'bg-[#fff3e0] text-[#cc6600]' :
                          task.priority === 'normal' ? 'bg-[#e3f2fd] text-[#0066cc]' :
                          'bg-[#f5f5f5] text-[#666]'
                        }`}>
                          {task.priority === 'critical' ? 'Критичный' : task.priority === 'high' ? 'Высокий' : task.priority === 'normal' ? 'Обычный' : 'Низкий'}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className={`px-1 py-0.5 rounded text-[8px] font-medium ${
                          task.status === 'new' ? 'bg-[#e3f2fd] text-[#0066cc]' :
                          task.status === 'in_progress' ? 'bg-[#fff3e0] text-[#cc6600]' :
                          task.status === 'overdue' ? 'bg-[#ffebee] text-[#c62828]' :
                          'bg-[#f5f5f5] text-[#666]'
                        }`}>
                          {task.status === 'new' ? 'Новая' : task.status === 'in_progress' ? 'В работе' : task.status === 'overdue' ? 'Просрочена' : 'Выполнена'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-3 py-1 bg-[#f5f5f5] border-t border-[#ddd] text-[9px] text-[#666]">
            Всего: {myTasks.length}
          </div>
        </div>

        {/* Widget: Recent Documents */}
        <div className="bg-white border border-[#999]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-[#333]" />
              <span className="text-[11px] font-bold text-[#333]">{t('home.recent_docs')}</span>
            </div>
            <Link to="/documents" className="text-[9px] text-[#0066cc] hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full text-[10px] border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                  <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd]">Номер</th>
                  <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd]">Название</th>
                  <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] border-r border-[#ddd] w-20">Обновлён</th>
                  <th className="text-left px-2 py-1 text-[8px] font-bold text-[#555] w-20">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentDocs.map((doc, i) => (
                  <tr key={doc.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                    <td className="px-2 py-1 border-r border-[#eee]">
                      <Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium">{doc.number}</Link>
                    </td>
                    <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[180px]">{doc.title}</td>
                    <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDateTime(doc.updatedAt)}</td>
                    <td className="px-2 py-1">
                      <span className={`px-1 py-0.5 rounded text-[8px] font-medium ${
                        doc.status === 'draft' ? 'bg-[#e8e8e8] text-[#666]' :
                        doc.status === 'on_approval' ? 'bg-[#fff3e0] text-[#cc6600]' :
                        doc.status === 'signed' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                        doc.status === 'executed' ? 'bg-[#c8e6c9] text-[#1b5e20]' :
                        'bg-[#f5f5f5] text-[#666]'
                      }`}>
                        {doc.status === 'draft' ? 'Черновик' : doc.status === 'on_approval' ? 'На согласовании' : doc.status === 'signed' ? 'Подписан' : doc.status === 'executed' ? 'Исполнен' : doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-1 bg-[#f5f5f5] border-t border-[#ddd] text-[9px] text-[#666]">
            Всего: {documents.length}
          </div>
        </div>

        {/* Widget: Meetings */}
        <div className="bg-white border border-[#999]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[#6a1b9a]" />
              <span className="text-[11px] font-bold text-[#333]">{t('home.meetings')}</span>
              {upcomingMeetings.length > 0 && (
                <span className="text-[9px] bg-[#6a1b9a] text-white px-1 rounded">{upcomingMeetings.length}</span>
              )}
            </div>
            <Link to="/meetings" className="text-[9px] text-[#0066cc] hover:underline">Все →</Link>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {upcomingMeetings.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-[#888]">{t('home.no_meetings')}</div>
            ) : (
              <div className="divide-y divide-[#eee]">
                {upcomingMeetings.map(m => (
                  <div key={m.id} className="px-3 py-2 hover:bg-[#cce4ff] cursor-pointer">
                    <p className="text-[10px] font-medium text-[#333]">{m.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-[#666]">
                      <span>{fmtDate(m.date)} в {m.time}</span>
                      <span>• {m.location}</span>
                      <span>• <Users size={8} className="inline" /> {m.participants.length} чел.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-[#f5f5f5] border-t border-[#ddd] text-[9px] text-[#666]">
            Запланировано: {meetings.filter(m => m.status === 'planned').length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#999]">
        <div className="px-3 py-1.5 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
          <span className="text-[11px] font-bold text-[#333]">Быстрый доступ</span>
        </div>
        <div className="p-2 flex flex-wrap gap-1.5">
          {[
            { icon: '📥', label: 'Зарегистрировать входящий', color: '#0066cc', link: '/registry' },
            { icon: '📤', label: 'Подготовить исходящий', color: '#2e7d32', link: '/documents' },
            { icon: '📄', label: 'Внутренний документ', color: '#6a1b9a', link: '/documents' },
            { icon: '✅', label: 'Поставить задачу', color: '#cc6600', link: '/tasks' },
            { icon: '📅', label: 'Организовать совещание', color: '#c62828', link: '/meetings' },
            { icon: '⭐', label: 'Утвердить документ', color: '#1b5e20', link: '/documents' },
          ].map(action => (
            <Link key={action.label} to={action.link} className="flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] hover:bg-[#cce4ff] border border-[#ccc] hover:border-[#7ba8e0] rounded text-[10px] text-[#333] transition">
              <span className="text-sm">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
