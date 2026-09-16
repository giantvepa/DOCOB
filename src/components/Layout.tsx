import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { resetApp } from '../utils/clearData';
import {
  LayoutDashboard, FileText, CheckSquare, Calendar,
  BookOpen, Users, BarChart3, Settings, Bell, Search,
  Menu, X, Globe, ChevronDown, LogOut, RefreshCw, Database
} from 'lucide-react';

export default function Layout() {
  const { currentUser, documents, tasks, language, setLanguage, t } = useContext(AppContext);
  const { user: authUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pendingCount = documents.filter(d => d.status === 'on_approval').length;
  const myTasksCount = tasks.filter(task => task.assigneeId === currentUser.id && task.status !== 'completed').length;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('home.title'), badge: null },
    { path: '/documents', icon: FileText, label: t('nav.documents'), badge: pendingCount },
    { path: '/tasks', icon: CheckSquare, label: t('nav.tasks'), badge: myTasksCount },
    { path: '/meetings', icon: Calendar, label: t('nav.meetings'), badge: null },
    { path: '/registry', icon: BookOpen, label: t('nav.registry'), badge: null },
    { path: '/employees', icon: Users, label: t('nav.employees'), badge: null },
    { path: '/reports', icon: BarChart3, label: t('nav.reports'), badge: null },
    { path: '/database', icon: Database, label: 'База данных', badge: null },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Modern Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {authUser?.avatar || currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{authUser?.name || currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{authUser?.position || currentUser.position}</p>
            </div>
            <button
              onClick={logout}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition text-red-500"
              title="Выйти"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('toolbar.search')}
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Globe size={16} className="text-gray-500 ml-2" />
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  language === 'ru' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('tk')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  language === 'tk' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                TK
              </button>
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
              <Bell size={20} className="text-gray-600" />
              {(pendingCount + myTasksCount) > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingCount + myTasksCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
              <Link to="/reports" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings size={16} /> {t('nav.settings')}
              </Link>
              <button 
                onClick={() => { setProfileOpen(false); resetApp(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full"
              >
                <RefreshCw size={16} /> Сбросить данные
              </button>
              <button 
                onClick={() => { setProfileOpen(false); logout(); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut size={16} /> Выйти
              </button>                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
