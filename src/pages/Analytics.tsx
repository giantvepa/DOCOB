import { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { BarChart3, FileText, Clock, CheckCircle2, XCircle, Users, TrendingUp, Calendar } from 'lucide-react';

export default function Analytics() {
  const { documents, users } = useContext(AppContext);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = { draft: 0, pending: 0, approved: 0, rejected: 0, archived: 0 };
    const byAuthor: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    documents.forEach(doc => {
      byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
      byStatus[doc.status]++;
      byAuthor[doc.authorId] = (byAuthor[doc.authorId] || 0) + 1;
      const month = new Date(doc.createdAt).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    const avgApprovalTime = documents.filter(d => d.status === 'approved').reduce((acc, d) => {
      const created = new Date(d.createdAt).getTime();
      const approved = d.approvals.find(a => a.status === 'approved')?.completedAt;
      if (approved) {
        const diff = (new Date(approved).getTime() - created) / (1000 * 60 * 60);
        return acc + diff;
      }
      return acc;
    }, 0) / Math.max(documents.filter(d => d.status === 'approved').length, 1);

    return { byCategory, byStatus, byAuthor, byMonth, avgApprovalTime };
  }, [documents]);

  const maxCategory = Math.max(...Object.values(stats.byCategory), 1);
  const maxAuthor = Math.max(...Object.values(stats.byAuthor), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Аналитика</h1>
        <p className="text-sm text-slate-500">Статистика документооборота</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Всего документов', value: documents.length, icon: FileText, color: 'from-blue-500 to-blue-600', change: '+12%' },
          { label: 'Среднее время согласования', value: `${stats.avgApprovalTime.toFixed(1)} ч`, icon: Clock, color: 'from-amber-500 to-orange-500', change: '-8%' },
          { label: 'Процент одобрения', value: `${documents.length > 0 ? Math.round((stats.byStatus.approved / documents.length) * 100) : 0}%`, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', change: '+5%' },
          { label: 'Активных авторов', value: Object.keys(stats.byAuthor).length, icon: Users, color: 'from-purple-500 to-indigo-500', change: '+2' },
        ].map(metric => (
          <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon size={18} className="text-white" />
              </div>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{metric.change}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-3">{metric.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-blue-500" />
            По категориям
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">{cat}</span>
                  <span className="text-slate-500">{count} док.</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${(count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Author */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users size={14} className="text-purple-500" />
            По авторам
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byAuthor).sort((a, b) => b[1] - a[1]).map(([authorId, count]) => {
              const author = users.find(u => u.id === authorId);
              return (
                <div key={authorId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                    {author?.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-700 font-medium">{author?.name}</span>
                      <span className="text-slate-500">{count} док.</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${(count / maxAuthor) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" />
            Распределение по статусам
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { status: 'draft', label: 'Черновики', color: 'bg-slate-400', count: stats.byStatus.draft },
              { status: 'pending', label: 'На согласовании', color: 'bg-amber-400', count: stats.byStatus.pending },
              { status: 'approved', label: 'Утверждено', color: 'bg-emerald-400', count: stats.byStatus.approved },
              { status: 'rejected', label: 'Отклонено', color: 'bg-red-400', count: stats.byStatus.rejected },
            ].map(item => (
              <div key={item.status} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-lg font-bold text-slate-900">{item.count}</p>
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Visual bar */}
          <div className="mt-4 flex h-4 rounded-full overflow-hidden bg-slate-100">
            {documents.length > 0 && (
              <>
                <div className="bg-slate-400 transition-all" style={{ width: `${(stats.byStatus.draft / documents.length) * 100}%` }} />
                <div className="bg-amber-400 transition-all" style={{ width: `${(stats.byStatus.pending / documents.length) * 100}%` }} />
                <div className="bg-emerald-400 transition-all" style={{ width: `${(stats.byStatus.approved / documents.length) * 100}%` }} />
                <div className="bg-red-400 transition-all" style={{ width: `${(stats.byStatus.rejected / documents.length) * 100}%` }} />
              </>
            )}
          </div>
        </div>

        {/* By Month */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-500" />
            По месяцам
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byMonth).map(([month, count]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-20">{month}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded flex items-center justify-end pr-2"
                    style={{ width: `${Math.max((count / Math.max(...Object.values(stats.byMonth))) * 100, 15)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{count}</span>
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
