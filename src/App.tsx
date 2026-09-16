import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initDatabase } from './backend/database/connection';
import { seedDatabase } from './backend/database/seed';
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
import DatabaseViewer from './pages/DatabaseViewer';

// ============ TYPES ============
export type DocStatus = 'draft' | 'on_approval' | 'on_signing' | 'signed' | 'executed' | 'rejected' | 'archived';
export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'overdue' | 'deferred';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type DocType = 'incoming' | 'outgoing' | 'internal';
export type DocCategory = 'Договор' | 'Счёт' | 'Акт' | 'Письмо' | 'Приказ' | 'Заявление' | 'Служебная записка' | 'Протокол' | 'Доверенность' | 'Другое';
export type Language = 'ru' | 'tk';

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
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string) => string;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// ============ TRANSLATIONS ============
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ru: {
    // Header
    'app.title': 'СЭД "ЭСАСЫ ПИКИР"',
    'app.subtitle': 'Система электронного документооборота',
    'app.organization': 'Организация: Демонстрационное предприятие',
    'app.ready': 'Готово',
    'app.connected': 'Подключено',
    'app.documents': 'Документов',
    'app.tasks': 'Задач',
    'app.on_approval': 'На согласовании',
    'app.version': 'СЭД "ЭСАСЫ ПИКИР" v5.3 • © 2024',
    
    // Menu
    'menu.file': 'Файл',
    'menu.edit': 'Правка',
    'menu.document': 'Документ',
    'menu.processes': 'Процессы',
    'menu.view': 'Вид',
    'menu.service': 'Сервис',
    'menu.help': 'Справка',
    
    // Toolbar
    'toolbar.create': 'Создать',
    'toolbar.open': 'Открыть',
    'toolbar.save': 'Сохранить',
    'toolbar.send': 'Отправить',
    'toolbar.approve': 'Согласовать',
    'toolbar.sign': 'Утвердить',
    'toolbar.print': 'Печать',
    'toolbar.search': 'Поиск документов...',
    
    // Navigation
    'nav.documents': 'Документы',
    'nav.incoming': 'Входящие',
    'nav.outgoing': 'Исходящие',
    'nav.internal': 'Внутренние',
    'nav.drafts': 'Черновики',
    'nav.on_approval': 'На согласовании',
    'nav.all_docs': 'Все документы',
    'nav.archived': 'Архив',
    'nav.tasks': 'Задачи и поручения',
    'nav.meetings': 'Совещания',
    'nav.registry': 'Канцелярия',
    'nav.references': 'Справочники',
    'nav.employees': 'Сотрудники',
    'nav.organizations': 'Организации',
    'nav.nomenclature': 'Номенклатура дел',
    'nav.reports': 'Отчёты и аналитика',
    'nav.admin': 'Администрирование',
    'nav.users': 'Пользователи',
    'nav.routes': 'Маршруты согласования',
    'nav.templates': 'Шаблоны документов',
    'nav.settings': 'Системные параметры',
    
    // Statuses
    'status.draft': 'Черновик',
    'status.on_approval': 'На согласовании',
    'status.on_signing': 'На подписании',
    'status.signed': 'Подписан',
    'status.executed': 'Исполнен',
    'status.rejected': 'Отклонён',
    'status.archived': 'В архиве',
    
    // Priorities
    'priority.low': 'Низкий',
    'priority.normal': 'Обычный',
    'priority.high': 'Высокий',
    'priority.critical': 'Критичный',
    
    // Task statuses
    'task.new': 'Новая',
    'task.in_progress': 'В работе',
    'task.completed': 'Выполнена',
    'task.overdue': 'Просрочена',
    'task.deferred': 'Отложена',
    
    // Common
    'common.all': 'Все',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.reset': 'Сбросить',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.close': 'Закрыть',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.confirm': 'Подтвердить',
    'common.records': 'Записей',
    'common.selected': 'Выделено',
    
    // Home page
    'home.title': 'Рабочий стол',
    'home.pending_docs': 'Документы, ожидающие моего решения',
    'home.my_tasks': 'Мои задачи и поручения',
    'home.recent_docs': 'Последние документы',
    'home.meetings': 'Ближайшие совещания',
    'home.quick_access': 'Быстрый доступ',
    'home.register_incoming': 'Зарегистрировать входящий',
    'home.prepare_outgoing': 'Подготовить исходящий',
    'home.internal_doc': 'Внутренний документ',
    'home.create_task': 'Поставить задачу',
    'home.organize_meeting': 'Организовать совещание',
    'home.approve_doc': 'Утвердить документ',
    'home.no_pending': 'Нет документов, ожидающих вашего решения',
    'home.no_tasks': 'Нет активных задач',
    'home.no_meetings': 'Нет запланированных совещаний',
    
    // Documents
    'docs.title': 'Документы',
    'docs.all': 'Все документы',
    'docs.incoming': 'Входящие документы',
    'docs.outgoing': 'Исходящие документы',
    'docs.internal': 'Внутренние документы',
    'docs.drafts': 'Черновики',
    'docs.on_approval': 'Документы на согласовании',
    'docs.archived': 'Архив документов',
    'docs.number': 'Рег. номер',
    'docs.date': 'Дата',
    'docs.type': 'Тип',
    'docs.correspondent': 'Корреспондент',
    'docs.subject': 'Тема документа',
    'docs.status': 'Статус',
    'docs.author': 'Автор',
    'docs.not_found': 'Документы не найдены',
    
    // Document card
    'doc.main_info': 'Основная информация',
    'doc.content': 'Содержание',
    'doc.workflow': 'Маршрут',
    'doc.approval': 'Согласование',
    'doc.history': 'История',
    'doc.files': 'Файлы',
    'doc.reg_number': 'Регистрационный номер',
    'doc.reg_date': 'Дата регистрации',
    'doc.doc_type': 'Тип документа',
    'doc.category': 'Категория',
    'doc.department': 'Подразделение',
    'doc.due_date': 'Срок исполнения',
    'doc.priority': 'Приоритет',
    'doc.last_modified': 'Последнее изменение',
    'doc.version': 'Версия',
    'doc.description': 'Описание',
    'doc.tags': 'Теги',
    'doc.topic': 'Тема документа',
    'doc.text': 'Текст документа',
    'doc.resolution': 'Резолюция',
    'doc.no_resolution': 'Резолюция не наложена',
    'doc.workflow_scheme': 'Схема бизнес-процесса',
    'doc.created': 'Создан',
    'doc.approval_stage': 'Согласование',
    'doc.signed': 'Подписан',
    'doc.executed': 'Исполнен',
    'doc.rejected': 'Отклонён',
    'doc.return_for_revision': 'Возврат на доработку',
    'doc.completed': 'Завершено',
    'doc.in_process': 'В процессе',
    'doc.waiting': 'Ожидает',
    'doc.rejected_status': 'Отклонено',
    'doc.approval_route': 'Маршрут согласования',
    'doc.no_route': 'Маршрут согласования не задан',
    'doc.approver': 'Согласующий',
    'doc.position': 'Должность',
    'doc.comment': 'Комментарий',
    'doc.approved': '✓ Согласовано',
    'doc.rejected_mark': '✗ Отклонено',
    'doc.pending': '⏳ Ожидает',
    'doc.approval_progress': 'Прогресс согласования',
    'doc.change_history': 'История изменений',
    'doc.date_time': 'Дата/время',
    'doc.user': 'Пользователь',
    'doc.action': 'Действие',
    'doc.attachments': 'Вложения',
    'doc.download': 'Скачать',
    'doc.attachment': 'Вложение',
    'doc.of': 'из',
    'doc.comments': 'Комментарии',
    'doc.add_comment': 'Добавить комментарий...',
    'doc.send': 'Отправить',
    'doc.to_approval': 'На согласование',
    'doc.approve': 'Согласовать',
    'doc.reject': 'Отклонить',
    'doc.open_card': 'Открыть карточку →',
    'doc.preview': 'Предварительный просмотр',
    
    // Tasks
    'tasks.title': 'Задачи и поручения',
    'tasks.new_task': 'Новая задача',
    'tasks.my': 'Мои задачи',
    'tasks.assigned_by_me': 'Порученные мной',
    'tasks.all': 'Все',
    'tasks.all_statuses': 'Все статусы',
    'tasks.task': 'Задача',
    'tasks.deadline': 'Срок',
    'tasks.executor': 'Исполнитель',
    'tasks.no_tasks': 'Нет задач',
    
    // Meetings
    'meetings.title': 'Совещания',
    'meetings.create': 'Создать',
    'meetings.planned': 'Запланировано',
    'meetings.in_progress': 'Идёт',
    'meetings.completed': 'Завершено',
    'meetings.cancelled': 'Отменено',
    'meetings.organizer': 'Организатор',
    'meetings.agenda': 'Повестка',
    'meetings.protocol': 'Протокол',
    'meetings.persons': 'чел.',
    
    // Registry
    'registry.title': 'Канцелярия',
    'registry.subtitle': 'Регистрация и учёт документов',
    'registry.name': 'Название',
    
    // Employees
    'employees.title': 'Сотрудники',
    'employees.directory': 'Справочник',
    'employees.search_placeholder': 'Поиск по ФИО, должности...',
    'employees.all_departments': 'Все подразделения',
    'employees.admin': 'Администратор',
    'employees.manager': 'Руководитель',
    'employees.employee': 'Сотрудник',
    
    // Reports
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
  },
  tk: {
    // Header
    'app.title': 'ESASY PIKIR EDS',
    'app.subtitle': 'Elektronik resminama dolanyşyk ulgamy',
    'app.organization': 'Gurama: Demo kärhanasy',
    'app.ready': 'Taýyn',
    'app.connected': 'Birikdirilen',
    'app.documents': 'Resminamalar',
    'app.tasks': 'Wezipeler',
    'app.on_approval': 'Ylalaşykda',
    'app.version': 'ESASY PIKIR EDS v5.3 • © 2024',
    
    // Menu
    'menu.file': 'Faýl',
    'menu.edit': 'Üýtget',
    'menu.document': 'Resminama',
    'menu.processes': 'Prosesler',
    'menu.view': 'Görüş',
    'menu.service': 'Hyzmat',
    'menu.help': 'Kömek',
    
    // Toolbar
    'toolbar.create': 'Döret',
    'toolbar.open': 'Aç',
    'toolbar.save': 'Sakla',
    'toolbar.send': 'Iber',
    'toolbar.approve': 'Ylalaş',
    'toolbar.sign': 'Tassykla',
    'toolbar.print': 'Çap et',
    'toolbar.search': 'Resminama gözle...',
    
    // Navigation
    'nav.documents': 'Resminamalar',
    'nav.incoming': 'Gelen',
    'nav.outgoing': 'Gidýän',
    'nav.internal': 'Içerki',
    'nav.drafts': 'Taslamalar',
    'nav.on_approval': 'Ylalaşykda',
    'nav.all_docs': 'Ähli resminamalar',
    'nav.archived': 'Arhiw',
    'nav.tasks': 'Wezipeler we tabşyryklar',
    'nav.meetings': 'Maslahatlar',
    'nav.registry': 'Kanselýariýa',
    'nav.references': 'Salgylanmalar',
    'nav.employees': 'Işgärler',
    'nav.organizations': 'Guramalar',
    'nav.nomenclature': 'Iş kagyzlarynyň nomenklaturasy',
    'nav.reports': 'Hasabatlar we seljerme',
    'nav.admin': 'Administrirleme',
    'nav.users': 'Ulanyjylar',
    'nav.routes': 'Ylalaşyk marşrutlary',
    'nav.templates': 'Resminama şablonlary',
    'nav.settings': 'Ulgam parametrleri',
    
    // Statuses
    'status.draft': 'Taslama',
    'status.on_approval': 'Ylalaşykda',
    'status.on_signing': 'Gol çekmekde',
    'status.signed': 'Gol çekilen',
    'status.executed': 'Ýerine ýetirilen',
    'status.rejected': 'Ret edilen',
    'status.archived': 'Arhiwde',
    
    // Priorities
    'priority.low': 'Pes',
    'priority.normal': 'Adaty',
    'priority.high': 'Ýokary',
    'priority.critical': 'Kritik',
    
    // Task statuses
    'task.new': 'Täze',
    'task.in_progress': 'Işlenilýär',
    'task.completed': 'Tamamlandy',
    'task.overdue': 'Gijikdirilen',
    'task.deferred': 'Yza süýşürilen',
    
    // Common
    'common.all': 'Ählisi',
    'common.search': 'Gözleg',
    'common.filter': 'Süzgüç',
    'common.reset': 'Täzeden',
    'common.save': 'Sakla',
    'common.cancel': 'Ýatyr',
    'common.delete': 'Poz',
    'common.edit': 'Üýtget',
    'common.view': 'Gör',
    'common.close': 'Ýap',
    'common.yes': 'Hawa',
    'common.no': 'Ýok',
    'common.confirm': 'Tassykla',
    'common.records': 'Ýazgylar',
    'common.selected': 'Saýlanan',
    
    // Home page
    'home.title': 'Iş stoly',
    'home.pending_docs': 'Meniň çözgüdime garaşýan resminamalar',
    'home.my_tasks': 'Meniň wezipelerim we tabşyryklarym',
    'home.recent_docs': 'Soňky resminamalar',
    'home.meetings': 'Ýakyn maslahatlar',
    'home.quick_access': 'Çalt giriş',
    'home.register_incoming': 'Gelen resminamany hasaba al',
    'home.prepare_outgoing': 'Gidýän resminamany taýýarla',
    'home.internal_doc': 'Içerki resminama',
    'home.create_task': 'Wezipe goý',
    'home.organize_meeting': 'Maslahat gurna',
    'home.approve_doc': 'Resminamany tassykla',
    'home.no_pending': 'Siziň çözgüdiňize garaşýan resminamalar ýok',
    'home.no_tasks': 'Işjeň wezipeler ýok',
    'home.no_meetings': 'Meýilleşdirilen maslahatlar ýok',
    
    // Documents
    'docs.title': 'Resminamalar',
    'docs.all': 'Ähli resminamalar',
    'docs.incoming': 'Gelen resminamalar',
    'docs.outgoing': 'Gidýän resminamalar',
    'docs.internal': 'Içerki resminamalar',
    'docs.drafts': 'Taslamalar',
    'docs.on_approval': 'Ylalaşykda bolan resminamalar',
    'docs.archived': 'Resminamalar arhiwi',
    'docs.number': 'Hasaba alyş belgisi',
    'docs.date': 'Sene',
    'docs.type': 'Görnüş',
    'docs.correspondent': 'Habарçy',
    'docs.subject': 'Resminamanyň temasy',
    'docs.status': 'Ýagdaý',
    'docs.author': 'Awtor',
    'docs.not_found': 'Resminamalar tapylmady',
    
    // Document card
    'doc.main_info': 'Esasy maglumat',
    'doc.content': 'Mazmun',
    'doc.workflow': 'Marşrut',
    'doc.approval': 'Ylalaşyk',
    'doc.history': 'Taryh',
    'doc.files': 'Faýllar',
    'doc.reg_number': 'Hasaba alyş belgisi',
    'doc.reg_date': 'Hasaba alyş senesi',
    'doc.doc_type': 'Resminama görnüşi',
    'doc.category': 'Kategoriýa',
    'doc.department': 'Bölüm',
    'doc.due_date': 'Ýerine ýetirmeli möhlet',
    'doc.priority': 'Ileri tutulýan ugur',
    'doc.last_modified': 'Soňky üýtgeşme',
    'doc.version': 'Wersiýa',
    'doc.description': 'Düşündiriş',
    'doc.tags': 'Bellikler',
    'doc.topic': 'Resminamanyň temasy',
    'doc.text': 'Resminamanyň teksti',
    'doc.resolution': 'Rezolýusiýa',
    'doc.no_resolution': 'Rezolýusiýa goýulmady',
    'doc.workflow_scheme': 'Iş prosesi shemasy',
    'doc.created': 'Döredilen',
    'doc.approval_stage': 'Ylalaşyk',
    'doc.signed': 'Gol çekilen',
    'doc.executed': 'Ýerine ýetirilen',
    'doc.rejected': 'Ret edilen',
    'doc.return_for_revision': 'Gaýtadan işlemek üçin gaýtaryldy',
    'doc.completed': 'Tamamlandy',
    'doc.in_process': 'Prosesde',
    'doc.waiting': 'Garaşýar',
    'doc.rejected_status': 'Ret edildi',
    'doc.approval_route': 'Ylalaşyk marşruty',
    'doc.no_route': 'Ylalaşyk marşruty kesgitlenmedik',
    'doc.approver': 'Ylalaşyjy',
    'doc.position': 'Wezipe',
    'doc.comment': 'Teswir',
    'doc.approved': '✓ Ylalaşyldy',
    'doc.rejected_mark': '✗ Ret edildi',
    'doc.pending': '⏳ Garaşýar',
    'doc.approval_progress': 'Ylalaşyk ösüşi',
    'doc.change_history': 'Üýtgeşme taryhy',
    'doc.date_time': 'Sene/wagt',
    'doc.user': 'Ulanyjy',
    'doc.action': 'Hereket',
    'doc.attachments': 'Goşundylar',
    'doc.download': 'Ýükle',
    'doc.attachment': 'Goşundy',
    'doc.of': '-dan/-den',
    'doc.comments': 'Teswirler',
    'doc.add_comment': 'Teswir goş...',
    'doc.send': 'Iber',
    'doc.to_approval': 'Ylalaşyga',
    'doc.approve': 'Ylalaş',
    'doc.reject': 'Ret et',
    'doc.open_card': 'Kartany aç →',
    'doc.preview': 'Öňünden görmek',
    
    // Tasks
    'tasks.title': 'Wezipeler we tabşyryklar',
    'tasks.new_task': 'Täze wezipe',
    'tasks.my': 'Meniň wezipelerim',
    'tasks.assigned_by_me': 'Meniň tabşyranlarym',
    'tasks.all': 'Ählisi',
    'tasks.all_statuses': 'Ähli ýagdaýlar',
    'tasks.task': 'Wezipe',
    'tasks.deadline': 'Möhlet',
    'tasks.executor': 'Ýerine ýetiriji',
    'tasks.no_tasks': 'Wezipeler ýok',
    
    // Meetings
    'meetings.title': 'Maslahatlar',
    'meetings.create': 'Döret',
    'meetings.planned': 'Meýilleşdirilen',
    'meetings.in_progress': 'Barýar',
    'meetings.completed': 'Tamamlandy',
    'meetings.cancelled': 'Ýatyryldy',
    'meetings.organizer': 'Gurnaýjy',
    'meetings.agenda': 'Gündelik',
    'meetings.protocol': 'Protokol',
    'meetings.persons': 'adam',
    
    // Registry
    'registry.title': 'Kanselýariýa',
    'registry.subtitle': 'Resminamalary hasaba almak we hasapda saklamak',
    'registry.name': 'Ady',
    
    // Employees
    'employees.title': 'Işgärler',
    'employees.directory': 'Salgylanma',
    'employees.search_placeholder': 'F.I.O., wezipe boýunça gözle...',
    'employees.all_departments': 'Ähli bölümler',
    'employees.admin': 'Administrator',
    'employees.manager': 'Ýolbaşçy',
    'employees.employee': 'Işgär',
    
    // Reports
    'reports.title': 'Hasabatlar we seljerme',
    'reports.subtitle': 'Resminama dolanyşygynyň statistikasy',
    'reports.by_category': 'Kategoriýalar boýunça',
    'reports.by_author': 'Awtorlar boýunça',
    'reports.by_type': 'Görnüşler boýunça',
    'reports.by_status': 'Ýagdaýlar boýunça',
    'reports.drafts': 'Taslamalar',
    'reports.approved': 'Gol çekilen',
    'reports.executed': 'Ýerine ýetirilen',
    'reports.rejected': 'Ret edilen',
  },
};

// ============ DEMO DATA ============
const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Аннамыратов Сердар', position: 'Генеральный директор', department: 'Руководство', avatar: '👔', email: 'annamyradov@demo.tm', phone: '+993 12 34-56-01', role: 'admin' },
  { id: 'e2', name: 'Мергенджанова Айгуль', position: 'Главный бухгалтер', department: 'Бухгалтерия', avatar: '👩‍💼', email: 'mergenjanova@demo.tm', phone: '+993 12 34-56-02', role: 'manager' },
  { id: 'e3', name: 'Бердиев Гурбан', position: 'Начальник юридического отдела', department: 'Юридический отдел', avatar: '⚖️', email: 'berdiyev@demo.tm', phone: '+993 12 34-56-03', role: 'manager' },
  { id: 'e4', name: 'Оразова Мая', position: 'Менеджер проектов', department: 'Проектный отдел', avatar: '📋', email: 'orazova@demo.tm', phone: '+993 12 34-56-04', role: 'user' },
  { id: 'e5', name: 'Атаев Довлет', position: 'Начальник IT-отдела', department: 'Информационные технологии', avatar: '💻', email: 'ataev@demo.tm', phone: '+993 12 34-56-05', role: 'manager' },
  { id: 'e6', name: 'Дурдыева Джесмайн', position: 'Секретарь', department: 'Канцелярия', avatar: '📝', email: 'durdyýewa@demo.tm', phone: '+993 12 34-56-06', role: 'user' },
  { id: 'e7', name: 'Ниязов Батыр', position: 'Специалист по кадрам', department: 'Отдел кадров', avatar: '👥', email: 'niýazow@demo.tm', phone: '+993 12 34-56-07', role: 'user' },
  { id: 'e8', name: 'Гульджаханова Лейла', position: 'Финансовый директор', department: 'Финансовый отдел', avatar: '💰', email: 'guljahanova@demo.tm', phone: '+993 12 34-56-08', role: 'manager' },
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
];

const DEMO_TASKS: Task[] = [
  { id: 't1', title: 'Подготовить ответ на письмо ООО "Партнёр"', description: 'Подготовить проект ответа до конца недели', status: 'in_progress', priority: 'high', assigneeId: 'e4', authorId: 'e1', documentId: 'd2', createdAt: '2024-12-10T09:00:00', dueDate: '2024-12-15' },
  { id: 't2', title: 'Проверить договор поставки оборудования', description: 'Юридическая экспертиза договора с ООО "ТехноСервис"', status: 'completed', priority: 'high', assigneeId: 'e3', authorId: 'e1', documentId: 'd1', createdAt: '2024-12-10T11:00:00', dueDate: '2024-12-12', completedAt: '2024-12-11T10:00:00' },
  { id: 't3', title: 'Подготовить финансовое обоснование модернизации', description: 'Рассчитать ROI и срок окупаемости', status: 'new', priority: 'normal', assigneeId: 'e8', authorId: 'e1', documentId: 'd3', createdAt: '2024-12-08T12:00:00', dueDate: '2024-12-20' },
];

const DEMO_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Заседание правления по итогам Q4 2024', description: 'Обсуждение результатов 4 квартала и планов на 2025 год', date: '2024-12-18', time: '10:00', duration: 120, location: 'Конференц-зал А', organizerId: 'e1', participantIds: ['e1', 'e2', 'e3', 'e5', 'e8'], status: 'planned', agenda: ['Итоги Q4 по подразделениям', 'Финансовые показатели', 'Планы на 2025', 'Бюджетирование'] },
  { id: 'm2', title: 'Совещание по проекту модернизации ЦОД', description: 'Обсуждение хода проекта и согласование этапов', date: '2024-12-16', time: '14:00', duration: 60, location: 'Переговорная Б', organizerId: 'e5', participantIds: ['e5', 'e4', 'e3', 'e8'], status: 'planned', agenda: ['Статус проекта', 'Согласование договора', 'Сроки поставки', 'Бюджет'] },
];

// Инициализация базы данных и демо-данных
async function initializeDatabase() {
  try {
    console.log('[App] Initializing database...');
    await initDatabase();
    console.log('[App] Database initialized, seeding data...');
    await seedDatabase();
    console.log('[App] Database seeding completed');
  } catch (error) {
    console.error('[App] Error initializing database:', error);
  }
}

// Компонент для защищенных маршрутов
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return <>{children}</>;
}

function App() {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const s = localStorage.getItem('esasy-pikir-docs');
    return s ? JSON.parse(s) : DEMO_DOCS;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const s = localStorage.getItem('esasy-pikir-tasks');
    return s ? JSON.parse(s) : DEMO_TASKS;
  });
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const s = localStorage.getItem('esasy-pikir-meetings');
    return s ? JSON.parse(s) : DEMO_MEETINGS;
  });
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('esasy-pikir-lang') as Language;
    return saved || 'ru';
  });
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    localStorage.setItem('esasy-pikir-lang', language);
  }, [language]);

  useEffect(() => {
    initializeDatabase().then(() => setDbInitialized(true));
  }, []);

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  const updateDocs = (v: Document[] | ((p: Document[]) => Document[])) => {
    setDocuments(v);
    const toSave = typeof v === 'function' ? v(documents) : v;
    localStorage.setItem('esasy-pikir-docs', JSON.stringify(toSave));
  };
  const updateTasks = (v: Task[] | ((p: Task[]) => Task[])) => {
    setTasks(v);
    const toSave = typeof v === 'function' ? v(tasks) : v;
    localStorage.setItem('esasy-pikir-tasks', JSON.stringify(toSave));
  };
  const updateMeetings = (v: Meeting[] | ((p: Meeting[]) => Meeting[])) => {
    setMeetings(v);
    const toSave = typeof v === 'function' ? v(meetings) : v;
    localStorage.setItem('esasy-pikir-meetings', JSON.stringify(toSave));
  };

  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-blue flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">СЭД "ЭСАСЫ ПИКИР"</h2>
          <p className="text-sm text-gray-500">Инициализация базы данных...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppContext.Provider value={{ documents, setDocuments: updateDocs, tasks, setTasks: updateTasks, meetings, setMeetings: updateMeetings, employees: EMPLOYEES, currentUser: CURRENT_USER, language, setLanguage, t }}>
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
              <Route path="database" element={<DatabaseViewer />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </AuthProvider>
  );
}

export default App;
