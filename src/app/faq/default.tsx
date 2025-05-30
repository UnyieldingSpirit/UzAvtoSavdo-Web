'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, Settings, HelpCircle, Users, Gift, Shield, Plus, Search, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from '@/hooks/useTranslation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { translations } from './faq.localization';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/store/language';

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  lightColor: string;
  gradient: string;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
  lastUpdated?: string;
}

const ITEMS_PER_PAGE = 10;

// Обновление массива категорий с более гармоничными цветами
const categories: Category[] = [
  { 
    id: 'all', 
    label: 'faq.categories.all',
    icon: Users,
    color: '#003974', // Основной синий цвет компании (primary)
    lightColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80'
  },
  { 
    id: 'general', 
    label: 'faq.categories.general',
    icon: Shield,
    color: '#0056a4', // Более яркий синий
    lightColor: 'bg-blue-100',
    gradient: 'from-blue-600 to-blue-700'
  },
  { 
    id: 'ordering', 
    label: 'faq.categories.ordering',
    icon: Gift,
    color: '#4ba82e', // Зеленый цвет (secondary)
    lightColor: 'bg-green-100',
    gradient: 'from-green-600 to-green-700'
  },
  { 
    id: 'payment', 
    label: 'faq.categories.payment',
    icon: CreditCard,
    color: '#2EA894', // Бирюзовый цвет из дизайна
    lightColor: 'bg-emerald-100',
    gradient: 'from-emerald-600 to-emerald-700'
  },
  { 
    id: 'delivery', 
    label: 'faq.categories.delivery',
    icon: Truck,
    color: '#e67817', // Оранжевый для доставки
    lightColor: 'bg-orange-100',
    gradient: 'from-orange-500 to-orange-600'
  },
  { 
    id: 'service', 
    label: 'faq.categories.service',
    icon: Settings,
    color: '#903784', // Фиолетовый для сервиса
    lightColor: 'bg-purple-100',
    gradient: 'from-purple-600 to-purple-700'
  },
  {
    id: 'support',
    label: 'faq.categories.support',
    icon: HelpCircle,
    color: '#1e88e5', // Голубой для поддержки
    lightColor: 'bg-sky-100',
    gradient: 'from-sky-500 to-sky-600'
  }
];

// Функция для регулировки яркости цвета
function adjustColorBrightness(hex: string, percent: number) {
  // Преобразование hex в rgb
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Регулировка яркости
  r = Math.max(0, Math.min(255, r + percent));
  g = Math.max(0, Math.min(255, g + percent));
  b = Math.max(0, Math.min(255, b + percent));

  // Преобразование обратно в hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Функция для правильного склонения существительного "вопрос"
const pluralizeQuestions = (n: number, t: (key: string) => string): string => {
  const rem10 = n % 10;
  const rem100 = n % 100;
  
  if (rem100 >= 11 && rem100 <= 14) {
    return `${n} ${t('faq.questions.many')}`;
  } else if (rem10 === 1) {
    return `${n} ${t('faq.questions.one')}`;
  } else if (rem10 >= 2 && rem10 <= 4) {
    return `${n} ${t('faq.questions.few')}`;
  } else {
    return `${n} ${t('faq.questions.many')}`;
  }
};

const faqsTranslations = {
  ru: [
    {
      id: '1',
      category: 'general',
      question: 'Как узнать статус моего заказа?',
      answer: 'Вы можете отслеживать статус вашего заказа в личном кабинете в разделе "Мои заказы". Там отображается актуальная информация о текущем этапе обработки заказа, ожидаемых сроках доставки и другие детали.'
    },
    {
      id: '2',
      category: 'ordering',
      question: 'Как оформить заказ на автомобиль?',
      answer: 'Для оформления заказа необходимо выбрать желаемую модель автомобиля на сайте, указать комплектацию и цвет, выбрать ближайшего дилера и оформить заказ через личный кабинет. После этого с вами свяжется менеджер для подтверждения деталей.'
    },
    {
      id: '3',
      category: 'payment',
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы предлагаем различные способы оплаты: наличными, банковской картой, банковским переводом. Также доступны программы рассрочки и кредитования от наших банков-партнеров.'
    },
    {
      id: '4',
      category: 'delivery',
      question: 'Как происходит передача автомобиля?',
      answer: 'Передача автомобиля происходит в дилерском центре после полной оплаты. Наши специалисты проведут подробный инструктаж по эксплуатации автомобиля, помогут с оформлением всех необходимых документов.'
    },
    {
      id: '5',
      category: 'service',
      question: 'Как происходит гарантийное обслуживание?',
      answer: 'Гарантийное обслуживание осуществляется у официальных дилеров компании. Для поддержания гарантии необходимо своевременно проходить плановое техническое обслуживание согласно регламенту производителя.'
    },
    {
      id: '6',
      category: 'support',
      question: 'Как связаться с поддержкой?',
      answer: 'Вы можете связаться с нашей службой поддержки по телефону +998 78 141 77 77 или написать на электронную почту info@uzautomotors.com. Наши специалисты готовы помочь вам с любыми вопросами.'
    }
  ],
  uz: [
    {
      id: '1',
      category: 'general',
      question: 'Buyurtmamning holatini qanday bilishim mumkin?',
      answer: 'Siz buyurtmangiz holatini shaxsiy kabinetdagi "Mening buyurtmalarim" bo\'limida kuzatishingiz mumkin. U yerda buyurtmaning joriy bosqichi, kutilayotgan yetkazib berish muddatlari va boshqa tafsilotlar haqida dolzarb ma\'lumotlar mavjud.'
    },
    {
      id: '2',
      category: 'ordering',
      question: 'Avtomobil uchun buyurtma qanday rasmiylashtiriladi?',
      answer: 'Buyurtmani rasmiylashtirish uchun saytda kerakli avtomobil modelini tanlash, komplektatsiya va rangni ko\'rsatish, eng yaqin dilerini tanlash va shaxsiy kabinet orqali buyurtmani rasmiylashtirish kerak. Shundan so\'ng tafsilotlarni tasdiqlash uchun menejer siz bilan bog\'lanadi.'
    },
    {
      id: '3',
      category: 'payment',
      question: 'Qanday to\'lov usullari mavjud?',
      answer: 'Biz turli xil to\'lov usullarini taklif qilamiz: naqd pul, bank kartasi, bank o\'tkazmasi. Shuningdek, hamkor banklarimizdan bo\'lib to\'lash va kredit dasturlari ham mavjud.'
    },
    {
      id: '4',
      category: 'delivery',
      question: 'Avtomobilni topshirish qanday amalga oshiriladi?',
      answer: 'Avtomobilni topshirish to\'liq to\'lovdan so\'ng dilerlik markazida amalga oshiriladi. Bizning mutaxassislarimiz avtomobilni ishlatish bo\'yicha batafsil ko\'rsatmalar berishadi va barcha zarur hujjatlarni rasmiylashtirish bilan yordam berishadi.'
    },
    {
      id: '5',
      category: 'service',
      question: 'Kafolat xizmati qanday amalga oshiriladi?',
      answer: 'Kafolat xizmati kompaniyaning rasmiy dilerlari tomonidan amalga oshiriladi. Kafolatni saqlash uchun ishlab chiqaruvchining tartibiga muvofiq rejali texnik xizmatni o\'z vaqtida o\'tkazish kerak.'
    },
    {
      id: '6',
      category: 'support',
      question: 'Qo\'llab-quvvatlash xizmati bilan qanday bog\'lanish mumkin?',
      answer: 'Siz qo\'llab-quvvatlash xizmatimiz bilan +998 78 141 77 77 raqami orqali bog\'lanishingiz yoki info@uzautomotors.com elektron pochtasiga yozishingiz mumkin. Bizning mutaxassislarimiz sizga har qanday savol bilan yordam berishga tayyor.'
    }
  ]
};

const FAQCard = ({ 
  faq, 
  isOpen, 
  onToggle 
}: { 
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const category = categories.find(c => c.id === faq.category) || categories[0];
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { duration: 0.3 },
        scale: { duration: 0.2 }
      }}
      id={`faq-${faq.id}`}
      className="overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{
          background: isOpen 
            ? `linear-gradient(135deg, ${category.color} 0%, ${adjustColorBrightness(category.color, -20)} 100%)` 
            : '#ffffff'
        }}
        className={clsx(
          "border rounded-2xl transition-all duration-300",
          isOpen ? "border-transparent shadow-lg" : "border-gray-200"
        )}
      >
        <button
          onClick={onToggle}
          className="w-full text-left p-6 flex items-center gap-4"
          aria-expanded={isOpen}
          aria-controls={`faq-content-${faq.id}`}
        >
          <div className={clsx(
            "flex-shrink-0 w-12 h-12 rounded-xl",
            "flex items-center justify-center",
            "transition-colors duration-300",
            isOpen ? "bg-white/20" : `bg-gradient-to-br ${category.lightColor}`
          )}>
            <category.icon className={clsx(
              "w-6 h-6",
              isOpen ? "text-white" : "text-gray-700"
            )} />
          </div>

          <div className="flex-grow min-w-0">
            <h3 className={clsx(
              "text-lg font-medium transition-colors duration-300",
              isOpen ? "text-white" : "text-gray-900"
            )}>
              {faq.question}
            </h3>
          </div>

          <div className={clsx(
            "flex-shrink-0 w-8 h-8 rounded-full",
            "flex items-center justify-center",
            "transition-all duration-300",
            isOpen ? "bg-white/20" : "bg-gray-100"
          )}>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              className="w-5 h-5"
            >
              <Plus className={clsx(
                "w-full h-full",
                isOpen ? "text-white" : "text-gray-500"
              )} />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-content-${faq.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="text-white/90 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const CategoryButton = ({ 
  category, 
  isActive, 
  onClick,
  count,
  t
}: { 
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count: number;
  t: (key: string) => string;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        "relative w-full p-4 rounded-xl transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isActive
          ? [
              "bg-gradient-to-br",
              category.gradient,
              "shadow-lg transform -translate-y-1",
              "focus:ring-offset-white focus:ring-opacity-50",
              "focus:ring-" + (category.id === 'all' ? 'primary' : category.id)
            ]
          : [
              "bg-gradient-to-br",
              `hover:${category.gradient}`,
              "hover:shadow-md",
              "bg-white",
              "focus:ring-gray-200"
            ]
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isActive}
      role="tab"
      aria-selected={isActive}
      id={`tab-${category.id}`}
      aria-controls={`panel-${category.id}`}
    >
      <div className={clsx(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
        isActive ? "bg-white/20" : "bg-white/60"
      )}>
        <category.icon className={clsx(
          "w-6 h-6",
          isActive ? "text-white" : "text-gray-700"
        )} />
      </div>

      <div className="text-left">
        <h3 className={clsx(
          "font-medium mb-1",
          isActive ? "text-white" : "text-gray-900"
        )}>
          {t(category.label)}
        </h3>
        
        <span className={clsx(
          "text-sm",
          isActive ? "text-white/80" : "text-gray-600"
        )}>
          {pluralizeQuestions(count, t)}
        </span>
      </div>
    </motion.button>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <nav aria-label="Pagination" className="flex justify-center gap-2 mt-8">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      className={clsx(
        "w-10 h-10 rounded-lg transition-all flex items-center justify-center",
        currentPage === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
      disabled={currentPage === 1}
      aria-label="Предыдущая страница"
    >
      &laquo;
    </button>
    
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={clsx(
          "w-10 h-10 rounded-lg transition-all",
          currentPage === index + 1
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
        aria-label={`Страница ${index + 1}`}
        aria-current={currentPage === index + 1 ? "page" : undefined}
      >
        {index + 1}
      </button>
    ))}
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      className={clsx(
        "w-10 h-10 rounded-lg transition-all flex items-center justify-center",
        currentPage === totalPages
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
      disabled={currentPage === totalPages}
      aria-label="Следующая страница"
    >
      &raquo;
    </button>
  </nav>
);

export default function FAQPage() {
  const { t } = useTranslation(translations);
  const { currentLocale } = useLanguageStore();
  const faqs = faqsTranslations[currentLocale === 'uz' ? 'uz' : 'ru'];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const tabsRef = useRef<HTMLDivElement>(null);

  // Мемоизируем функцию подсчета вопросов для каждой категории
  const getCategoryCount = useCallback((categoryId: string) => {
    if (categoryId === 'all') return faqs.length;
    return faqs.filter(faq => faq.category === categoryId).length;
  }, [faqs]);

  // Дебаунс для поиска
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Обработка изменения категории
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // Фильтрация FAQs по категории и поисковому запросу
  const filteredFAQs = useMemo(() => {
    const searchLower = debouncedSearchQuery.toLowerCase();
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = !debouncedSearchQuery || 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, debouncedSearchQuery, faqs]);

  // Пагинация
  const paginatedFAQs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFAQs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFAQs, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE));

  // При изменении total pages, убедимся, что текущая страница не выходит за пределы
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Обработчик переключения FAQ (без автоскролла)
  const handleFAQToggle = useCallback((id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  }, [openFAQ]);

  // Обработчик изменения страницы пагинации
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">{t('faq.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="container-fluid">
        <div className="py-12 lg:py-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-6">
                {t('faq.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                {t('faq.subtitle')}
              </p>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div ref={tabsRef} role="tablist" aria-label={t('faq.categories.all')} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-8">
              <div className={clsx(
                "grid gap-4",
                isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-7"
              )}>
                {categories.map(category => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isActive={activeCategory === category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    count={getCategoryCount(category.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    placeholder={t('faq.search')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      shadow-sm"
                    aria-label={t('faq.search')}
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div 
              role="region" 
              aria-label={t('faq.title')} 
              className="space-y-4"
              id={`panel-${activeCategory}`}
            >
              <AnimatePresence mode="wait">
                {paginatedFAQs.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {paginatedFAQs.map(faq => (
                      <article key={faq.id}>
                        <h2 className="sr-only">{faq.question}</h2>
                        <FAQCard
                          faq={faq}
                          isOpen={openFAQ === faq.id}
                          onToggle={() => handleFAQToggle(faq.id)}
                        />
                      </article>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-12 
                      bg-white rounded-2xl border border-gray-200 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {t('faq.noResults.title')}
                    </h3>
                    <p className="text-gray-500">
                      {t('faq.noResults.text')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredFAQs.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('faq.contactSupport.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('faq.contactSupport.text')}
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="tel:+998781417777"
                    className={clsx(
                      "px-6 py-3 rounded-xl",
                      "bg-primary text-white",
                      "hover:bg-primary/90 transition-colors",
                      "font-medium shadow-md hover:shadow-lg"
                    )}
                    aria-label="Call support"
                  >
                    {t('faq.contactSupport.call')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}