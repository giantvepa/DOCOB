import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, DocType } from '../App';
import { Search, Inbox, Send, FileText } from 'lucide-react';

export default function Registry() {
  const { documents, employees, t } = useContext(AppContext);
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

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const incoming = documents.filter(d => d.type === 'incoming').length;
  const outgoing = documents.filter(d => d.type === 'outgoing').length;
  const internal = documents.filter(d => d.type === 'internal').length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">Канцелярия</span>
        <span className="text-[9px] text-[#666]">Регистрация и учёт документов</span>
      </div>

      <div className="px-2 py-1.5 bg-[#f0f0f0] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        {[
          { label: 'Входящие', value: incoming, icon: Inbox, color: '#0066cc', filter: 'incoming' as DocType },
          { label: 'Исходящие', value: outgoing, icon: Send, color: '#2e7d32', filter: 'outgoing' as DocType },
          { label: 'Внутренние', value: internal, icon: FileText, color: '#6a1b9a', filter: 'internal' as DocType },
        ].map(s => (
          <button key={s.label} onClick={() => setTypeFilter(s.filter)} className={`flex items-center gap-1 px-2 py-0.5 border rounded-sm text-[10px] transition ${typeFilter === s.filter ? 'bg-[#cce4ff] border-[#7ba8e0] text-[#003d80]' : 'bg-white border-[#aaa] text-[#333] hover:bg-[#e8f0fb]'}`}>
            <s.icon size={10} style={{ color: s.color }} />
            <span className="font-medium">{s.label}</span>
            <span className="text-[8px] bg-[#ddd] px-0.5 rounded-sm">{s.value}</span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search size={10} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="h-[20px] pl-5 pr-1.5 bg-white border border-[#aaa] rounded-sm text-[10px] focus:outline-none focus:border-[#0066cc] w-40" />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-[10px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-b from-[#e8eef5] to-[#d0dce8] border-b border-[#aaa]">
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-6">Тип</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-20">Номер</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-16">Дата</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Название</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Корреспондент</th>
              <th className="text-left px-1.5 py-1 font-bold text-[#333]">Автор</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => (
              <tr key={doc.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#e3f0ff] border-b border-[#eee]`}>
                <td className="px-1.5 py-0.5 text-center border-r border-[#eee]">{doc.type === 'incoming' ? '📥' : doc.type === 'outgoing' ? '📤' : '📄'}</td>
                <td className="px-1.5 py-0.5 border-r border-[#eee]"><Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium">{doc.number}</Link></td>
                <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">{fmtDate(doc.createdAt)}</td>
                <td className="px-1.5 py-0.5 text-[#333] border-r border-[#eee] truncate max-w-[200px]"><Link to={`/documents/${doc.id}`} className="hover:text-[#0066cc]">{doc.title}</Link></td>
                <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">{doc.correspondent || '—'}</td>
                <td className="px-1.5 py-0.5 text-[#555]">{getEmp(doc.authorId)?.name.split(' ').slice(0, 2).join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-8 text-[10px] text-[#888]">Документы не найдены</div>}
      </div>

      <div className="px-2 py-0.5 bg-[#f0f0f0] border-t border-[#aaa] text-[9px] text-[#555] flex-shrink-0">
        Записей: {filtered.length}
      </div>
    </div>
  );
}
