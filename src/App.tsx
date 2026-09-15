import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  uploadedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  avatar: string;
  createdAt: string;
  likes: number;
}

export interface AppContextType {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  currentUser: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({
  videos: [],
  setVideos: () => {},
  currentUser: 'Пользователь',
  searchQuery: '',
  setSearchQuery: () => {},
});

const DEMO_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Как создать веб-приложение на Django за 30 минут',
    description: 'В этом видео мы создадим полноценное веб-приложение с использованием Django. Разберём модели, views, templates и URL-маршруты.',
    url: '',
    thumbnail: '',
    duration: 1845,
    views: 15420,
    likes: 892,
    dislikes: 12,
    author: 'Django Мастер',
    authorAvatar: '🎬',
    category: 'Программирование',
    tags: ['django', 'python', 'веб-разработка'],
    uploadedAt: '2024-12-15',
    comments: [
      { id: 'c1', text: 'Отличное видео! Всё понятно объяснено', author: 'Кодер42', avatar: '💻', createdAt: '2024-12-16', likes: 24 },
      { id: 'c2', text: 'Сделал по туториалу, всё работает!', author: 'WebDev', avatar: '🌐', createdAt: '2024-12-17', likes: 15 },
    ],
  },
  {
    id: '2',
    title: 'Python для начинающих — полный курс 2024',
    description: 'Полный курс Python с нуля. Изучим переменные, циклы, функции, ООП и работу с библиотеками.',
    url: '',
    thumbnail: '',
    duration: 7200,
    views: 89300,
    likes: 4521,
    dislikes: 45,
    author: 'Python Pro',
    authorAvatar: '🐍',
    category: 'Программирование',
    tags: ['python', 'курс', 'обучение'],
    uploadedAt: '2024-11-20',
    comments: [
      { id: 'c3', text: 'Лучший курс по Python!', author: 'Студент', avatar: '📚', createdAt: '2024-11-22', likes: 89 },
    ],
  },
  {
    id: '3',
    title: 'Готовим итальянскую пасту — рецепт от шефа',
    description: 'Классический рецепт итальянской пасты карбонара. Простые ингредиенты, потрясающий результат.',
    url: '',
    thumbnail: '',
    duration: 920,
    views: 34200,
    likes: 2100,
    dislikes: 8,
    author: 'Шеф Марко',
    authorAvatar: '👨‍🍳',
    category: 'Кулинария',
    tags: ['паста', 'рецепт', 'итальянская кухня'],
    uploadedAt: '2024-12-01',
    comments: [
      { id: 'c4', text: 'Приготовил, семья в восторге!', author: 'Домохозяйка', avatar: '🏠', createdAt: '2024-12-03', likes: 45 },
    ],
  },
  {
    id: '4',
    title: 'Тренировка дома за 20 минут — без оборудования',
    description: 'Эффективная тренировка для всего тела. Не нужно никакое оборудование, только ваше желание!',
    url: '',
    thumbnail: '',
    duration: 1200,
    views: 56700,
    likes: 3400,
    dislikes: 22,
    author: 'FitLife',
    authorAvatar: '💪',
    category: 'Спорт',
    tags: ['фитнес', 'тренировка', 'здоровье'],
    uploadedAt: '2024-12-10',
    comments: [],
  },
  {
    id: '5',
    title: 'Путешествие по Грузии — Тбилиси и окрестности',
    description: 'Показываем самые красивые места Тбилиси. Старый город, серные бани, горы и вкусная еда.',
    url: '',
    thumbnail: '',
    duration: 2400,
    views: 23100,
    likes: 1800,
    dislikes: 5,
    author: 'TravelVlog',
    authorAvatar: '✈️',
    category: 'Путешествия',
    tags: ['грузия', 'тбилиси', 'путешествие'],
    uploadedAt: '2024-11-28',
    comments: [
      { id: 'c5', text: 'Какая красота! Обязательно поеду!', author: 'Путешественник', avatar: '🗺️', createdAt: '2024-11-30', likes: 33 },
    ],
  },
  {
    id: '6',
    title: 'React + TypeScript — создаём интернет-магазин',
    description: 'Создаём полноценный интернет-магазин на React с TypeScript. Корзина, фильтры, оплата.',
    url: '',
    thumbnail: '',
    duration: 5400,
    views: 41200,
    likes: 2900,
    dislikes: 18,
    author: 'Frontend Guru',
    authorAvatar: '⚛️',
    category: 'Программирование',
    tags: ['react', 'typescript', 'интернет-магазин'],
    uploadedAt: '2024-12-08',
    comments: [],
  },
  {
    id: '7',
    title: 'Учимся рисовать — акварель для начинающих',
    description: 'Основы акварельной живописи. Разберём техники, материалы и создадим первый пейзаж.',
    url: '',
    thumbnail: '',
    duration: 3600,
    views: 18900,
    likes: 1200,
    dislikes: 3,
    author: 'ArtStudio',
    authorAvatar: '🎨',
    category: 'Искусство',
    tags: ['рисование', 'акварель', 'творчество'],
    uploadedAt: '2024-12-05',
    comments: [],
  },
  {
    id: '8',
    title: 'Обзор iPhone 16 Pro — стоит ли покупать?',
    description: 'Детальный обзор нового iPhone 16 Pro. Камера, производительность, батарея и сравнение с конкурентами.',
    url: '',
    thumbnail: '',
    duration: 1500,
    views: 120000,
    likes: 8500,
    dislikes: 340,
    author: 'TechReview',
    authorAvatar: '📱',
    category: 'Технологии',
    tags: ['iphone', 'обзор', 'технологии'],
    uploadedAt: '2024-12-12',
    comments: [
      { id: 'c6', text: 'Купил, не жалею! Камера огонь 🔥', author: 'Фанат Apple', avatar: '🍎', createdAt: '2024-12-13', likes: 56 },
      { id: 'c7', text: 'Лучше бы Android взяли...', author: 'Андроид', avatar: '🤖', createdAt: '2024-12-14', likes: 12 },
    ],
  },
];

function App() {
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('video-platform-videos');
    return saved ? JSON.parse(saved) : DEMO_VIDEOS;
  });
  const [currentUser] = useState('Пользователь');
  const [searchQuery, setSearchQuery] = useState('');

  // Save to localStorage
  const updateVideos = (newVideos: Video[] | ((prev: Video[]) => Video[])) => {
    setVideos(newVideos);
    const toSave = typeof newVideos === 'function' ? newVideos(videos) : newVideos;
    localStorage.setItem('video-platform-videos', JSON.stringify(toSave));
  };

  return (
    <AppContext.Provider value={{ videos, setVideos: updateVideos, currentUser, searchQuery, setSearchQuery }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="watch/:id" element={<WatchPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
