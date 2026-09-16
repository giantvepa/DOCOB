import { useContext, useState } from 'react';
import { AppContext, TaskStatus } from '../App';
import { CheckSquare, Plus, CheckCircle2, Calendar, User, Clock } from 'lucide-react';
import CreateTaskModal from '../components/CreateTaskModal';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  new: { label: 'Новая', color: 'text-blue-600', bg: 'bg-blue-100' },
  in_progress: { label: 'В работе', color: 'text-amber-600', bg: 'bg-amber-100' },
  completed: { label: 'Выполнена', color: 'text-green-600', bg: 'bg-green-100' },
  overdue: { label: 'Просрочена', color: 'text-red-600', bg: 'bg-red-100' },
  deferred: { label: 'Отложена', color: 'text-gray-600', bg: 'bg-gray-100' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-gray-600', bg: 'bg-gray-100' },
  normal: { label: 'Обычный', color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { label: 'Высокий', color: 'text-amber-600', bg: 'bg-amber-100' },
  critical: { label: 'Критичный', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function Tasks() {
  const { tasks, setTasks, employees, currentUser, t } = useContext(AppContext);
  const [filter, setFilter] = useState<'all' | 'my' | 'assigned'>('my');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [showCreateTask, setShowCreateTask] = useState(false);

  const filtered = tasks.filter(task => {
    if (filter === 'my' && task.assigneeId !== currentUser.id) return false;
    if (filter === 'assigned' && task.authorId !== currentUser.id) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: task.status === 'completed' ? 'in_progress' as TaskStatus : 'completed' as TaskStatus, completedAt: task.status === 'completed' ? undefined : new Date().toISOString() } : task));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('tasks.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} {t('common.records')}</p>
        </div>
        <button 
          onClick={() => setShowCreateTask(true)}
          className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          {t('tasks.new_task')}
        </button>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && <CreateTaskModal onClose={() => setShowCreateTask(false)} />}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-modern p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {[
              { id: 'my' as const, label: t('tasks.my') },
              { id: 'assigned' as const, label: t('tasks.assigned_by_me') },
              { id: 'all' as const, label: t('tasks.all') }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                  filter === f.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="h-10 px-4 modern-input modern-select rounded-xl text-sm"
          >
            <option value="all">{t('tasks.all_statuses')}</option>
            <option value="new">{t('task.new')}</option>
            <option value="in_progress">{t('task.in_progress')}</option>
            <option value="completed">{t('task.completed')}</option>
            <option value="overdue">{t('task.overdue')}</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">{t('tasks.no_tasks')}</p>
            </div>
          ) : (
            filtered.map(task => {
              const statusConf = STATUS_CONFIG[task.status];
              const priorityConf = PRIORITY_CONFIG[task.priority];
              const assignee = getEmp(task.assigneeId);
              return (
                <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                      task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 size={14} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                        {priorityConf.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <User size={12} />
                        {assignee?.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {fmtDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
