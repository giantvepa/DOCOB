import { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { BarChart3, FileText, CheckSquare, Calendar, TrendingUp, Users } from 'lucide-react';

export default function Reports() {
  const { documents, tasks, meetings, employees } = useContext(AppContext);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = { incoming: 0, outgoing: 0, internal: 0 };
    const byAuthor: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    documents.forEach(d => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      byType[d.type]++;
      byAuthor[d.authorId] = (byAuthor[d.authorId] || 0) + 1;
      const m = new Date(d.createdAt).toLocaleDateString('ru-RU', { month: 'short' });
      byMonth[m] = (byMonth[m] || 0) + 1;
    });

    return { byCategory, byStatus, byType, byAuthor, byMonth };
  }, [documents]);

  const maxCat = Math.max(...Object.values(stats.byCategory), 1);
  const maxAuth = Math.max(...Object.values(stats.byAuthor), 1);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Отчёты и аналитика</h1>
        <p className="text-xs text-slate-500">Статистика документооборота организации</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Документов', value: documents.length, icon: FileText, color: 'from-blue-500 to-blue-600' },
          { label: 'Задач', value: tasks.length, icon: CheckSquare, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Совещаний', value: meetings.length, icon: Calendar, color: 'from-purple-500 to-purple-600' },
          { label: 'Сотрудников', value: employees.length, icon: Users, color: 'from-amber-500 to-amber-600' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className={`w-9 h-9 rounded bg-gradient-to-br ${m.color} flex items-center justify-center mb-2`}>
              <m.icon size={16} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{m.value}</p>
            <p className="text-[10px] text-slate-500">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By category */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><BarChart3 size={14} className="text-blue-500" />По категориям</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-slate-700 font-medium">{cat}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(count / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By author */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Users size={14} className="text-purple-500" />По авторам</h3>
          <div className="space-y-2">
            {Object.entries(stats.byAuthor).sort((a, b) => b[1] - a[1]).map(([authorId, count]) => {
              const author = employees.find(e => e.id === authorId);
              return (
                <div key={authorId} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs flex-shrink-0">{author?.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-slate-700 font-medium truncate">{author?.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${(count / maxAuth) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By type */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" />По типу</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'incoming', label: 'Входящие', icon: '📥', color: 'bg-blue-500' },
              { type: 'outgoing', label: 'Исходящие', icon: '📤', color: 'bg-emerald-500' },
              { type: 'internal', label: 'Внутренние', icon: '📄', color: 'bg-purple-500' },
            ].map(t => (
              <div key={t.type} className="text-center p-3 bg-slate-50 rounded">
                <span className="text-xl">{t.icon}</span>
                <p className="text-lg font-bold text-slate-800 mt-1">{stats.byType[t.type]}</p>
                <p className="text-[9px] text-slate-500">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* By month */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Calendar size={14} className="text-amber-500" />По месяцам</h3>
          <div className="space-y-1.5">
            {Object.entries(stats.byMonth).map(([month, count]) => (
              <div key={month} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 w-12">{month}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded flex items-center justify-end pr-1.5" style={{ width: `${Math.max((count / Math.max(...Object.values(stats.byMonth))) * 100, 10)}%` }}>
                    <span className="text-[9px] font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
