import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Mail, Lock, User, Building2, Briefcase, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    position: '',
    department: '',
    avatar: '👤',
    role: 'user' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Ошибка входа');
        }
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Заполните все обязательные поля');
          setLoading(false);
          return;
        }
        const result = await register(formData);
        if (!result.success) {
          setError(result.error || 'Ошибка регистрации');
        }
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const avatars = ['👤', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🔧', '👩‍🔧', '👨‍🎓', '👩‍🎓'];
  const departments = ['Руководство', 'Бухгалтерия', 'Юридический отдел', 'IT отдел', 'Отдел кадров', 'Канцелярия', 'Проектный отдел', 'Финансовый отдел'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left - Branding */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-blue flex items-center justify-center">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">СЭД "ЭСАСЫ ПИКИР"</h1>
                <p className="text-sm text-gray-500">Elektronika resminama dolanyşyk ulgamy</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Современная система<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                документооборота
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Управляйте документами, задачами и совещаниями в единой системе
            </p>
            
            <div className="space-y-4">
              {[
                { icon: '📄', title: 'Управление документами', desc: 'Создание, согласование, утверждение' },
                { icon: '✅', title: 'Задачи и поручения', desc: 'Постановка и контроль исполнения' },
                { icon: '📅', title: 'Совещания', desc: 'Планирование и проведение' },
                { icon: '🔒', title: 'Безопасность', desc: 'Аутентификация и права доступа' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-blue flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">СЭД "ЭСАСЫ ПИКИР"</h1>
              <p className="text-xs text-gray-500">Elektronika resminama dolanyşyk</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                !isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">ФИО *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Иванов Иван Иванович"
                          className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Должность</label>
                        <div className="relative">
                          <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="Менеджер"
                            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Отдел</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full h-11 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="">Выберите отдел</option>
                          {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Аватар</label>
                      <div className="flex gap-2 flex-wrap">
                        {avatars.map(avatar => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setFormData({ ...formData, avatar })}
                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                              formData.avatar === avatar ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@company.com"
                  className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700 font-medium mb-1">Демо-доступ:</p>
              <p className="text-xs text-blue-600">Email: <code className="bg-blue-100 px-1 rounded">admin@demo.tm</code></p>
              <p className="text-xs text-blue-600">Пароль: <code className="bg-blue-100 px-1 rounded">admin123</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
