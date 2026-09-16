import { useContext } from 'react';
import { AppContext } from '../App';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';

export default function Meetings() {
  const { meetings, employees } = useContext(AppContext);
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });

  const sorted = [...meetings].sort((a, b) => {
    const statusOrder = { planned: 0, in_progress: 1, completed: 2, cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status] || a.date.localeCompare(b.date);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-1 bg-gradient-to-r from-[#d0dce8] to-[#e8eef5] border-b border-[#aaa] flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] font-bold text-[#333]">Совещания</span>
        <span className="text-[9px] text-[#666]">({meetings.length})</span>
        <div className="ml-auto">
          <button className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-sm border border-[#004499]">
            <Plus size={10} /> Создать
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 bg-[#ece9e0]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sorted.map(m => {
            const org = getEmp(m.organizerId);
            const participants = m.participantIds.map(id => getEmp(id)).filter(Boolean);
            return (
              <div key={m.id} className="bg-white border border-[#aaa] shadow-sm">
                <div className="px-2 py-1 bg-gradient-to-r from-[#f8f9fb] to-white border-b border-[#ccc] flex items-start justify-between">
                  <div>
                    <h3 className="text-[11px] font-bold text-[#333]">{m.title}</h3>
                    <p className="text-[9px] text-[#666] mt-0.5">{m.description}</p>
                  </div>
                  <span className={`px-1 py-0.5 rounded-sm text-[8px] font-medium flex-shrink-0 ${
                    m.status === 'planned' ? 'bg-[#e3f2fd] text-[#0066cc]' :
                    m.status === 'in_progress' ? 'bg-[#fff3e0] text-[#cc6600]' :
                    m.status === 'completed' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                    'bg-[#f5f5f5] text-[#666]'
                  }`}>
                    {m.status === 'planned' ? 'Запланировано' : m.status === 'in_progress' ? 'Идёт' : m.status === 'completed' ? 'Завершено' : 'Отменено'}
                  </span>
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[9px] text-[#555]">
                    <span className="flex items-center gap-0.5"><Calendar size={9} />{fmtDate(m.date)}</span>
                    <span className="flex items-center gap-0.5"><Clock size={9} />{m.time} ({m.duration} мин)</span>
                    <span className="flex items-center gap-0.5"><MapPin size={9} />{m.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#eee]">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-[#666]">Организатор:</span>
                      <span className="text-[9px] font-medium text-[#333]">{org?.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                    <div className="flex -space-x-1">
                      {participants.slice(0, 5).map(p => (
                        <div key={p!.id} className="w-5 h-5 rounded-sm bg-[#e0e0e0] border border-white flex items-center justify-center text-[8px]" title={p!.name}>{p!.avatar}</div>
                      ))}
                    </div>
                  </div>
                  {m.agenda.length > 0 && (
                    <div className="pt-1.5 border-t border-[#eee]">
                      <p className="text-[8px] text-[#666] uppercase font-bold mb-0.5">Повестка</p>
                      <ul className="space-y-0.5">
                        {m.agenda.map((item, i) => (
                          <li key={i} className="text-[9px] text-[#555] flex items-start gap-1">
                            <span className="text-[#0066cc] mt-0.5">{i + 1}.</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
