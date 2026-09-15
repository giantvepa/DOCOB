import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Search, Upload, User, Home, Menu, X, Play } from 'lucide-react';

const CATEGORIES = ['Все', 'Программирование', 'Кулинария', 'Спорт', 'Путешествия', 'Технологии', 'Искусство', 'Музыка', 'Наука'];

export default function Layout() {
  const { searchQuery, setSearchQuery } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-4 gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Play size={14} fill="white" className="text-white ml-0.5" />
          </div>
          <span className="font-bold text-base hidden sm:block">VideoHub</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Поиск видео..."
              className="flex-1 h-9 px-4 bg-[#121212] border border-white/10 rounded-l-full text-sm focus:outline-none focus:border-blue-500 transition placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="h-9 px-5 bg-[#222] border border-white/10 border-l-0 rounded-r-full hover:bg-[#333] transition"
            >
              <Search size={16} className="text-gray-400" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/upload"
            className="h-9 px-3 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1.5 text-xs font-medium transition hidden sm:flex"
          >
            <Upload size={14} />
            <span>Загрузить</span>
          </Link>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold hover:opacity-90 transition"
          >
            <User size={14} />
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 bottom-0 w-56 bg-[#0f0f0f] border-r border-white/5 z-40 overflow-y-auto transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="p-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm"
          >
            <Home size={18} />
            <span>Главная</span>
          </Link>

          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="px-3 text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Категории</p>
            {CATEGORIES.slice(1).map(cat => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm text-gray-300"
              >
                <span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px]">
                  {cat === 'Программирование' ? '💻' : cat === 'Кулинария' ? '🍳' : cat === 'Спорт' ? '🏋️' : cat === 'Путешествия' ? '✈️' : cat === 'Технологии' ? '📱' : cat === 'Искусство' ? '🎨' : cat === 'Музыка' ? '🎵' : '🔬'}
                </span>
                <span>{cat}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="px-3 text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Информация</p>
            <div className="px-3 py-2 text-[11px] text-gray-600 space-y-1">
              <p>© 2024 VideoHub</p>
              <p>Создано на Django + React</p>
              <p className="text-gray-700">v2.0.0</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-14 lg:pl-56">
        <Outlet />
      </main>
    </div>
  );
}
