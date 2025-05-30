'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useDealersStore } from '@/store/dealers';
import { DealerCard } from '@/components/shared/DealerCard';
import {  ChevronLeft, Map } from 'lucide-react';
import { RegionSelector } from '@/components/sections/RegionSelector';
import { UzbekistanMap } from '@/components/shared/UzbekistanMap';
import { useContractStore } from '@/store/selected-car';
import { CaptchaModal } from '@/components/sections/CaptchaModal';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useProcessingStore } from '@/store/processing';
import ContractProcessing from '@/components/shared/Loader/Loader';
import { useCarsStore } from '@/store/models-cars';
import { fetchDealersWithStock } from '@/api/dealers';
import clsx from 'clsx';

const translations = {
    "uz": {
        "dealers": {
            "title": "Dilerlar tarmog'i",
            "subtitle": "Rasmiy dilerlar ro'yxati",
            "noDealers": "Bu hududda dilerlar topilmadi",
            "openMap": "Kartada ko'rish",
            "workingHours": "Ish vaqti",
            "rating": "Reyting",
            "mapLoadError": "Xaritani yuklab bo'lmadi",
            "retryLoad": "Qayta urinib ko'ring",
            "loadingMap": "Xarita yuklanmoqda...",
            "locationUnavailable": "Manzil mavjud emas",
            "noPhone": "Telefon raqami ko'rsatilmagan",
            "noLocation": "Manzil ko'rsatilmagan",
            "regions": {
                "tashkent": "Toshkent shahar",
                "andijan": "Andijon viloyati", 
                "bukhara": "Buxoro viloyati",
                "jizzakh": "Jizzax viloyati",
                "kashkadarya": "Qashqadaryo viloyati",
                "navoi": "Navoiy viloyati",
                "namangan": "Namangan viloyati", 
                "samarkand": "Samarqand viloyati",
                "surkhandarya": "Surxondaryo viloyati",
                "syrdarya": "Sirdaryo viloyati",
                "ferghana": "Farg'ona viloyati",
                "khorezm": "Xorazm viloyati",
                "karakalpakstan": "Qoraqalpog'iston Respublikasi",
                "tashkent_region": "Toshkent viloyati"
            },
            "availability": {
                "inStock": "Mavjud: {count} dona",
                "preOrder": "Oldindan buyurtma",
                "chooseDealer": "Diler tanlash",
                "dealerSelected": "Diler tanlandi"
            },
            "selectRegionOnMap": "Dilerlarni ko'rish uchun xaritadan hududni tanlang",
            "selectedRegion": "Tanlangan hudud",
            "changeRegion": "Hududni o'zgartirish",
            "dealersInRegion": "dagi dilerlar"
        },
        "catalog": {
            "region": {
                "title": "Hududni tanlash",
                "selected": "Tanlangan hudud",
                "choose": "Hududni tanlang",
                "allRegions": "Barcha hududlar",
                "search": "Hududni qidirish...",
                "selectHint": "Dilerlarni ko'rish uchun hududni tanlang"
            }
        }
    },
    "ru": {
        "dealers": {
            "title": "Дилерская сеть",
            "subtitle": "Список официальных дилеров",
            "noDealers": "В этом регионе дилеров не найдено",
            "openMap": "Открыть на карте",
            "workingHours": "Время работы",
            "rating": "Рейтинг",
            "mapLoadError": "Ошибка загрузки карты",
            "retryLoad": "Повторить загрузку",
            "loadingMap": "Загрузка карты...",
            "locationUnavailable": "Локация недоступна",
            "noPhone": "Телефон не указан",
            "noLocation": "Местоположение не указано",
            "regions": {
                "tashkent": "город Ташкент",
                "andijan": "Андижанская область",
                "bukhara": "Бухарская область",
                "jizzakh": "Джизакская область", 
                "kashkadarya": "Кашкадарьинская область",
                "navoi": "Навоийская область",
                "namangan": "Наманганская область",
                "samarkand": "Самаркандская область",
                "surkhandarya": "Сурхандарьинская область",
                "syrdarya": "Сырдарьинская область",
                "ferghana": "Ферганская область",
                "khorezm": "Хорезмская область",
                "karakalpakstan": "Республика Каракалпакстан",
                "tashkent_region": "Ташкентская область"
            },
            "availability": {
                "inStock": "В наличии: {count} шт",
                "preOrder": "Предзаказ",
                "chooseDealer": "Выбрать дилера",
                "dealerSelected": "Дилер выбран"
            },
            "selectRegionOnMap": "Выберите регион на карте для просмотра дилеров",
            "selectedRegion": "Выбранный регион",
            "changeRegion": "Изменить регион",
            "dealersInRegion": "Дилеры в регионе"
        },
        "catalog": {
            "region": {
                "title": "Выберите регион",
                "selected": "Выбранный регион",
                "choose": "Выберите регион",
                "allRegions": "Все регионы",
                "search": "Поиск региона...",
                "selectHint": "Для просмотра дилеров выберите регион из списка выше"
            }
        }
    }
} as const;

// Соответствие ID регионов в компоненте RegionSelector с кодами регионов на карте
const regionMappings: {[key: string]: string} = {
  '1': 'UZ-TK',    // Ташкент город
  '2': 'UZ-AN',    // Андижанская область
  '3': 'UZ-BU',    // Бухарская область
  '4': 'UZ-JI',    // Джизакская область
  '5': 'UZ-QA',    // Кашкадарьинская область
  '6': 'UZ-NW',    // Навоийская область
  '7': 'UZ-NG',    // Наманганская область
  '8': 'UZ-SA',    // Самаркандская область
  '9': 'UZ-SU',    // Сурхандарьинская область
  '10': 'UZ-SI',   // Сырдарьинская область
  '11': 'UZ-TO',   // Ташкентская область
  '12': 'UZ-FA',   // Ферганская область
  '13': 'UZ-XO',   // Хорезмская область
  '14': 'UZ-QR'    // Республика Каракалпакстан
};

// Обратное соответствие кода региона на карте к ID региона
const reverseRegionMappings: {[key: string]: string} = Object.entries(regionMappings).reduce(
  (acc, [key, value]) => ({...acc, [value]: key}),
  {}
);

export default function DealersPage() {
  const { isProcessing } = useProcessingStore();
  const { t } = useTranslation(translations);
  const { cars } = useCarsStore();
  const [dealersStock, setDealersStock] = useState<{dealer_id: string, stock: number}[]>([]);
  const [showRegionSelector, setShowRegionSelector] = useState(true);

  const { 
    dealers, 
    selectedRegion, 
    isLoading, 
    error, 
    fetchDealers, 
    setSelectedRegion 
  } = useDealersStore();
  
  const { 
    isContractFlow,
    selectedDealer,
    setSelectedDealer,
    setCaptchaModalOpen,
  } = useContractStore();

  const { isAuthorized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const loadSavedData = async () => {
      const savedModification = localStorage.getItem('selected_modification');
      const savedColor = localStorage.getItem('selected_color');
      const savedDealer = localStorage.getItem('selected_dealer_id');

      if (savedModification && savedColor && savedDealer) {
        setSelectedDealer(savedDealer);
      }
    };

    loadSavedData();
  }, [setSelectedDealer]);

  useEffect(() => {
    const getDealersStock = async () => {
      const selectedModId = localStorage.getItem('selected_modification');
      const selectedColorId = localStorage.getItem('selected_color');

      if (!selectedModId || !selectedColorId || !selectedRegion) {
        setDealersStock([]);
        return;
      }

      try {
        const dealersWithStock = await fetchDealersWithStock(
          selectedModId,
          selectedColorId,
          dealers,
          selectedRegion
        );

        setDealersStock(dealersWithStock.map(dealer => ({
          dealer_id: dealer.dealer_id,
          stock: dealer.stock_count
        })));

      } catch (error) {
        console.error('Error getting dealers stock:', error);
        setDealersStock([]);
      }
    };

    if (isContractFlow) {
      getDealersStock();
    }
  }, [cars, selectedRegion, dealers, isContractFlow]);

  const filteredDealers = selectedRegion 
    ? dealers.filter((dealer) => dealer.region === selectedRegion)
      .map(dealer => ({
        ...dealer,
        stock: dealersStock.find(s => s.dealer_id === dealer.dealer_id)?.stock || 0,
        availability: {
          count: dealersStock.find(s => s.dealer_id === dealer.dealer_id)?.stock || 0,
          status: dealersStock.find(s => s.dealer_id === dealer.dealer_id)?.stock 
            ? 'inStock' as const 
            : 'preOrder' as const
        }
      }))
    : [];

  useEffect(() => {
    fetchDealers();
    localStorage.removeItem('selected_dealer_id');
    return () => setSelectedRegion('');
  }, [fetchDealers, setSelectedRegion]);

  // При выборе региона скрываем селектор
  useEffect(() => {
    if (selectedRegion) {
      setShowRegionSelector(false);
    }
  }, [selectedRegion]);

  const handleDealerSelect = async (dealerId: string) => {
    if (!isAuthorized) {
      router.push('/auth');
      return;
    }

    const modification_id = localStorage.getItem('selected_modification');
    const color_id = localStorage.getItem('selected_color');

    if (!modification_id || !color_id) return;

    setSelectedDealer(dealerId);
    localStorage.setItem('selected_dealer_id', dealerId);
    setCaptchaModalOpen(true);
  };

  // Обработчик выбора региона на карте
  const handleRegionSelect = (regionCode: string) => {
    const regionId = reverseRegionMappings[regionCode];
    if (regionId) {
      setSelectedRegion(regionId);
      setShowRegionSelector(false); // Скрываем селектор после выбора
    }
  };

  // Функция для возврата к выбору региона
  const handleBackToRegionSelect = () => {
    setShowRegionSelector(true);
  };

  const regions = [
    { id: '1', nameKey: 'tashkent' },
    { id: '2', nameKey: 'andijan' },
    { id: '3', nameKey: 'bukhara' },
    { id: '4', nameKey: 'jizzakh' },
    { id: '5', nameKey: 'kashkadarya' },
    { id: '6', nameKey: 'navoi' },
    { id: '7', nameKey: 'namangan' },
    { id: '8', nameKey: 'samarkand' },
    { id: '9', nameKey: 'surkhandarya' },
    { id: '10', nameKey: 'syrdarya' },
    { id: '14', nameKey: 'karakalpakstan' },
    { id: '11', nameKey: 'tashkent_region' },
    { id: '12', nameKey: 'ferghana' },
    { id: '13', nameKey: 'khorezm' }
  ].map(region => ({
    ...region,
    name: t(`dealers.regions.${region.nameKey}`)
  }));

  // Получаем название выбранного региона
  const selectedRegionName = selectedRegion 
    ? regions.find(r => r.id === selectedRegion)?.name 
    : '';

  return (
    <main className="min-h-screen pt-[80px]">
      <div className="container-fluid">
        {/* Показываем селектор региона только если showRegionSelector = true */}
        {showRegionSelector && (
          <div>
            <RegionSelector
              regions={regions}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              t={t}
            />
          </div>
        )}

        {/* Заголовок с выбранным регионом и кнопкой возврата */}
        {selectedRegion && !showRegionSelector && (
          <div className="sticky top-[80px] z-20 bg-white py-4 border-b mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedRegionName}
                </h2>
              </div>
              <button
                onClick={handleBackToRegionSelect}
                className="flex items-center gap-2 text-primary hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('dealers.changeRegion')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Показываем карту выбора региона только если нет выбранного региона или показан селектор */}
        {(!selectedRegion || showRegionSelector) && (
              <div className="max-w-7xl mx-auto">
                <UzbekistanMap 
                  dataType="dealers"
                  onRegionSelect={handleRegionSelect}
                  selectedRegion={selectedRegion ? regionMappings[selectedRegion] : null}
                  isLoading={isLoading}
                />
              </div>
        )}
   
        {/* Список дилеров (показываем только если есть выбранный регион и не показан селектор) */}
        {selectedRegion && !showRegionSelector && (
          isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className={clsx(
              "grid gap-3",
              isContractFlow 
                ? "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer) => (
                  <DealerCard
                    key={dealer.dealer_id} 
                    dealer={dealer}
                    t={t}
                    mode={isContractFlow ? 'select' : 'view'}
                    onSelect={handleDealerSelect} 
                    isSelected={selectedDealer === dealer.dealer_id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">
                  {t('dealers.noDealers')}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <CaptchaModal />
      {isProcessing && <ContractProcessing />}
    </main>
  );
}