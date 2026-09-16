import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import {
  Inbox, Send, FileText, FolderOpen, Archive, Trash2,
  CheckSquare, Calendar, Users, BarChart3, Settings,
  ChevronRight, ChevronDown, Search, Bell, Plus,
  Save, Printer, Mail, Star, AlertCircle, HelpCircle,
  Menu, X, Home
} from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  icon: any;
  path?: string;
  badge?: number;
  children?: TreeNode[];
}

export default function Layout() {
  const { currentUser, documents, tasks } = useContext(AppContext);
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ docs: true, refs: false, sys: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const incomingCount = documents.filter(d => d.type === 'incoming').length;
  const outgoingCount = documents.filter(d => d.type === 'outgoing').length;
  const internalCount = documents.filter(d => d.type === 'internal').length;
  const draftCount = documents.filter(d => d.status === 'draft').length;
  const pendingCount = documents.filter(d => d.status === 'on_approval').length;
  const myTasksCount = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed').length;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const tree: TreeNode[] = [
    {
      id: 'docs', label: 'Документы', icon: FolderOpen, children: [
        { id: 'incoming', label: `Входящие (${incomingCount})`, icon: Inbox, path: '/documents?type=incoming' },
        { id: 'outgoing', label: `Исходящие (${outgoingCount})`, icon: Send, path: '/documents?type=outgoing' },
        { id: 'internal', label: `Внутренние (${internalCount})`, icon: FileText, path: '/documents?type=internal' },
        { id: 'drafts', label: `Черновики (${draftCount})`, icon: FileText, path: '/documents?status=draft' },
        { id: 'pending', label: `На согласовании (${pendingCount})`, icon: AlertCircle, path: '/documents?status=on_approval' },
        { id: 'all_docs', label: 'Все документы', icon: FolderOpen, path: '/documents' },
        { id: 'archived', label: 'Архив', icon: Archive, path: '/documents?status=archived' },
      ]
    },
    { id: 'tasks', label: `Задачи (${myTasksCount})`, icon: CheckSquare, path: '/tasks' },
    { id: 'meetings', label: 'Совещания', icon: Calendar, path: '/meetings' },
    { id: 'registry', label: 'Канцелярия', icon: Mail, path: '/registry' },
    {
      id: 'refs', label: 'Справочники', icon: FolderOpen, children: [
        { id: 'employees', label: 'Сотрудники', icon: Users, path: '/employees' },
        { id: 'org', label: 'Организации', icon: Users, path: '/employees' },
      ]
    },
    { id: 'reports', label: 'Отчёты', icon: BarChart3, path: '/reports' },
    {
      id: 'sys', label: 'Администрирование', icon: Settings, children: [
        { id: 'settings', label: 'Настройки', icon: Settings, path: '/reports' },
      ]
    },
  ];

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.id];
    const active = node.path ? isActive(node.path) : false;

    return (
      <div key={node.id}>
        <div
          onClick={() => {
            if (hasChildren) toggle(node.id);
          }}
          className={`flex items-center gap-1.5 py-[5px] pr-2 cursor-pointer text-[12px] transition-colors group ${
            active ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-700 hover:bg-slate-100'
          }`}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={12} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}
          <node.icon size={13} className={active ? 'text-blue-600' : 'text-slate-400'} />
          {node.path ? (
            <Link to={node.path} className="flex-1 truncate" onClick={(e) => e.stopPropagation()}>
              {node.label}
            </Link>
          ) : (
            <span className="flex-1 truncate">{node.label}</span>
          )}
        </div>
        {hasChildren && isExpanded && node.children!.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* ===== TOP TOOLBAR ===== */}
      <div className="bg-gradient-to-b from-[#3b6ea5] to-[#2d5986] text-white flex-shrink-0">
        {/* Title bar */}
        <div className="flex items-center h-8 px-3 border-b border-white/10 text-[11px]">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-2">
            <Menu size={14} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
              <FileText size={10} />
            </div>
            <span className="font-semibold tracking-wide">СЭД ТЕЗИС</span>
            <span className="text-white/50">— Организация: ООО «Демо-Предприятие»</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-white/70">
            <span>{currentUser.name}</span>
            <span className="text-white/40">|</span>
            <span>{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>

        {/* Action toolbar */}
        <div className="flex items-center h-9 px-2 gap-0.5">
          <Link to="/" className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Home size={12} /> Главная
          </Link>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Plus size={12} /> Создать
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Save size={12} /> Сохранить
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Mail size={12} /> Отправить
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <CheckSquare size={12} /> Согласовать
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Star size={12} /> Утвердить
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-white/10 rounded transition">
            <Printer size={12} /> Печать
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <div className="flex-1" />
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
            <input type="text" placeholder="Поиск..." className="h-6 pl-6 pr-2 bg-white/10 border border-white/20 rounded text-[11px] text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 w-44" />
          </div>
          <button className="relative ml-2 w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center">
            <Bell size={12} />
            {(pendingCount + myTasksCount) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">{pendingCount + myTasksCount}</span>
            )}
          </button>
          <button className="ml-1 w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center">
            <HelpCircle size={12} />
          </button>
        </div>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== LEFT SIDEBAR — TREE ===== */}
        <aside className={`w-52 bg-white border-r border-slate-300 flex-shrink-0 overflow-y-auto flex flex-col ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 pt-[72px]' : 'hidden lg:flex'}`}>
          {/* Tree header */}
          <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Навигация</p>
          </div>
          <div className="flex-1 py-1 overflow-y-auto">
            {tree.map(node => renderNode(node))}
          </div>
          {/* User info at bottom */}
          <div className="p-2 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs">{currentUser.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-slate-700 truncate">{currentUser.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[9px] text-slate-400 truncate">{currentUser.department}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ===== CONTENT ===== */}
        <main className="flex-1 overflow-auto bg-[#ececec]">
          <Outlet />
        </main>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="h-5 bg-[#e8e8e8] border-t border-slate-300 flex items-center px-3 text-[10px] text-slate-500 flex-shrink-0 gap-4">
        <span>Готово</span>
        <span className="ml-auto">Документов: {documents.length}</span>
        <span>|</span>
        <span>Задач: {tasks.length}</span>
        <span>|</span>
        <span>Подключено</span>
      </div>
    </div>
  );
}
