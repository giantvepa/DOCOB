import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import {
  LayoutDashboard, FileText, CheckSquare, Users, Calendar,
  BookOpen, BarChart3, Settings, Bell, Menu, X, Search,
  ChevronDown, LogOut, Inbox, Send, Building2
} from 'lucide-react';

export default function Layout() {
  const { currentUser, documents, tasks } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const pendingDocs = documents.filter(d => d.status === 'on_approval').length;
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed').length;

  const NAV = [
    { path: '/', icon: LayoutDashboard, label: 'Главная', badge: null },
    { path: '/documents', icon: FileText, label: 'Документы', badge: pendingDocs },
    { path: '/tasks', icon: CheckSquare, label: 'Задачи', badge: myTasks },
    { path: '/meetings', icon: Calendar, label: 'Совещания', badge: null },
    { path: '/registry', icon: BookOpen, label: 'Канцелярия', badge: null },
    { path: '/employees', icon: Users, label: 'Сотрудники', badge: null },
    { path: '/reports', icon: BarChart3, label: 'Отчёты', badge: null },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/documents?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#1a3a5c] text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-white/10 bg-[#15304d]">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none">СЭД ТЕЗИС</h1>
            <p className="text-[9px] text-blue-300/70 leading-none mt-0.5">Документооборот</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2 space-y-0.5 mt-1">
          {NAV.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-[13px] transition-all ${
                  isActive
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-blue-100/80 hover:bg-white/8 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-[#15304d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-sm">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentUser.name.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-[10px] text-blue-200/60 truncate">{currentUser.position}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center"
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск документов, задач..."
                className="w-full h-8 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </form>

          {/* Quick actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link to="/documents?type=incoming" className="flex items-center gap-1 h-8 px-2.5 text-[11px] text-slate-600 hover:bg-slate-100 rounded transition">
              <Inbox size={13} /> Входящие
            </Link>
            <Link to="/documents?type=outgoing" className="flex items-center gap-1 h-8 px-2.5 text-[11px] text-slate-600 hover:bg-slate-100 rounded transition">
              <Send size={13} /> Исходящие
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button className="relative w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center">
              <Bell size={16} className="text-slate-600" />
              {(pendingDocs + myTasks) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingDocs + myTasks}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 h-8 px-2 rounded hover:bg-slate-100 transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                  {currentUser.avatar}
                </div>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                  </div>
                  <Link to="/employees" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                    <Settings size={12} /> Настройки
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full">
                    <LogOut size={12} /> Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
