import { useState, useRef, useCallback, useEffect } from 'react';

interface VideoFragment {
  id: string;
  file: File;
  url: string;
  name: string;
  duration: number;
}

function App() {
  const [fragments, setFragments] = useState<VideoFragment[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    
    const newFragments: VideoFragment[] = videoFiles.map(file => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
    }));

    setFragments(prev => [...prev, ...newFragments]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverDropzone(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFragment = (id: string) => {
    setFragments(prev => {
      const fragment = prev.find(f => f.id === id);
      if (fragment) URL.revokeObjectURL(fragment.url);
      return prev.filter(f => f.id !== id);
    });
    if (fragments[currentIndex]?.id === id) {
      setCurrentIndex(-1);
      setIsPlaying(false);
    }
  };

  const playFragment = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const playAll = () => {
    if (fragments.length === 0) return;
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleVideoEnded = () => {
    if (currentIndex < fragments.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && currentIndex >= 0 && videoRef.current) {
      videoRef.current.src = fragments[currentIndex]?.url || '';
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, isPlaying, fragments]);

  // Drag and drop for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      setFragments(prev => {
        const newFragments = [...prev];
        const [removed] = newFragments.splice(draggedIndex, 1);
        newFragments.splice(dragOverIndex, 0, removed);
        return newFragments;
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFragments(prev => {
      const newFragments = [...prev];
      [newFragments[index - 1], newFragments[index]] = [newFragments[index], newFragments[index - 1]];
      return newFragments;
    });
  };

  const moveDown = (index: number) => {
    if (index === fragments.length - 1) return;
    setFragments(prev => {
      const newFragments = [...prev];
      [newFragments[index], newFragments[index + 1]] = [newFragments[index + 1], newFragments[index]];
      return newFragments;
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = fragments.reduce((acc, f) => acc + (f.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <i className="fas fa-film text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">Video Constructor</h1>
              <p className="text-xs text-gray-400">Собери видео из фрагментов</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {fragments.length > 0 && (
              <span className="text-sm text-gray-400">
                <i className="fas fa-clock mr-1"></i>
                {fragments.length} фрагмент(ов) • {formatDuration(totalDuration)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {isPlaying && currentIndex >= 0 && fragments[currentIndex] ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onEnded={handleVideoEnded}
                    controls
                    autoPlay
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <i className="fas fa-play-circle text-6xl mb-4 opacity-50"></i>
                    <p className="text-lg">Выберите фрагмент для просмотра</p>
                    <p className="text-sm mt-1">или нажмите "Воспроизвести все"</p>
                  </div>
                )}
              </div>
              
              {/* Player Controls */}
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={playAll}
                    disabled={fragments.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <i className="fas fa-play"></i>
                    Воспроизвести все
                  </button>
                  <button
                    onClick={() => { setIsPlaying(false); setCurrentIndex(-1); }}
                    disabled={!isPlaying}
                    className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <i className="fas fa-stop"></i>
                    Стоп
                  </button>
                </div>
                {isPlaying && currentIndex >= 0 && (
                  <span className="text-sm text-gray-400">
                    Фрагмент {currentIndex + 1} из {fragments.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="lg:col-span-1">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOverDropzone(true); }}
              onDragLeave={() => setIsDragOverDropzone(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`h-full min-h-[200px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragOverDropzone
                  ? 'border-purple-400 bg-purple-500/20 scale-[1.02]'
                  : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                isDragOverDropzone ? 'bg-purple-500/30 scale-110' : 'bg-white/10'
              }`}>
                <i className="fas fa-cloud-upload-alt text-2xl text-purple-400"></i>
              </div>
              <p className="text-sm font-medium text-gray-300">
                {isDragOverDropzone ? 'Отпустите файлы здесь' : 'Перетащите видео сюда'}
              </p>
              <p className="text-xs text-gray-500 mt-1">или нажмите для выбора файлов</p>
              <p className="text-xs text-gray-600 mt-3">MP4, WebM, MOV, AVI</p>
            </div>
          </div>
        </div>

        {/* Fragments List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-list-ol text-purple-400"></i>
              Порядок фрагментов
            </h2>
            {fragments.length > 0 && (
              <button
                onClick={() => {
                  fragments.forEach(f => URL.revokeObjectURL(f.url));
                  setFragments([]);
                  setCurrentIndex(-1);
                  setIsPlaying(false);
                }}
                className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center gap-1"
              >
                <i className="fas fa-trash-alt"></i>
                Очистить всё
              </button>
            )}
          </div>

          {fragments.length === 0 ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
              <i className="fas fa-video-slash text-4xl text-gray-600 mb-3"></i>
              <p className="text-gray-500">Пока нет фрагментов</p>
              <p className="text-gray-600 text-sm mt-1">Загрузите видео, чтобы начать конструирование</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fragments.map((fragment, index) => (
                <div
                  key={fragment.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    dragOverIndex === index && draggedIndex !== index
                      ? 'border-purple-400 bg-purple-500/20'
                      : draggedIndex === index
                      ? 'border-white/5 bg-white/5 opacity-50'
                      : currentIndex === index && isPlaying
                      ? 'border-purple-400/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="text-gray-500 hover:text-gray-300 transition">
                    <i className="fas fa-grip-vertical"></i>
                  </div>

                  {/* Index */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    currentIndex === index && isPlaying
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                    <video
                      src={fragment.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const dur = (e.target as HTMLVideoElement).duration;
                        setFragments(prev => prev.map(f => 
                          f.id === fragment.id ? { ...f, duration: dur } : f
                        ));
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fragment.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(fragment.duration)} • {(fragment.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Вверх"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === fragments.length - 1}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Вниз"
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                    <button
                      onClick={() => playFragment(index)}
                      className="w-7 h-7 rounded-lg bg-purple-500/30 hover:bg-purple-500/50 flex items-center justify-center text-xs transition"
                      title="Воспроизвести"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                    <button
                      onClick={() => removeFragment(fragment.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-xs text-red-400 transition"
                      title="Удалить"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-mouse-pointer text-purple-400"></i>
              <h3 className="text-sm font-semibold">Drag & Drop</h3>
            </div>
            <p className="text-xs text-gray-400">Перетаскивайте фрагменты для изменения порядка воспроизведения</p>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-arrows-alt-v text-pink-400"></i>
              <h3 className="text-sm font-semibold">Стрелки</h3>
            </div>
            <p className="text-xs text-gray-400">Используйте кнопки ↑↓ для точного управления порядком</p>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-play-circle text-green-400"></i>
              <h3 className="text-sm font-semibold">Просмотр</h3>
            </div>
            <p className="text-xs text-gray-400">Нажмите "Воспроизвести все" для последовательного просмотра</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
