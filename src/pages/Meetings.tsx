import { useContext } from 'react';
import { AppContext } from '../App';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';

export default function Meetings() {
  const { meetings, employees, t } = useContext(AppContext);
  const getEmp = (id: string) => employees.find(e => e.id === id);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });

  const sorted = [...meetings].sort((a, b) => {
    const statusOrder = { planned: 0, in_progress: 1, completed: 2, cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status] || a.date.localeCompare(b.date);
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('meetings.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{meetings.length} {t('common.records')}</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2">
          <Plus size={18} />
          {t('meetings.create')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map(m => {
          const org = getEmp(m.organizerId);
          const participants = m.participantIds.map(id => getEmp(id)).filter(Boolean);
          return (
            <div key={m.id} className="bg-white rounded-2xl shadow-modern hover-card overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-xs text-gray-500">{m.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    m.status === 'planned' ? 'bg-blue-100 text-blue-700' :
                    m.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    m.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {m.status === 'planned' ? t('meetings.planned') : 
                     m.status === 'in_progress' ? t('meetings.in_progress') : 
                     m.status === 'completed' ? t('meetings.completed') : 
                     t('meetings.cancelled')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {fmtDate(m.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {m.time} ({m.duration} мин)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {m.location}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('meetings.organizer')}:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {org?.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{org?.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {participants.slice(0, 5).map(p => (
                      <div key={p!.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" title={p!.name}>
                        {p!.name.charAt(0)}
                      </div>
                    ))}
                    {participants.length > 5 && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-[9px] font-bold">
                        +{participants.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                {m.agenda.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">{t('meetings.agenda')}</p>
                    <ul className="space-y-1">
                      {m.agenda.map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 font-medium">{i + 1}.</span>
                          {item}
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
  );
}
