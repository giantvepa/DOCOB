import { useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import VideoCard from '../components/VideoCard';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { videos } = useContext(AppContext);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent');

  const decodedCategory = decodeURIComponent(category || '');
  const filtered = videos.filter(v => v.category === decodedCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'popular') return b.likes - a.likes;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const categoryEmoji: Record<string, string> = {
    'Программирование': '💻',
    'Кулинария': '🍳',
    'Спорт': '🏋️',
    'Путешествия': '✈️',
    'Технологии': '📱',
    'Искусство': '🎨',
    'Музыка': '🎵',
    'Наука': '🔬',
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
          {categoryEmoji[decodedCategory] || '📁'}
        </div>
        <div>
          <h1 className="text-xl font-bold">{decodedCategory}</h1>
          <p className="text-xs text-gray-500">{filtered.length} видео</p>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Сортировка:</span>
        {[
          { id: 'recent' as const, label: 'Новые' },
          { id: 'popular' as const, label: 'Популярные' },
          { id: 'views' as const, label: 'Просмотры' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSortBy(s.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              sortBy === s.id ? 'bg-white text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Videos */}
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">{categoryEmoji[decodedCategory] || '📁'}</p>
          <p className="text-gray-400">Нет видео в категории "{decodedCategory}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
