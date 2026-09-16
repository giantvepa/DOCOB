import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Documents from './pages/Documents';
import DocumentCard from './pages/DocumentCard';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Registry from './pages/Registry';
import Employees from './pages/Employees';
import Reports from './pages/Reports';

// ============ TYPES ============
export type DocStatus = 'draft' | 'on_approval' | 'on_signing' | 'signed' | 'executed' | 'rejected' | 'archived';
export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'overdue' | 'deferred';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type DocType = 'incoming' | 'outgoing' | 'internal';
export type DocCategory = 'Договор' | 'Счёт' | 'Акт' | 'Письмо' | 'Приказ' | 'Заявление' | 'Служебная записка' | 'Протокол' | 'Доверенность' | 'Другое';

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'user';
}

export interface ApprovalStep {
  id: string;
  userId: string;
  status: 'waiting' | 'approved' | 'rejected';
  comment?: string;
  completedAt?: string;
}

export interface DocComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  action: string;
  userId: string;
  createdAt: string;
  details: string;
}

export interface Document {
  id: string;
  number: string;
  title: string;
  description: string;
  type: DocType;
  category: DocCategory;
  status: DocStatus;
  priority: TaskPriority;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  correspondent?: string;
  shortDescription?: string;
  fileSize: number;
  fileName: string;
  tags: string[];
  comments: DocComment[];
  history: HistoryEntry[];
  approvals: ApprovalStep[];
  version: number;
  relatedIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  authorId: string;
  documentId?: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  organizerId: string;
  participantIds: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  agenda: string[];
  protocol?: string;
}

export interface AppContextType {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  employees: Employee[];
  currentUser: Employee;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// ============ DEMO DATA ============
const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Иванов Сергей Петрович', position: 'Генеральный директор', department: 'Руководство', avatar: '👔', email: 'ivanov@org.ru', phone: '+7 (495) 123-45-01', role: 'admin' },
  { id: 'e2', name: 'Петрова Мария Владимировна', position: 'Главный бухгалтер', department: 'Бухгалтерия', avatar: '👩‍💼', email: 'petrova@org.ru', phone: '+7 (495) 123-45-02', role: 'manager' },
  { id: 'e3', name: 'Сидоров Константин Львович', position: 'Начальник юридического отдела', department: 'Юридический отдел', avatar: '⚖️', email: 'sidorov@org.ru', phone: '+7 (495) 123-45-03', role: 'manager' },
  { id: 'e4', name: 'Козлова Елена Николаевна', position: 'Менеджер проектов', department: 'Проектный отдел', avatar: '📋', email: 'kozlova@org.ru', phone: '+7 (495) 123-45-04', role: 'user' },
  { id: 'e5', name: 'Морозов Дмитрий Игоревич', position: 'Начальник IT-отдела', department: 'Информационные технологии', avatar: '💻', email: 'morozov@org.ru', phone: '+7 (495) 123-45-05', role: 'manager' },
  { id: 'e6', name: 'Волкова Анна Сергеевна', position: 'Секретарь', department: 'Канцелярия', avatar: '📝', email: 'volkova@org.ru', phone: '+7 (495) 123-45-06', role: 'user' },
  { id: 'e7', name: 'Новиков Алексей Михайлович', position: 'Специалист по кадрам', department: 'Отдел кадров', avatar: '👥', email: 'novikov@org.ru', phone: '+7 (495) 123-45-07', role: 'user' },
  { id: 'e8', name: 'Федорова Ольга Викторовна', position: 'Финансовый директор', department: 'Финансовый отдел', avatar: '💰', email: 'fedorova@org.ru', phone: '+7 (495) 123-45-08', role: 'manager' },
];

const CURRENT_USER = EMPLOYEES[0];

const DEMO_DOCS: Document[] = [
  {
    id: 'd1', number: 'ВХ-2024-0156', title: 'Договор поставки серверного оборудования',
    description: 'Договор с ООО "ТехноСервис" на поставку серверного оборудования для модернизации ЦОД. Сумма: 2 450 000 руб. Срок поставки: 30 рабочих дней.',
    type: 'incoming', category: 'Договор', status: 'on_approval', priority: 'high', authorId: 'e4',
    createdAt: '2024-12-10T09:30:00', updatedAt: '2024-12-12T14:20:00', dueDate: '2024-12-20',
    correspondent: 'ООО "ТехноСервис"', shortDescription: 'Поставка серверов для ЦОД',
    fileSize: 1240000, fileName: 'dogovor_tekhnoservis_2024.pdf', tags: ['поставка', 'оборудование', 'ЦОД'],
    comments: [
      { id: 'c1', authorId: 'e3', text: 'Юридическая экспертиза проведена. Замечаний нет.', createdAt: '2024-12-11T10:00:00' },
      { id: 'c2', authorId: 'e2', text: 'Бюджет согласован. Средства зарезервированы.', createdAt: '2024-12-12T14:20:00' },
    ],
    history: [
      { id: 'h1', action: 'registered', userId: 'e6', createdAt: '2024-12-10T09:30:00', details: 'Документ зарегистрирован канцелярией' },
      { id: 'h2', action: 'resolution', userId: 'e1', createdAt: '2024-12-10T11:00:00', details: 'Наложена резолюция: Согласовать в установленном порядке' },
      { id: 'h3', action: 'sent_to_approval', userId: 'e4', createdAt: '2024-12-10T14:00:00', details: 'Отправлен на согласование' },
      { id: 'h4', action: 'approved', userId: 'e3', createdAt: '2024-12-11T10:00:00', details: 'Согласовано юридическим отделом' },
      { id: 'h5', action: 'approved', userId: 'e2', createdAt: '2024-12-12T14:20:00', details: 'Согласовано бухгалтерией' },
    ],
    approvals: [
      { id: 'a1', userId: 'e3', status: 'approved', comment: 'Замечаний нет', completedAt: '2024-12-11T10:00:00' },
      { id: 'a2', userId: 'e2', status: 'approved', comment: 'Бюджет подтверждён', completedAt: '2024-12-12T14:20:00' },
      { id: 'a3', userId: 'e8', status: 'waiting' },
      { id: 'a4', userId: 'e1', status: 'waiting' },
    ],
    version: 2, relatedIds: ['d3'],
  },
  {
    id: 'd2', number: 'ИСХ-2024-0089', title: 'Письмо в адрес ООО "Партнёр" о условиях сотрудничества',
    description: 'Исходящее письмо с предложением о пролонгации договора и пересмотре условий сотрудничества на 2025 год.',
    type: 'outgoing', category: 'Письмо', status: 'signed', priority: 'normal', authorId: 'e4',
    createdAt: '2024-12-05T11:00:00', updatedAt: '2024-12-07T16:00:00',
    correspondent: 'ООО "Партнёр"', shortDescription: 'Пролонгация договора',
    fileSize: 340000, fileName: 'pismo_partner_prolongaciya.pdf', tags: ['партнёр', 'пролонгация'],
    comments: [],
    history: [
      { id: 'h6', action: 'created', userId: 'e4', createdAt: '2024-12-05T11:00:00', details: 'Документ создан' },
      { id: 'h7', action: 'approved', userId: 'e1', createdAt: '2024-12-06T09:00:00', details: 'Утверждено директором' },
      { id: 'h8', action: 'signed', userId: 'e1', createdAt: '2024-12-07T16:00:00', details: 'Подписано ЭП' },
    ],
    approvals: [
      { id: 'a5', userId: 'e3', status: 'approved', completedAt: '2024-12-05T17:00:00' },
      { id: 'a6', userId: 'e1', status: 'approved', completedAt: '2024-12-06T09:00:00' },
    ],
    version: 1, relatedIds: [],
  },
  {
    id: 'd3', number: 'ВН-2024-0234', title: 'Служебная записка о необходимости модернизации IT-инфраструктуры',
    description: 'Обоснование необходимости модернизации серверной инфраструктуры. Текущее оборудование выработало ресурс.',
    type: 'internal', category: 'Служебная записка', status: 'executed', priority: 'high', authorId: 'e5',
    createdAt: '2024-12-01T08:00:00', updatedAt: '2024-12-08T12:00:00', dueDate: '2024-12-15',
    shortDescription: 'Модернизация IT',
    fileSize: 890000, fileName: 'sluzhebnaya_modernizaciya_it.docx', tags: ['IT', 'модернизация', 'серверы'],
    comments: [
      { id: 'c3', authorId: 'e1', text: 'Поддерживаю. Включить в бюджет 2025.', createdAt: '2024-12-02T10:00:00' },
    ],
    history: [
      { id: 'h9', action: 'created', userId: 'e5', createdAt: '2024-12-01T08:00:00', details: 'Документ создан' },
      { id: 'h10', action: 'executed', userId: 'e1', createdAt: '2024-12-08T12:00:00', details: 'Исполнено' },
    ],
    approvals: [
      { id: 'a7', userId: 'e8', status: 'approved', completedAt: '2024-12-03T11:00:00' },
      { id: 'a8', userId: 'e1', status: 'approved', completedAt: '2024-12-04T09:00:00' },
    ],
    version: 1, relatedIds: ['d1'],
  },
  {
    id: 'd4', number: 'ВХ-2024-0162', title: 'Акт выполненных работ по договору №45/2024',
    description: 'Акт сдачи-приёмки работ по этапу 2 проекта автоматизации. Подрядчик: АО "ИнфоТех". Сумма: 780 000 руб.',
    type: 'incoming', category: 'Акт', status: 'on_approval', priority: 'critical', authorId: 'e6',
    createdAt: '2024-12-13T08:00:00', updatedAt: '2024-12-13T10:00:00', dueDate: '2024-12-16',
    correspondent: 'АО "ИнфоТех"', shortDescription: 'Акт по этапу 2',
    fileSize: 560000, fileName: 'akt_infoteh_etap2.pdf', tags: ['акт', 'автоматизация'],
    comments: [],
    history: [
      { id: 'h11', action: 'registered', userId: 'e6', createdAt: '2024-12-13T08:00:00', details: 'Зарегистрирован канцелярией' },
      { id: 'h12', action: 'resolution', userId: 'e1', createdAt: '2024-12-13T10:00:00', details: 'Резолюция: Петровой М.В. — проверить и доложить' },
    ],
    approvals: [
      { id: 'a9', userId: 'e2', status: 'waiting' },
      { id: 'a10', userId: 'e4', status: 'waiting' },
      { id: 'a11', userId: 'e1', status: 'waiting' },
    ],
    version: 1, relatedIds: [],
  },
  {
    id: 'd5', number: 'ВН-2024-0241', title: 'Приказ о проведении годовой инвентаризации',
    description: 'Приказ о проведении годовой инвентаризации основных средств и материальных ценностей. Срок: до 31.12.2024.',
    type: 'internal', category: 'Приказ', status: 'draft', priority: 'high', authorId: 'e2',
    createdAt: '2024-12-13T15:00:00', updatedAt: '2024-12-13T15:00:00', dueDate: '2024-12-18',
    shortDescription: 'Инвентаризация 2024',
    fileSize: 420000, fileName: 'prikaz_inventoryzaciya_2024.docx', tags: ['инвентаризация', 'приказ'],
    comments: [],
    history: [
      { id: 'h13', action: 'created', userId: 'e2', createdAt: '2024-12-13T15:00:00', details: 'Черновик создан' },
    ],
    approvals: [],
    version: 1, relatedIds: [],
  },
  {
    id: 'd6', number: 'ВХ-2024-0148', title: 'Заявление на предоставление отпуска — Морозов Д.И.',
    description: 'Заявление на ежегодный оплачиваемый отпуск с 25.12.2024 по 07.01.2025 (14 календарных дней).',
    type: 'internal', category: 'Заявление', status: 'signed', priority: 'low', authorId: 'e5',
    createdAt: '2024-12-01T10:00:00', updatedAt: '2024-12-02T09:00:00',
    shortDescription: 'Отпуск Морозова',
    fileSize: 120000, fileName: 'zayavlenie_otpusk_morozov.pdf', tags: ['отпуск', 'кадры'],
    comments: [],
    history: [
      { id: 'h14', action: 'created', userId: 'e5', createdAt: '2024-12-01T10:00:00', details: 'Заявление подано' },
      { id: 'h15', action: 'approved', userId: 'e1', createdAt: '2024-12-02T09:00:00', details: 'Согласовано' },
    ],
    approvals: [
      { id: 'a12', userId: 'e7', status: 'approved', completedAt: '2024-12-01T15:00:00' },
      { id: 'a13', userId: 'e1', status: 'approved', completedAt: '2024-12-02T09:00:00' },
    ],
    version: 1, relatedIds: [],
  },
  {
    id: 'd7', number: 'ИСХ-2024-0091', title: 'Счёт на оплату услуг связи за ноябрь 2024',
    description: 'Счёт от ПАО "Ростелеком" за услуги интернет-провайдера и телефонии за ноябрь 2024. Сумма: 45 800 руб.',
    type: 'outgoing', category: 'Счёт', status: 'executed', priority: 'normal', authorId: 'e2',
    createdAt: '2024-12-03T09:00:00', updatedAt: '2024-12-05T11:00:00',
    correspondent: 'ПАО "Ростелеком"', shortDescription: 'Оплата связи ноябрь',
    fileSize: 180000, fileName: 'schet_rostelecom_noyabr.pdf', tags: ['оплата', 'связь'],
    comments: [],
    history: [
      { id: 'h16', action: 'created', userId: 'e2', createdAt: '2024-12-03T09:00:00', details: 'Счёт зарегистрирован' },
      { id: 'h17', action: 'executed', userId: 'e2', createdAt: '2024-12-05T11:00:00', details: 'Оплачен' },
    ],
    approvals: [
      { id: 'a14', userId: 'e1', status: 'approved', completedAt: '2024-12-04T10:00:00' },
    ],
    version: 1, relatedIds: [],
  },
];

const DEMO_TASKS: Task[] = [
  { id: 't1', title: 'Подготовить ответ на письмо ООО "Партнёр"', description: 'Подготовить проект ответа до конца недели', status: 'in_progress', priority: 'high', assigneeId: 'e4', authorId: 'e1', documentId: 'd2', createdAt: '2024-12-10T09:00:00', dueDate: '2024-12-15' },
  { id: 't2', title: 'Проверить договор поставки оборудования', description: 'Юридическая экспертиза договора с ООО "ТехноСервис"', status: 'completed', priority: 'high', assigneeId: 'e3', authorId: 'e1', documentId: 'd1', createdAt: '2024-12-10T11:00:00', dueDate: '2024-12-12', completedAt: '2024-12-11T10:00:00' },
  { id: 't3', title: 'Подготовить финансовое обоснование модернизации', description: 'Рассчитать ROI и срок окупаемости', status: 'new', priority: 'normal', assigneeId: 'e8', authorId: 'e1', documentId: 'd3', createdAt: '2024-12-08T12:00:00', dueDate: '2024-12-20' },
  { id: 't4', title: 'Организовать подписание акта с АО "ИнфоТех"', description: 'Согласовать акт и организовать подписание', status: 'new', priority: 'critical', assigneeId: 'e4', authorId: 'e1', documentId: 'd4', createdAt: '2024-12-13T10:00:00', dueDate: '2024-12-16' },
  { id: 't5', title: 'Завершить инвентаризацию', description: 'Провести инвентаризацию основных средств', status: 'in_progress', priority: 'high', assigneeId: 'e2', authorId: 'e1', documentId: 'd5', createdAt: '2024-12-13T15:00:00', dueDate: '2024-12-31' },
  { id: 't6', title: 'Обновить график отпусков на 2025 год', description: 'Собрать заявки от всех подразделений', status: 'overdue', priority: 'normal', assigneeId: 'e7', authorId: 'e1', createdAt: '2024-12-01T09:00:00', dueDate: '2024-12-10' },
];

const DEMO_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Заседание правления по итогам Q4 2024', description: 'Обсуждение результатов 4 квартала и планов на 2025 год', date: '2024-12-18', time: '10:00', duration: 120, location: 'Конференц-зал А', organizerId: 'e1', participantIds: ['e1', 'e2', 'e3', 'e5', 'e8'], status: 'planned', agenda: ['Итоги Q4 по подразделениям', 'Финансовые показатели', 'Планы на 2025', 'Бюджетирование'] },
  { id: 'm2', title: 'Совещание по проекту модернизации ЦОД', description: 'Обсуждение хода проекта и согласование этапов', date: '2024-12-16', time: '14:00', duration: 60, location: 'Переговорная Б', organizerId: 'e5', participantIds: ['e5', 'e4', 'e3', 'e8'], status: 'planned', agenda: ['Статус проекта', 'Согласование договора', 'Сроки поставки', 'Бюджет'] },
  { id: 'm3', title: 'Еженедельное совещание руководителей', description: 'Регулярное совещание по операционным вопросам', date: '2024-12-14', time: '09:00', duration: 90, location: 'Конференц-зал А', organizerId: 'e1', participantIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e7', 'e8'], status: 'completed', agenda: ['Статус задач', 'Проблемные вопросы', 'Планы на неделю'], protocol: 'Протокол утверждён. Поручения розданы.' },
];

function App() {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const s = localStorage.getItem('tezis-docs');
    return s ? JSON.parse(s) : DEMO_DOCS;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const s = localStorage.getItem('tezis-tasks');
    return s ? JSON.parse(s) : DEMO_TASKS;
  });
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const s = localStorage.getItem('tezis-meetings');
    return s ? JSON.parse(s) : DEMO_MEETINGS;
  });

  const updateDocs = (v: Document[] | ((p: Document[]) => Document[])) => {
    setDocuments(v);
    const toSave = typeof v === 'function' ? v(documents) : v;
    localStorage.setItem('tezis-docs', JSON.stringify(toSave));
  };
  const updateTasks = (v: Task[] | ((p: Task[]) => Task[])) => {
    setTasks(v);
    const toSave = typeof v === 'function' ? v(tasks) : v;
    localStorage.setItem('tezis-tasks', JSON.stringify(toSave));
  };
  const updateMeetings = (v: Meeting[] | ((p: Meeting[]) => Meeting[])) => {
    setMeetings(v);
    const toSave = typeof v === 'function' ? v(meetings) : v;
    localStorage.setItem('tezis-meetings', JSON.stringify(toSave));
  };

  return (
    <AppContext.Provider value={{ documents, setDocuments: updateDocs, tasks, setTasks: updateTasks, meetings, setMeetings: updateMeetings, employees: EMPLOYEES, currentUser: CURRENT_USER }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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

export default App;
