'use client';

import { useState, useEffect } from 'react';
import {  ArrowRight, Star, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface NewsItem {
  id: string;
  title: string;
  text: string;
  date: string;
  imglistsha: string;
  isPinned?: boolean;
  category: 'company' | 'products' | 'events';
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Презентация нового CHEVROLET ONIX',
    text: 'Компания UzAuto Motors представляет новый седан Chevrolet Onix, который сочетает в себе современные технологии, экономичность и комфорт...',
    date: '10.01.2025',
    imglistsha: 'https://telegra.ph/file/91228160665ff9995c41f.png',
    isPinned: true,
    category: 'products'
  },
  {
    id: '2',
    title: 'UzAuto Motors развивает дилерскую сеть',
    text: 'В рамках стратегии расширения присутствия в регионах, компания UzAuto Motors открыла новый современный дилерский центр...',
    date: '09.01.2025',
    imglistsha: 'https://telegra.ph/file/65e30126152aedc010da5.png',
    category: 'company'
  },
  {
    id: '3',
    title: 'Участие в выставке AutoExpo 2025',
    text: 'UzAuto Motors приняла участие в крупнейшей международной автомобильной выставке AutoExpo 2025...',
    date: '08.01.2025',
    imglistsha: 'https://telegra.ph/file/91228160665ff9995c41f.png',
    category: 'events'
  },
  {
    id: '4',
    title: 'Обновленная CHEVROLET TRACKER',
    text: 'На заводе в Асаке начато производство обновленного кроссовера Chevrolet Tracker 2025 модельного года...',
    date: '07.01.2025',
    imglistsha: 'https://telegra.ph/file/65e30126152aedc010da5.png',
    category: 'products'
  }
];

const categories = {
  all: 'Все новости',
  company: 'Компания',
  products: 'Продукты',
  events: 'События'
} as const;

const NewsCard = ({ news, featured = false }: { news: NewsItem; featured?: boolean }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "group relative overflow-hidden rounded-xl bg-white transition-all duration-300",
        "hover:shadow-xl border border-gray-100",
        featured ? "lg:col-span-2 lg:row-span-2" : ""
      )}
    >
      <Link href={`/news/${news.id}`}>
        <div className="relative">
          <div className={clsx(
            "relative overflow-hidden",
            featured ? "h-[400px]" : "h-[240px]"
          )}>
            <Image
              src={news.imglistsha}
              alt={news.title}
              fill
              className="object-contain transform transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? 
                "(max-width: 768px) 100vw, (max-width: 1200px) 66vw" :
                "(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {news.isPinned && (
            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg p-2">
              <Star className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="absolute bottom-0 w-full p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                {categories[news.category]}
              </span>
              <span className="text-sm opacity-90">{news.date}</span>
            </div>

            <h3 className={clsx(
              "font-bold mb-2 line-clamp-2",
              featured ? "text-2xl" : "text-lg"
            )}>
              {news.title}
            </h3>

            <p className={clsx(
              "text-sm text-white/80 line-clamp-2 mb-4",
              featured ? "md:line-clamp-3" : ""
            )}>
              {news.text}
            </p>

            <span className="inline-flex items-center text-sm font-medium">
              Подробнее
              <ArrowRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | keyof typeof categories>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews(mockNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[80px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="container-fluid">
        <div className="py-12 md:py-16 lg:py-20 px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Новости и события
            </h1>
            <p className="text-xl text-gray-600">
              Следите за последними новостями, событиями и анонсами компании UzAuto Motors
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as keyof typeof categories)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    key === activeCategory
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Поиск новостей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-20">
          <AnimatePresence mode="wait">
            {filteredNews.map((item, index) => (
              <NewsCard
                key={item.id}
                news={item}
                featured={index === 0}
              />
            ))}

            {filteredNews.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <Filter className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Новости не найдены
                </h3>
                <p className="text-gray-500">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}