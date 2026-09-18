import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function Documents() {
  const { documents, employees } = useContext(AppContext);

  return (
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
      onCreateClick={() => {
        // TODO: Открыть модальное окно создания документа
        console.log('Создание нового документа');
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
  );
}
