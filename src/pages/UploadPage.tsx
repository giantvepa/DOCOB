import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, Video } from '../App';
import { Upload, Film, X, Check, Loader2 } from 'lucide-react';

const CATEGORIES = ['Программирование', 'Кулинария', 'Спорт', 'Путешествия', 'Технологии', 'Искусство', 'Музыка', 'Наука'];

export default function UploadPage() {
  const { setVideos, currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('video/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
      setStep(2);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('video/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
      setStep(2);
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !file) return;
    setUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      const newVideo: Video = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        url: preview,
        thumbnail: '',
        duration: 0,
        views: 0,
        likes: 0,
        dislikes: 0,
        author: currentUser,
        authorAvatar: '👤',
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        uploadedAt: new Date().toISOString().split('T')[0],
        comments: [],
      };

      setVideos(prev => [newVideo, ...prev]);
      setStep(3);

      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6">
      <h1 className="text-xl font-bold mb-6">Загрузка видео</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step >= s ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-500'
            }`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            <span className={`text-xs ${step >= s ? 'text-white' : 'text-gray-500'}`}>
              {s === 1 ? 'Выбор файла' : s === 2 ? 'Детали' : 'Готово'}
            </span>
            {s < 3 && <div className={`w-12 h-px ${step > s ? 'bg-blue-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 - File Selection */}
      {step === 1 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-16 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
        >
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-blue-400" />
          </div>
          <p className="text-sm font-medium mb-1">Перетащите видеофайл сюда</p>
          <p className="text-xs text-gray-500 mb-4">или нажмите для выбора</p>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition">
            Выбрать файл
          </button>
          <p className="text-[11px] text-gray-600 mt-4">MP4, WebM, MOV • Макс. 10 GB</p>
        </div>
      )}

      {/* Step 2 - Details */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black max-w-lg">
            {preview ? (
              <video src={preview} className="w-full h-full object-contain" controls />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film size={40} className="text-gray-600" />
              </div>
            )}
            <button
              onClick={() => { setStep(1); setFile(null); setPreview(''); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition"
            >
              <X size={14} />
            </button>
          </div>

          {file && (
            <p className="text-xs text-gray-500">
              <Film size={12} className="inline mr-1" />
              {file.name} • {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          )}

          {/* Form */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Название *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="Введите название видео"
            />
            <p className="text-[10px] text-gray-600 mt-1">{title.length}/100</p>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={5000}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition resize-none"
              placeholder="Расскажите о видео..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition appearance-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Видимость</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition appearance-none"
              >
                <option value="public" className="bg-[#1a1a1a]">Публичное</option>
                <option value="unlisted" className="bg-[#1a1a1a]">По ссылке</option>
                <option value="private" className="bg-[#1a1a1a]">Приватное</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Теги (через запятую)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
              placeholder="django, python, веб-разработка"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Назад
            </button>
            <button
              onClick={handlePublish}
              disabled={!title.trim() || uploading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Загрузка... {Math.round(progress)}%
                </>
              ) : (
                'Опубликовать'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Done */}
      {step === 3 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-400" />
          </div>
          <h2 className="text-lg font-bold mb-2">Видео загружено!</h2>
          <p className="text-sm text-gray-400">Перенаправление на главную...</p>
        </div>
      )}
    </div>
  );
}
