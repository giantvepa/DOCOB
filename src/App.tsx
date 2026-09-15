import { useState, useRef, useCallback, useEffect } from 'react';

interface Clip {
  id: string;
  file: File;
  url: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  filter: string;
  opacity: number;
  volume: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
  clipId: string | null;
}

const FILTERS: Record<string, string> = {
  'Без фильтра': 'none',
  'Ч/Б': 'grayscale(100%)',
  'Сепия': 'sepia(100%)',
  'Яркий': 'saturate(200%) contrast(120%)',
  'Тёплый': 'sepia(40%) saturate(150%)',
  'Холодный': 'hue-rotate(180deg) saturate(80%)',
  'Винтаж': 'sepia(30%) contrast(80%) brightness(90%)',
  'Неон': 'saturate(300%) brightness(110%) contrast(130%)',
  'Кино': 'contrast(120%) brightness(85%) saturate(80%)',
  'Мечта': 'blur(0.5px) brightness(110%) saturate(130%)',
};

function App() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [currentClipIndex, setCurrentClipIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [newText, setNewText] = useState('');
  const [newTextColor, setNewTextColor] = useState('#ffffff');
  const [newTextSize, setNewTextSize] = useState(32);
  const [activeTab, setActiveTab] = useState<'clips' | 'filters' | 'text' | 'export'>('clips');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [trimMode, setTrimMode] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const totalDuration = clips.reduce((acc, c) => acc + (c.endTime - c.startTime), 0);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    const newClips: Clip[] = videoFiles.map(file => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 0,
      startTime: 0,
      endTime: 0,
      filter: 'none',
      opacity: 100,
      volume: 100,
    }));
    setClips(prev => {
      const updated = [...prev, ...newClips];
      if (prev.length === 0 && newClips.length > 0) {
        setSelectedClipId(newClips[0].id);
      }
      return updated;
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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

  const handleVideoLoadedMetadata = (clipId: string) => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    setClips(prev => prev.map(c =>
      c.id === clipId ? { ...c, duration: dur, endTime: dur } : c
    ));
  };

  const updateClip = (id: string, updates: Partial<Clip>) => {
    setClips(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeClip = (id: string) => {
    setClips(prev => {
      const clip = prev.find(c => c.id === id);
      if (clip) URL.revokeObjectURL(clip.url);
      return prev.filter(c => c.id !== id);
    });
    setTextOverlays(prev => prev.filter(t => t.clipId !== id));
    if (selectedClipId === id) {
      setSelectedClipId(clips.length > 1 ? clips.find(c => c.id !== id)?.id || null : null);
    }
  };

  const selectedClip = clips.find(c => c.id === selectedClipId);

  const playClip = (clip: Clip) => {
    setSelectedClipId(clip.id);
    if (videoRef.current) {
      videoRef.current.src = clip.url;
      videoRef.current.currentTime = clip.startTime;
      videoRef.current.style.filter = clip.filter;
      videoRef.current.style.opacity = `${clip.opacity}%`;
      videoRef.current.volume = clip.volume / 100;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const playAll = () => {
    if (clips.length === 0) return;
    setCurrentClipIndex(0);
    const clip = clips[0];
    setSelectedClipId(clip.id);
    if (videoRef.current) {
      videoRef.current.src = clip.url;
      videoRef.current.currentTime = clip.startTime;
      videoRef.current.style.filter = clip.filter;
      videoRef.current.style.opacity = `${clip.opacity}%`;
      videoRef.current.volume = clip.volume / 100;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !selectedClip) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    if (time >= selectedClip.endTime) {
      const idx = clips.findIndex(c => c.id === selectedClip.id);
      if (idx < clips.length - 1) {
        const nextClip = clips[idx + 1];
        setCurrentClipIndex(idx + 1);
        videoRef.current.src = nextClip.url;
        videoRef.current.currentTime = nextClip.startTime;
        videoRef.current.style.filter = nextClip.filter;
        videoRef.current.style.opacity = `${nextClip.opacity}%`;
        videoRef.current.volume = nextClip.volume / 100;
        videoRef.current.play().catch(() => {});
        setSelectedClipId(nextClip.id);
      } else {
        setIsPlaying(false);
        videoRef.current.pause();
      }
    }
  };

  const addTextOverlay = () => {
    if (!newText.trim()) return;
    const overlay: TextOverlay = {
      id: generateId(),
      text: newText,
      x: 50,
      y: 50,
      fontSize: newTextSize,
      color: newTextColor,
      startTime: 0,
      endTime: totalDuration || 10,
      clipId: selectedClipId,
    };
    setTextOverlays(prev => [...prev, overlay]);
    setNewText('');
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(t => t.id !== id));
  };

  const handleExport = async () => {
    if (!videoRef.current || clips.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1280;
      canvas.height = 720;

      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video-export.webm';
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportProgress(100);
      };

      mediaRecorder.start();

      const video = videoRef.current;
      let clipIdx = 0;
      video.src = clips[0].url;
      video.currentTime = clips[0].startTime;
      video.muted = true;

      await new Promise(resolve => { video.onseeked = resolve; });

      const startTime = Date.now();
      const renderFrame = () => {
        if (clipIdx >= clips.length) {
          mediaRecorder.stop();
          return;
        }

        const clip = clips[clipIdx];
        const elapsed = (Date.now() - startTime) / 1000;
        const clipElapsed = elapsed - clips.slice(0, clipIdx).reduce((a, c) => a + (c.endTime - c.startTime), 0);

        if (clipElapsed >= clip.endTime - clip.startTime) {
          clipIdx++;
          if (clipIdx < clips.length) {
            video.src = clips[clipIdx].url;
            video.currentTime = clips[clipIdx].startTime;
          }
          requestAnimationFrame(renderFrame);
          return;
        }

        ctx.filter = clip.filter;
        ctx.globalAlpha = clip.opacity / 100;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        // Draw text overlays
        textOverlays.forEach(overlay => {
          ctx.font = `bold ${overlay.fontSize}px Arial`;
          ctx.fillStyle = overlay.color;
          ctx.textAlign = 'center';
          ctx.fillText(overlay.text, (overlay.x / 100) * canvas.width, (overlay.y / 100) * canvas.height);
        });

        const progress = (elapsed / totalDuration) * 100;
        setExportProgress(Math.min(progress, 99));

        video.currentTime += 1/30;
        requestAnimationFrame(renderFrame);
      };

      video.play();
      renderFrame();
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const moveClipLeft = (index: number) => {
    if (index === 0) return;
    setClips(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveClipRight = (index: number) => {
    if (index === clips.length - 1) return;
    setClips(prev => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const visibleTextOverlays = textOverlays.filter(t => {
    if (!selectedClip) return false;
    if (t.clipId && t.clipId !== selectedClipId) return false;
    return currentTime >= t.startTime && currentTime <= t.endTime;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-[#12121a] border-b border-white/5 flex items-center px-4 justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <i className="fas fa-video text-sm"></i>
          </div>
          <span className="font-bold text-sm tracking-wide">VIDEO STUDIO</span>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-medium">PRO</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {clips.length} клип(ов) • {formatTime(totalDuration)}
          </span>
          <button
            onClick={handleExport}
            disabled={clips.length === 0 || isExporting}
            className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {Math.round(exportProgress)}%
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                Экспорт
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Media */}
        <aside className="w-64 bg-[#0e0e16] border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-white/5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Медиа</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition flex items-center gap-2 justify-center"
            >
              <i className="fas fa-plus"></i>
              Добавить видео
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {clips.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-film text-2xl text-gray-700 mb-2"></i>
                <p className="text-xs text-gray-600">Нет медиафайлов</p>
              </div>
            ) : (
              clips.map((clip, idx) => (
                <div
                  key={clip.id}
                  onClick={() => { setSelectedClipId(clip.id); if (videoRef.current) { videoRef.current.src = clip.url; videoRef.current.currentTime = clip.startTime; videoRef.current.style.filter = clip.filter; videoRef.current.style.opacity = `${clip.opacity}%`; } }}
                  className={`group p-2 rounded-lg cursor-pointer transition-all ${
                    selectedClipId === clip.id ? 'bg-violet-500/20 border border-violet-500/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-8 rounded bg-black/50 overflow-hidden flex-shrink-0">
                      <video src={clip.url} className="w-full h-full object-cover" muted preload="metadata" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate">{clip.name}</p>
                      <p className="text-[10px] text-gray-500">{formatTime(clip.duration)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-[10px] text-red-400 transition"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center - Preview */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div
            className="flex-1 flex items-center justify-center bg-black/30 relative"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
          >
            {isDragOver && (
              <div className="absolute inset-0 bg-violet-500/10 border-2 border-dashed border-violet-400 rounded-lg m-4 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="text-center">
                  <i className="fas fa-cloud-upload-alt text-4xl text-violet-400 mb-2"></i>
                  <p className="text-sm text-violet-300">Отпустите видеофайлы</p>
                </div>
              </div>
            )}

            {selectedClip ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: selectedClip.filter, opacity: `${selectedClip.opacity}%` }}
                  onLoadedMetadata={() => handleVideoLoadedMetadata(selectedClip.id)}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                />
                {/* Text Overlays */}
                {visibleTextOverlays.map(overlay => (
                  <div
                    key={overlay.id}
                    className="absolute pointer-events-none font-bold"
                    style={{
                      left: `${overlay.x}%`,
                      top: `${overlay.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${overlay.fontSize}px`,
                      color: overlay.color,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {overlay.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-play text-3xl text-gray-600"></i>
                </div>
                <p className="text-gray-500 text-sm">Добавьте видео для начала работы</p>
                <p className="text-gray-600 text-xs mt-1">Перетащите файлы или нажмите "Добавить видео"</p>
              </div>
            )}
          </div>

          {/* Transport Controls */}
          <div className="h-12 bg-[#12121a] border-t border-white/5 flex items-center px-4 gap-3">
            <button
              onClick={() => {
                if (videoRef.current && selectedClip) {
                  videoRef.current.currentTime = selectedClip.startTime;
                  setCurrentTime(selectedClip.startTime);
                }
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs transition"
            >
              <i className="fas fa-step-backward"></i>
            </button>
            <button
              onClick={() => {
                if (isPlaying) {
                  videoRef.current?.pause();
                  setIsPlaying(false);
                } else {
                  if (selectedClip) {
                    playClip(selectedClip);
                  } else {
                    playAll();
                  }
                }
              }}
              disabled={clips.length === 0}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 flex items-center justify-center transition disabled:opacity-30"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
            </button>
            <button
              onClick={() => {
                if (videoRef.current && selectedClip) {
                  videoRef.current.currentTime = selectedClip.endTime;
                  setCurrentTime(selectedClip.endTime);
                }
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs transition"
            >
              <i className="fas fa-step-forward"></i>
            </button>
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                    style={{ width: selectedClip ? `${((currentTime - selectedClip.startTime) / (selectedClip.endTime - selectedClip.startTime)) * 100}%` : '0%' }}
                  />
                </div>
                <span>{selectedClip ? formatTime(selectedClip.endTime) : '0:00'}</span>
              </div>
            </div>
            <button
              onClick={playAll}
              disabled={clips.length === 0}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] font-medium transition disabled:opacity-30 flex items-center gap-1"
            >
              <i className="fas fa-play-all"></i>
              Все
            </button>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="h-32 bg-[#0e0e16] border-t border-white/5 p-3 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max h-full">
              {clips.length === 0 ? (
                <div className="flex-1 h-full flex items-center justify-center">
                  <p className="text-xs text-gray-600">Таймлайн пуст — добавьте видео</p>
                </div>
              ) : (
                clips.map((clip, idx) => (
                  <div
                    key={clip.id}
                    onClick={() => { setSelectedClipId(clip.id); if (videoRef.current) { videoRef.current.src = clip.url; videoRef.current.currentTime = clip.startTime; videoRef.current.style.filter = clip.filter; videoRef.current.style.opacity = `${clip.opacity}%`; } }}
                    className={`relative h-full rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0 ${
                      selectedClipId === clip.id ? 'ring-2 ring-violet-500 scale-[1.02]' : 'hover:brightness-110'
                    }`}
                    style={{
                      width: `${Math.max(80, (clip.endTime - clip.startTime) * 30)}px`,
                      filter: clip.filter,
                      opacity: `${clip.opacity}%`,
                    }}
                  >
                    <video src={clip.url} className="w-full h-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-1 left-1 right-1">
                      <p className="text-[9px] font-medium truncate">{clip.name}</p>
                      <p className="text-[8px] text-gray-300">{formatTime(clip.endTime - clip.startTime)}</p>
                    </div>
                    <div className="absolute top-1 right-1 flex gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveClipLeft(idx); }}
                        className="w-4 h-4 rounded bg-black/50 hover:bg-black/80 flex items-center justify-center text-[8px] transition"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveClipRight(idx); }}
                        className="w-4 h-4 rounded bg-black/50 hover:bg-black/80 flex items-center justify-center text-[8px] transition"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <aside className="w-72 bg-[#0e0e16] border-l border-white/5 flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'clips', icon: 'fa-film', label: 'Клипы' },
              { id: 'filters', icon: 'fa-magic', label: 'Фильтры' },
              { id: 'text', icon: 'fa-font', label: 'Текст' },
              { id: 'export', icon: 'fa-cog', label: 'Настройки' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2.5 text-[10px] font-medium transition flex flex-col items-center gap-0.5 ${
                  activeTab === tab.id ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'clips' && selectedClip && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Обрезка</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Начало</span>
                      <input
                        type="range"
                        min={0}
                        max={selectedClip.duration}
                        step={0.1}
                        value={selectedClip.startTime}
                        onChange={(e) => updateClip(selectedClip.id, { startTime: parseFloat(e.target.value) })}
                        className="flex-1 h-1 accent-violet-500"
                      />
                      <span className="text-[10px] text-gray-400 w-10 text-right">{formatTime(selectedClip.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Конец</span>
                      <input
                        type="range"
                        min={0}
                        max={selectedClip.duration}
                        step={0.1}
                        value={selectedClip.endTime}
                        onChange={(e) => updateClip(selectedClip.id, { endTime: parseFloat(e.target.value) })}
                        className="flex-1 h-1 accent-violet-500"
                      />
                      <span className="text-[10px] text-gray-400 w-10 text-right">{formatTime(selectedClip.endTime)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Прозрачность</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedClip.opacity}
                      onChange={(e) => updateClip(selectedClip.id, { opacity: parseInt(e.target.value) })}
                      className="flex-1 h-1 accent-violet-500"
                    />
                    <span className="text-[10px] text-gray-400 w-8">{selectedClip.opacity}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Громкость</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedClip.volume}
                      onChange={(e) => updateClip(selectedClip.id, { volume: parseInt(e.target.value) })}
                      className="flex-1 h-1 accent-violet-500"
                    />
                    <span className="text-[10px] text-gray-400 w-8">{selectedClip.volume}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-gray-500">
                    <i className="fas fa-info-circle mr-1"></i>
                    Длительность клипа: {formatTime(selectedClip.endTime - selectedClip.startTime)}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'clips' && !selectedClip && (
              <div className="text-center py-8">
                <i className="fas fa-hand-pointer text-2xl text-gray-700 mb-2"></i>
                <p className="text-xs text-gray-600">Выберите клип для настройки</p>
              </div>
            )}

            {activeTab === 'filters' && selectedClip && (
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Фильтры</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FILTERS).map(([name, value]) => (
                    <button
                      key={name}
                      onClick={() => {
                        updateClip(selectedClip.id, { filter: value });
                        if (videoRef.current) videoRef.current.style.filter = value;
                      }}
                      className={`p-2 rounded-lg border text-[10px] font-medium transition ${
                        selectedClip.filter === value
                          ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded mb-1 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30"
                        style={{ filter: value }}
                      ></div>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'filters' && !selectedClip && (
              <div className="text-center py-8">
                <i className="fas fa-magic text-2xl text-gray-700 mb-2"></i>
                <p className="text-xs text-gray-600">Выберите клип для применения фильтра</p>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Добавить текст</label>
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Введите текст..."
                    className="w-full mt-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs focus:outline-none focus:border-violet-500 transition"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <div>
                      <label className="text-[9px] text-gray-500">Цвет</label>
                      <input
                        type="color"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        className="w-8 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-gray-500">Размер: {newTextSize}px</label>
                      <input
                        type="range"
                        min={12}
                        max={72}
                        value={newTextSize}
                        onChange={(e) => setNewTextSize(parseInt(e.target.value))}
                        className="w-full h-1 accent-violet-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addTextOverlay}
                    disabled={!newText.trim()}
                    className="w-full mt-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg text-xs font-medium text-violet-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Добавить наложение
                  </button>
                </div>

                {textOverlays.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Наложения</p>
                    {textOverlays.map(overlay => (
                      <div key={overlay.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium truncate">{overlay.text}</p>
                          <p className="text-[9px] text-gray-500">{overlay.fontSize}px • {overlay.color}</p>
                        </div>
                        <button
                          onClick={() => removeTextOverlay(overlay.id)}
                          className="w-5 h-5 rounded bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-[9px] text-red-400 transition"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Экспорт видео</label>
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="space-y-2 text-[11px] text-gray-400">
                      <p><i className="fas fa-film mr-2 text-violet-400"></i>Формат: WebM (VP9)</p>
                      <p><i className="fas fa-expand mr-2 text-violet-400"></i>Разрешение: 1280×720</p>
                      <p><i className="fas fa-tachometer-alt mr-2 text-violet-400"></i>Битрейт: 5 Mbps</p>
                      <p><i className="fas fa-clock mr-2 text-violet-400"></i>Длительность: {formatTime(totalDuration)}</p>
                    </div>
                  </div>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center">Экспорт: {Math.round(exportProgress)}%</p>
                  </div>
                )}

                <button
                  onClick={handleExport}
                  disabled={clips.length === 0 || isExporting}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Экспортировать видео
                </button>

                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] text-gray-500">
                    <i className="fas fa-info-circle mr-1 text-violet-400"></i>
                    Экспорт происходит в реальном времени. Не закрывайте вкладку во время экспорта.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Hidden Canvas for Export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default App;
