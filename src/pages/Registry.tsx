import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, DocType } from '../App';
import { BookOpen, Inbox, Send, FileText, Search, Calendar } from 'lucide-react';

export default function Registry() {
  const { documents, employees } = useContext(AppContext);
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = documents.filter(d => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.number.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || (d.correspondent || '').toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const incoming = documents.filter(d => d.type === 'incoming').length;
  const outgoing = documents.filter(d => d.type === 'outgoing').length;
  const internal = documents.filter(d => d.type === 'internal').length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Канцелярия</h1>
        <p className="text-xs text-slate-500">Регистрация и учёт документов</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Входящие', value: incoming, icon: Inbox, color: 'from-blue-500 to-blue-600', filter: 'incoming' as DocType },
          { label: 'Исходящие', value: outgoing, icon: Send, color: 'from-emerald-500 to-emerald-600', filter: 'outgoing' as DocType },
          { label: 'Внутренние', value: internal, icon: FileText, color: 'from-purple-500 to-purple-600', filter: 'internal' as DocType },
        ].map(s => (
          <button key={s.label} onClick={() => setTypeFilter(s.filter)} className={`bg-white rounded-lg border p-3 text-left transition hover:shadow-md ${typeFilter === s.filter ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'}`}>
            <div className={`w-8 h-8 rounded bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon size={14} className="text-white" />
            </div>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по номеру, названию, корреспонденту..." className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
        <button onClick={() => { setTypeFilter('all'); setSearch(''); }} className="px-2.5 h-8 text-[11px] text-slate-500 hover:text-slate-700">Сбросить</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Тип</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Номер</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Дата</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">Название</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600 hidden md:table-cell">Корреспондент</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600 hidden lg:table-cell">Автор</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition">
                <td className="px-3 py-2 text-center">{doc.type === 'incoming' ? '📥' : doc.type === 'outgoing' ? '📤' : '📄'}</td>
                <td className="px-3 py-2"><Link to={`/documents/${doc.id}`} className="font-medium text-blue-600 hover:underline">{doc.number}</Link></td>
                <td className="px-3 py-2 text-slate-500">{fmtDate(doc.createdAt)}</td>
                <td className="px-3 py-2"><Link to={`/documents/${doc.id}`} className="text-slate-800 hover:text-blue-600 truncate block max-w-[200px]">{doc.title}</Link></td>
                <td className="px-3 py-2 text-slate-600 hidden md:table-cell">{doc.correspondent || '—'}</td>
                <td className="px-3 py-2 text-slate-600 hidden lg:table-cell">{getEmp(doc.authorId)?.name.split(' ').slice(0, 2).join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <BookOpen size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Документы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
