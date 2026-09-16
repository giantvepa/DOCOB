import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext, DocStatus, DocCategory, DocType } from '../App';
import { Search, Plus, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';

const STATUS_MAP: Record<DocStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Черновик', color: 'text-slate-600', bg: 'bg-slate-100' },
  on_approval: { label: 'На согласовании', color: 'text-amber-700', bg: 'bg-amber-50' },
  on_signing: { label: 'На подписании', color: 'text-blue-700', bg: 'bg-blue-50' },
  signed: { label: 'Подписан', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  executed: { label: 'Исполнен', color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { label: 'Отклонён', color: 'text-red-700', bg: 'bg-red-50' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-50' },
};

const TYPE_LABELS: Record<DocType, string> = {
  incoming: 'Входящий',
  outgoing: 'Исходящий',
  internal: 'Внутренний',
};

export default function Documents() {
  const { documents, employees } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') as DocType | null;
  const statusParam = searchParams.get('status') as DocStatus | null;

  const [search, setSearch] = useState(qParam);
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>(typeParam || 'all');
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>(statusParam || 'all');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.number.toLowerCase().includes(q) || (d.correspondent || '').toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(d => d.category === categoryFilter);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, search, typeFilter, statusFilter, categoryFilter]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const sectionTitle = typeParam === 'incoming' ? 'Входящие документы' : typeParam === 'outgoing' ? 'Исходящие документы' : typeParam === 'internal' ? 'Внутренние документы' : statusParam === 'draft' ? 'Черновики' : statusParam === 'on_approval' ? 'Документы на согласовании' : statusParam === 'archived' ? 'Архив' : 'Все документы';

  const selectedDoc = documents.find(d => d.id === selectedId);

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="px-3 py-2 bg-white border-b border-slate-300 flex items-center gap-2 flex-shrink-0">
        <span className="text-[12px] font-bold text-slate-800">{sectionTitle}</span>
        <span className="text-[10px] text-slate-400">({filtered.length})</span>
        <div className="ml-auto flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded transition">
            <Plus size={11} /> Создать
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="px-3 py-1.5 bg-[#f5f5f5] border-b border-slate-200 flex items-center gap-2 flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="w-full h-6 pl-6 pr-2 bg-white border border-slate-300 rounded text-[11px] focus:outline-none focus:border-blue-400" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as DocType | 'all')} className="h-6 px-1.5 bg-white border border-slate-300 rounded text-[10px]">
          <option value="all">Все типы</option>
          <option value="incoming">Входящие</option>
          <option value="outgoing">Исходящие</option>
          <option value="internal">Внутренние</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocStatus | 'all')} className="h-6 px-1.5 bg-white border border-slate-300 rounded text-[10px]">
          <option value="all">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="on_approval">На согласовании</option>
          <option value="on_signing">На подписании</option>
          <option value="signed">Подписан</option>
          <option value="executed">Исполнен</option>
          <option value="rejected">Отклонён</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'all')} className="h-6 px-1.5 bg-white border border-slate-300 rounded text-[10px]">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#e8eef5] border-b border-slate-300">
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200 w-8">№</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200 w-24">Рег. номер</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200 w-20">Дата</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200 w-16">Тип</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200">Корреспондент</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200">Тема документа</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 border-r border-slate-200 w-20">Статус</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600 w-24">Автор</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, idx) => {
                const s = STATUS_MAP[doc.status];
                const author = getEmp(doc.authorId);
                const isSelected = selectedId === doc.id;
                return (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-100' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    } hover:bg-blue-50`}
                  >
                    <td className="px-2 py-1 text-slate-400 border-r border-slate-100">{idx + 1}</td>
                    <td className="px-2 py-1 border-r border-slate-100">
                      <Link to={`/documents/${doc.id}`} className="text-blue-600 hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                        {doc.number}
                      </Link>
                    </td>
                    <td className="px-2 py-1 text-slate-600 border-r border-slate-100">{fmtDate(doc.createdAt)}</td>
                    <td className="px-2 py-1 text-slate-600 border-r border-slate-100">{TYPE_LABELS[doc.type]}</td>
                    <td className="px-2 py-1 text-slate-600 border-r border-slate-100 truncate max-w-[150px]">{doc.correspondent || '—'}</td>
                    <td className="px-2 py-1 text-slate-800 border-r border-slate-100 truncate max-w-[250px]">{doc.title}</td>
                    <td className="px-2 py-1 border-r border-slate-100">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-2 py-1 text-slate-600">{author?.name.split(' ').slice(0, 2).join(' ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[11px] text-slate-400">Документы не найдены</div>
          )}
        </div>

        {/* Right panel — quick card preview */}
        {selectedDoc && (
          <div className="w-72 border-l border-slate-300 bg-white flex-shrink-0 overflow-y-auto hidden xl:block">
            <div className="p-3 border-b border-slate-200 bg-[#e8f0f8]">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Карточка документа</p>
            </div>
            <div className="p-3 space-y-2.5">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Рег. номер</p>
                <p className="text-[11px] font-medium text-blue-600">{selectedDoc.number}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Тема</p>
                <p className="text-[11px] text-slate-800">{selectedDoc.title}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Статус</p>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${STATUS_MAP[selectedDoc.status].bg} ${STATUS_MAP[selectedDoc.status].color}`}>
                  {STATUS_MAP[selectedDoc.status].label}
                </span>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Описание</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{selectedDoc.description}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Маршрут согласования</p>
                <div className="space-y-1 mt-1">
                  {selectedDoc.approvals.map((a, i) => {
                    const approver = employees.find(e => e.id === a.userId);
                    return (
                      <div key={a.id} className="flex items-center gap-1.5 text-[10px]">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${
                          a.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {a.status === 'approved' ? '✓' : a.status === 'rejected' ? '✗' : (i + 1)}
                        </span>
                        <span className="text-slate-700 truncate">{approver?.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to={`/documents/${selectedDoc.id}`} className="block w-full text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-medium transition mt-3">
                Открыть карточку →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="px-3 py-1 bg-[#f5f5f5] border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0 flex items-center justify-between">
        <span>Записей: {filtered.length}</span>
        <span>Фильтр: {typeFilter !== 'all' ? TYPE_LABELS[typeFilter as DocType] : 'все типы'} | {statusFilter !== 'all' ? STATUS_MAP[statusFilter as DocStatus].label : 'все статусы'}</span>
      </div>
    </div>
  );
}
