import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import UploadDocument from './pages/UploadDocument';
import Approvals from './pages/Approvals';
import Archive from './pages/Archive';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// ============ TYPES ============
export type DocStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
export type DocPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DocCategory = 'Договор' | 'Счёт' | 'Акт' | 'Заявление' | 'Приказ' | 'Служебная записка' | 'Доверенность' | 'Прочее';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  email: string;
}

export interface Comment {
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
  details?: string;
}

export interface ApprovalStep {
  id: string;
  userId: string;
  status: 'waiting' | 'approved' | 'rejected';
  comment?: string;
  completedAt?: string;
}

export interface Document {
  id: string;
  number: string;
  title: string;
  description: string;
  category: DocCategory;
  status: DocStatus;
  priority: DocPriority;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  fileSize: number;
  fileType: string;
  fileName: string;
  fileUrl: string;
  tags: string[];
  comments: Comment[];
  history: HistoryEntry[];
  approvals: ApprovalStep[];
  version: number;
}

export interface AppContextType {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  users: User[];
  currentUser: User;
  notifications: number;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// ============ DEMO DATA ============
const USERS: User[] = [
  { id: 'u1', name: 'Иванов А.С.', position: 'Генеральный директор', department: 'Руководство', avatar: '👔', email: 'ivanov@company.ru' },
  { id: 'u2', name: 'Петрова М.В.', position: 'Главный бухгалтер', department: 'Бухгалтерия', avatar: '👩‍💼', email: 'petrova@company.ru' },
  { id: 'u3', name: 'Сидоров К.Л.', position: 'Юрист', department: 'Юридический отдел', avatar: '⚖️', email: 'sidorov@company.ru' },
  { id: 'u4', name: 'Козлова Е.Н.', position: 'Менеджер проектов', department: 'Проектный отдел', avatar: '📋', email: 'kozlova@company.ru' },
  { id: 'u5', name: 'Морозов Д.И.', position: 'Системный администратор', department: 'IT', avatar: '💻', email: 'morozov@company.ru' },
];

const CURRENT_USER = USERS[0];

const DEMO_DOCS: Document[] = [
  {
    id: 'd1',
    number: 'ДГ-2024-001',
    title: 'Договор поставки оборудования №45',
    description: 'Договор на поставку серверного оборудования для модернизации ЦОД. Поставщик: ООО "ТехноСервис". Сумма: 2 450 000 руб.',
    category: 'Договор',
    status: 'pending',
    priority: 'high',
    authorId: 'u4',
    createdAt: '2024-12-10T09:30:00',
    updatedAt: '2024-12-12T14:20:00',
    dueDate: '2024-12-20',
    fileSize: 1240000,
    fileType: 'application/pdf',
    fileName: 'dogovor_postavki_45.pdf',
    fileUrl: '',
    tags: ['поставка', 'оборудование', 'ЦОД'],
    comments: [
      { id: 'c1', authorId: 'u3', text: 'Проверил, замечаний нет. Можно согласовывать.', createdAt: '2024-12-11T10:00:00' },
      { id: 'c2', authorId: 'u2', text: 'Бюджет согласован, средства выделены.', createdAt: '2024-12-12T14:20:00' },
    ],
    history: [
      { id: 'h1', action: 'created', userId: 'u4', createdAt: '2024-12-10T09:30:00', details: 'Документ создан' },
      { id: 'h2', action: 'sent_to_approval', userId: 'u4', createdAt: '2024-12-10T09:35:00', details: 'Отправлен на согласование' },
      { id: 'h3', action: 'viewed', userId: 'u3', createdAt: '2024-12-11T09:50:00', details: 'Просмотрен юристом' },
      { id: 'h4', action: 'commented', userId: 'u3', createdAt: '2024-12-11T10:00:00', details: 'Добавлен комментарий' },
    ],
    approvals: [
      { id: 'a1', userId: 'u3', status: 'approved', comment: 'Юридически чисто', completedAt: '2024-12-11T10:00:00' },
      { id: 'a2', userId: 'u2', status: 'approved', comment: 'Бюджет подтверждён', completedAt: '2024-12-12T14:20:00' },
      { id: 'a3', userId: 'u1', status: 'waiting' },
    ],
    version: 2,
  },
  {
    id: 'd2',
    number: 'СЧ-2024-089',
    title: 'Счёт на оплату услуг связи за ноябрь',
    description: 'Оплата услуг интернет-провайдера и телефонии за ноябрь 2024. Провайдер: ПАО "Ростелеком".',
    category: 'Счёт',
    status: 'approved',
    priority: 'medium',
    authorId: 'u2',
    createdAt: '2024-12-05T11:00:00',
    updatedAt: '2024-12-07T16:00:00',
    fileSize: 340000,
    fileType: 'application/pdf',
    fileName: 'schet_rostelecom_noyabr.pdf',
    fileUrl: '',
    tags: ['оплата', 'связь', 'Ростелеком'],
    comments: [],
    history: [
      { id: 'h5', action: 'created', userId: 'u2', createdAt: '2024-12-05T11:00:00', details: 'Документ создан' },
      { id: 'h6', action: 'approved', userId: 'u1', createdAt: '2024-12-07T16:00:00', details: 'Утверждено' },
    ],
    approvals: [
      { id: 'a4', userId: 'u1', status: 'approved', completedAt: '2024-12-07T16:00:00' },
    ],
    version: 1,
  },
  {
    id: 'd3',
    number: 'АЗ-2024-034',
    title: 'Акт выполненных работ по проекту "Модернизация"',
    description: 'Акт сдачи-приёмки работ по этапу 2 проекта модернизации IT-инфраструктуры. Подрядчик: АО "ИнфоТех".',
    category: 'Акт',
    status: 'rejected',
    priority: 'urgent',
    authorId: 'u4',
    createdAt: '2024-12-08T08:00:00',
    updatedAt: '2024-12-09T12:00:00',
    dueDate: '2024-12-15',
    fileSize: 890000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileName: 'akt_modernizaciya_etap2.docx',
    fileUrl: '',
    tags: ['акт', 'модернизация', 'IT'],
    comments: [
      { id: 'c3', authorId: 'u1', text: 'Не хватает подписи субподрядчика. Вернуть на доработку.', createdAt: '2024-12-09T12:00:00' },
    ],
    history: [
      { id: 'h7', action: 'created', userId: 'u4', createdAt: '2024-12-08T08:00:00', details: 'Документ создан' },
      { id: 'h8', action: 'rejected', userId: 'u1', createdAt: '2024-12-09T12:00:00', details: 'Отклонено: не хватает подписи' },
    ],
    approvals: [
      { id: 'a5', userId: 'u3', status: 'approved', completedAt: '2024-12-08T15:00:00' },
      { id: 'a6', userId: 'u1', status: 'rejected', comment: 'Не хватает подписи субподрядчика', completedAt: '2024-12-09T12:00:00' },
    ],
    version: 1,
  },
  {
    id: 'd4',
    number: 'ЗВ-2024-112',
    title: 'Заявление на предоставление отпуска',
    description: 'Заявление на ежегодный оплачиваемый отпуск с 25.12.2024 по 07.01.2025 (14 календарных дней).',
    category: 'Заявление',
    status: 'approved',
    priority: 'low',
    authorId: 'u5',
    createdAt: '2024-12-01T10:00:00',
    updatedAt: '2024-12-02T09:00:00',
    fileSize: 120000,
    fileType: 'application/pdf',
    fileName: 'zayavlenie_otpusk_morozov.pdf',
    fileUrl: '',
    tags: ['отпуск', 'кадры'],
    comments: [],
    history: [
      { id: 'h9', action: 'created', userId: 'u5', createdAt: '2024-12-01T10:00:00', details: 'Документ создан' },
      { id: 'h10', action: 'approved', userId: 'u1', createdAt: '2024-12-02T09:00:00', details: 'Согласовано' },
    ],
    approvals: [
      { id: 'a7', userId: 'u1', status: 'approved', completedAt: '2024-12-02T09:00:00' },
    ],
    version: 1,
  },
  {
    id: 'd5',
    number: 'ПР-2024-067',
    title: 'Приказ о проведении инвентаризации',
    description: 'Приказ о проведении годовой инвентаризации основных средств и материальных ценностей. Срок: до 31.12.2024.',
    category: 'Приказ',
    status: 'draft',
    priority: 'high',
    authorId: 'u2',
    createdAt: '2024-12-13T15:00:00',
    updatedAt: '2024-12-13T15:00:00',
    dueDate: '2024-12-18',
    fileSize: 560000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileName: 'prikaz_inventoryzaciya.docx',
    fileUrl: '',
    tags: ['инвентаризация', 'приказ'],
    comments: [],
    history: [
      { id: 'h11', action: 'created', userId: 'u2', createdAt: '2024-12-13T15:00:00', details: 'Черновик создан' },
    ],
    approvals: [],
    version: 1,
  },
  {
    id: 'd6',
    number: 'СЗ-2024-023',
    title: 'Служебная записка о необходимости закупки ПО',
    description: 'Обоснование необходимости приобретения лицензий на программное обеспечение для отдела разработки.',
    category: 'Служебная записка',
    status: 'pending',
    priority: 'medium',
    authorId: 'u5',
    createdAt: '2024-12-11T13:00:00',
    updatedAt: '2024-12-12T10:00:00',
    dueDate: '2024-12-25',
    fileSize: 230000,
    fileType: 'application/pdf',
    fileName: 'sluzhebnaya_zakupka_po.pdf',
    fileUrl: '',
    tags: ['ПО', 'закупка', 'лицензии'],
    comments: [
      { id: 'c4', authorId: 'u2', text: 'Прошу уточнить общую стоимость и сроки окупаемости.', createdAt: '2024-12-12T10:00:00' },
    ],
    history: [
      { id: 'h12', action: 'created', userId: 'u5', createdAt: '2024-12-11T13:00:00', details: 'Документ создан' },
      { id: 'h13', action: 'sent_to_approval', userId: 'u5', createdAt: '2024-12-11T13:05:00', details: 'Отправлен на согласование' },
    ],
    approvals: [
      { id: 'a8', userId: 'u2', status: 'waiting' },
      { id: 'a9', userId: 'u1', status: 'waiting' },
    ],
    version: 1,
  },
];

function App() {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('sed-documents');
    return saved ? JSON.parse(saved) : DEMO_DOCS;
  });
  const [notifications] = useState(3);

  const updateDocuments = (newDocs: Document[] | ((prev: Document[]) => Document[])) => {
    setDocuments(newDocs);
    const toSave = typeof newDocs === 'function' ? newDocs(documents) : newDocs;
    localStorage.setItem('sed-documents', JSON.stringify(toSave));
  };

  return (
    <AppContext.Provider value={{ documents, setDocuments: updateDocuments, users: USERS, currentUser: CURRENT_USER, notifications }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:id" element={<DocumentDetail />} />
            <Route path="upload" element={<UploadDocument />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="archive" element={<Archive />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
