import { Link } from 'react-router-dom';
import { Video } from '../App';
import { Eye, Clock } from 'lucide-react';

interface Props {
  video: Video;
  layout?: 'grid' | 'list' | 'sidebar';
}

const GRADIENTS = [
  'from-red-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-red-500',
  'from-indigo-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-green-500',
];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 1) return 'сегодня';
  if (diff < 7) return `${diff} дн. назад`;
  if (diff < 30) return `${Math.floor(diff / 7)} нед. назад`;
  if (diff < 365) return `${Math.floor(diff / 30)} мес. назад`;
  return `${Math.floor(diff / 365)} г. назад`;
}

export default function VideoCard({ video, layout = 'grid' }: Props) {
  const gradientIndex = parseInt(video.id) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  if (layout === 'sidebar') {
    return (
      <Link to={`/watch/${video.id}`} className="flex gap-2 group">
        <div className="w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-3xl">{video.authorAvatar}</span>
          </div>
          <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium line-clamp-2 group-hover:text-blue-400 transition">{video.title}</h4>
          <p className="text-[10px] text-gray-500 mt-1">{video.author}</p>
          <p className="text-[10px] text-gray-500">{formatViews(video.views)} просмотров • {timeAgo(video.uploadedAt)}</p>
        </div>
      </Link>
    );
  }

  if (layout === 'list') {
    return (
      <Link to={`/watch/${video.id}`} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition group">
        <div className="w-64 h-36 rounded-lg overflow-hidden flex-shrink-0 relative">
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-5xl">{video.authorAvatar}</span>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition">{video.title}</h3>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{video.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span>{video.author}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {formatViews(video.views)}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(video.uploadedAt)}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {video.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400">#{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/watch/${video.id}`} className="group">
      <div className="relative rounded-xl overflow-hidden aspect-video">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
          <span className="text-5xl">{video.authorAvatar}</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded font-medium">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-sm flex-shrink-0">
          {video.authorAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition leading-snug">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{video.author}</p>
          <p className="text-xs text-gray-500">
            {formatViews(video.views)} просмотров • {timeAgo(video.uploadedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
