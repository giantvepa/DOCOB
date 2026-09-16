import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Users, Search, Mail, Phone, Building2 } from 'lucide-react';

export default function Employees() {
  const { employees } = useContext(AppContext);
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
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Сотрудники</h1>
        <p className="text-xs text-slate-500">Справочник сотрудников организации</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по ФИО, должности, email..." className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-8 px-2 bg-slate-50 border border-slate-200 rounded text-xs">
          <option value="all">Все подразделения</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <span className="text-[10px] text-slate-500">{filtered.length} сотрудников</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl flex-shrink-0">
                {emp.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{emp.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{emp.position}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Building2 size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500">{emp.department}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-slate-600">
                <Mail size={10} className="text-slate-400" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600">
                <Phone size={10} className="text-slate-400" />
                <span>{emp.phone}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                emp.role === 'admin' ? 'bg-red-50 text-red-700' :
                emp.role === 'manager' ? 'bg-amber-50 text-amber-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {emp.role === 'admin' ? 'Администратор' : emp.role === 'manager' ? 'Руководитель' : 'Сотрудник'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
