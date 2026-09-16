import { useState, useEffect } from 'react';
import { djangoApi } from '../api/djangoClient';
import { FileText, Plus, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function DjangoDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    doc_type: 'internal',
    category: 'memo',
    priority: 'normal',
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await djangoApi.getDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки документов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await djangoApi.createDocument(newDoc);
      setShowCreateForm(false);
      setNewDoc({ title: '', description: '', doc_type: 'internal', category: 'memo', priority: 'normal' });
      await loadDocuments();
    } catch (err: any) {
      alert('Ошибка создания документа: ' + err.message);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await djangoApi.approveDocument(id, 'Согласовано');
      await loadDocuments();
    } catch (err: any) {
      alert('Ошибка согласования: ' + err.message);
    }
  };

  const handleReject = async (id: number) => {
    const comment = prompt('Причина отклонения:');
    if (comment) {
      try {
        await djangoApi.rejectDocument(id, comment);
        await loadDocuments();
      } catch (err: any) {
        alert('Ошибка отклонения: ' + err.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить документ?')) {
      try {
        await djangoApi.deleteDocument(id);
        await loadDocuments();
      } catch (err: any) {
        alert('Ошибка удаления: ' + err.message);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText size={16} className="text-gray-500" />;
      case 'on_approval': return <Clock size={16} className="text-amber-500" />;
      case 'signed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'executed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Черновик',
      on_approval: 'На согласовании',
      on_signing: 'На подписании',
      signed: 'Подписан',
      executed: 'Исполнен',
      rejected: 'Отклонён',
      archived: 'В архиве',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      on_approval: 'bg-amber-100 text-amber-700',
      on_signing: 'bg-blue-100 text-blue-700',
      signed: 'bg-green-100 text-green-700',
      executed: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-red-100 text-red-700',
      archived: 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка документов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Ошибка подключения</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadDocuments}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Документы (Django API)</h1>
          <p className="text-sm text-gray-500 mt-1">
            {documents.length} документов • Подключено к Django Backend
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Создать документ
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Создать документ</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название *</label>
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
                  <select
                    value={newDoc.doc_type}
                    onChange={(e) => setNewDoc({ ...newDoc, doc_type: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="incoming">Входящий</option>
                    <option value="outgoing">Исходящий</option>
                    <option value="internal">Внутренний</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="contract">Договор</option>
                    <option value="invoice">Счёт</option>
                    <option value="act">Акт</option>
                    <option value="letter">Письмо</option>
                    <option value="order">Приказ</option>
                    <option value="application">Заявление</option>
                    <option value="memo">Служебная записка</option>
                    <option value="protocol">Протокол</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                  <select
                    value={newDoc.priority}
                    onChange={(e) => setNewDoc({ ...newDoc, priority: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="low">Низкий</option>
                    <option value="normal">Обычный</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критичный</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-modern p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет документов</h3>
          <p className="text-gray-500 mb-4">Создайте первый документ</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Создать документ
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Номер</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Название</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Тип</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Статус</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Приоритет</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-blue-600">{doc.number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      {doc.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{doc.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {doc.doc_type === 'incoming' ? 'Входящий' : doc.doc_type === 'outgoing' ? 'Исходящий' : 'Внутренний'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {getStatusLabel(doc.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        doc.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        doc.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.priority === 'critical' ? 'Критичный' :
                         doc.priority === 'high' ? 'Высокий' :
                         doc.priority === 'normal' ? 'Обычный' : 'Низкий'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {doc.status === 'on_approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(doc.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition"
                            >
                              Согласовать
                            </button>
                            <button
                              onClick={() => handleReject(doc.id)}
                              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition"
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
