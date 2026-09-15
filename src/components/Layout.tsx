import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import {
  LayoutDashboard, FileText, Upload, CheckSquare, Archive,
  BarChart3, Settings, Bell, Menu, X, Search, LogOut, ChevronDown
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Панель управления', badge: null },
  { path: '/documents', icon: FileText, label: 'Документы', badge: null },
  { path: '/upload', icon: Upload, label: 'Загрузить', badge: null },
  { path: '/approvals', icon: CheckSquare, label: 'Согласование', badge: 'pending' },
  { path: '/archive', icon: Archive, label: 'Архив', badge: null },
  { path: '/analytics', icon: BarChart3, label: 'Аналитика', badge: null },
  { path: '/settings', icon: Settings, label: 'Настройки', badge: null },
];

export default function Layout() {
  const { currentUser, notifications, documents } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const pendingCount = documents.filter(d => d.status === 'pending').length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/documents?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Документооборот</h1>
            <p className="text-[10px] text-slate-400">СЭД «Канцелярия»</p>
          </div>
        </div>

        <nav className="p-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const badgeCount = item.badge === 'pending' ? pendingCount : null;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 font-medium'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {badgeCount && badgeCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.position}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск документов..."
                  autoFocus
                  className="flex-1 h-9 px-3 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                  <X size={16} className="text-slate-400" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 w-full h-9 px-3 bg-slate-100 rounded-lg text-sm text-slate-500 hover:bg-slate-200 transition"
              >
                <Search size={14} />
                <span>Поиск документов...</span>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <Upload size={14} />
              <span>Новый документ</span>
            </Link>

            <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition">
              <Bell size={18} className="text-slate-600" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs">
                  {currentUser.avatar}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings size={14} /> Настройки
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <LogOut size={14} /> Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
