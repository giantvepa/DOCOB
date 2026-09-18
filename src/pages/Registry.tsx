import { useContext, useState } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';
import { Inbox, Send, FileText } from 'lucide-react';

export default function Registry() {
  const { documents, employees } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'internal'>('incoming');

  // Фильтрация по типу
  const filteredDocs = documents.filter(d => d.type === activeTab);

  // Статистика
  const stats = {
    incoming: documents.filter(d => d.type === 'incoming').length,
    outgoing: documents.filter(d => d.type === 'outgoing').length,
    internal: documents.filter(d => d.type === 'internal').length,
  };

  // Настройки для каждого типа реестра
  const getRegistryConfig = () => {
    switch (activeTab) {
      case 'incoming':
        return {
          title: 'Входящие документы',
          defaultType: 'incoming',
          showTypeFilter: false, // Не показываем фильтр типа, т.к. уже отфильтровано
        };
      case 'outgoing':
        return {
          title: 'Исходящие документы',
          defaultType: 'outgoing',
          showTypeFilter: false,
        };
      case 'internal':
        return {
          title: 'Внутренние документы',
          defaultType: 'internal',
          showTypeFilter: false,
        };
    }
  };

  const config = getRegistryConfig();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Канцелярия</h1>
        <p className="text-sm text-gray-500 mt-1">Регистрация и учёт документов</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-modern p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'incoming'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inbox size={18} />
            <span>Входящие</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {stats.incoming}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'outgoing'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Send size={18} />
            <span>Исходящие</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'outgoing' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {stats.outgoing}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === 'internal'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={18} />
            <span>Внутренние</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'internal' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {stats.internal}
            </span>
          </button>
        </div>
      </div>

      {/* Document Table */}
      <DocumentTable
        title={config.title}
        documents={filteredDocs}
        employees={employees}
        totalCount={filteredDocs.length}
        columns={{
          showCheckbox: true,
          showType: false, // Не показываем колонку типа, т.к. уже отфильтровано
          showPriority: true,
          showCorrespondent: true,
          showDueDate: true,
          showAuthor: true,
          showTags: true,
        }}
        filters={{
          showTypeFilter: config.showTypeFilter,
          showStatusFilter: true,
          showPriorityFilter: true,
          showCorrespondentFilter: true,
          showAuthorFilter: true,
          showDateFilter: true,
          showTagFilter: true,
          defaultType: config.defaultType,
        }}
        searchable={true}
        sortable={true}
        selectable={true}
        linkPrefix="/documents"
        createButtonLabel="Зарегистрировать документ"
        onCreateClick={() => {
          // TODO: Открыть модальное окно регистрации документа
          console.log(`Регистрация нового ${activeTab} документа`);
        }}
        onBulkAction={(action, ids) => {
          console.log(`Массовое действие: ${action}`, ids);
          // TODO: Реализовать массовые действия
        }}
        onFilterChange={(filters) => {
          console.log('Фильтры изменены:', filters);
          // Можно использовать для сохранения фильтров в URL или localStorage
        }}
      />
    </div>
  );
}
