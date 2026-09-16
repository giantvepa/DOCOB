import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Search, Mail, Phone, Building2 } from 'lucide-react';

export default function Employees() {
  const { employees, t } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const departments = [...new Set(employees.map(e => e.department))];
  const filtered = employees.filter(e => {
    if (deptFilter !== 'all' && e.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.position.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('employees.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('employees.directory')} • {filtered.length}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-modern p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('employees.search_placeholder')}
              className="w-full h-10 pl-10 pr-4 modern-input rounded-xl text-sm"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-10 px-4 modern-input modern-select rounded-xl text-sm"
          >
            <option value="all">{t('employees.all_departments')}</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl shadow-modern hover-card overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{emp.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{emp.position}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{emp.department}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{emp.phone}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  emp.role === 'admin' ? 'bg-red-100 text-red-700' :
                  emp.role === 'manager' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {emp.role === 'admin' ? t('employees.admin') : emp.role === 'manager' ? t('employees.manager') : t('employees.employee')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
