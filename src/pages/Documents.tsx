import { useContext, useState } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';
import CreateDocumentModal from '../components/CreateDocumentModal';

export default function Documents() {
  const { documents, employees } = useContext(AppContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <DocumentTable
        title="Все документы"
        documents={documents}
        employees={employees}
        totalCount={documents.length}
        columns={{
          showCheckbox: true,
          showType: true,
          showPriority: true,
          showCorrespondent: true,
          showDueDate: true,
          showAuthor: true,
          showTags: true,
        }}
        filters={{
          showTypeFilter: true,
          showStatusFilter: true,
          showPriorityFilter: true,
          showCorrespondentFilter: true,
          showAuthorFilter: true,
          showDateFilter: true,
          showTagFilter: true,
        }}
        searchable={true}
        sortable={true}
        selectable={true}
        linkPrefix="/documents"
        createButtonLabel="Создать документ"
        onCreateClick={() => setShowCreateModal(true)}
        onBulkAction={(action, ids) => {
          console.log(`Массовое действие: ${action}`, ids);
          if (action === 'delete') {
            if (confirm(`Удалить ${ids.length} документов?`)) {
              // TODO: Реализовать удаление
            }
          }
        }}
        onFilterChange={(filters) => {
          console.log('Фильтры изменены:', filters);
        }}
      />

      {showCreateModal && <CreateDocumentModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}
