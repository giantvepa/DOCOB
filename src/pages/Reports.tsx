import { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { BarChart3, FileText, CheckSquare, Calendar, Users } from 'lucide-react';

export default function Reports() {
  const { documents, tasks, meetings, employees } = useContext(AppContext);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = { incoming: 0, outgoing: 0, internal: 0 };
    const byAuthor: Record<string, number> = {};

    documents.forEach(d => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      byType[d.type]++;
      byAuthor[d.authorId] = (byAuthor[d.authorId] || 0) + 1;
    });

    return { byCategory, byStatus, byType, byAuthor };
  }, [documents]);

  const maxCat = Math.max(...Object.values(stats.byCategory), 1);
  const maxAuth = Math.max(...Object.values(stats.byAuthor), 1);

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">Отчёты и аналитика</span>
        <span className="text-[9px] text-[#666]">Статистика документооборота</span>
      </div>

      <div className="flex-1 overflow-auto p-2 bg-[#ece9e0] space-y-2">
        {/* Key metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'Документов', value: documents.length, icon: FileText, color: '#0066cc' },
            { label: 'Задач', value: tasks.length, icon: CheckSquare, color: '#2e7d32' },
            { label: 'Совещаний', value: meetings.length, icon: Calendar, color: '#6a1b9a' },
            { label: 'Сотрудников', value: employees.length, icon: Users, color: '#cc6600' },
          ].map(m => (
            <div key={m.label} className="bg-white border border-[#aaa] shadow-sm p-3">
              <div className="w-7 h-7 rounded-sm flex items-center justify-center mb-1.5" style={{ backgroundColor: m.color + '20', border: `1px solid ${m.color}40` }}>
                <m.icon size={14} style={{ color: m.color }} />
              </div>
              <p className="text-lg font-bold text-[#333]">{m.value}</p>
              <p className="text-[9px] text-[#666]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* By category */}
          <div className="bg-white border border-[#aaa] shadow-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc]">
              <h3 className="text-[10px] font-bold text-[#333] flex items-center gap-1"><BarChart3 size={10} className="text-[#0066cc]" />По категориям</h3>
            </div>
            <div className="p-2 space-y-1.5">
              {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#333] font-medium">{cat}</span>
                    <span className="text-[#666]">{count}</span>
                  </div>
                  <div className="h-2 bg-[#e0e0e0] rounded-sm overflow-hidden border border-[#ccc]">
                    <div className="h-full bg-gradient-to-r from-[#0066cc] to-[#0055aa] rounded-sm" style={{ width: `${(count / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By author */}
          <div className="bg-white border border-[#aaa] shadow-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc]">
              <h3 className="text-[10px] font-bold text-[#333] flex items-center gap-1"><Users size={10} className="text-[#6a1b9a]" />По авторам</h3>
            </div>
            <div className="p-2 space-y-1.5">
              {Object.entries(stats.byAuthor).sort((a, b) => b[1] - a[1]).map(([authorId, count]) => {
                const author = employees.find(e => e.id === authorId);
                return (
                  <div key={authorId} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-sm bg-[#e0e0e0] flex items-center justify-center text-[9px] flex-shrink-0 border border-[#ccc]">{author?.avatar}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-[#333] font-medium truncate">{author?.name.split(' ').slice(0, 2).join(' ')}</span>
                        <span className="text-[#666]">{count}</span>
                      </div>
                      <div className="h-1.5 bg-[#e0e0e0] rounded-sm overflow-hidden border border-[#ccc]">
                        <div className="h-full bg-gradient-to-r from-[#6a1b9a] to-[#9c27b0] rounded-sm" style={{ width: `${(count / maxAuth) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By type */}
          <div className="bg-white border border-[#aaa] shadow-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc]">
              <h3 className="text-[10px] font-bold text-[#333]">По типу</h3>
            </div>
            <div className="p-2 grid grid-cols-3 gap-1.5">
              {[
                { type: 'incoming', label: 'Входящие', icon: '📥', color: '#0066cc' },
                { type: 'outgoing', label: 'Исходящие', icon: '📤', color: '#2e7d32' },
                { type: 'internal', label: 'Внутренние', icon: '📄', color: '#6a1b9a' },
              ].map(t => (
                <div key={t.type} className="text-center p-2 bg-[#f9f9f9] border border-[#ccc] rounded-sm">
                  <span className="text-lg">{t.icon}</span>
                  <p className="text-sm font-bold text-[#333] mt-0.5">{stats.byType[t.type]}</p>
                  <p className="text-[8px] text-[#666]">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* By status */}
          <div className="bg-white border border-[#aaa] shadow-sm">
            <div className="px-2 py-1 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc]">
              <h3 className="text-[10px] font-bold text-[#333]">По статусу</h3>
            </div>
            <div className="p-2 space-y-1">
              {[
                { status: 'draft', label: 'Черновики', color: '#666' },
                { status: 'on_approval', label: 'На согласовании', color: '#cc6600' },
                { status: 'signed', label: 'Подписаны', color: '#2e7d32' },
                { status: 'executed', label: 'Исполнены', color: '#1b5e20' },
                { status: 'rejected', label: 'Отклонены', color: '#c62828' },
              ].map(item => (
                <div key={item.status} className="flex items-center gap-1.5 text-[9px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#333] flex-1">{item.label}</span>
                  <span className="font-bold text-[#333]">{stats.byStatus[item.status] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
