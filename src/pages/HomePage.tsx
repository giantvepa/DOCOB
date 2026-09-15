import { useContext, useState } from 'react';
import { AppContext } from '../App';
import VideoCard from '../components/VideoCard';

const CATEGORIES = ['Все', 'Программирование', 'Кулинария', 'Спорт', 'Путешествия', 'Технологии', 'Искусство'];

export default function HomePage() {
  const { videos } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent');

  const filtered = videos.filter(v => activeCategory === 'Все' || v.category === activeCategory);
  
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'popular') return b.likes - a.likes;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  return (
    <div className="p-4 lg:p-6">
      {/* Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          {activeCategory === 'Все' ? 'Рекомендации' : activeCategory}
        </h2>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
          {[
            { id: 'recent' as const, label: 'Новые' },
            { id: 'popular' as const, label: 'Популярные' },
            { id: 'views' as const, label: 'Просмотры' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition ${
                sortBy === s.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Нет видео в этой категории</p>
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
