import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Plus, FileText, MoreVertical, Inbox, Send, FileText as FileIcon,
  CheckCircle2, Clock, XCircle, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

// ============ КОНФИГУРАЦИИ ============

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string; icon: any }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400', icon: FileIcon },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-400', icon: Clock },
  on_signing: { label: 'На подписании', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-400', icon: Clock },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-400', icon: CheckCircle2 },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-400', icon: CheckCircle2 },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-400', icon: XCircle },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400', icon: FileIcon },
};

export const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Низкий', color: 'text-gray-600', bg: 'bg-gray-100' },
  normal: { label: 'Обычный', color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { label: 'Высокий', color: 'text-amber-600', bg: 'bg-amber-100' },
  critical: { label: 'Критичный', color: 'text-red-600', bg: 'bg-red-100' },
};

export const TYPE_ICONS: Record<string, any> = {
  incoming: Inbox,
  outgoing: Send,
  internal: FileIcon,
};

export const TYPE_LABELS: Record<string, string> = {
  incoming: 'Входящий',
  outgoing: 'Исходящий',
  internal: 'Внутренний',
};

// ============ ТИПЫ ============

export interface DocumentRecord {
  id: string | number;
  number: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  authorId?: string | number;
  author?: string | number;
  correspondent?: string;
  dueDate?: string;
  due_date?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface EmployeeRecord {
  id: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  position?: string;
  [key: string]: any;
}

export type SortField = 'updatedAt' | 'createdAt' | 'number' | 'title';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'table' | 'cards';

// ============ ПРОПСЫ ============

interface DocumentTableProps {
  title: string;
  documents: DocumentRecord[];
  employees: EmployeeRecord[];
  totalCount?: number;
  
  // Колонки
  columns?: {
    showCheckbox?: boolean;
    showType?: boolean;
    showPriority?: boolean;
    showCorrespondent?: boolean;
    showDueDate?: boolean;
    showAuthor?: boolean;
  };
  
  // Фильтры
  filters?: {
    showTypeFilter?: boolean;
    showStatusFilter?: boolean;
    showPriorityFilter?: boolean;
    defaultType?: string;
    defaultStatus?: string;
  };
  
  // Действия
  onCreateClick?: () => void;
  onBulkAction?: (action: string, ids: (string | number)[]) => void;
  createButtonLabel?: string;
  
  // Поведение
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  linkPrefix?: string;
}

// ============ КОМПОНЕНТ ============

export default function DocumentTable({
  title,
  documents,
  employees,
  totalCount,
  columns = {},
  filters = {},
  onCreateClick,
  onBulkAction,
  createButtonLabel = 'Создать',
  searchable = true,
  sortable = true,
  selectable = true,
  linkPrefix = '/documents',
}: DocumentTableProps) {
  // Дефолтные значения колонок
  const {
    showCheckbox = selectable,
    showType = true,
    showPriority = true,
    showCorrespondent = true,
    showDueDate = true,
    showAuthor = true,
  } = columns;

  // Дефолтные значения фильтров
  const {
    showTypeFilter = true,
    showStatusFilter = true,
    showPriorityFilter = true,
    defaultType = 'all',
    defaultStatus = 'all',
  } = filters;

  // Состояния
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(defaultType);
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedDocs, setSelectedDocs] = useState<Set<string | number>>(new Set());

  // Фильтрация и сортировка
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
    if (sortable) {
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
    }

    return result;
  }, [documents, search, typeFilter, statusFilter, priorityFilter, sortField, sortDirection, sortable]);

  // Утилиты
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtDateShort = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const getEmp = (id: string | number) => employees.find(e => e.id === id);

  const getAuthorName = (doc: DocumentRecord) => {
    const emp = getEmp(doc.authorId || doc.author || '');
    if (!emp) return '—';
    return (emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.username || emp.email || '—');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleSelect = (id: string | number) => {
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
    setTypeFilter(defaultType);
    setStatusFilter(defaultStatus);
    setPriorityFilter('all');
    setSelectedDocs(new Set());
  };

  const hasActiveFilters = search || typeFilter !== defaultType || statusFilter !== defaultStatus || priorityFilter !== 'all';

  // ============ RENDER ============

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} {totalCount !== undefined ? `из ${totalCount}` : ''} документов
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
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              {createButtonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-modern p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          {searchable && (
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
          )}

          {/* Type Filter */}
          {showTypeFilter && (
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
          )}

          {/* Status Filter */}
          {showStatusFilter && (
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
          )}

          {/* Priority Filter */}
          {showPriorityFilter && (
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
          )}

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

        {/* Active filters */}
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
                Тип: {TYPE_LABELS[typeFilter] || typeFilter}
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
      {selectable && selectedDocs.size > 0 && onBulkAction && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-blue-900 font-medium">
            Выбрано документов: {selectedDocs.size}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('approve', Array.from(selectedDocs))}
              className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
            >
              Согласовать
            </button>
            <button
              onClick={() => onBulkAction('export', Array.from(selectedDocs))}
              className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
            >
              Экспорт
            </button>
            <button
              onClick={() => onBulkAction('delete', Array.from(selectedDocs))}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
            >
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
                  {showCheckbox && (
                    <th className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocs.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  {sortable ? (
                    <th
                      className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort('number')}
                    >
                      <div className="flex items-center gap-1">
                        Рег. номер
                        {sortField === 'number' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  ) : (
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Рег. номер</th>
                  )}
                  {sortable ? (
                    <th
                      className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        Тема документа
                        {sortField === 'title' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  ) : (
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Тема документа</th>
                  )}
                  {showType && <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Тип</th>}
                  {showPriority && <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Приоритет</th>}
                  <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Статус</th>
                  {showCorrespondent && <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Корреспондент</th>}
                  {showAuthor && <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Автор</th>}
                  {sortable ? (
                    <th
                      className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort('updatedAt')}
                    >
                      <div className="flex items-center gap-1">
                        Обновлено
                        {sortField === 'updatedAt' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  ) : (
                    <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Обновлено</th>
                  )}
                  {showDueDate && <th className="text-left px-4 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Срок</th>}
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(doc => {
                  const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                  const priorityConf = PRIORITY_CONFIG[doc.priority] || PRIORITY_CONFIG.normal;
                  const TypeIcon = TYPE_ICONS[doc.type] || FileIcon;
                  const StatusIcon = statusConf.icon;
                  const isSelected = selectedDocs.has(doc.id);
                  const dueDate = doc.dueDate || doc.due_date;
                  const isOverdue = dueDate && new Date(dueDate) < new Date() && doc.status !== 'executed' && doc.status !== 'signed';

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-gray-50 transition cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={() => selectable && toggleSelect(doc.id)}
                    >
                      {showCheckbox && (
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(doc.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <Link
                          to={`${linkPrefix}/${doc.id}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {doc.number}
                        </Link>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <Link
                          to={`${linkPrefix}/${doc.id}`}
                          className="text-sm text-gray-900 hover:text-blue-600 transition block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="font-medium truncate">{doc.title}</p>
                          {doc.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>}
                        </Link>
                      </td>
                      {showType && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon size={14} className="text-gray-500" />
                            <span className="text-xs text-gray-600">{TYPE_LABELS[doc.type] || doc.type}</span>
                          </div>
                        </td>
                      )}
                      {showPriority && (
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                            {priorityConf.label}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                          <StatusIcon size={12} />
                          {statusConf.label}
                        </span>
                      </td>
                      {showCorrespondent && (
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-600 truncate block max-w-[150px]">{doc.correspondent || '—'}</span>
                        </td>
                      )}
                      {showAuthor && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getEmp(doc.authorId || doc.author || '')?.avatar || getAuthorName(doc).charAt(0)}
                            </div>
                            <span className="text-xs text-gray-600 truncate max-w-[100px]">{getAuthorName(doc)}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">{fmtDateShort(doc.updatedAt)}</span>
                      </td>
                      {showDueDate && (
                        <td className="px-4 py-4">
                          {dueDate ? (
                            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {isOverdue && <AlertCircle size={12} />}
                              {fmtDateShort(dueDate)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      )}
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
              <p className="text-sm text-gray-500">Документы не найдены</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span>Показано {filtered.length} из {totalCount || documents.length} документов</span>
              {sortable && (
                <div className="flex items-center gap-2">
                  <span>
                    Сортировка: {sortField === 'updatedAt' ? 'Дата обновления' : sortField === 'createdAt' ? 'Дата создания' : sortField === 'number' ? 'Номер' : 'Название'}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span>{sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
            const priorityConf = PRIORITY_CONFIG[doc.priority] || PRIORITY_CONFIG.normal;
            const TypeIcon = TYPE_ICONS[doc.type] || FileIcon;
            const StatusIcon = statusConf.icon;
            const dueDate = doc.dueDate || doc.due_date;
            const isOverdue = dueDate && new Date(dueDate) < new Date() && doc.status !== 'executed' && doc.status !== 'signed';

            return (
              <Link
                key={doc.id}
                to={`${linkPrefix}/${doc.id}`}
                className="bg-white rounded-2xl shadow-modern hover-card overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.type === 'incoming' ? 'bg-blue-100' : doc.type === 'outgoing' ? 'bg-green-100' : 'bg-purple-100'
                        }`}
                      >
                        <TypeIcon
                          size={16}
                          className={doc.type === 'incoming' ? 'text-blue-600' : doc.type === 'outgoing' ? 'text-green-600' : 'text-purple-600'}
                        />
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

                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">{doc.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{doc.description}</p>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                      <StatusIcon size={10} />
                      {statusConf.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityConf.bg} ${priorityConf.color}`}>
                      {priorityConf.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {getEmp(doc.authorId || doc.author || '')?.avatar || getAuthorName(doc).charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{getAuthorName(doc).split(' ').slice(0, 2).join(' ')}</p>
                        <p className="text-[10px] text-gray-500">{fmtDateShort(doc.updatedAt)}</p>
                      </div>
                    </div>
                    {doc.correspondent && <span className="text-[10px] text-gray-500 truncate max-w-[100px]">{doc.correspondent}</span>}
                  </div>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Документы не найдены</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
