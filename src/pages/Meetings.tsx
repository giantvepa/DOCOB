import { useContext } from 'react';
import { AppContext } from '../App';
import { Calendar, MapPin, Users, Clock, Plus, CheckCircle2 } from 'lucide-react';

export default function Meetings() {
  const { meetings, employees } = useContext(AppContext);
  const getEmp = (id: string) => employees.find(e => e.id === id);

  const sorted = [...meetings].sort((a, b) => {
    const statusOrder = { planned: 0, in_progress: 1, completed: 2, cancelled: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return a.date.localeCompare(b.date);
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Совещания</h1>
          <p className="text-xs text-slate-500">Организация и проведение совещаний</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"><Plus size={13} /> Создать</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map(m => {
          const org = getEmp(m.organizerId);
          const participants = m.participantIds.map(id => getEmp(id)).filter(Boolean);
          return (
            <div key={m.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{m.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{m.description}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0 ${
                  m.status === 'planned' ? 'bg-blue-50 text-blue-700' :
                  m.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                  m.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {m.status === 'planned' ? 'Запланировано' : m.status === 'in_progress' ? 'Идёт' : m.status === 'completed' ? 'Завершено' : 'Отменено'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-3">
                <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(m.date)}</span>
                <span className="flex items-center gap-1"><Clock size={10} />{m.time} ({m.duration} мин)</span>
                <span className="flex items-center gap-1"><MapPin size={10} />{m.location}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">Организатор:</span>
                  <span className="text-[10px] font-medium text-slate-700">{org?.name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <div className="flex -space-x-1.5">
                  {participants.slice(0, 5).map(p => (
                    <div key={p!.id} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px]" title={p!.name}>{p!.avatar}</div>
                  ))}
                  {participants.length > 5 && <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] text-slate-600">+{participants.length - 5}</div>}
                </div>
              </div>
              {m.agenda.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[9px] text-slate-500 uppercase font-semibold mb-1">Повестка</p>
                  <ul className="space-y-0.5">
                    {m.agenda.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5">{i + 1}.</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {m.protocol && (
                <div className="mt-3 p-2 bg-emerald-50 rounded text-[10px] text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={10} /> Протокол: {m.protocol}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
