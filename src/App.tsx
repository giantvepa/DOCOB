import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { djangoApi } from './api/djangoClient';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import HomePage from './pages/HomePage';
import Documents from './pages/Documents';
import DocumentCard from './pages/DocumentCard';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Registry from './pages/Registry';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import type { Document, Task, Meeting, Employee, Language, DocStatus, DocType, DocCategory, TaskStatus, TaskPriority } from './types';

// Переводы
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ru: {
    'home.title': 'Рабочий стол',
    'toolbar.create': 'Создать',
    'nav.documents': 'Документы',
    'nav.tasks': 'Задачи',
    'nav.meetings': 'Совещания',
    'nav.registry': 'Канцелярия',
    'nav.employees': 'Сотрудники',
    'nav.reports': 'Отчёты',
    'app.documents': 'Документов',
    'app.tasks': 'Задач',
    'docs.title': 'Документы',
    'tasks.title': 'Задачи и поручения',
    'tasks.new_task': 'Новая задача',
    'tasks.my': 'Мои задачи',
    'tasks.assigned_by_me': 'Порученные мной',
    'tasks.all': 'Все',
    'tasks.all_statuses': 'Все статусы',
    'tasks.no_tasks': 'Нет задач',
    'meetings.title': 'Совещания',
    'meetings.create': 'Создать',
    'meetings.planned': 'Запланировано',
    'meetings.in_progress': 'Идёт',
    'meetings.completed': 'Завершено',
    'meetings.cancelled': 'Отменено',
    'meetings.organizer': 'Организатор',
    'meetings.agenda': 'Повестка',
    'meetings.persons': 'чел.',
    'registry.title': 'Канцелярия',
    'registry.subtitle': 'Регистрация и учёт документов',
    'registry.name': 'Название',
    'employees.title': 'Сотрудники',
    'employees.directory': 'Справочник',
    'employees.search_placeholder': 'Поиск по ФИО, должности...',
    'employees.all_departments': 'Все подразделения',
    'employees.admin': 'Администратор',
    'employees.manager': 'Руководитель',
    'employees.employee': 'Сотрудник',
    'reports.title': 'Отчёты и аналитика',
    'reports.subtitle': 'Статистика документооборота',
    'reports.by_category': 'По категориям',
    'reports.by_author': 'По авторам',
    'reports.by_type': 'По типу',
    'reports.by_status': 'По статусу',
    'reports.drafts': 'Черновики',
    'reports.approved': 'Подписаны',
    'reports.executed': 'Исполнены',
    'reports.rejected': 'Отклонены',
    'common.all': 'Все',
    'common.search': 'Поиск',
    'common.view': 'Все',
    'common.records': 'записей',
    'nav.incoming': 'Входящие',
    'nav.outgoing': 'Исходящие',
    'nav.internal': 'Внутренние',
    'docs.type': 'Тип',
    'docs.status': 'Статус',
    'docs.number': 'Рег. номер',
    'docs.subject': 'Тема',
    'docs.author': 'Автор',
    'docs.date': 'Дата',
    'docs.correspondent': 'Корреспондент',
    'docs.not_found': 'Документы не найдены',
    'status.draft': 'Черновик',
    'status.on_approval': 'На согласовании',
    'status.signed': 'Подписан',
    'status.executed': 'Исполнен',
    'status.rejected': 'Отклонён',
    'priority.critical': 'Критичный',
    'priority.high': 'Высокий',
    'priority.normal': 'Обычный',
    'priority.low': 'Низкий',
    'home.pending_docs': 'Ожидают моего решения',
    'home.my_tasks': 'Мои задачи',
    'home.recent_docs': 'Последние документы',
    'home.meetings': 'Ближайшие совещания',
    'home.no_pending': 'Нет документов, ожидающих решения',
    'home.no_tasks': 'Нет активных задач',
    'home.no_meetings': 'Нет запланированных совещаний',
  },
  tk: {
    'home.title': 'Iş stoly',
    'toolbar.create': 'Döret',
    'nav.documents': 'Resminamalar',
    'nav.tasks': 'Wezipeler',
    'nav.meetings': 'Maslahatlar',
    'nav.registry': 'Kanselýariýa',
    'nav.employees': 'Işgärler',
    'nav.reports': 'Hasabatlar',
    'app.documents': 'Resminamalar',
    'app.tasks': 'Wezipeler',
    'docs.title': 'Resminamalar',
    'tasks.title': 'Wezipeler we tabşyryklar',
    'tasks.new_task': 'Täze wezipe',
    'tasks.my': 'Meniň wezipelerim',
    'tasks.assigned_by_me': 'Meniň tabşyranlarym',
    'tasks.all': 'Ählisi',
    'tasks.all_statuses': 'Ähli ýagdaýlar',
    'tasks.no_tasks': 'Wezipeler ýok',
    'meetings.title': 'Maslahatlar',
    'meetings.create': 'Döret',
    'meetings.planned': 'Meýilleşdirilen',
    'meetings.in_progress': 'Barýar',
    'meetings.completed': 'Tamamlandy',
    'meetings.cancelled': 'Ýatyryldy',
    'meetings.organizer': 'Gurnaýjy',
    'meetings.agenda': 'Gündelik',
    'meetings.persons': 'adam',
    'registry.title': 'Kanselýariýa',
    'registry.subtitle': 'Resminamalary hasaba almak',
    'registry.name': 'Ady',
    'employees.title': 'Işgärler',
    'employees.directory': 'Salgylanma',
    'employees.search_placeholder': 'Gözle...',
    'employees.all_departments': 'Ähli bölümler',
    'employees.admin': 'Administrator',
    'employees.manager': 'Ýolbaşçy',
    'employees.employee': 'Işgär',
    'reports.title': 'Hasabatlar',
    'reports.subtitle': 'Statistika',
    'reports.by_category': 'Kategoriýalar boýunça',
    'reports.by_author': 'Awtorlar boýunça',
    'reports.by_type': 'Görnüşler boýunça',
    'reports.by_status': 'Ýagdaýlar boýunça',
    'reports.drafts': 'Taslamalar',
    'reports.approved': 'Gol çekilen',
    'reports.executed': 'Ýerine ýetirilen',
    'reports.rejected': 'Ret edilen',
    'common.all': 'Ählisi',
    'common.search': 'Gözleg',
    'common.view': 'Gör',
    'common.records': 'ýazgylar',
    'nav.incoming': 'Gelen',
    'nav.outgoing': 'Gidýän',
    'nav.internal': 'Içerki',
    'docs.type': 'Görnüş',
    'docs.status': 'Ýagdaý',
    'docs.number': 'Belgi',
    'docs.subject': 'Tema',
    'docs.author': 'Awtor',
    'docs.date': 'Sene',
    'docs.correspondent': 'Habарçy',
    'docs.not_found': 'Resminamalar tapylmady',
    'status.draft': 'Taslama',
    'status.on_approval': 'Ylalaşykda',
    'status.signed': 'Gol çekilen',
    'status.executed': 'Ýerine ýetirilen',
    'status.rejected': 'Ret edilen',
    'priority.critical': 'Kritik',
    'priority.high': 'Ýokary',
    'priority.normal': 'Adaty',
    'priority.low': 'Pes',
    'home.pending_docs': 'Meniň çözgüdime garaşýan resminamalar',
    'home.my_tasks': 'Meniň wezipelerim',
    'home.recent_docs': 'Soňky resminamalar',
    'home.meetings': 'Ýakyn maslahatlar',
    'home.no_pending': 'Garaşýan resminamalar ýok',
    'home.no_tasks': 'Işjeň wezipeler ýok',
    'home.no_meetings': 'Meýilleşdirilen maslahatlar ýok',
  },
};

// Тип AppContext - используем any для совместимости со старыми компонентами
interface AppContextType {
  documents: any[];
  setDocuments: any;
  tasks: any[];
  setTasks: any;
  meetings: any[];
  setMeetings: any;
  employees: any[];
  currentUser: any;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string) => string;
  refreshData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// Компонент для защищённых маршрутов
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">СЭД "ЭСАСЫ ПИКИР"</h2>
          <p className="text-sm text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

// Основной контент приложения
function AppContent() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('esasy-pikir-lang') as Language;
    return saved || 'ru';
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('esasy-pikir-lang', language);
  }, [language]);

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[language][key] || key;
  }, [language]);

  const refreshData = useCallback(async () => {
    try {
      const [docs, tasksData, meetingsData, usersData] = await Promise.all([
        djangoApi.getDocuments().catch(() => []),
        djangoApi.getTasks().catch(() => []),
        djangoApi.getMeetings().catch(() => []),
        djangoApi.getUsers().catch(() => []),
      ]);
      setDocuments(docs);
      setTasks(tasksData);
      setMeetings(meetingsData);
      setEmployees(usersData);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  const currentUser: Employee = user ? {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`.trim() || user.username || user.email,
    email: user.email,
    position: user.position,
    department: user.department,
    avatar: user.avatar,
    role: user.role,
  } : {
    id: 0,
    name: 'Пользователь',
    email: '',
    position: '',
    department: '',
    avatar: '👤',
    role: 'user',
  };

  return (
    <AppContext.Provider value={{
      documents,
      setDocuments,
      tasks,
      setTasks,
      meetings,
      setMeetings,
      employees,
      currentUser,
      language,
      setLanguage,
      t,
      refreshData,
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentCard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="registry" element={<Registry />} />
            <Route path="employees" element={<Employees />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

// Реэкспорт типов для совместимости с компонентами
export type { Document, Task, Meeting, Employee, Language, DocStatus, DocType, DocCategory, TaskStatus, TaskPriority };
