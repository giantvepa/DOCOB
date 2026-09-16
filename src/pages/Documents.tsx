import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext, DocStatus, DocCategory, DocType } from '../App';
import { FileText, Search, Filter, Plus, MoreHorizontal, Eye, Download, Archive, ChevronDown } from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50' },
};

const TYPE_MAP: Record<DocType, { label: string; icon: string }> = {
  incoming: { label: 'Входящий', icon: '📥' },
  outgoing: { label: 'Исходящий', icon: '📤' },
  internal: { label: 'Внутренний', icon: '📄' },
};

export default function Documents() {
  const { documents, employees, setDocuments } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') as DocType | null;

  const [search, setSearch] = useState(qParam);
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>(typeParam || 'all');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.number.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);
    if (categoryFilter !== 'all') result = result.filter(d => d.category === categoryFilter);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, search, statusFilter, typeFilter, categoryFilter]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtSize = (b: number) => b >= 1e6 ? `${(b / 1e6).toFixed(1)} МБ` : `${(b / 1e3).toFixed(0)} КБ`;
  const getEmp = (id: string) => employees.find(e => e.id === id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Документы</h1>
          <p className="text-xs text-slate-500">Реестр документов организации</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition">
          <Plus size={13} /> Создать
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[180px] relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру, названию, тегам..."
              className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as DocType | 'all')} className="h-8 px-2 bg-slate-50 border border-slate-200 rounded text-xs">
            <option value="all">Все типы</option>
            <option value="incoming">📥 Входящие</option>
            <option value="outgoing">📤 Исходящие</option>
            <option value="internal">📄 Внутренние</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocStatus | 'all')} className="h-8 px-2 bg-slate-50 border border-slate-200 rounded text-xs">
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="on_approval">На согласовании</option>
            <option value="on_signing">На подписании</option>
            <option value="signed">Подписан</option>
            <option value="executed">Исполнен</option>
            <option value="rejected">Отклонён</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'all')} className="h-8 px-2 bg-slate-50 border border-slate-200 rounded text-xs">
            <option value="all">Все категории</option>
            <option value="Договор">Договор</option>
            <option value="Счёт">Счёт</option>
            <option value="Акт">Акт</option>
            <option value="Письмо">Письмо</option>
            <option value="Приказ">Приказ</option>
            <option value="Заявление">Заявление</option>
            <option value="Служебная записка">Служебная записка</option>
            <option value="Протокол">Протокол</option>
          </select>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Найдено: {filtered.length} из {documents.length}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Тип</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Номер</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Название</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 hidden md:table-cell">Категория</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600">Статус</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 hidden lg:table-cell">Автор</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 hidden sm:table-cell">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(doc => {
                const s = STATUS_MAP[doc.status];
                const t = TYPE_MAP[doc.type];
                const author = getEmp(doc.authorId);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition group">
                    <td className="px-3 py-2 text-center text-sm">{t.icon}</td>
                    <td className="px-3 py-2">
                      <Link to={`/documents/${doc.id}`} className="font-medium text-blue-600 hover:underline">{doc.number}</Link>
                    </td>
                    <td className="px-3 py-2">
                      <Link to={`/documents/${doc.id}`} className="text-slate-800 hover:text-blue-600 transition">
                        <p className="font-medium truncate max-w-[250px]">{doc.title}</p>
                        {doc.correspondent && <p className="text-[10px] text-slate-500 mt-0.5">{doc.correspondent}</p>}
                      </Link>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">{doc.category}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell text-slate-600">{author?.name.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="px-3 py-2 hidden sm:table-cell text-slate-500">{fmtDate(doc.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Документы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
