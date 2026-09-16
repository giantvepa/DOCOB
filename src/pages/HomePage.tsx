import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, Calendar, 
  Users, TrendingUp, ArrowRight, Plus, Inbox, Send
} from 'lucide-react';
import CreateDocumentModal from '../components/CreateDocumentModal';

export default function HomePage() {
  const { documents, tasks, meetings, currentUser, t } = useContext(AppContext);
  const [showCreateDoc, setShowCreateDoc] = useState(false);

  const myPendingDocs = documents.filter(d => d.approvals.some(a => a.userId === currentUser.id && a.status === 'waiting'));
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed');
  const upcomingMeetings = meetings.filter(m => m.status === 'planned').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const recentDocs = [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const fmtDateTime = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('home.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={() => setShowCreateDoc(true)}
          className="btn-primary px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          {t('toolbar.create')}
        </button>
      </div>

      {/* Create Document Modal */}
      {showCreateDoc && <CreateDocumentModal onClose={() => setShowCreateDoc(false)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('app.documents'), value: documents.length, icon: FileText, gradient: 'gradient-blue', change: '+12%' },
          { label: t('app.tasks'), value: myTasks.length, icon: CheckCircle2, gradient: 'gradient-green', change: '+5%' },
          { label: t('nav.meetings'), value: meetings.filter(m => m.status === 'planned').length, icon: Calendar, gradient: 'gradient-orange', change: '+2' },
          { label: t('nav.employees'), value: 8, icon: Users, gradient: 'gradient-purple', change: '100%' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-modern hover-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.gradient} flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Documents */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t('home.pending_docs')}</h2>
                <p className="text-xs text-gray-500">{myPendingDocs.length} {t('app.documents')}</p>
              </div>
            </div>
            <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              {t('common.view')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {myPendingDocs.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 size={48} className="mx-auto text-green-300 mb-3" />
                <p className="text-sm text-gray-500">{t('home.no_pending')}</p>
              </div>
            ) : (
              myPendingDocs.slice(0, 5).map(doc => (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.number} • {doc.category}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                      {t('status.on_approval')}
                    </span>
                    {doc.dueDate && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {fmtDate(doc.dueDate)}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">{t('home.recent_docs')}</h2>
            </div>
            <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {t('common.view')}
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDocs.map(doc => (
              <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{doc.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{fmtDateTime(doc.updatedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks and Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t('home.my_tasks')}</h2>
                <p className="text-xs text-gray-500">{myTasks.length} {t('app.tasks')}</p>
              </div>
            </div>
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              {t('common.view')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {myTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 size={48} className="mx-auto text-green-300 mb-3" />
                <p className="text-sm text-gray-500">{t('home.no_tasks')}</p>
              </div>
            ) : (
              myTasks.slice(0, 4).map(task => (
                <div key={task.id} className="px-6 py-3 hover:bg-gray-50 transition">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority === 'critical' ? t('priority.critical') : 
                       task.priority === 'high' ? t('priority.high') : 
                       t('priority.normal')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={10} />
                      {fmtDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t('home.meetings')}</h2>
                <p className="text-xs text-gray-500">{meetings.filter(m => m.status === 'planned').length} {t('nav.meetings')}</p>
              </div>
            </div>
            <Link to="/meetings" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              {t('common.view')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingMeetings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar size={48} className="mx-auto text-purple-300 mb-3" />
                <p className="text-sm text-gray-500">{t('home.no_meetings')}</p>
              </div>
            ) : (
              upcomingMeetings.map(m => (
                <div key={m.id} className="px-6 py-3 hover:bg-gray-50 transition">
                  <p className="text-sm font-medium text-gray-900">{m.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {fmtDate(m.date)} {m.time}
                    </span>
                    <span>•</span>
                    <span>{m.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {m.participantIds.length} {t('meetings.persons')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
