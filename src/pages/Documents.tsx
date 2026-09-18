import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../App';
import { Search, Plus, Filter, Eye, Download, MoreVertical, FileText, Calendar, User, ChevronDown, ChevronUp, Inbox, Send, FileText as FileIcon, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400', icon: FileIcon },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-400', icon: Clock },
  on_signing: { label: 'На подписании', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-400', icon: Clock },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-400', icon: CheckCircle2 },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-400', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-400', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400', icon: FileIcon },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-gray-600', bg: 'bg-gray-100' },
  normal: { label: 'Обычный', color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { label: 'Высокий', color: 'text-amber-600', bg: 'bg-amber-100' },
  critical: { label: 'Критичный', color: 'text-red-600', bg: 'bg-red-100' },
};

const TYPE_ICONS: Record<string, any> = {
  incoming: Inbox,
  outgoing: Send,
  internal: FileIcon,
};

export default function Documents() {
  const { documents, employees, t } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(typeParam || 'all');
  const [statusFilter, setStatusFilter] = useState(statusParam || 'all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<'updatedAt' | 'createdAt' | 'number' | 'title'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = [...documents];
    
    // Поиск
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.number.toLowerCase().includes(q) || 
        (d.correspondent || '').toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q)
      );
    }
    
    // Фильтры
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(d => d.priority === priorityFilter);
    
    // Сортировка
    result.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortField) {
        case 'number':
          aVal = a.number;
          bVal = b.number;
          break;
        case 'title':
          aVal = a.title;
          bVal = b.title;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          aVal = new Date(a.updatedAt).getTime();
          bVal = new Date(b.updatedAt).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    return result;
  }, [documents, search, typeFilter, statusFilter, priorityFilter, sortField, sortDirection]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedDocs.size === filtered.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(filtered.map(d => d.id)));
    }
  };

  const resetFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedDocs(new Set());
  };

  const hasActiveFilters = search || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all';

  // Определение заголовка страницы
  const getPageTitle = () => {
    if (typeParam === 'incoming') return 'Входящие документы';
    if (typeParam === 'outgoing') return 'Исходящие документы';
    if (typeParam === 'internal') return 'Внутренние документы';
    if (statusParam === 'draft') return 'Черновики';
    if (statusParam === 'on_approval') return 'Документы на согласовании';
    if (statusParam === 'archived') return 'Архив документов';
    return 'Все документы';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} {t('common.records')}
            {hasActiveFilters && <span className="ml-2 text-blue-600">(отфильтровано)</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Сбросить фильтры
            </button>
          )}
          <button className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2">
            <Plus size={18} />
            {t('toolbar.create')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-modern p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по номеру, названию, корреспонденту..."
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="all">Все типы</option>
            <option value="incoming">📥 Входящие</option>
            <option value="outgoing">📤 Исходящие</option>
            <option value="internal">📄 Внутренние</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="on_approval">На согласовании</option>
            <option value="on_signing">На подписании</option>
            <option value="signed">Подписан</option>
            <option value="executed">Исполнен</option>
            <option value="rejected">Отклонён</option>
            <option value="archived">В архиве</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          >
            <option value="all">Все приоритеты</option>
            <option value="critical">🔴 Критичный</option>
            <option value="high">🟠 Высокий</option>
            <option value="normal">🔵 Обычный</option>
            <option value="low">⚪ Низкий</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Таблица
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'cards' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Карточки
            </button>
          </div>
        </div>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Активные фильтры:</span>
            {search && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                Поиск: "{search}"
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                Тип: {typeFilter === 'incoming' ? 'Входящие' : typeFilter === 'outgoing' ? 'Исходящие' : 'Внутренние'}
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs">
                Статус: {STATUS_CONFIG[statusFilter]?.label}
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs">
                Приоритет: {PRIORITY_CONFIG[priorityFilter]?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedDocs.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-blue-900 font-medium">
            Выбрано документов: {selectedDocs.size}
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
              Согласовать
            </button>
            <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
              Экспорт
            </button>
            <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition">
              Удалить
            </button>
            <button
              onClick={() => setSelectedDocs(new Set())}
              className="px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
            >
              Отменить выбор
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocs.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('number')}
                  >
                    <div className="flex items-center gap-1">
                      {t('docs.number')}
                      {sortField === 'number' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      {t('docs.subject')}
                      {sortField === 'title' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Тип</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Приоритет</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('docs.status')}</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Корреспондент</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('docs.author')}</th>
                  <th 
                    className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <div className="flex items-center gap-1">
                      Обновлено
                      {sortField === 'updatedAt' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Срок</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(doc => {
                  const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                  const priorityConf = PRIORITY_CONFIG[doc.priority] || PRIORITY_CONFIG.normal;
                  const author = getEmp(doc.authorId || doc.author);
                  const TypeIcon = TYPE_ICONS[doc.type] || FileIcon;
                  const StatusIcon = statusConf.icon;
                  const isSelected = selectedDocs.has(doc.id);
                  const isOverdue = doc.dueDate && new Date(doc.dueDate) < new Date() && doc.status !== 'executed' && doc.status !== 'signed';
                  
                  return (
                    <tr 
                      key={doc.id} 
                      className={`hover:bg-gray-50 transition cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => toggleSelect(doc.id)}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(doc.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <Link 
                          to={`/documents/${doc.id}`} 
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {doc.number}
                        </Link>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <Link 
                          to={`/documents/${doc.id}`}
                          className="text-sm text-gray-900 hover:text-blue-600 transition block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="font-medium truncate">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon size={14} className="text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                          {priorityConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 truncate block max-w-[150px]">
                          {doc.correspondent || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {author?.avatar || (author?.first_name || author?.name || '?').charAt(0)}
                          </div>
                          <span className="text-xs text-gray-600 truncate max-w-[100px]">
                            {author ? `${author.first_name || author.name || ''} ${author.last_name || ''}`.trim() : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">{fmtDateShort(doc.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-4">
                        {doc.dueDate ? (
                          <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {isOverdue && <AlertCircle size={12} />}
                            {fmtDateShort(doc.dueDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">{t('docs.not_found')}</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
          
          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span>Показано {filtered.length} из {documents.length} документов</span>
              <div className="flex items-center gap-2">
                <span>Сортировка: {sortField === 'updatedAt' ? 'Дата обновления' : sortField === 'createdAt' ? 'Дата создания' : sortField === 'number' ? 'Номер' : 'Название'}</span>
                <span className="text-gray-400">|</span>
                <span>{sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
            const priorityConf = PRIORITY_CONFIG[doc.priority] || PRIORITY_CONFIG.normal;
            const author = getEmp(doc.authorId || doc.author);
            const TypeIcon = TYPE_ICONS[doc.type] || FileIcon;
            const StatusIcon = statusConf.icon;
            const isOverdue = doc.dueDate && new Date(doc.dueDate) < new Date() && doc.status !== 'executed' && doc.status !== 'signed';
            
            return (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="bg-white rounded-2xl shadow-modern hover-card overflow-hidden group">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        doc.type === 'incoming' ? 'bg-blue-100' : 
                        doc.type === 'outgoing' ? 'bg-green-100' : 
                        'bg-purple-100'
                      }`}>
                        <TypeIcon size={16} className={
                          doc.type === 'incoming' ? 'text-blue-600' : 
                          doc.type === 'outgoing' ? 'text-green-600' : 
                          'text-purple-600'
                        } />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{doc.number}</span>
                    </div>
                    {isOverdue && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium flex items-center gap-1">
                        <AlertCircle size={10} />
                        Просрочен
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                    {doc.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{doc.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                      <StatusIcon size={10} />
                      {statusConf.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                      {priorityConf.label}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {author?.avatar || (author?.first_name || author?.name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {author ? `${author.first_name || author.name || ''} ${author.last_name || ''}`.trim().split(' ').slice(0, 2).join(' ') : '—'}
                        </p>
                        <p className="text-[10px] text-gray-500">{fmtDateShort(doc.updatedAt)}</p>
                      </div>
                    </div>
                    {doc.correspondent && (
                      <span className="text-[10px] text-gray-500 truncate max-w-[100px]">
                        {doc.correspondent}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">{t('docs.not_found')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
