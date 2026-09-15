import { useContext } from 'react';
import { AppContext } from '../App';
import VideoCard from '../components/VideoCard';
import { User, Film, Eye, ThumbsUp, Calendar, Settings, Bell, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { videos, currentUser } = useContext(AppContext);
  
  const userVideos = videos.filter(v => v.author === currentUser);
  const totalViews = userVideos.reduce((acc, v) => acc + v.views, 0);
  const totalLikes = userVideos.reduce((acc, v) => acc + v.likes, 0);

  return (
    <div className="p-4 lg:p-6">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl border-4 border-[#0f0f0f]">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{currentUser}</h1>
            <p className="text-xs text-gray-500 mt-0.5">@{currentUser.toLowerCase().replace(/\s/g, '')} • {userVideos.length} видео</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
              <Settings size={12} />
              Настройки
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Film, label: 'Видео', value: userVideos.length, color: 'text-blue-400' },
          { icon: Eye, label: 'Просмотры', value: totalViews.toLocaleString(), color: 'text-green-400' },
          { icon: ThumbsUp, label: 'Лайки', value: totalLikes.toLocaleString(), color: 'text-pink-400' },
          { icon: Calendar, label: 'На платформе', value: '30 дней', color: 'text-yellow-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
            <stat.icon size={16} className={stat.color} />
            <p className="text-lg font-bold mt-2">{stat.value}</p>
            <p className="text-[11px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mt-8 border-b border-white/5">
        {['Видео', 'Понравившиеся', 'История'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition ${
              i === 0 ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* User Videos */}
      <div className="mt-6">
        {userVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Film size={24} className="text-gray-600" />
            </div>
            <p className="text-sm text-gray-400">У вас пока нет видео</p>
            <p className="text-xs text-gray-600 mt-1">Загрузите первое видео!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>

      {/* Django Info */}
      <div className="mt-10 p-5 bg-white/5 rounded-xl border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Shield size={18} className="text-green-400" />
          <h3 className="text-sm font-bold">О платформе</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-400">
          <div>
            <p className="text-gray-600">Backend</p>
            <p className="text-white font-medium">Django 5.0</p>
          </div>
          <div>
            <p className="text-gray-600">Frontend</p>
            <p className="text-white font-medium">React 18</p>
          </div>
          <div>
            <p className="text-gray-600">База данных</p>
            <p className="text-white font-medium">PostgreSQL</p>
          </div>
          <div>
            <p className="text-gray-600">API</p>
            <p className="text-white font-medium">Django REST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
