import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext } from '../App';
import { Search, Plus, FileText, Eye, Download, MoreVertical } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  draft: { label: 'Черновик', color: 'text-[#666]', bg: 'bg-[#e8e8e8]', dot: 'bg-[#999]' },
  on_approval: { label: 'На согласовании', color: 'text-[#cc6600]', bg: 'bg-[#fff3e0]', dot: 'bg-[#cc6600]' },
  on_signing: { label: 'На подписании', color: 'text-[#0066cc]', bg: 'bg-[#e3f2fd]', dot: 'bg-[#0066cc]' },
  signed: { label: 'Подписан', color: 'text-[#2e7d32]', bg: 'bg-[#e8f5e9]', dot: 'bg-[#2e7d32]' },
  executed: { label: 'Исполнен', color: 'text-[#1b5e20]', bg: 'bg-[#c8e6c9]', dot: 'bg-[#1b5e20]' },
  rejected: { label: 'Отклонён', color: 'text-[#c62828]', bg: 'bg-[#ffebee]', dot: 'bg-[#c62828]' },
  archived: { label: 'В архиве', color: 'text-[#666]', bg: 'bg-[#f5f5f5]', dot: 'bg-[#999]' },
};

export default function Documents() {
  const { documents, employees, t } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(typeParam || 'all');
  const [statusFilter, setStatusFilter] = useState(statusParam || 'all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.number.toLowerCase().includes(q) || 
        (d.correspondent || '').toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, search, typeFilter, statusFilter]);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU');
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const selectedDoc = documents.find(d => d.id === selectedId);

  const sectionTitle = typeParam === 'incoming' ? 'Входящие документы' : 
                       typeParam === 'outgoing' ? 'Исходящие документы' : 
                       typeParam === 'internal' ? 'Внутренние документы' : 
                       statusParam === 'draft' ? 'Черновики' : 
                       statusParam === 'on_approval' ? 'Документы на согласовании' : 
                       statusParam === 'archived' ? 'Архив документов' : 
                       'Все документы';

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="px-3 py-1.5 bg-white border-b border-[#999] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">{sectionTitle}</span>
        <span className="text-[9px] text-[#666]">({filtered.length})</span>
        <div className="ml-auto flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#0066cc] hover:bg-[#0055aa] text-white rounded border border-[#004499]">
            <Plus size={10} /> Создать
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-3 py-1 bg-[#f0f0f0] border-b border-[#999] flex items-center gap-1.5 flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[150px] max-w-[200px]">
          <Search size={10} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..." 
            className="w-full h-[20px] pl-5 pr-1.5 bg-white border border-[#999] rounded-sm text-[10px] focus:outline-none focus:border-[#0066cc]" 
          />
        </div>
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-[20px] px-1 bg-white border border-[#999] rounded-sm text-[10px]"
        >
          <option value="all">Все типы</option>
          <option value="incoming">Входящие</option>
          <option value="outgoing">Исходящие</option>
          <option value="internal">Внутренние</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[20px] px-1 bg-white border border-[#999] rounded-sm text-[10px]"
        >
          <option value="all">Все статусы</option>
          <option value="draft">Черновик</option>
          <option value="on_approval">На согласовании</option>
          <option value="signed">Подписан</option>
          <option value="executed">Исполнен</option>
          <option value="rejected">Отклонён</option>
        </select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-[10px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-b from-[#e8eef5] to-[#d0dce8] border-b border-[#999]">
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-6">№</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-20">Рег. номер</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-16">Дата</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-14">Тип</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Корреспондент</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb]">Тема документа</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] border-r border-[#bbb] w-20">Статус</th>
                <th className="text-left px-1.5 py-1 font-bold text-[#333] w-20">Автор</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, idx) => {
                const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                const author = getEmp(doc.authorId || doc.author);
                const isSelected = selectedId === doc.id;
                return (
                  <tr 
                    key={doc.id} 
                    onClick={() => setSelectedId(doc.id)}
                    className={`border-b border-[#eee] cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#cce4ff]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'
                    } hover:bg-[#e3f0ff]`}
                  >
                    <td className="px-1.5 py-0.5 text-[#888] border-r border-[#eee]">{idx + 1}</td>
                    <td className="px-1.5 py-0.5 border-r border-[#eee]">
                      <Link to={`/documents/${doc.id}`} className="text-[#0066cc] hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                        {doc.number}
                      </Link>
                    </td>
                    <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">{fmtDate(doc.createdAt)}</td>
                    <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee]">
                      {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}
                    </td>
                    <td className="px-1.5 py-0.5 text-[#555] border-r border-[#eee] truncate max-w-[120px]">{doc.correspondent || '—'}</td>
                    <td className="px-1.5 py-0.5 text-[#333] border-r border-[#eee] truncate max-w-[200px]">{doc.title}</td>
                    <td className="px-1.5 py-0.5 border-r border-[#eee]">
                      <span className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-sm text-[8px] font-medium ${statusConf.bg} ${statusConf.color}`}>
                        <span className={`w-1 h-1 rounded-full ${statusConf.dot}`}></span>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-1.5 py-0.5 text-[#555]">
                      {author ? `${author.first_name || author.name || ''} ${author.last_name || ''}`.trim() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[10px] text-[#888]">
              <FileText size={24} className="mx-auto mb-2 text-[#ccc]" />
              Документы не найдены
            </div>
          )}
        </div>

        {/* Right Panel - Quick Preview */}
        {selectedDoc && (
          <div className="w-[280px] border-l border-[#999] bg-white flex-shrink-0 overflow-y-auto hidden xl:flex flex-col">
            <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#999]">
              <p className="text-[9px] font-bold text-[#333] uppercase">Предварительный просмотр</p>
            </div>
            <div className="p-2 space-y-2 text-[10px] flex-1">
              <div>
                <label className="text-[8px] text-[#666] uppercase font-bold">Рег. номер</label>
                <p className="text-[10px] font-medium text-[#0066cc]">{selectedDoc.number}</p>
              </div>
              <div>
                <label className="text-[8px] text-[#666] uppercase font-bold">Тема</label>
                <p className="text-[10px] text-[#333] font-medium">{selectedDoc.title}</p>
              </div>
              <div>
                <label className="text-[8px] text-[#666] uppercase font-bold">Статус</label>
                <span className={`inline-block px-1 py-0.5 rounded-sm text-[8px] font-medium ${STATUS_CONFIG[selectedDoc.status]?.bg} ${STATUS_CONFIG[selectedDoc.status]?.color}`}>
                  {STATUS_CONFIG[selectedDoc.status]?.label}
                </span>
              </div>
              <div>
                <label className="text-[8px] text-[#666] uppercase font-bold">Описание</label>
                <p className="text-[9px] text-[#555] leading-relaxed">{selectedDoc.description}</p>
              </div>
              <div>
                <label className="text-[8px] text-[#666] uppercase font-bold">Маршрут согласования</label>
                <div className="space-y-0.5 mt-0.5">
                  {selectedDoc.approvals?.map((a, i) => {
                    const approver = employees.find(e => e.id === (a.userId || a.user));
                    return (
                      <div key={a.id} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[7px] ${
                          a.status === 'approved' ? 'bg-[#c8e6c9] text-[#1b5e20]' :
                          a.status === 'rejected' ? 'bg-[#ffcdd2] text-[#c62828]' :
                          'bg-[#fff3e0] text-[#cc6600]'
                        }`}>
                          {a.status === 'approved' ? '✓' : a.status === 'rejected' ? '✗' : (i + 1)}
                        </span>
                        <span className="text-[9px] text-[#333] truncate">
                          {approver ? `${approver.first_name || approver.name || ''} ${approver.last_name || ''}`.trim() : 'Неизвестно'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to={`/documents/${selectedDoc.id}`} className="block w-full text-center py-1 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm text-[10px] font-medium transition mt-2">
                Открыть карточку →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="px-2 py-0.5 bg-[#f0f0f0] border-t border-[#999] text-[9px] text-[#555] flex-shrink-0 flex items-center justify-between">
        <span>Записей: {filtered.length} | Выделено: {selectedId ? 1 : 0}</span>
        <span>Фильтр: {typeFilter !== 'all' ? (typeFilter === 'incoming' ? 'Входящие' : typeFilter === 'outgoing' ? 'Исходящие' : 'Внутренние') : 'все типы'} | {statusFilter !== 'all' ? STATUS_CONFIG[statusFilter]?.label : 'все статусы'}</span>
      </div>
    </div>
  );
}
