import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, FileText, CheckSquare, Calendar,
  BookOpen, Users, BarChart3, Settings, Bell, Search,
  Menu, Globe, ChevronDown, LogOut, Inbox, Send,
  Archive, AlertCircle, Edit3, FolderOpen
} from 'lucide-react';

export default function Layout() {
  const { documents, tasks, language, setLanguage, t } = useContext(AppContext);
  const { user: authUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    documents: true,
    tasks: false,
    meetings: false,
    registry: false,
    references: false,
    reports: false,
    admin: false,
  });

  const pendingCount = documents.filter(d => d.status === 'on_approval').length;
  const myTasksCount = tasks.filter(task => task.assigneeId === authUser?.id && task.status !== 'completed').length;

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const navItems = [
    { 
      id: 'documents',
      path: '/documents', 
      icon: FolderOpen, 
      label: t('nav.documents'), 
      badge: pendingCount,
      children: [
        { path: '/documents?type=incoming', label: t('nav.incoming'), icon: Inbox, count: documents.filter(d => d.type === 'incoming').length },
        { path: '/documents?type=outgoing', label: t('nav.outgoing'), icon: Send, count: documents.filter(d => d.type === 'outgoing').length },
        { path: '/documents?type=internal', label: t('nav.internal'), icon: FileText, count: documents.filter(d => d.type === 'internal').length },
        { path: '/documents?status=draft', label: t('nav.drafts'), icon: Edit3, count: documents.filter(d => d.status === 'draft').length },
        { path: '/documents?status=on_approval', label: t('nav.on_approval'), icon: AlertCircle, count: documents.filter(d => d.status === 'on_approval').length },
        { path: '/documents?status=archived', label: t('nav.archived'), icon: Archive },
      ]
    },
    { path: '/tasks', icon: CheckSquare, label: t('nav.tasks'), badge: myTasksCount },
    { path: '/meetings', icon: Calendar, label: t('nav.meetings') },
    { path: '/registry', icon: BookOpen, label: t('nav.registry') },
    { 
      id: 'references',
      icon: FolderOpen, 
      label: t('nav.references'),
      children: [
        { path: '/employees', label: t('nav.employees'), icon: Users },
      ]
    },
    { path: '/reports', icon: BarChart3, label: t('nav.reports') },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '?');

  return (
    <div className="h-screen flex flex-col bg-[#f0f0f0] overflow-hidden" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5298] to-[#1e3a5f] text-white flex-shrink-0 h-[28px] flex items-center px-3 text-[11px] border-b border-[#0d1f33]">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-2 hover:bg-white/10 rounded px-1">
          <Menu size={14} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
            <FileText size={11} />
          </div>
          <span className="font-bold tracking-wide">СЭД "ЭСАСЫ ПИКИР"</span>
          <span className="text-white/40 mx-1">—</span>
          <span className="text-white/70 text-[10px]">{t('app.subtitle')}</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-white/70 text-[10px]">
          <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-0.5">
            <Globe size={10} />
            <button
              onClick={() => setLanguage('ru')}
              className={`text-[9px] px-1 rounded ${language === 'ru' ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
            >
              RU
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => setLanguage('tk')}
              className={`text-[9px] px-1 rounded ${language === 'tk' ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
            >
              TK
            </button>
          </div>
          <span>{authUser?.first_name || authUser?.username || 'Пользователь'}</span>
          <span>|</span>
          <span>{new Date().toLocaleDateString('ru-RU')}</span>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-[#f0f0f0] border-b border-[#999] flex items-center h-[24px] px-1 text-[11px] flex-shrink-0">
        {['Файл', 'Правка', 'Документ', 'Процессы', 'Вид', 'Сервис', 'Справка'].map(item => (
          <button key={item} className="px-2 py-0.5 hover:bg-[#cce4ff] hover:border hover:border-[#7ba8e0] rounded-sm text-[#333]">
            {item}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-gradient-to-b from-[#fafafa] to-[#e8e8e8] border-b border-[#999] flex items-center h-[36px] px-2 gap-1 flex-shrink-0">
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded border border-transparent hover:border-[#7ba8e0]">
          <FileText size={13} className="text-[#0066cc]" /> <span>Создать</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded border border-transparent hover:border-[#7ba8e0]">
          <Edit3 size={13} className="text-[#0066cc]" /> <span>Открыть</span>
        </button>
        <div className="w-px h-6 bg-[#999] mx-1" />
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded border border-transparent hover:border-[#7ba8e0]">
          <CheckSquare size={13} className="text-[#cc6600]" /> <span>Согласовать</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded border border-transparent hover:border-[#7ba8e0]">
          <Inbox size={13} className="text-[#0066cc]" /> <span>Зарегистрировать</span>
        </button>
        <div className="flex-1" />
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#888]" />
          <input type="text" placeholder={t('toolbar.search')} className="h-[24px] pl-6 pr-2 bg-white border border-[#999] rounded-sm text-[11px] focus:outline-none focus:border-[#0066cc] w-56" />
        </div>
        <button className="relative ml-1 w-7 h-7 rounded hover:bg-[#cce4ff] flex items-center justify-center border border-transparent hover:border-[#7ba8e0]">
          <Bell size={13} className="text-[#333]" />
          {(pendingCount + myTasksCount) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
              {pendingCount + myTasksCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tree Navigation */}
        <aside className={`w-[220px] bg-white border-r border-[#999] flex-shrink-0 flex flex-col overflow-hidden ${
          sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'
        }`}>
          <div className="px-2 py-1.5 bg-gradient-to-b from-[#e8eef5] to-[#d0dce8] border-b border-[#999]">
            <p className="text-[10px] font-bold text-[#333] uppercase tracking-wide">Навигатор</p>
          </div>
          <div className="flex-1 overflow-y-auto py-1 bg-white text-[11px]">
            {navItems.map(item => (
              <div key={item.id || item.path}>
                <div
                  onClick={() => item.id && toggleNode(item.id)}
                  className={`flex items-center gap-1.5 py-[4px] px-2 cursor-pointer hover:bg-[#e8f0fb] ${
                    item.path && isActive(item.path) ? 'bg-[#cce4ff] text-[#003d80] font-medium' : 'text-[#333]'
                  }`}
                >
                  {item.children ? (
                    expandedNodes[item.id!] ? (
                      <span className="text-[#666] text-[9px]">▼</span>
                    ) : (
                      <span className="text-[#666] text-[9px]">▶</span>
                    )
                  ) : (
                    <span className="w-[9px]" />
                  )}
                  <item.icon size={13} className={item.path && isActive(item.path) ? 'text-[#0055b3]' : 'text-[#666]'} />
                  {item.path ? (
                    <Link to={item.path} className="flex-1 truncate" onClick={(e) => e.stopPropagation()}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {item.badge && item.badge > 0 && (
                    <span className={`text-[9px] px-1 rounded ${
                      item.path && isActive(item.path) ? 'bg-[#0055b3] text-white' : 'bg-[#ddd] text-[#555]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.children && expandedNodes[item.id!] && (
                  <div className="ml-3">
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-1.5 py-[3px] px-2 text-[10px] hover:bg-[#e8f0fb] ${
                          isActive(child.path) ? 'bg-[#cce4ff] text-[#003d80] font-medium' : 'text-[#555]'
                        }`}
                      >
                        <child.icon size={11} className="text-[#888]" />
                        <span className="flex-1 truncate">{child.label}</span>
                        {child.count !== undefined && child.count > 0 && (
                          <span className="text-[8px] bg-[#ddd] px-1 rounded">{child.count}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-[#999] bg-[#f0f0f0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#d0dce8] flex items-center justify-center text-[10px] border border-[#999]">
                {authUser?.avatar || '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-[#333] truncate">
                  {authUser?.first_name || authUser?.username || 'Пользователь'}
                </p>
                <p className="text-[8px] text-[#666] truncate">{authUser?.position || ''}</p>
              </div>
              <button
                onClick={logout}
                className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center text-red-500"
                title="Выйти"
              >
                <LogOut size={12} />
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Center Content */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#ece9e0]">
          <Outlet />
        </main>
      </div>

      {/* Status Bar */}
      <div className="h-[22px] bg-[#f0f0f0] border-t border-[#999] flex items-center px-3 text-[10px] text-[#555] flex-shrink-0 gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Подключено
        </span>
        <span>|</span>
        <span>Документов: {documents.length}</span>
        <span>|</span>
        <span>Задач: {tasks.length}</span>
        <span>|</span>
        <span>На согласовании: {pendingCount}</span>
        <span className="ml-auto">СЭД "ЭСАСЫ ПИКИР" v5.3 • © 2024</span>
      </div>
    </div>
  );
}
