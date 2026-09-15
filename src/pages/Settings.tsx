import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { User, Bell, Shield, Palette, Database, Mail, Save, Check } from 'lucide-react';

export default function Settings() {
  const { currentUser } = useContext(AppContext);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+7 (999) 123-45-67',
    department: currentUser.department,
    position: currentUser.position,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newDocs: true,
    approvals: true,
    comments: true,
    deadlines: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    density: 'comfortable',
    language: 'ru',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'data', label: 'Данные', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Настройки</h1>
          <p className="text-sm text-slate-500">Управление параметрами системы</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm ${
            saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saved ? <><Check size={14} /> Сохранено</> : <><Save size={14} /> Сохранить</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 space-y-0.5">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition text-left ${
                  activeSection === section.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">Личные данные</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl">
                  {currentUser.avatar}
                </div>
                <div>
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium transition">
                    Изменить фото
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1">JPG, PNG. Макс. 2 МБ</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">ФИО</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Телефон</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Отдел</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Должность</label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Bell size={14} /> Настройки уведомлений
              </h2>
              
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email-уведомления', desc: 'Получать уведомления на электронную почту' },
                  { key: 'push', label: 'Push-уведомления', desc: 'Уведомления в браузере' },
                  { key: 'newDocs', label: 'Новые документы', desc: 'Когда создан новый документ' },
                  { key: 'approvals', label: 'Согласования', desc: 'Когда документ ожидает вашего решения' },
                  { key: 'comments', label: 'Комментарии', desc: 'Когда добавлен комментарий к документу' },
                  { key: 'deadlines', label: 'Сроки', desc: 'Напоминания о приближающихся сроках' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Shield size={14} /> Безопасность
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Текущий пароль</label>
                  <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Новый пароль</label>
                  <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Подтверждение пароля</label>
                  <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                  Изменить пароль
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-700 mb-3">Двухфакторная аутентификация</h3>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">2FA включена</p>
                    <p className="text-xs text-emerald-700">Ваш аккаунт защищён</p>
                  </div>
                  <Shield size={18} className="text-emerald-600" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-700 mb-3">Активные сессии</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="text-xs">💻</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900">Chrome на Windows</p>
                        <p className="text-[10px] text-slate-500">Текущая сессия • Москва</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">Активна</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Palette size={14} /> Внешний вид
              </h2>
              
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Тема</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: 'Светлая', emoji: '☀️' },
                    { id: 'dark', label: 'Тёмная', emoji: '🌙' },
                    { id: 'auto', label: 'Авто', emoji: '🖥️' },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setAppearance({ ...appearance, theme: theme.id })}
                      className={`p-3 rounded-lg border-2 text-center transition ${
                        appearance.theme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{theme.emoji}</span>
                      <p className="text-xs font-medium text-slate-700 mt-1">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Плотность интерфейса</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'compact', label: 'Компактная' },
                    { id: 'comfortable', label: 'Обычная' },
                    { id: 'spacious', label: 'Просторная' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setAppearance({ ...appearance, density: d.id })}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition ${
                        appearance.density === d.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Язык интерфейса</label>
                <select
                  value={appearance.language}
                  onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Database size={14} /> Данные и хранилище
              </h2>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">Использование хранилища</span>
                  <span className="text-xs text-slate-500">2.4 ГБ / 10 ГБ</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900">Экспорт данных</p>
                      <p className="text-xs text-slate-500">Скачать все документы в ZIP</p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-amber-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900">Резервная копия</p>
                      <p className="text-xs text-slate-500">Последняя: 15.12.2024</p>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-200">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-red-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-red-900">Очистить кэш</p>
                      <p className="text-xs text-red-600">Освободить 156 МБ</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
