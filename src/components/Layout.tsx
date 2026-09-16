import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import {
  Inbox, Send, FileText, FolderOpen, Archive,
  CheckSquare, Calendar, Users, BarChart3, Settings,
  ChevronRight, ChevronDown, Search, Bell, Plus,
  Save, Printer, Mail, Star, AlertCircle, HelpCircle,
  Menu, Home, RefreshCw, Edit3, ArrowRight, Globe
} from 'lucide-react';

export default function Layout() {
  const { currentUser, documents, tasks, language, setLanguage, t } = useContext(AppContext);
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ docs: true, refs: true, sys: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const incomingCount = documents.filter(d => d.type === 'incoming').length;
  const outgoingCount = documents.filter(d => d.type === 'outgoing').length;
  const internalCount = documents.filter(d => d.type === 'internal').length;
  const draftCount = documents.filter(d => d.status === 'draft').length;
  const pendingCount = documents.filter(d => d.status === 'on_approval').length;
  const myTasksCount = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'completed').length;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  interface TreeNode {
    id: string;
    label: string;
    icon: any;
    path?: string;
    count?: number;
    children?: TreeNode[];
  }

  const tree: TreeNode[] = [
    {
      id: 'docs', label: t('nav.documents'), icon: FolderOpen, children: [
        { id: 'incoming', label: t('nav.incoming'), icon: Inbox, count: incomingCount, path: '/documents?type=incoming' },
        { id: 'outgoing', label: t('nav.outgoing'), icon: Send, count: outgoingCount, path: '/documents?type=outgoing' },
        { id: 'internal', label: t('nav.internal'), icon: FileText, count: internalCount, path: '/documents?type=internal' },
        { id: 'drafts', label: t('nav.drafts'), icon: Edit3, count: draftCount, path: '/documents?status=draft' },
        { id: 'pending', label: t('nav.on_approval'), icon: AlertCircle, count: pendingCount, path: '/documents?status=on_approval' },
        { id: 'all_docs', label: t('nav.all_docs'), icon: FolderOpen, count: documents.length, path: '/documents' },
        { id: 'archived', label: t('nav.archived'), icon: Archive, path: '/documents?status=archived' },
      ]
    },
    { id: 'tasks', label: t('nav.tasks'), icon: CheckSquare, count: myTasksCount, path: '/tasks' },
    { id: 'meetings', label: t('nav.meetings'), icon: Calendar, path: '/meetings' },
    { id: 'registry', label: t('nav.registry'), icon: Mail, path: '/registry' },
    {
      id: 'refs', label: t('nav.references'), icon: FolderOpen, children: [
        { id: 'employees', label: t('nav.employees'), icon: Users, path: '/employees' },
        { id: 'orgs', label: t('nav.organizations'), icon: Users, path: '/employees' },
        { id: 'nomenclature', label: t('nav.nomenclature'), icon: FolderOpen, path: '/registry' },
      ]
    },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3, path: '/reports' },
    {
      id: 'sys', label: t('nav.admin'), icon: Settings, children: [
        { id: 'users', label: t('nav.users'), icon: Users, path: '/employees' },
        { id: 'routes', label: t('nav.routes'), icon: ArrowRight, path: '/reports' },
        { id: 'templates', label: t('nav.templates'), icon: FileText, path: '/documents' },
        { id: 'settings', label: t('nav.settings'), icon: Settings, path: '/reports' },
      ]
    },
  ];

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.id];
    const active = node.path ? isActive(node.path) : false;

    return (
      <div key={node.id}>
        <div
          onClick={() => { if (hasChildren) toggle(node.id); }}
          className={`flex items-center gap-1 py-[3px] pr-1 cursor-pointer text-[11px] leading-tight select-none ${
            active ? 'bg-[#cce4ff] text-[#003d80]' : 'text-[#333] hover:bg-[#e8f0fb]'
          }`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={10} className="text-[#666] flex-shrink-0" /> : <ChevronRight size={10} className="text-[#666] flex-shrink-0" />
          ) : (
            <span className="w-[10px] flex-shrink-0" />
          )}
          <node.icon size={12} className={active ? 'text-[#0055b3]' : 'text-[#666]'} />
          {node.path ? (
            <Link to={node.path} className="flex-1 truncate" onClick={(e) => e.stopPropagation()}>
              {node.label}
            </Link>
          ) : (
            <span className="flex-1 truncate font-medium">{node.label}</span>
          )}
          {node.count !== undefined && node.count > 0 && (
            <span className={`text-[9px] px-1 rounded-sm ${active ? 'bg-[#0055b3] text-white' : 'bg-[#ddd] text-[#555]'}`}>
              {node.count}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && node.children!.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#ece9e0] overflow-hidden" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* ===== TITLE BAR ===== */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5298] to-[#1e3a5f] text-white flex-shrink-0 h-[26px] flex items-center px-2 text-[11px]">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-1">
          <Menu size={12} />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-white/20 flex items-center justify-center">
            <FileText size={9} />
          </div>
          <span className="font-bold tracking-wide text-[11px]">{t('app.title')}</span>
          <span className="text-white/40 mx-1">—</span>
          <span className="text-white/70 text-[10px]">{t('app.subtitle')}</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-white/60 text-[10px]">
          {/* Language switcher */}
          <div className="flex items-center gap-1 bg-white/10 rounded-sm px-1.5 py-0.5">
            <Globe size={10} />
            <button
              onClick={() => setLanguage('ru')}
              className={`text-[9px] px-1 rounded-sm ${language === 'ru' ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
            >
              RU
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => setLanguage('tk')}
              className={`text-[9px] px-1 rounded-sm ${language === 'tk' ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
            >
              TK
            </button>
          </div>
          <span>{currentUser.name}</span>
          <span>|</span>
          <span>{new Date().toLocaleDateString('ru-RU')} {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* ===== MENU BAR ===== */}
      <div className="bg-[#f0f0f0] border-b border-[#aaa] flex items-center h-[22px] px-1 text-[11px] flex-shrink-0">
        {['menu.file', 'menu.edit', 'menu.document', 'menu.processes', 'menu.view', 'menu.service', 'menu.help'].map(item => (
          <button key={item} className="px-2 py-0.5 hover:bg-[#cce4ff] hover:border hover:border-[#7ba8e0] rounded-sm text-[#333]">
            {t(item)}
          </button>
        ))}
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="bg-gradient-to-b from-[#f8f8f8] to-[#e8e8e8] border-b border-[#aaa] flex items-center h-[32px] px-1 gap-0.5 flex-shrink-0">
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Plus size={12} className="text-[#0066cc]" /> <span>{t('toolbar.create')}</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Edit3 size={12} className="text-[#0066cc]" /> <span>{t('toolbar.open')}</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Save size={12} className="text-[#0066cc]" /> <span>{t('toolbar.save')}</span>
        </button>
        <div className="w-px h-5 bg-[#aaa] mx-0.5" />
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Mail size={12} className="text-[#0066cc]" /> <span>{t('toolbar.send')}</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <CheckSquare size={12} className="text-[#cc6600]" /> <span>{t('toolbar.approve')}</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Star size={12} className="text-[#cc6600]" /> <span>{t('toolbar.sign')}</span>
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <Printer size={12} className="text-[#333]" /> <span>{t('toolbar.print')}</span>
        </button>
        <div className="w-px h-5 bg-[#aaa] mx-0.5" />
        <button className="flex items-center gap-1 px-1.5 py-1 text-[11px] hover:bg-[#cce4ff] rounded-sm border border-transparent hover:border-[#7ba8e0]">
          <RefreshCw size={11} />
        </button>
        <div className="flex-1" />
        <div className="relative">
          <Search size={11} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input type="text" placeholder={t('toolbar.search')} className="h-[22px] pl-5 pr-2 bg-white border border-[#aaa] rounded-sm text-[11px] focus:outline-none focus:border-[#0066cc] w-48" />
        </div>
        <button className="relative ml-1 w-6 h-6 rounded-sm hover:bg-[#cce4ff] flex items-center justify-center border border-transparent hover:border-[#7ba8e0]">
          <Bell size={12} className="text-[#333]" />
          {(pendingCount + myTasksCount) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 rounded-full text-[7px] text-white flex items-center justify-center font-bold">{pendingCount + myTasksCount}</span>
          )}
        </button>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== LEFT — FOLDER TREE ===== */}
        <aside className={`w-[200px] bg-white border-r border-[#aaa] flex-shrink-0 flex flex-col overflow-hidden ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'}`} style={{ marginTop: 0 }}>
          <div className="px-2 py-1 bg-gradient-to-b from-[#e8eef5] to-[#d0dce8] border-b border-[#aaa]">
            <p className="text-[10px] font-bold text-[#333] uppercase tracking-wide">{t('nav.documents')}</p>
          </div>
          <div className="flex-1 overflow-y-auto py-0.5 bg-white">
            {tree.map(node => renderNode(node))}
          </div>
          <div className="p-1.5 border-t border-[#aaa] bg-[#f0f0f0]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-sm bg-[#d0dce8] flex items-center justify-center text-[10px] border border-[#aaa]">{currentUser.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-[#333] truncate">{currentUser.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[8px] text-[#666] truncate">{currentUser.position}</p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ===== CENTER — CONTENT ===== */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#ece9e0]">
          <Outlet />
        </main>
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="h-[20px] bg-[#f0f0f0] border-t border-[#aaa] flex items-center px-2 text-[10px] text-[#555] flex-shrink-0 gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {t('app.connected')}</span>
        <span>|</span>
        <span>{t('app.documents')}: {documents.length}</span>
        <span>|</span>
        <span>{t('app.tasks')}: {tasks.length}</span>
        <span>|</span>
        <span>{t('app.on_approval')}: {pendingCount}</span>
        <span className="ml-auto">{t('app.version')}</span>
      </div>
    </div>
  );
}
