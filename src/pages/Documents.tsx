import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext, DocStatus, DocCategory, DocPriority } from '../App';
import {
  FileText, Clock, CheckCircle2, XCircle, Search, Filter,
  ChevronDown, MoreHorizontal, Eye, Download, Trash2, ArrowUpDown, Plus
} from 'lucide-react';

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; dot: string }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  pending: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  approved: { label: 'Утверждён', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-400' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50', dot: 'bg-slate-400' },
};

const PRIORITY_CONFIG: Record<DocPriority, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'text-slate-500' },
  medium: { label: 'Средний', color: 'text-blue-500' },
  high: { label: 'Высокий', color: 'text-amber-500' },
  urgent: { label: 'Срочный', color: 'text-red-500' },
};

export default function Documents() {
  const { documents, users, setDocuments } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(queryParam);
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...documents];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.number.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(d => d.category === categoryFilter);

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [documents, search, statusFilter, categoryFilter, sortBy]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatFileSize = (bytes: number) => bytes >= 1000000 ? `${(bytes / 1000000).toFixed(1)} МБ` : `${(bytes / 1000).toFixed(0)} КБ`;
  const getAuthor = (id: string) => users.find(u => u.id === id);

  const handleArchive = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'archived' as DocStatus } : d));
    setOpenMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить документ?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      setOpenMenu(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Документы</h1>
          <p className="text-sm text-slate-500">Управление документами организации</p>
        </div>
        <Link to="/upload" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">Новый документ</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию, номеру, тегам..."
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocStatus | 'all')}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновики</option>
            <option value="pending">На согласовании</option>
            <option value="approved">Утверждённые</option>
            <option value="rejected">Отклонённые</option>
            <option value="archived">В архиве</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'all')}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Все категории</option>
            <option value="Договор">Договоры</option>
            <option value="Счёт">Счета</option>
            <option value="Акт">Акты</option>
            <option value="Заявление">Заявления</option>
            <option value="Приказ">Приказы</option>
            <option value="Служебная записка">Служебные записки</option>
            <option value="Доверенность">Доверенности</option>
            <option value="Прочее">Прочее</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'status')}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="date">По дате</option>
            <option value="title">По названию</option>
            <option value="status">По статусу</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              Таблица
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition ${viewMode === 'cards' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              Карточки
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Найдено: {filtered.length} из {documents.length} документов
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Документ</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Категория</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Статус</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Автор</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Дата</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(doc => {
                  const statusConf = STATUS_CONFIG[doc.status];
                  const author = getAuthor(doc.authorId);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-5 py-3">
                        <Link to={`/documents/${doc.id}`} className="block">
                          <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition truncate max-w-xs">{doc.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{doc.number} • {formatFileSize(doc.fileSize)}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{doc.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{author?.avatar}</span>
                          <span className="text-xs text-slate-600">{author?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-500">{formatDate(doc.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === doc.id ? null : doc.id)}
                          className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal size={14} className="text-slate-500" />
                        </button>
                        {openMenu === doc.id && (
                          <div className="absolute right-4 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                            <Link to={`/documents/${doc.id}`} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                              <Eye size={12} /> Просмотр
                            </Link>
                            <button onClick={() => handleArchive(doc.id)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 w-full text-left">
                              <Download size={12} /> В архив
                            </button>
                            <button onClick={() => handleDelete(doc.id)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full text-left">
                              <Trash2 size={12} /> Удалить
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Документы не найдены</p>
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const statusConf = STATUS_CONFIG[doc.status];
            const author = getAuthor(doc.authorId);
            return (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                    {statusConf.label}
                  </span>
                  <span className="text-[10px] text-slate-400">{doc.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{doc.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{author?.avatar}</span>
                    <span className="text-[11px] text-slate-500">{author?.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(doc.updatedAt)}</span>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Документы не найдены</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
