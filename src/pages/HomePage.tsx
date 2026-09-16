import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { AlertTriangle, CheckSquare, Clock, Calendar, FileText, Inbox, Send, CheckCircle2, Users, Home } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Черновик', color: 'text-[#666]', bg: 'bg-[#e8e8e8]' },
  on_approval: { label: 'На согласовании', color: 'text-[#cc6600]', bg: 'bg-[#fff3e0]' },
  on_signing: { label: 'На подписании', color: 'text-[#0066cc]', bg: 'bg-[#e3f2fd]' },
  signed: { label: 'Подписан', color: 'text-[#2e7d32]', bg: 'bg-[#e8f5e9]' },
  executed: { label: 'Исполнен', color: 'text-[#1b5e20]', bg: 'bg-[#c8e6c9]' },
  rejected: { label: 'Отклонён', color: 'text-[#c62828]', bg: 'bg-[#ffebee]' },
  archived: { label: 'В архиве', color: 'text-[#666]', bg: 'bg-[#f5f5f5]' },
};

export default function HomePage() {
  const { documents, tasks, meetings, currentUser, t } = useContext(AppContext);

  const myPendingDocs = documents.filter(d => d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting'));
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed');
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fmtDateTime = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  // Widget component
  const Widget = ({ title, icon: Icon, iconColor, children, count, link }: {
    title: string; icon: any; iconColor: string; children: React.ReactNode; count?: number; link?: string;
  }) => (
    <div className="bg-white border border-[#aaa] shadow-sm">
      {/* Widget header */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa]">
        <div className="flex items-center gap-1.5">
          <Icon size={12} className={iconColor} />
          <span className="text-[11px] font-bold text-[#333]">{title}</span>
          {count !== undefined && (
            <span className="text-[9px] bg-[#0055b3] text-white px-1 rounded-sm font-bold">{count}</span>
          )}
        </div>
        {link && (
          <Link to={link} className="text-[9px] text-[#0066cc] hover:underline">Все →</Link>
        )}
      </div>
      {/* Widget content */}
      <div className="max-h-[220px] overflow-y-auto">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-2 space-y-2 overflow-y-auto h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[10px] text-[#666] bg-[#f0f0f0] border border-[#aaa] px-2 py-1 rounded-sm">
        <Home size={10} /> <span>{t('home.title')}</span>
        <span className="ml-auto">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Widget 1: Pending approvals */}
        <Widget title="Документы, ожидающие моего решения" icon={AlertTriangle} iconColor="text-[#cc6600]" count={myPendingDocs.length} link="/documents?status=on_approval">
          {myPendingDocs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={24} className="mx-auto mb-1 text-[#4caf50]" />
              <p className="text-[11px] text-[#666]">Нет документов, ожидающих вашего решения</p>
            </div>
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd]">Рег. №</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd]">Название</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd] w-16">Дата</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] w-24">Статус</th>
                </tr>
              </thead>
              <tbody>
                {myPendingDocs.map((doc, i) => {
                  const s = STATUS_MAP[doc.status];
                  return (
                    <tr key={doc.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                      <td className="px-2 py-1 border-r border-[#eee]">
                        <Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium">{doc.number}</Link>
                      </td>
                      <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[200px]">{doc.title}</td>
                      <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDate(doc.createdAt)}</td>
                      <td className="px-2 py-1">
                        <span className={`px-1 py-0.5 rounded-sm text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Widget>

        {/* Widget 2: My tasks */}
        <Widget title="Мои задачи и поручения" icon={CheckSquare} iconColor="text-[#0066cc]" count={myTasks.length} link="/tasks">
          {myTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[11px] text-[#666]">Нет активных задач</p>
            </div>
          ) : (
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd]">Задача</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd] w-16">Срок</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd] w-16">Приоритет</th>
                  <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] w-20">Статус</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task, i) => (
                  <tr key={task.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                    <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[180px]">{task.title}</td>
                    <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDate(task.dueDate)}</td>
                    <td className="px-2 py-1 border-r border-[#eee]">
                      <span className={`px-1 py-0.5 rounded-sm text-[9px] font-medium ${
                        task.priority === 'critical' ? 'bg-[#ffebee] text-[#c62828]' :
                        task.priority === 'high' ? 'bg-[#fff3e0] text-[#cc6600]' :
                        task.priority === 'normal' ? 'bg-[#e3f2fd] text-[#0066cc]' :
                        'bg-[#f5f5f5] text-[#666]'
                      }`}>
                        {task.priority === 'critical' ? 'Критичный' : task.priority === 'high' ? 'Высокий' : task.priority === 'normal' ? 'Обычный' : 'Низкий'}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <span className={`px-1 py-0.5 rounded-sm text-[9px] font-medium ${
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
        </Widget>

        {/* Widget 3: Recent documents */}
        <Widget title="Последние документы" icon={Clock} iconColor="text-[#333]" count={documents.length} link="/documents">
          <table className="w-full text-[11px] border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-[#f5f5f5] border-b border-[#ddd]">
                <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd]">Рег. №</th>
                <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd]">Название</th>
                <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] border-r border-[#ddd] w-20">Обновлён</th>
                <th className="text-left px-2 py-1 text-[9px] font-bold text-[#555] w-24">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentDocs.map((doc, i) => {
                const s = STATUS_MAP[doc.status];
                return (
                  <tr key={doc.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#cce4ff] cursor-pointer border-b border-[#eee]`}>
                    <td className="px-2 py-1 border-r border-[#eee]">
                      <Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium">{doc.number}</Link>
                    </td>
                    <td className="px-2 py-1 text-[#333] border-r border-[#eee] truncate max-w-[200px]">{doc.title}</td>
                    <td className="px-2 py-1 text-[#666] border-r border-[#eee]">{fmtDateTime(doc.updatedAt)}</td>
                    <td className="px-2 py-1">
                      <span className={`px-1 py-0.5 rounded-sm text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Widget>

        {/* Widget 4: Meetings */}
        <Widget title="Ближайшие совещания" icon={Calendar} iconColor="text-[#6a1b9a]" count={meetings.filter(m => m.status === 'planned').length} link="/meetings">
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[11px] text-[#666]">Нет запланированных совещаний</p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee]">
              {upcomingMeetings.map(m => (
                <div key={m.id} className="px-2 py-1.5 hover:bg-[#cce4ff] cursor-pointer">
                  <p className="text-[11px] font-medium text-[#333]">{m.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] text-[#666]">
                    <span>{fmtDate(m.date)} в {m.time}</span>
                    <span>• {m.location}</span>
                    <span>• <Users size={8} className="inline" /> {m.participantIds.length} чел.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>
      </div>

      {/* Quick actions panel */}
      <div className="bg-white border border-[#aaa] shadow-sm">
        <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa]">
          <span className="text-[11px] font-bold text-[#333]">Быстрый доступ</span>
        </div>
        <div className="p-2 flex flex-wrap gap-1.5">
          {[
            { icon: Inbox, label: 'Зарегистрировать входящий', color: '#0066cc', link: '/registry' },
            { icon: Send, label: 'Подготовить исходящий', color: '#2e7d32', link: '/documents' },
            { icon: FileText, label: 'Внутренний документ', color: '#6a1b9a', link: '/documents' },
            { icon: CheckSquare, label: 'Поставить задачу', color: '#cc6600', link: '/tasks' },
            { icon: Calendar, label: 'Организовать совещание', color: '#c62828', link: '/meetings' },
            { icon: CheckCircle2, label: 'Утвердить документ', color: '#1b5e20', link: '/documents' },
          ].map(action => (
            <Link key={action.label} to={action.link} className="flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] hover:bg-[#cce4ff] border border-[#ccc] hover:border-[#7ba8e0] rounded-sm text-[10px] text-[#333] transition">
              <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ backgroundColor: action.color }}>
                <action.icon size={9} className="text-white" />
              </div>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
