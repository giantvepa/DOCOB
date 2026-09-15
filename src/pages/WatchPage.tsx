import { useParams, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext, Comment } from '../App';
import VideoCard from '../components/VideoCard';
import { ThumbsUp, ThumbsDown, Share2, Download, MessageSquare, Send, Eye, Calendar } from 'lucide-react';

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

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const { videos, setVideos, currentUser } = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const video = videos.find(v => v.id === id);
  const relatedVideos = videos.filter(v => v.id !== id).slice(0, 8);

  if (!video) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-400">Видео не найдено</p>
          <Link to="/" className="text-blue-400 text-sm mt-2 inline-block hover:underline">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  const gradientIndex = parseInt(video.id) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setDisliked(false);
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, likes: v.likes + 1, dislikes: disliked ? v.dislikes - 1 : v.dislikes } : v));
  };

  const handleDislike = () => {
    if (disliked) return;
    setDisliked(true);
    setLiked(false);
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, dislikes: v.dislikes + 1, likes: liked ? v.likes - 1 : v.likes } : v));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      text: commentText,
      author: currentUser,
      avatar: '👤',
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, comments: [...v.comments, newComment] } : v));
    setCommentText('');
  };

  // Increment views
  setVideos(prev => {
    const v = prev.find(x => x.id === id);
    if (v && v.views === video.views) {
      return prev.map(x => x.id === id ? { ...x, views: x.views + 1 } : x);
    }
    return prev;
  });

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            {video.url ? (
              <video src={video.url} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <div className="text-center">
                  <span className="text-8xl block mb-4">{video.authorAvatar}</span>
                  <p className="text-white/60 text-sm">Демо-видео</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-lg font-bold leading-snug">{video.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-lg">
                  {video.authorAvatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{video.author}</p>
                  <p className="text-[11px] text-gray-500">1.2K подписчиков</p>
                </div>
                <button className="ml-2 px-4 py-1.5 bg-white text-black rounded-full text-xs font-semibold hover:bg-gray-200 transition">
                  Подписаться
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/10 rounded-full overflow-hidden">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition ${liked ? 'text-blue-400' : 'hover:bg-white/10'}`}
                  >
                    <ThumbsUp size={14} fill={liked ? 'currentColor' : 'none'} />
                    {formatViews(video.likes)}
                  </button>
                  <div className="w-px h-5 bg-white/10" />
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition ${disliked ? 'text-red-400' : 'hover:bg-white/10'}`}
                  >
                    <ThumbsDown size={14} fill={disliked ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded-full text-xs font-medium hover:bg-white/20 transition">
                  <Share2 size={14} />
                  Поделиться
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded-full text-xs font-medium hover:bg-white/20 transition">
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div
              className={`mt-4 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/8 transition ${showDescription ? '' : 'line-clamp-2'}`}
              onClick={() => setShowDescription(!showDescription)}
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1"><Eye size={12} /> {formatViews(video.views)} просмотров</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(video.uploadedAt)}</span>
              </div>
              <p className={`text-sm text-gray-300 ${showDescription ? '' : 'line-clamp-2'}`}>
                {video.description}
              </p>
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {video.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-blue-400">#{tag}</span>
                  ))}
                </div>
              )}
              {!showDescription && <p className="text-xs text-gray-500 mt-1">Показать ещё...</p>}
            </div>

            {/* Comments */}
            <div className="mt-6">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare size={16} />
                Комментарии
                <span className="text-gray-500 font-normal">{video.comments.length}</span>
              </h3>

              {/* Add comment */}
              <div className="flex items-start gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Написать комментарий..."
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/30 text-sm py-1 focus:outline-none transition placeholder:text-gray-600"
                  />
                  {commentText && (
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setCommentText('')}
                        className="px-3 py-1 text-xs text-gray-400 hover:text-white transition"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleComment}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <Send size={11} />
                        Отправить
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments list */}
              <div className="mt-6 space-y-4">
                {video.comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{comment.author}</span>
                        <span className="text-[10px] text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-0.5">{comment.text}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-white transition">
                          <ThumbsUp size={11} />
                          {comment.likes > 0 && comment.likes}
                        </button>
                        <button className="text-[11px] text-gray-500 hover:text-white transition">
                          <ThumbsDown size={11} />
                        </button>
                        <button className="text-[11px] text-gray-500 hover:text-white transition">
                          Ответить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related videos */}
        <div className="xl:w-80 flex-shrink-0">
          <h3 className="text-sm font-bold mb-3">Похожие видео</h3>
          <div className="space-y-3">
            {relatedVideos.map(v => (
              <VideoCard key={v.id} video={v} layout="sidebar" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
