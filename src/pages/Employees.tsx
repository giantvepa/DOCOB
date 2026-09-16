import { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Search, Mail, Phone, Building2 } from 'lucide-react';

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
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">Сотрудники</span>
        <span className="text-[9px] text-[#666]">Справочник ({filtered.length})</span>
      </div>

      <div className="px-2 py-1 bg-[#f0f0f0] border-b border-[#aaa] flex items-center gap-1.5 flex-shrink-0">
        <div className="relative flex-1 max-w-[200px]">
          <Search size={10} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по ФИО, должности..." className="w-full h-[20px] pl-5 pr-1.5 bg-white border border-[#aaa] rounded-sm text-[10px] focus:outline-none focus:border-[#0066cc]" />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-[20px] px-1 bg-white border border-[#aaa] rounded-sm text-[10px]">
          <option value="all">Все подразделения</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto p-2 bg-[#ece9e0]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white border border-[#aaa] shadow-sm">
              <div className="px-2 py-1.5 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc] flex items-start gap-2">
                <div className="w-8 h-8 rounded-sm bg-[#d0dce8] flex items-center justify-center text-sm flex-shrink-0 border border-[#aaa]">
                  {emp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] font-bold text-[#333] truncate">{emp.name}</h3>
                  <p className="text-[9px] text-[#666] mt-0.5">{emp.position}</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Building2 size={8} className="text-[#888]" />
                    <span className="text-[8px] text-[#666]">{emp.department}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-[#555]">
                  <Mail size={8} className="text-[#888]" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#555]">
                  <Phone size={8} className="text-[#888]" />
                  <span>{emp.phone}</span>
                </div>
                <div className="pt-1">
                  <span className={`px-1 py-0.5 rounded-sm text-[8px] font-medium ${
                    emp.role === 'admin' ? 'bg-[#ffebee] text-[#c62828]' :
                    emp.role === 'manager' ? 'bg-[#fff3e0] text-[#cc6600]' :
                    'bg-[#f5f5f5] text-[#666]'
                  }`}>
                    {emp.role === 'admin' ? 'Администратор' : emp.role === 'manager' ? 'Руководитель' : 'Сотрудник'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
