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
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('registry.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('registry.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('nav.incoming'), value: incoming, icon: Inbox, gradient: 'gradient-blue', filter: 'incoming' as DocType },
          { label: t('nav.outgoing'), value: outgoing, icon: Send, gradient: 'gradient-green', filter: 'outgoing' as DocType },
          { label: t('nav.internal'), value: internal, icon: FileText, gradient: 'gradient-purple', filter: 'internal' as DocType },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setTypeFilter(s.filter)}
            className={`bg-white rounded-2xl p-6 shadow-modern hover-card text-left transition ${
              typeFilter === s.filter ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl ${s.gradient} flex items-center justify-center mb-3`}>
              <s.icon size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-modern p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="w-full h-10 pl-10 pr-4 modern-input rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full modern-table">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">{t('docs.type')}</th>
                <th className="px-6 py-4 text-left">{t('docs.number')}</th>
                <th className="px-6 py-4 text-left">{t('docs.date')}</th>
                <th className="px-6 py-4 text-left">{t('registry.name')}</th>
                <th className="px-6 py-4 text-left">{t('docs.correspondent')}</th>
                <th className="px-6 py-4 text-left">{t('docs.author')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(doc => {
                const author = getEmp(doc.authorId || doc.author);
                const authorName = author?.name || `${author?.first_name || ''} ${author?.last_name || ''}`.trim() || 'Неизвестно';
                
                return (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-center text-xl">
                    {(doc.type || doc.doc_type) === 'incoming' ? '📥' : (doc.type || doc.doc_type) === 'outgoing' ? '📤' : '📄'}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/documents/${doc.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      {doc.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{fmtDate(doc.createdAt || doc.created_at)}</td>
                  <td className="px-6 py-4">
                    <Link to={`/documents/${doc.id}`} className="text-sm text-gray-900 hover:text-blue-600 transition truncate block max-w-xs">
                      {doc.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.correspondent || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{authorName.split(' ').slice(0, 2).join(' ')}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Inbox size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">{t('docs.not_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
