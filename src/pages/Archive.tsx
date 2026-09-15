import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, DocStatus } from '../App';
import { Archive as ArchiveIcon, Search, FileText, RotateCcw, Trash2, Calendar } from 'lucide-react';

export default function Archive() {
  const { documents, setDocuments } = useContext(AppContext);
  const [search, setSearch] = useState('');

  const archivedDocs = documents.filter(d => d.status === 'archived');
  const filtered = search
    ? archivedDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.number.toLowerCase().includes(search.toLowerCase()))
    : archivedDocs;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatFileSize = (bytes: number) => bytes >= 1000000 ? `${(bytes / 1000000).toFixed(1)} МБ` : `${(bytes / 1000).toFixed(0)} КБ`;

  const handleRestore = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' as DocStatus } : d));
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить документ безвозвратно?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Архив документов</h1>
          <p className="text-sm text-slate-500">{archivedDocs.length} документов в архиве</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск в архиве..."
          className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Archive list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ArchiveIcon size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {search ? 'Ничего не найдено' : 'Архив пуст'}
            </p>
            {!search && <p className="text-xs text-slate-400 mt-1">Архивированные документы появятся здесь</p>}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/documents/${doc.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 transition truncate block">
                    {doc.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500">{doc.number}</span>
                    <span className="text-xs text-slate-500">{doc.category}</span>
                    <span className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleRestore(doc.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-medium transition"
                  >
                    <RotateCcw size={12} /> Восстановить
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
