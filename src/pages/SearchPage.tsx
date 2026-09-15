import { useContext } from 'react';
import { AppContext } from '../App';
import VideoCard from '../components/VideoCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const { videos, searchQuery } = useContext(AppContext);

  const query = searchQuery.toLowerCase().trim();
  
  const results = query
    ? videos.filter(v =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.author.toLowerCase().includes(query) ||
        v.tags.some(t => t.toLowerCase().includes(query)) ||
        v.category.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="p-4 lg:p-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-6">
        <SearchIcon size={20} className="text-gray-400" />
        <div>
          <h1 className="text-lg font-bold">
            {query ? `Результаты: "${searchQuery}"` : 'Поиск'}
          </h1>
          <p className="text-xs text-gray-500">
            {query ? `Найдено ${results.length} видео` : 'Введите запрос для поиска'}
          </p>
        </div>
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <SearchIcon size={24} className="text-gray-600" />
          </div>
          <p className="text-sm text-gray-400">Введите поисковый запрос</p>
          <p className="text-xs text-gray-600 mt-1">Ищем по названию, описанию, тегам и автору</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">Ничего не найдено по запросу "{searchQuery}"</p>
          <p className="text-xs text-gray-600 mt-1">Попробуйте изменить запрос</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map(video => (
            <VideoCard key={video.id} video={video} layout="list" />
          ))}
        </div>
      )}

      {/* Suggestions */}
      {query && results.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/5">
          <h3 className="text-sm font-bold mb-3 text-gray-400">Возможно, вы искали:</h3>
          <div className="flex flex-wrap gap-2">
            {['django', 'python', 'рецепт', 'фитнес', 'путешествие', 'react', 'обзор'].map(suggestion => (
              <span
                key={suggestion}
                className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer transition"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
