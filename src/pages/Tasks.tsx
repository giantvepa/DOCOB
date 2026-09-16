import { useContext, useState } from 'react';
import { AppContext, TaskStatus } from '../App';
import { CheckSquare, Plus, CheckCircle2 } from 'lucide-react';

const STATUS_MAP: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Новая', color: 'text-[#0066cc]', bg: 'bg-[#e3f2fd]' },
  in_progress: { label: 'В работе', color: 'text-[#cc6600]', bg: 'bg-[#fff3e0]' },
  completed: { label: 'Выполнена', color: 'text-[#2e7d32]', bg: 'bg-[#e8f5e9]' },
  overdue: { label: 'Просрочена', color: 'text-[#c62828]', bg: 'bg-[#ffebee]' },
  deferred: { label: 'Отложена', color: 'text-[#666]', bg: 'bg-[#f5f5f5]' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-[#666]', bg: 'bg-[#f5f5f5]' },
  normal: { label: 'Обычный', color: 'text-[#0066cc]', bg: 'bg-[#e3f2fd]' },
  high: { label: 'Высокий', color: 'text-[#cc6600]', bg: 'bg-[#fff3e0]' },
  critical: { label: 'Критичный', color: 'text-[#c62828]', bg: 'bg-[#ffebee]' },
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
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: t.status === 'completed' ? 'in_progress' as TaskStatus : 'completed' as TaskStatus, completedAt: t.status === 'completed' ? undefined : new Date().toISOString() } : t));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">Задачи и поручения</span>
        <span className="text-[9px] text-[#666]">({filtered.length})</span>
        <div className="ml-auto flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm border border-[#004499]">
            <Plus size={10} /> Новая задача
          </button>
        </div>
      </div>

      <div className="px-2 py-1 bg-[#f0f0f0] border-b border-[#aaa] flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center bg-white border border-[#aaa] rounded-sm">
          {[{ id: 'my' as const, label: 'Мои задачи' }, { id: 'assigned' as const, label: 'Порученные мной' }, { id: 'all' as const, label: 'Все' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-2 py-0.5 text-[10px] transition ${filter === f.id ? 'bg-[#0066cc] text-white' : 'text-[#333] hover:bg-[#e8eef5]'}`}>{f.label}</button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')} className="h-[20px] px-1 bg-white border border-[#aaa] rounded-sm text-[10px]">
          <option value="all">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Выполнены</option>
          <option value="overdue">Просрочены</option>
        </select>
        <span className="text-[9px] text-[#666] ml-auto">{filtered.length} задач</span>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-[10px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-b from-[#e8eef5] to-[#d0dce8] border-b border-[#aaa]">
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-6"></th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Задача</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-16">Срок</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-16">Приоритет</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-20">Исполнитель</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] w-16">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task, i) => {
              const s = STATUS_MAP[task.status];
              const p = PRIORITY_MAP[task.priority];
              const assignee = getEmp(task.assigneeId);
              return (
                <tr key={task.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#e3f0ff] border-b border-[#eee]`}>
                  <td className="px-1.5 py-0.5 border-r border-[#eee]">
                    <button onClick={() => toggleComplete(task.id)} className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${task.status === 'completed' ? 'bg-[#2e7d32] border-[#1b5e20]' : 'border-[#aaa] hover:border-[#0066cc]'}`}>
                      {task.status === 'completed' && <CheckCircle2 size={9} className="text-white" />}
                    </button>
                  </td>
                  <td className={`px-1.5 py-0.5 border-r border-[#eee] ${task.status === 'completed' ? 'text-[#888] line-through' : 'text-[#333]'}`}>{task.title}</td>
                  <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">{fmtDate(task.dueDate)}</td>
                  <td className="px-1.5 py-0.5 border-r border-[#eee]">
                    <span className={`px-1 py-0.5 rounded-sm text-[8px] font-medium ${p.bg} ${p.color}`}>{p.label}</span>
                  </td>
                  <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">{assignee?.name.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-1.5 py-0.5">
                    <span className={`px-1 py-0.5 rounded-sm text-[8px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-8 text-[10px] text-[#888]">Нет задач</div>}
      </div>

      <div className="px-2 py-0.5 bg-[#f0f0f0] border-t border-[#aaa] text-[9px] text-[#555] flex-shrink-0">
        Записей: {filtered.length}
      </div>
    </div>
  );
}
