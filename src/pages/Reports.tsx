import { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { BarChart3, FileText, CheckSquare, Calendar, Users, TrendingUp } from 'lucide-react';

export default function Reports() {
  const { documents, tasks, meetings, employees, t } = useContext(AppContext);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = { incoming: 0, outgoing: 0, internal: 0 };
    const byAuthor: Record<string, number> = {};

    documents.forEach(d => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      const docType = d.type || d.doc_type || 'internal';
      byType[docType] = (byType[docType] || 0) + 1;
      const authorId = d.authorId || d.author;
      byAuthor[authorId] = (byAuthor[authorId] || 0) + 1;
    });

    return { byCategory, byStatus, byType, byAuthor };
  }, [documents]);

  const maxCat = Math.max(...Object.values(stats.byCategory), 1);
  const maxAuth = Math.max(...Object.values(stats.byAuthor), 1);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('reports.subtitle')}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('app.documents'), value: documents.length, icon: FileText, gradient: 'gradient-blue' },
          { label: t('app.tasks'), value: tasks.length, icon: CheckSquare, gradient: 'gradient-green' },
          { label: t('nav.meetings'), value: meetings.length, icon: Calendar, gradient: 'gradient-orange' },
          { label: t('nav.employees'), value: employees.length, icon: Users, gradient: 'gradient-purple' },
        ].map((m, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-modern hover-card">
            <div className={`w-12 h-12 rounded-xl ${m.gradient} flex items-center justify-center mb-4`}>
              <m.icon size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white rounded-2xl shadow-modern p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-600" />
            {t('reports.by_category')}
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">{cat}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full gradient-blue rounded-full transition-all" style={{ width: `${(count / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Author */}
        <div className="bg-white rounded-2xl shadow-modern p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={18} className="text-purple-600" />
            {t('reports.by_author')}
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byAuthor).sort((a, b) => b[1] - a[1]).map(([authorId, count]) => {
              const author = employees.find(e => String(e.id) === String(authorId));
              const authorName = author?.name || `${author?.first_name || ''} ${author?.last_name || ''}`.trim() || author?.username || author?.email || 'Неизвестно';
              return (
                <div key={authorId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {authorName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 font-medium truncate">{authorName.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full gradient-purple rounded-full transition-all" style={{ width: `${(count / maxAuth) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Type */}
        <div className="bg-white rounded-2xl shadow-modern p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" />
            {t('reports.by_type')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'incoming', label: t('nav.incoming'), icon: '📥', gradient: 'gradient-blue' },
              { type: 'outgoing', label: t('nav.outgoing'), icon: '📤', gradient: 'gradient-green' },
              { type: 'internal', label: t('nav.internal'), icon: '📄', gradient: 'gradient-purple' },
            ].map(t => (
              <div key={t.type} className="text-center p-4 bg-gray-50 rounded-xl">
                <span className="text-3xl">{t.icon}</span>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.byType[t.type]}</p>
                <p className="text-xs text-gray-500 mt-1">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div className="bg-white rounded-2xl shadow-modern p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-600" />
            {t('reports.by_status')}
          </h3>
          <div className="space-y-2">
            {[
              { status: 'draft', label: t('reports.drafts'), color: 'bg-gray-400' },
              { status: 'on_approval', label: t('status.on_approval'), color: 'bg-amber-400' },
              { status: 'signed', label: t('reports.approved'), color: 'bg-green-400' },
              { status: 'executed', label: t('reports.executed'), color: 'bg-emerald-400' },
              { status: 'rejected', label: t('reports.rejected'), color: 'bg-red-400' },
            ].map(item => (
              <div key={item.status} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{stats.byStatus[item.status] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
