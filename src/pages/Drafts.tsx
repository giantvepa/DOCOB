import { useContext } from 'react';
import { AppContext } from '../App';
import DocumentTable from '../components/DocumentTable';

export default function Drafts() {
  const { documents, employees } = useContext(AppContext);

  // Фильтрация только черновиков
  const draftDocs = documents.filter(d => d.status === 'draft');

  return (
    <DocumentTable
      title="Черновики"
      documents={draftDocs}
      employees={employees}
      totalCount={draftDocs.length}
      columns={{
        showCheckbox: true,
        showType: true,
        showPriority: true,
        showCorrespondent: true,
        showDueDate: true,
        showAuthor: true,
      }}
      filters={{
        showTypeFilter: true,
        showStatusFilter: false, // Не показываем фильтр статуса, т.к. уже отфильтровано
        showPriorityFilter: true,
        defaultStatus: 'draft',
      }}
      searchable={true}
      sortable={true}
      selectable={true}
      linkPrefix="/documents"
      createButtonLabel="Создать черновик"
      onCreateClick={() => {
        // TODO: Открыть модальное окно создания черновика
        console.log('Создание нового черновика');
      }}
      onBulkAction={(action, ids) => {
        console.log(`Массовое действие: ${action}`, ids);
        // TODO: Реализовать массовые действия
      }}
    />
  );
}
