import { useContext, useState } from 'react';
import { AppContext, TaskStatus, TaskPriority } from '../App';
import { CheckSquare, Plus, Filter, Calendar, User, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const STATUS_MAP: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Новая', color: 'text-blue-700', bg: 'bg-blue-50' },
  in_progress: { label: 'В работе', color: 'text-amber-700', bg: 'bg-amber-50' },
  completed: { label: 'Выполнена', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  overdue: { label: 'Просрочена', color: 'text-red-700', bg: 'bg-red-50' },
  deferred: { label: 'Отложена', color: 'text-slate-600', bg: 'bg-slate-100' },
};

const PRIORITY_MAP: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-slate-600', bg: 'bg-slate-100' },
  normal: { label: 'Обычный', color: 'text-blue-700', bg: 'bg-blue-50' },
  high: { label: 'Высокий', color: 'text-amber-700', bg: 'bg-amber-50' },
  critical: { label: 'Критичный', color: 'text-red-700', bg: 'bg-red-50' },
};

export default function Tasks() {
  const { tasks, setTasks, employees, currentUser } = useContext(AppContext);
  const [filter, setFilter] = useState<'all' | 'my' | 'assigned'>('my');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filtered = tasks.filter(t => {
    if (filter === 'my' && t.assigneeId !== currentUser.id) return false;
    if (filter === 'assigned' && t.authorId !== currentUser.id) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === 'completed' ? 'in_progress' as TaskStatus : 'completed' as TaskStatus, completedAt: t.status === 'completed' ? undefined : new Date().toISOString() } : t));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Задачи</h1>
          <p className="text-xs text-slate-500">Управление задачами и контроль исполнения</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"><Plus size={13} /> Новая задача</button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded p-0.5">
          {[{ id: 'my' as const, label: 'Мои задачи' }, { id: 'assigned' as const, label: 'Порученные мной' }, { id: 'all' as const, label: 'Все' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${filter === f.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>{f.label}</button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')} className="h-7 px-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
          <option value="all">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Выполнены</option>
          <option value="overdue">Просрочены</option>
        </select>
        <span className="text-[10px] text-slate-500 ml-auto">{filtered.length} задач</span>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <CheckSquare size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Нет задач</p>
          </div>
        ) : filtered.map(task => {
          const s = STATUS_MAP[task.status];
          const p = PRIORITY_MAP[task.priority];
          const assignee = getEmp(task.assigneeId);
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
          return (
            <div key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition">
              <button onClick={() => toggleComplete(task.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-blue-400'}`}>
                {task.status === 'completed' && <CheckCircle2 size={12} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${p.bg} ${p.color}`}>{p.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><User size={9} />{assignee?.name.split(' ').slice(0, 2).join(' ')}</span>
                  <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                    <Calendar size={9} />{fmtDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
