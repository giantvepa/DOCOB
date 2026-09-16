import { useContext, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppContext, DocStatus, DocCategory, DocType } from '../App';
import { Search, Plus, Filter, Eye, Download, MoreVertical, FileText, Calendar, User } from 'lucide-react';
import CreateDocumentModal from '../components/CreateDocumentModal';

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; dot: string }> = {
  draft: { label: 'Черновик', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' },
  on_approval: { label: 'На согласовании', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-400' },
  on_signing: { label: 'На подписании', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-400' },
  signed: { label: 'Подписан', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-400' },
  executed: { label: 'Исполнен', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-400' },
  rejected: { label: 'Отклонён', color: 'text-red-600', bg: 'bg-red-100', dot: 'bg-red-400' },
  archived: { label: 'В архиве', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
};

export default function Documents() {
  const { documents, employees, t } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as DocType | null;
  const statusParam = searchParams.get('status') as DocStatus | null;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>(typeParam || 'all');
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>(statusParam || 'all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showCreateDoc, setShowCreateDoc] = useState(false);

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

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const getEmp = (id: string) => employees.find(e => e.id === id);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('docs.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} {t('common.records')}</p>
        </div>
        <button 
          onClick={() => setShowCreateDoc(true)}
          className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          {t('toolbar.create')}
        </button>
      </div>

      {/* Create Document Modal */}
      {showCreateDoc && <CreateDocumentModal onClose={() => setShowCreateDoc(false)} />}

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
              placeholder={t('common.search')}
              className="w-full h-10 pl-10 pr-4 modern-input rounded-xl text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocType | 'all')}
            className="h-10 px-4 modern-input modern-select rounded-xl text-sm"
          >
            <option value="all">{t('common.all')} {t('docs.type')}</option>
            <option value="incoming">{t('nav.incoming')}</option>
            <option value="outgoing">{t('nav.outgoing')}</option>
            <option value="internal">{t('nav.internal')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocStatus | 'all')}
            className="h-10 px-4 modern-input modern-select rounded-xl text-sm"
          >
            <option value="all">{t('common.all')} {t('docs.status')}</option>
            <option value="draft">{t('status.draft')}</option>
            <option value="on_approval">{t('status.on_approval')}</option>
            <option value="signed">{t('status.signed')}</option>
            <option value="executed">{t('status.executed')}</option>
            <option value="rejected">{t('status.rejected')}</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              {t('common.view')}
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
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full modern-table">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">{t('docs.number')}</th>
                  <th className="px-6 py-4 text-left">{t('docs.subject')}</th>
                  <th className="px-6 py-4 text-left">{t('docs.type')}</th>
                  <th className="px-6 py-4 text-left">{t('docs.status')}</th>
                  <th className="px-6 py-4 text-left">{t('docs.author')}</th>
                  <th className="px-6 py-4 text-left">{t('docs.date')}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(doc => {
                  const statusConf = STATUS_CONFIG[doc.status];
                  const author = getEmp(doc.authorId);
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link to={`/documents/${doc.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          {doc.number}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/documents/${doc.id}`} className="text-sm text-gray-900 hover:text-blue-600 transition">
                          <p className="font-medium truncate max-w-xs">{doc.title}</p>
                          {doc.correspondent && <p className="text-xs text-gray-500 mt-0.5">{doc.correspondent}</p>}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {doc.type === 'incoming' ? t('nav.incoming') : doc.type === 'outgoing' ? t('nav.outgoing') : t('nav.internal')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {author?.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-600">{author?.name.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">{fmtDate(doc.updatedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
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
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const statusConf = STATUS_CONFIG[doc.status];
            const author = getEmp(doc.authorId);
            return (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="bg-white rounded-2xl shadow-modern hover-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                      {statusConf.label}
                    </span>
                    <span className="text-xs text-gray-400">{doc.number}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{doc.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{doc.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {author?.name.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-500">{author?.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                    <span className="text-xs text-gray-400">{fmtDate(doc.updatedAt)}</span>
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
