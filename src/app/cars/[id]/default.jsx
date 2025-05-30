'use client';

import { useEffect, useState, useCallback, Fragment, useMemo } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Download, 
  FileText, 
  Wallet,
  Car,
  AlertCircle,
  MapPin,
  Store,
  Check,
  Map,
  List,
  Loader
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useCarsStore } from '@/store/models-cars';
import Link from 'next/link';
import { FeaturesSlider } from '@/components/shared/FeaturesSlider';
import { useTranslation } from '@/hooks/useTranslation';
import { paymentTranslations, translations } from './cars.localization';
import { useContractStore } from '@/store/selected-car';
import { useLanguageStore } from '@/store/language';
import { motion, AnimatePresence } from 'framer-motion';
import { carModels, carModelsDesc, carNameToId } from './mocks';
import { ColorButton, InstallmentCalculator, ModificationButton, PaginationButton } from '@/components/sections/Cars';
import { RegionSelector } from '@/components/sections/RegionSelector';
import { UzbekistanMap } from '@/components/shared/UzbekistanMap';
import { fetchDealersWithStock } from '@/api/dealers';
import { useDealersStore } from '@/store/dealers';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Tab } from '@headlessui/react';
import { useCaptchaStore } from '@/store/captcha';
import { useProcessingStore } from '@/store/processing';
import { useAuth } from '@/hooks/useAuth';
import ContractProcessing from '@/components/shared/Loader/Loader';

const unitTranslations = {
  "uz": {
    "powerUnit": "o.k.",
    "secondUnit": "sek",
    "litreUnit": "l"
  },
  "ru": {
    "powerUnit": "л.с.",
    "secondUnit": "сек",
    "litreUnit": "л"
  }
};

const regionDealerTranslations = {
  "uz": {
    "region": {
      "selectRegion": "Hududni tanlang",
      "mapTitle": "Xaritadan tanlang",
      "listTitle": "Ro'yxatdan tanlang",
      "tabs": {
        "map": "Xarita",
        "list": "Ro'yxat"
      },
      "selectRegionHint": "Avtomobil mavjudligini ko'rish uchun hududni tanlang",
      "selectedRegion": "Tanlangan hudud",
      "changeRegion": "Hududni o'zgartirish",
      "search": "Qidirish...",
      "allRegions": "Barcha hududlar",
      "regionRequired": "Avval hududni tanlang",
      "continueToDealer": "Diler tanlashga o'tish",
      "availability": {
        "inStock": "Mavjud: {count}",
        "preOrder": "Oldindan buyurtma"
      },
      "regions": {
        "andijan": "Andijon viloyati",
        "bukhara": "Buxoro viloyati",
        "ferghana": "Farg'ona viloyati",
        "jizzakh": "Jizzax viloyati",
        "kashkadarya": "Qashqadaryo viloyati",
        "karakalpakstan": "Qoraqalpog'iston Respublikasi",
        "khorezm": "Xorazm viloyati",
        "namangan": "Namangan viloyati",
        "navoi": "Navoiy viloyati",
        "samarkand": "Samarqand viloyati",
        "surkhandarya": "Surxondaryo viloyati",
        "syrdarya": "Sirdaryo viloyati",
        "tashkent": "Toshkent shahar",
        "tashkent_region": "Toshkent viloyati"
      }
    },
    "dealers": {
      "selectDealer": "Dilerini tanlang",
      "dealer": "Diler",
      "inStock": "dona",
      "loading": "Dilerlar ro'yxati yuklanmoqda...",
      "noDealers": "Mavjud dilerlar yo'q",
      "noAvailabilityMessage": "Tanlangan hududda ushbu modeldagi avtomobil mavjud emas",
      "continueOrder": "Buyurtmani davom ettirish",
      "selectDealerFirst": "Diler tanlang",
      "dealerName": "Diler nomi",
      "dealerAddress": "Manzil",
      "stockInfo": "Omborda mavjud",
      "stockCount": "{count} dona mavjud",
      "noStock": "Mavjud emas",
      "dealerInfo": "Diler haqida ma'lumot",
      "dealerContacts": "Aloqa ma'lumotlari",
      "viewOnMap": "Xaritada ko'rish",
      "contactDealer": "Diler bilan bog'lanish",
      "preOrder": "Oldindan buyurtma"
    },
    "buttons": {
      "selectDealer": "Dilerini tanlang",
      "continueOrder": "Buyurtmani davom ettirish",
      "changeRegion": "Hududni o'zgartirish",
      "selectRegionAndDealer": "Hudud va dilerni tanlang",
      "selectRegion": "Hududni tanlang",
      "backToRegionSelect": "Hudud tanlashga qaytish",
      "confirmSelection": "Tanlovni tasdiqlash",
      "processToCashier": "Kassaga o'tish",
      "createOrder": "Buyurtma yaratish",
      "processing": "Ishlov berilmoqda..."
    }
  },
  "ru": {
    "region": {
      "selectRegion": "Выберите регион",
      "mapTitle": "Выбрать на карте",
      "listTitle": "Выбрать из списка",
      "tabs": {
        "map": "Карта",
        "list": "Список"
      },
      "selectRegionHint": "Выберите регион, чтобы увидеть наличие автомобилей",
      "selectedRegion": "Выбранный регион",
      "changeRegion": "Сменить регион",
      "search": "Поиск...",
      "allRegions": "Все регионы",
      "regionRequired": "Сначала выберите регион",
      "continueToDealer": "Перейти к выбору дилера",
      "availability": {
        "inStock": "В наличии: {count}",
        "preOrder": "Предзаказ"
      },
      "regions": {
        "andijan": "Андижанская область",
        "bukhara": "Бухарская область",
        "ferghana": "Ферганская область",
        "jizzakh": "Джизакская область",
        "kashkadarya": "Кашкадарьинская область",
        "karakalpakstan": "Республика Каракалпакстан",
        "khorezm": "Хорезмская область",
        "namangan": "Наманганская область",
        "navoi": "Навоийская область",
        "samarkand": "Самаркандская область",
        "surkhandarya": "Сурхандарьинская область",
        "syrdarya": "Сырдарьинская область",
        "tashkent": "Город Ташкент",
        "tashkent_region": "Ташкентская область"
      }
    },
    "dealers": {
      "selectDealer": "Выберите дилера",
      "dealer": "Дилер",
      "inStock": "шт. в наличии",
      "loading": "Загрузка списка дилеров...",
      "noDealers": "Нет доступных дилеров",
      "noAvailabilityMessage": "В выбранном регионе нет дилеров с данной моделью автомобиля в наличии",
      "continueOrder": "Продолжить оформление",
      "selectDealerFirst": "Выберите дилера",
      "dealerName": "Название дилера",
      "dealerAddress": "Адрес",
      "stockInfo": "Информация о наличии",
      "phoneNumber": "Номер телефона",
      "workingHours": "Часы работы",
      "stockCount": "В наличии {count} шт.",
      "noStock": "Нет в наличии",
      "dealerInfo": "Информация о дилере",
      "dealerContacts": "Контактная информация",
      "viewOnMap": "Показать на карте",
      "contactDealer": "Связаться с дилером",
      "preOrder": "Предзаказ"
    },
    "buttons": {
      "selectDealer": "Выберите дилера",
      "continueOrder": "Продолжить оформление",
      "changeRegion": "Сменить регион",
      "selectRegionAndDealer": "Выберите регион и дилера",
      "selectRegion": "Выберите регион",
      "backToRegionSelect": "Вернуться к выбору региона",
      "confirmSelection": "Подтвердить выбор",
      "processToCashier": "Перейти к оформлению",
      "createOrder": "Создать заказ",
      "processing": "Обработка..."
    }
  }
};

function RegionSelectorTabs({ 
  regions, 
  selectedRegionCode, 
  handleRegionSelect, 
  trd, 
  isLoadingMap, 
  isMobile,
  t,
  currentLocale,
  regionAvailability
}) {
  // Функция для получения правильного перевода для региона
  const getRegionName = (regionCode) => {
    // Преобразуем код региона (UZ-XX) в короткий ключ
    const shortKey = regionCode.toLowerCase().replace('uz-', '');
    
    // Сначала пробуем найти перевод в регионных ключах
    let translation = trd(`region.regions.${shortKey}`);
    
    // Если перевод не найден или равен ключу, пробуем через catalog.car.regions
    if (translation === `region.regions.${shortKey}`) {
      translation = t(`catalog.car.regions.${shortKey}`);
    }
    
    // Если все еще нет перевода, используем запасной вариант
    if (translation === `catalog.car.regions.${shortKey}`) {
      // Запасной словарь переводов
      const fallbackTranslations = {
        "ru": {
          "an": "Андижанская область",
          "bu": "Бухарская область",
          "fa": "Ферганская область",
          "ji": "Джизакская область",
          "ng": "Наманганская область",
          "nw": "Навоийская область",
          "qa": "Кашкадарьинская область",
          "qr": "Республика Каракалпакстан",
          "sa": "Самаркандская область",
          "si": "Сырдарьинская область",
          "su": "Сурхандарьинская область",
          "tk": "город Ташкент",
          "to": "Ташкентская область",
          "xo": "Хорезмская область"
        },
        "uz": {
          "an": "Andijon viloyati",
          "bu": "Buxoro viloyati",
          "fa": "Farg'ona viloyati",
          "ji": "Jizzax viloyati",
          "ng": "Namangan viloyati",
          "nw": "Navoiy viloyati",
          "qa": "Qashqadaryo viloyati",
          "qr": "Qoraqalpog'iston Respublikasi",
          "sa": "Samarqand viloyati",
          "si": "Sirdaryo viloyati",
          "su": "Surxondaryo viloyati",
          "tk": "Toshkent shahar",
          "to": "Toshkent viloyati",
          "xo": "Xorazm viloyati"
        }
      };
      
      const locale = currentLocale || 'ru';
      translation = fallbackTranslations[locale]?.[shortKey] || shortKey;
    }
    
    return translation;
  };

  // Функция для получения данных о доступности для региона
  const getRegionAvailabilityInfo = (regionCode) => {
    // ВАЖНОЕ ИЗМЕНЕНИЕ: Проверяем разные формы данных и правильно обрабатываем структуру
    // Сначала проверяем наличие данных в regionAvailability
    if (!regionAvailability) {
      return { count: 0, dealerCount: 0, hasStock: false };
    }

    // Прямое получение данных из regionAvailability
    const directData = regionAvailability[regionCode];
    if (directData) {
      // Обработка случая, когда directData это число
      if (typeof directData === 'number') {
        return { 
          count: directData, 
          dealerCount: 1,  // Предполагаем хотя бы одного дилера
          hasStock: directData > 0 
        };
      }
      
      // Обработка случая, когда directData это объект
      if (typeof directData === 'object') {
        const count = directData.count || 0;
        const dealerCount = directData.dealerCount || 
                           (directData.dealerDetails ? Object.keys(directData.dealerDetails).length : 0);
        
        return {
          count,
          dealerCount,
          hasStock: count > 0
        };
      }
    }
    
    // Если нет прямых данных, смотрим цвета и stock_data
    // ВАЖНО: Добавим проверку структуры данных в selectedMod
    if (window.selectedMod && window.selectedMod.colors) {
      let totalCount = 0;
      const dealerIds = new Set();
      
      window.selectedMod.colors.forEach(color => {
        if (color.stock_data && Array.isArray(color.stock_data)) {
          color.stock_data.forEach(data => {
            // Получаем ID региона из кода
            // Добавим отладочный вывод для проверки маппинга
            
            const regionMapping = {
              'UZ-AN': '2', // Андижанская область
              'UZ-BU': '3', // Бухарская область
              'UZ-FA': '12', // Ферганская область
              'UZ-JI': '4', // Джизакская область
              'UZ-NG': '7', // Наманганская область
              'UZ-NW': '6', // Навоийская область
              'UZ-QA': '5', // Кашкадарьинская область
              'UZ-QR': '14', // Каракалпакстан
              'UZ-SA': '8', // Самаркандская область
              'UZ-SI': '10', // Сырдарьинская область
              'UZ-SU': '9', // Сурхандарьинская область
              'UZ-TK': '1', // Ташкент
              'UZ-TO': '11', // Ташкентская область
              'UZ-XO': '13', // Хорезмская область
            };
            
            const regionId = regionMapping[regionCode];
            
            // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: правильное сравнение с данными API
            // API возвращает region_id как строку, поэтому сравниваем строки
            if (data.region_id === regionId) {
              const stockCount = parseInt(data.stock || 0);
              totalCount += stockCount;
              
              if (data.dealer_id && stockCount > 0) {
                dealerIds.add(data.dealer_id);
              }
            }
          });
        }
      });
      
      return {
        count: totalCount,
        dealerCount: dealerIds.size,
        hasStock: totalCount > 0
      };
    }
    
    // Если ничего не нашли, возвращаем нули
    return { count: 0, dealerCount: 0, hasStock: false };
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {trd('region.selectRegion')}
      </h3>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none ring-white/60 ring-offset-2 focus:ring-2',
                  'transition-all duration-300',
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-gray-600 hover:bg-white/[0.5] hover:text-primary'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Map className="w-4 h-4" />
                  <span>{trd('region.tabs.map')}</span>
                </div>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'focus:outline-none ring-white/60 ring-offset-2 focus:ring-2',
                  'transition-all duration-300',
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-gray-600 hover:bg-white/[0.5] hover:text-primary'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <List className="w-4 h-4" />
                  <span>{trd('region.tabs.list')}</span>
                </div>
              </button>
            )}
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Панель с картой */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {isMobile ? (
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 text-center">
                    {trd('region.selectRegionHint')}
                  </p>
                </div>
              ) : (
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900">
                    {trd('region.mapTitle')}
                  </h4>
                </div>
              )}
              <div className="p-4">
               <UzbekistanMap 
                  dataType="cars"
                  onRegionSelect={handleRegionSelect}
                  selectedRegion={selectedRegionCode}
                  isLoading={isLoadingMap}
                  className="w-full"
                  regionData={regionAvailability}
                />
              </div>
            </div>
          </Tab.Panel>
          
          {/* Панель со списком - с отображением количества доступных машин */}
          <Tab.Panel>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-medium text-gray-900">
                  {trd('region.listTitle')}
                </h4>
              </div>
              
              <div className="p-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {regions.map((region) => {
                    const isSelected = selectedRegionCode === region.id;
                    
                    // Получаем данные о наличии для этого региона
                    const { count, dealerCount, hasStock } = getRegionAvailabilityInfo(region.id);
                    
                    // Определяем статус наличия и классы для отображения
                    let statusClass = hasStock
                      ? (count > 5 ? "text-green-600 font-medium" : "text-amber-600 font-medium")
                      : "text-red-500 font-medium";
                    
                    return (
                      <div 
                        key={region.id}
                        className="group relative overflow-hidden"
                      >
                        {/* Фоновый элемент для анимации при наведении */}
                        <div
                          className={clsx(
                            "absolute inset-0 bg-primary/5 rounded-lg transition-transform duration-300",
                            "origin-left scale-x-0 group-hover:scale-x-100",
                            isSelected ? "scale-x-100" : ""
                          )}
                        />
                        
                        <button 
                          onClick={() => handleRegionSelect(region.id)}
                          className={clsx(
                            "relative z-10 w-full p-3 rounded-lg",
                            "flex items-center gap-2 text-left",
                            "transition-colors duration-300 border-2",
                            isSelected
                              ? "border-primary"
                              : "border-transparent hover:border-primary/30"
                          )}
                        >
                          <MapPin className={clsx(
                            "w-5 h-5 flex-shrink-0 transition-colors duration-300",
                            isSelected ? "text-primary" : "text-gray-400 group-hover:text-primary/60"
                          )} />
                          
                          <div className="flex-1 min-w-0">
                            <span className={clsx(
                              "block text-sm transition-colors duration-300",
                              isSelected 
                                ? "font-medium text-gray-900" 
                                : "text-gray-700 group-hover:text-gray-900"
                            )}>
                              {getRegionName(region.id)}
                            </span>
                            
                            {/* Отображение количества машин и дилеров */}
                            <div className="flex flex-col mt-1">
                              <span className={clsx(
                                "block text-xs",
                                statusClass
                              )}>
                                {hasStock 
                                  ? trd('region.availability.inStock', { count })
                                  : trd('')}
                              </span>
                            </div>
                          </div>
                          
                          <div className={clsx(
                            "ml-auto transition-opacity duration-300",
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                          )}>
                            <Check className={clsx(
                              "w-4 h-4 transition-colors duration-300",
                              isSelected ? "text-primary" : "text-primary/60"
                            )} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function DealersList({ 
  dealersWithStock,
  allDealers, 
  isLoading, 
  selectedDealer, 
  setSelectedDealer, 
  isMobile,
  trd,
  regionAvailability,
  selectedRegionCode,
  regionMapping
}) {
  // Функция для получения данных о наличии для дилера
  const getDealerAvailabilityInfo = (dealerId) => {
    // Сначала проверяем в dealersWithStock
    const stockInfo = dealersWithStock?.find(d => d.dealer_id === dealerId);
    if (stockInfo) {
      return {
        stock: stockInfo.stock_count || 0,
        hasStock: stockInfo.stock_count > 0
      };
    }
    
    // Если нет в dealersWithStock, проверяем в regionAvailability
    if (regionAvailability && selectedRegionCode) {
      const regionData = regionAvailability[selectedRegionCode];
      
      if (regionData && typeof regionData === 'object' && regionData.dealerDetails) {
        const dealerData = regionData.dealerDetails[dealerId];
        if (dealerData) {
          return {
            stock: dealerData.stock || 0,
            hasStock: dealerData.stock > 0
          };
        }
      }
    }
    
    return { stock: 0, hasStock: false };
  };

  return (
    <div className="mb-4">
      <h3 className={clsx(
        "font-semibold text-gray-900 mb-3",
        isMobile ? "text-base" : "text-lg"
      )}>
        {trd('dealers.selectDealer')}
      </h3>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[200px] flex flex-col items-center justify-center"
          >
            <Loader className="w-8 h-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-500">{trd('dealers.loading')}</p>
          </motion.div>
        ) : !allDealers || allDealers.length === 0 ? (
          <motion.div 
            key="no-dealers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-700">{trd('dealers.noDealers')}</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  {trd('dealers.noAvailabilityMessage')}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dealers-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar"
          >
            {allDealers.map((dealerInfo) => {
              const isSelected = selectedDealer === dealerInfo.dealer_id;
              
              // Получаем информацию о наличии
              const { stock, hasStock } = getDealerAvailabilityInfo(dealerInfo.dealer_id);
              
              return (
                <div 
                  key={dealerInfo.dealer_id}
                  className="group relative overflow-hidden"
                >
                  <div
                    className={clsx(
                      "absolute inset-0 bg-primary/5 rounded-lg transition-transform duration-300",
                      "origin-left scale-x-0 group-hover:scale-x-100",
                      isSelected ? "scale-x-100" : ""
                    )}
                  />
                  
                  <div 
                    onClick={() => setSelectedDealer(dealerInfo.dealer_id)}
                    className={clsx(
                      "relative z-10 cursor-pointer",
                      "p-3 sm:p-4 rounded-lg border-2 transition-colors duration-300",
                      isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Store className={clsx(
                            isMobile ? "w-4 h-4" : "w-5 h-5",
                            "transition-colors duration-300",
                            isSelected 
                              ? "text-primary" 
                              : "text-gray-400 group-hover:text-primary/60"
                          )} />
                          <h4 className={clsx(
                            "font-medium text-gray-900 uppercase", // Исправлено: upercase -> uppercase
                            isMobile ? "text-sm" : "text-base"
                          )}>
                            {dealerInfo?.name || `${trd('dealers.dealer')} #${dealerInfo.dealer_id}`}
                          </h4>
                        </div>
                        
                        {dealerInfo?.address && (
                          <p className={clsx(
                            "text-gray-500 mt-1 truncate",
                            isMobile ? "text-xs pl-6" : "text-sm pl-7"
                          )}>
                            {dealerInfo.address}
                          </p>
                        )}
                        
                        <div className={clsx(
                          "flex items-center mt-1",
                          isMobile ? "pl-6" : "pl-7 mt-2"
                        )}>
                          {hasStock ? (
                            <span className={clsx(
                              "font-medium text-green-600",
                              isMobile ? "text-xs" : "text-sm"
                            )}>
                              {stock} {trd('dealers.inStock')}
                            </span>
                          ) : (
                            <span className={clsx(
                              "font-medium text-amber-600",
                              isMobile ? "text-xs" : "text-sm"
                            )}>
                              {trd('dealers.preOrder')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={clsx(
                        "transition-opacity duration-300",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                      )}>
                        <div className={clsx(
                          "bg-primary rounded-full flex items-center justify-center flex-shrink-0",
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        )}>
                          <Check className={isMobile ? "w-3 h-3 text-white" : "w-4 h-4 text-white"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CarDetailsPage() {
  const { t } = useTranslation(translations);
  const { currentLocale } = useLanguageStore();
  const { id } = useParams();
  const { cars, fetchCars } = useCarsStore();
  const router = useRouter();
  const [selectedMod, setSelectedMod] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTopTab, setActiveTopTab] = useState('configuration');
  const [installmentActions, setInstallmentActions] = useState([]);
  const [installmentConfig, setInstallmentConfig] = useState(null);
  const [isInstallmentAvailable, setIsInstallmentAvailable] = useState(false);
  const [hasRealActions, setHasRealActions] = useState(false); // Новое состояние для отслеживания реальных actions
  
  const [selectedRegionCode, setSelectedRegionCode] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [dealersWithStock, setDealersWithStock] = useState([]);
  const [isLoadingDealers, setIsLoadingDealers] = useState(false);
  const [regionDealers, setRegionDealers] = useState([]);
  
  // Состояние для контроля высоты динамических блоков
  const [colorBlockHeight, setColorBlockHeight] = useState("auto");
  const [modBlockHeight, setModBlockHeight] = useState("auto");
  
  const { dealers, fetchDealers } = useDealersStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const itemsPerPage = 6;
  
  // Используем хуки для состояний контракта, капчи и обработки
  const { 
    isContractFlow, 
    setContractFlow, 
    selectedDealer,
    setSelectedDealer,
    setSelectedColor: setStoreSelectedColor,
    setSelectedMod: setStoreSelectedMod
  } = useContractStore();
  const [carNotFound, setCarNotFound] = useState(false);

// Обновим useEffect для загрузки и проверки существования автомобиля
useEffect(() => {
  const initializeData = async () => {
    setIsLoading(true);
    
    try {
      // Загружаем машины если их еще нет
      if (cars.length === 0) {
        await fetchCars();
      }
      
      // Загружаем дилеров
      await fetchDealers();
      
      // После загрузки проверяем наличие машины
      // Используем setTimeout чтобы дать время стору обновиться
      setTimeout(() => {
        const foundCar = cars.find(c => c.model_id === id);
        if (!foundCar && cars.length > 0) {
          setCarNotFound(true);
        }
        setIsLoading(false);
      }, 100);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };
  
  initializeData();
}, [id]); // Добавляем id в зависимости
  // Функция для вычисления доступности по регионам
  const calculateRegionAvailability = () => {
    if (!selectedMod || !selectedColor) {
      return {};
    }
    
    const result = {};
    
    // Проходим по всем регионам и вычисляем доступность для каждого
    Object.entries(regionMapping).forEach(([regionCode, regionId]) => {
      if (selectedColor.stock_data && Array.isArray(selectedColor.stock_data)) {
        let totalCount = 0;
        const dealerIds = new Set();
        
        // Фильтруем данные для текущего региона
        selectedColor.stock_data.forEach(stockItem => {
          if (stockItem.region_id === regionId) {
            const stockCount = parseInt(stockItem.stock || 0);
            totalCount += stockCount;
            
            if (stockItem.dealer_id && stockCount > 0) {
              dealerIds.add(stockItem.dealer_id);
            }
          }
        });
        
        // Сохраняем информацию о наличии для региона
        result[regionCode] = {
          count: totalCount,
          dealerCount: dealerIds.size,
          hasStock: totalCount > 0,
          dealerDetails: {}
        };
      } else {
        // Если нет данных о наличии, устанавливаем нули
        result[regionCode] = {
          count: 0,
          dealerCount: 0,
          hasStock: false,
          dealerDetails: {}
        };
      }
    });
    
    return result;
  };

  const { setIsOpen: setCaptchaModalOpen } = useCaptchaStore();
  const { isProcessing, submitContract } = useProcessingStore();
  const { isAuthorized, handleAuthRequired } = useAuth();
  
  const car = cars.find((c) => c.model_id === id);
  
  // Маппинг регионов из карты к ID регионов для API
  const regionMapping = useMemo(() => ({
    'UZ-AN': '2', // Андижанская область
    'UZ-BU': '3', // Бухарская область
    'UZ-FA': '12', // Ферганская область
    'UZ-JI': '4', // Джизакская область
    'UZ-NG': '7', // Наманганская область
    'UZ-NW': '6', // Навоийская область
    'UZ-QA': '5', // Кашкадарьинская область
    'UZ-QR': '14', // Каракалпакстан
    'UZ-SA': '8', // Самаркандская область
    'UZ-SI': '10', // Сырдарьинская область
    'UZ-SU': '9', // Сурхандарьинская область
    'UZ-TK': '1', // Ташкент
    'UZ-TO': '11', // Ташкентская область
    'UZ-XO': '13', // Хорезмская область
  }), []);
  
  // Обратное маппинг для получения кода региона по ID
  const reverseRegionMapping = useMemo(() => {
    return Object.entries(regionMapping).reduce(
      (acc, [key, value]) => {
        acc[value] = key.replace('UZ-', '');
        return acc;
      }, 
      {}
    );
  }, [regionMapping]);

  // Получаем ID региона для API из кода региона
  const selectedRegion = useMemo(() => {
    return selectedRegionCode ? regionMapping[selectedRegionCode] || null : null;
  }, [selectedRegionCode, regionMapping]);

  // Подготовка данных для регионов
  const regions = useMemo(() => {
    return Object.entries(regionMapping).map(([key]) => ({
      id: key,
      name: t(`catalog.car.regions.${key.toLowerCase().replace('uz-', '')}`)
    }));
  }, [regionMapping, t]);
  
  // Вычисление доступности по регионам
  const regionAvailability = calculateRegionAvailability();
  
  // Функция для получения перевода платежных терминов
  const tPayment = useCallback((key) => {
    const parts = key.split('.');
    let value = paymentTranslations[currentLocale];
    
    if (!value) return key;
    
    for (const part of parts) {
      if (!value[part]) return key;
      value = value[part];
    }
    
    return value;
  }, [currentLocale]);

  // Функция получения данных доступности
  const fetchAvailabilityData = useCallback(async () => {
    if (!selectedMod) return;
    
    const availabilityData = {
      regions: {}, // Данные по регионам
      dealers: {}  // Данные по дилерам
    };
    
    // Получаем данные о наличии для всех цветов выбранной модификации
    const availabilityPromises = selectedMod.colors.map(async (color) => {
      try {
        // API-запрос для получения данных о наличии для данного цвета
        const response = await axios.get(`https://uzavtosavdo.uz/backendbot/stocks`, {
          params: {
            color: color.color_id,
            mod: selectedMod.modification_id
          }
        });
        
        if (response.data?.status === 'ok' && Array.isArray(response.data.stocks)) {
          // Обрабатываем данные о наличии
          response.data.stocks.forEach(stockItem => {
            if (!stockItem.dealer_id || !stockItem.stock) return;
            
            const dealerId = stockItem.dealer_id;
            const stockCount = parseInt(stockItem.stock, 10) || 0;
            
            // Находим регион для этого дилера
            const dealer = dealers.find(d => d.dealer_id === dealerId);
            if (!dealer) return;
            
            const regionId = dealer.region;
            const regionCode = Object.entries(regionMapping).find(([, id]) => id === regionId)?.[0];
            if (!regionCode) return;
            
            // Добавляем информацию о наличии для региона
            if (!availabilityData.regions[regionCode]) {
              availabilityData.regions[regionCode] = {
                count: 0,
                dealerCount: 0,
                dealerIds: new Set()
              };
            }
            
            availabilityData.regions[regionCode].count += stockCount;
            availabilityData.regions[regionCode].dealerIds.add(dealerId);
            
            // Добавляем информацию о наличии для дилера
            if (!availabilityData.dealers[dealerId]) {
              availabilityData.dealers[dealerId] = {
                stock_count: 0,
                region: regionId,
                regionCode
              };
            }
            
            availabilityData.dealers[dealerId].stock_count += stockCount;
          });
        }
      } catch (error) {
        console.error('Error fetching availability data:', error);
      }
    });
    
    // Ждем завершения всех запросов
    await Promise.all(availabilityPromises);
    
    // Завершаем обработку данных о регионах
    Object.keys(availabilityData.regions).forEach(regionCode => {
      availabilityData.regions[regionCode].dealerCount = 
        availabilityData.regions[regionCode].dealerIds.size;
      delete availabilityData.regions[regionCode].dealerIds; // Удаляем ненужное поле
    });
    
    return availabilityData;
  }, [selectedMod, dealers, regionMapping]);

  // Функция для получения перевода текстов региона и дилеров
  const tRegionDealer = useCallback((key, params = {}) => {
    const parts = key.split('.');
    let value = regionDealerTranslations[currentLocale];
    
    if (!value) return key;
    
    for (const part of parts) {
      if (!value[part]) return key;
      value = value[part];
    }
    
    // Обработка параметров для подстановки
    let result = value;
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([param, replacement]) => {
        result = result.replace(`{${param}}`, replacement);
      });
    }
    
    return result;
  }, [currentLocale]);

  // Получаем перевод единиц измерения в зависимости от текущего языка
  const getUnit = useCallback((unitType) => {
    return unitTranslations[currentLocale]?.[unitType] || 
           unitTranslations.ru[unitType];
  }, [currentLocale]);
  
  const getImageUrl = useCallback((sha, width = 400, height = 400) => {
    if (!sha) return '';
    return `https://uzavtosavdo.uz/b/core/m$load_image?sha=${sha}&width=${width}&height=${height}`;
  }, []);
  
  // Улучшенная функция проверки доступности рассрочки
  const checkInstallmentAvailability = useCallback((mod, parentCar) => {
    // Если нет модификации, сразу возвращаем false
    if (!mod) {
      console.log('No mod provided for installment check');
      return false;
    }
    
    console.log('Checking installment availability for mod:', mod.modification_id);
    
    // Простая проверка - если есть массив actions (любой), считаем рассрочку доступной
    const hasModActions = mod.actions && Array.isArray(mod.actions) && mod.actions.length > 0;
    const hasCarActions = parentCar && parentCar.actions && Array.isArray(parentCar.actions) && parentCar.actions.length > 0;
    
    // Если есть actions хоть где-то, считаем рассрочку доступной
    return hasModActions || hasCarActions;
  }, []);

  // Улучшенная функция обновления данных о рассрочке
  const updateInstallmentData = useCallback((mod, parentCar, isAvailable) => {
    console.log('Updating installment data:', { mod: mod?.modification_id, isAvailable });
    
    // Проверяем наличие actions и их корректность у модификации
    const hasValidModActions = mod.actions && Array.isArray(mod.actions) && mod.actions.length > 0 && 
      mod.actions.some(action => 
        action.price && 
        action.payment_months && 
        action.prepayment_amount && 
        action.prepayment_percent
      );
    
    // Проверяем наличие actions и их корректность у автомобиля
    const hasValidCarActions = parentCar && parentCar.actions && Array.isArray(parentCar.actions) && 
      parentCar.actions.length > 0 && 
      parentCar.actions.some(action => 
        action.price && 
        action.payment_months && 
        action.prepayment_amount && 
        action.prepayment_percent
      );
    
    // Если у нас нет валидных actions, устанавливаем пустой массив
    if (!hasValidModActions && !hasValidCarActions) {
      console.log('No valid actions found, setting empty array');
      setInstallmentActions([]);
      return;
    }
    
    // Если рассрочка недоступна, устанавливаем пустой массив
    if (!isAvailable) {
      console.log('Installment not available, setting empty array');
      setInstallmentActions([]);
      return;
    }
    
    // Используем действия модификации, если они есть и валидны
    if (hasValidModActions) {
      // Фильтруем только валидные действия
      const validActions = mod.actions.filter(action => 
        action.price && 
        action.payment_months && 
        action.prepayment_amount && 
        action.prepayment_percent
      );
      
      console.log('Setting installment actions from mod:', validActions);
      setInstallmentActions(validActions);
    } 
    // Если у модификации нет валидных actions, но они есть у автомобиля
    else if (hasValidCarActions) {
      // Фильтруем только валидные действия, подходящие по цене
      const validActions = parentCar.actions.filter(action => {
        if (!action.price || !action.payment_months || !action.prepayment_amount || !action.prepayment_percent) {
          return false;
        }
        
        // Проверяем соответствие цены
        const actionPrice = parseInt(action.price);
        const modPrice = parseInt(mod.price);
        return Math.abs(actionPrice - modPrice) < 1000000;
      });
      
      if (validActions.length > 0) {
        console.log('Setting installment actions from car:', validActions);
        setInstallmentActions(validActions);
      } else {
        // Если не нашли подходящих действий среди автомобиля, используем пустой массив
        console.log('No matching car actions, setting empty array');
        setInstallmentActions([]);
      }
    } else {
      // На всякий случай
      console.log('No actions found, using empty array');
      setInstallmentActions([]);
    }
  }, []);

  const calculateTotalStock = useCallback((stockData) => {
    if (!stockData) return 0;
    return stockData.reduce((sum, item) => sum + parseInt(String(item.stock || 0)), 0);
  }, []);

  // Измерение высоты блоков для плавных анимаций
  useEffect(() => {
    if (selectedMod) {
      const modElement = document.getElementById('modifications-list');
      if (modElement) {
        setModBlockHeight(`${modElement.scrollHeight}px`);
      }
    }
  }, [selectedMod]);

  useEffect(() => {
    if (selectedColor) {
      const colorGrid = document.getElementById('colors-grid');
      if (colorGrid) {
        setColorBlockHeight(`${colorGrid.scrollHeight}px`);
      }
    }
  }, [selectedColor, currentPage]);

  const loadDealersForRegion = useCallback(async (modificationId, colorId, regionId) => {
    if (!modificationId || !colorId || !regionId || !dealers.length) {
      return;
    }
    
    setIsLoadingDealers(true);
    
    try {
      // Находим соответствующий код региона для данного ID
      const regionCode = Object.entries(regionMapping).find(
        ([, id]) => id === regionId
      )?.[0];
      
      // Получаем всех дилеров в выбранном регионе
      const allRegionDealers = dealers.filter(dealer => dealer.region === regionId);
      setRegionDealers(allRegionDealers);
      
      // Получаем информацию о наличии через API
      const dealersData = await fetchDealersWithStock(
        modificationId,
        colorId,
        dealers,
        regionId
      );
      
      // Важно: не применяем фильтр здесь, чтобы сохранить информацию о всех дилерах
      setDealersWithStock(dealersData);
      
    } catch (error) {
      console.error('Error fetching dealers data:', error);
      setDealersWithStock([]);
    } finally {
      setTimeout(() => {
        setIsLoadingDealers(false);
      }, 500);
    }
  }, [dealers, regionMapping, fetchDealersWithStock]);

  // Обработчик выбора региона
  const handleRegionSelect = useCallback((regionCode) => {
    setIsLoadingMap(true);
    setSelectedRegionCode(regionCode);
    
    // Сбрасываем выбранного дилера при смене региона
    setSelectedDealer(null);
    
    // Добавляем небольшую задержку для анимации
    setTimeout(() => {
      setIsLoadingMap(false);
    }, 500);
  }, [setSelectedDealer]);

  // Загрузка данных при инициализации
  useEffect(() => {
    if (!cars.length) {
      fetchCars().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    
    // Загружаем список дилеров
    fetchDealers();

    // Восстанавливаем ранее выбранные данные из localStorage
    const savedDealer = localStorage.getItem('selected_dealer_id');
    if (savedDealer) {
      setSelectedDealer(savedDealer);
    }

  }, [cars.length, fetchCars, fetchDealers, setSelectedDealer]);

  // При выборе региона загружаем дилеров
  useEffect(() => {
    if (selectedRegion && selectedMod && selectedColor) {
      loadDealersForRegion(
        selectedMod.modification_id,
        selectedColor.color_id,
        selectedRegion
      );
    }
  }, [selectedRegion, selectedMod, selectedColor, loadDealersForRegion]);

  // Эффект для обновления состояния isInstallmentAvailable и активной вкладки
  useEffect(() => {
    if (selectedMod && car) {
      const installmentAvailable = checkInstallmentAvailability(selectedMod, car);
      console.log('Installment available for', selectedMod.modification_id, ':', installmentAvailable);
      setIsInstallmentAvailable(installmentAvailable);
      
      // Обновляем данные о рассрочке
      updateInstallmentData(selectedMod, car, installmentAvailable);
      
      // Отладочный вывод
      console.log('Selected mod actions:', selectedMod.actions);
      console.log('Car actions:', car.actions);
    }
  }, [selectedMod, car, checkInstallmentAvailability, updateInstallmentData]);

  // Получение данных машины и установка выбранных значений
  useEffect(() => {
    if (car) {
      // Проверка на наличие модификаций
      if (!car.modifications || !Array.isArray(car.modifications) || car.modifications.length === 0) {
        console.error('No modifications found for car:', car.model_id);
        setIsLoading(false);
        return;
      }
      
      const savedModId = localStorage.getItem('selected_modification');
      let firstMod = car.modifications[0];
      
      // Если был сохранен выбор модификации, используем его
      if (savedModId) {
        const foundMod = car.modifications.find(mod => mod.modification_id === savedModId);
        if (foundMod) {
          firstMod = foundMod;
        }
      }
      
      console.log('Selected modification:', firstMod.modification_id);
      setSelectedMod(firstMod);
      // Делаем доступным в глобальном контексте для расчета доступности
      window.selectedMod = firstMod;
      
      // Проверяем наличие цветов
      if (!firstMod.colors || !Array.isArray(firstMod.colors) || firstMod.colors.length === 0) {
        console.error('No colors found for modification:', firstMod.modification_id);
        setIsLoading(false);
        return;
      }
      
      // Проверяем сохраненный выбор цвета
      const savedColorId = localStorage.getItem('selected_color');
      let selectedColorObj = firstMod.colors[0];
      
      if (savedColorId) {
        const foundColor = firstMod.colors.find(color => color.color_id === savedColorId);
        if (foundColor) {
          selectedColorObj = foundColor;
        }
      }
      
      setSelectedColor(selectedColorObj);
      
      // Проверяем доступность рассрочки с подробным логированием
      console.log('Checking installment availability...');
      const installmentAvailable = checkInstallmentAvailability(firstMod, car);
      console.log('Installment available:', installmentAvailable);
      setIsInstallmentAvailable(installmentAvailable);
      
      // Обновляем данные о рассрочке
      updateInstallmentData(firstMod, car, installmentAvailable);
    }
  }, [car, checkInstallmentAvailability, updateInstallmentData]);

// Заменим в файле src/app/cars/[id]/default.jsx

// Создадим один эффект для обработки изменений модификации
useEffect(() => {
  if (!selectedMod || !car) return;
  
  console.log('EFFECT: ModificationChange', {
    modId: selectedMod.modification_id,
    modActionsLength: selectedMod.actions?.length,
    carActionsLength: car.actions?.length
  });
  
  // Шаг 1: Проверяем доступность рассрочки
  const installmentAvailable = checkInstallmentAvailability(selectedMod, car);
  console.log('Installment check result:', installmentAvailable);
  
  // Шаг 2: Обновляем состояние доступности
  setIsInstallmentAvailable(installmentAvailable);
  
  // Шаг 3: Если рассрочка доступна, подготавливаем и устанавливаем действия
  if (installmentAvailable) {
    // Глубокая проверка и получение валидных действий
    const validModActions = selectedMod.actions && Array.isArray(selectedMod.actions) 
      ? selectedMod.actions.filter(action => 
          action && 
          action.price && 
          action.payment_months && 
          action.prepayment_amount && 
          action.prepayment_percent
        )
      : [];
      
    const validCarActions = car.actions && Array.isArray(car.actions)
      ? car.actions.filter(action => {
          if (!action || !action.price || !action.payment_months || 
              !action.prepayment_amount || !action.prepayment_percent) {
            return false;
          }
          
          // Проверяем соответствие цены модификации
          const actionPrice = parseInt(action.price);
          const modPrice = parseInt(selectedMod.price);
          return Math.abs(actionPrice - modPrice) < 1000000;
        })
      : [];
    
    console.log('Valid actions found:', {
      modActions: validModActions.length,
      carActions: validCarActions.length
    });
    
    // Используем либо действия модификации, либо действия автомобиля
    const actionsToUse = validModActions.length > 0 
      ? validModActions 
      : validCarActions;
    
    // Устанавливаем действия только если они действительно есть
    if (actionsToUse.length > 0) {
      console.log('Setting installment actions:', actionsToUse);
      setInstallmentActions(actionsToUse);
      setHasRealActions(true);
    } else {
      console.log('No valid actions found, clearing installment data');
      setInstallmentActions([]);
      setHasRealActions(false);
    }
  } else {
    // Если рассрочка недоступна, очищаем действия
    console.log('Installment not available, clearing actions');
    setInstallmentActions([]);
    setHasRealActions(false);
  }
  
  // Шаг 4: Если нет вкладки конфигурации и рассрочка недоступна, переключаемся на конфигурацию
  if (activeTopTab === 'installment' && !installmentAvailable) {
    console.log('Auto-switching to configuration tab because installment is not available');
    setActiveTopTab('configuration');
  }
}, [selectedMod, car, checkInstallmentAvailability, activeTopTab]);

const handleModificationSelect = useCallback((mod) => {
  const oldModHeight = modBlockHeight;
  
  // Устанавливаем новую модификацию
  setSelectedMod(mod);
  // Обновляем глобальную ссылку для расчета доступности
  window.selectedMod = mod;
  
  // Получаем первый цвет новой модификации
  const firstColor = mod.colors[0];
  
  // ВАЖНО: Сначала проверяем доступность рассрочки и обновляем данные о рассрочке
  // ПЕРЕД тем, как менять цвет
  const installmentAvailable = checkInstallmentAvailability(mod, car);
  console.log('New mod installment available:', installmentAvailable);
  setIsInstallmentAvailable(installmentAvailable);
  
  // Обновляем данные о рассрочке при смене модификации
  updateInstallmentData(mod, car, installmentAvailable);
  
  // ТОЛЬКО ПОСЛЕ обновления данных о рассрочке меняем цвет
  setSelectedColor(firstColor);
  
  // Обновляем состояние в store
  setStoreSelectedMod(mod);
  setStoreSelectedColor(firstColor);
  
  // Сохраняем выбор в localStorage
  localStorage.setItem('selected_modification', mod.modification_id);
  localStorage.setItem('selected_color', firstColor.color_id);
  
  // Если есть выбранный регион, обновляем список дилеров
  if (selectedRegion) {
    loadDealersForRegion(mod.modification_id, firstColor.color_id, selectedRegion);
  }
  
  // Устанавливаем новую высоту с задержкой для анимации
  setTimeout(() => {
    const modElement = document.getElementById('modifications-list');
    if (modElement) {
      setModBlockHeight(`${modElement.scrollHeight}px`);
    }
  }, 100);
  
  // Сбрасываем страницу цветов при смене модификации
  setCurrentPage(1);
}, [car, checkInstallmentAvailability, loadDealersForRegion, modBlockHeight, selectedRegion, setStoreSelectedColor, setStoreSelectedMod, updateInstallmentData]);

  // Обработчик оформления заказа с показом капчи и обработкой
  const handleOrder = useCallback(async () => {
    // Проверяем авторизацию
    const isAuth = await handleAuthRequired();
    if (!isAuth) {
      return;
    }
    
    // Сохраняем выбранные данные в localStorage
    localStorage.setItem('selected_modification', selectedMod.modification_id);
    localStorage.setItem('selected_color', selectedColor?.color_id || '');
    
    // Работа с данными о рассрочке
    if (activeTopTab === 'installment' && installmentConfig) {
      localStorage.setItem('payment_type', 'installment');
      
      // Сохраняем детали рассрочки
      if (installmentConfig.actionId) {
        localStorage.setItem('installment_action_id', installmentConfig.actionId);
      }
      // Всегда сохраняем основные параметры рассрочки
      localStorage.setItem('installment_period', installmentConfig.period.toString());
      localStorage.setItem('installment_down_payment', Math.round(installmentConfig.downPayment).toString());
      localStorage.setItem('installment_monthly_payment', Math.round(installmentConfig.monthlyPayment).toString());
      localStorage.setItem('installment_total_payment', Math.round(installmentConfig.totalPayment).toString());
      localStorage.setItem('installment_price', Math.round(installmentConfig.installmentPrice).toString());
    } else {
      localStorage.setItem('payment_type', 'cash');
    }
    
    if (selectedDealer) {
      localStorage.setItem('selected_dealer_id', selectedDealer);
    }
    
    // Устанавливаем состояние контракта
    setContractFlow(true, car.model_id);
    
    // Открываем модальное окно с капчей
    if (activeTopTab === 'installment') {
      // В режиме рассрочки открываем капчу сразу, без требования выбора дилера
      setCaptchaModalOpen(true);
    } else if (selectedDealer) {
      setCaptchaModalOpen(true);
    } else {
      // Если дилер не выбран в режиме конфигурации, переходим к списку дилеров
      router.push('/dealers');
    }
  }, [
    selectedDealer, 
    selectedMod, 
    selectedColor, 
    activeTopTab, 
    installmentConfig, 
    car, 
    setContractFlow, 
    router, 
    handleAuthRequired, 
    setCaptchaModalOpen
  ]);

  // Обработчик переключения на вкладку рассрочки
  const handleTabChange = useCallback((tab) => {
    console.log('Switching to tab:', tab);
    setActiveTopTab(tab);
  }, []);

  const totalPages = Math.ceil((selectedMod?.colors?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentColors = selectedMod?.colors?.slice(startIndex, endIndex).map(color => {
    const totalAvailable = calculateTotalStock(color.stock_data);
    return {
      ...color,
      totalAvailable
    };
  }) || [];

// Рендеринг при загрузке
if (isLoading) {
  return (
    <div className="min-h-screen bg-gray-50 pt-[80px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-gray-500">{t('cars.loading')}</p>
      </div>
    </div>
  );
}

// Проверка на несуществующую машину
if (carNotFound || (!isLoading && cars.length > 0 && !car)) {
  return (
    <div className="min-h-screen bg-gray-50 pt-[120px]">
      <div className="container-fluid py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto "
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Иллюстрация */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-12 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6"
              >
                <Car className="w-12 h-12 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {currentLocale === 'ru' ? 'Автомобиль не найден' : 'Avtomobil topilmadi'}
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {currentLocale === 'ru' 
                  ? `Автомобиль с ID "${id}" не существует в нашем каталоге` 
                  : `"${id}" ID li avtomobil katalogimizda mavjud emas`}
              </p>
            </div>
            
            {/* Контент */}
            <div className="p-8">
              {/* Информационный блок */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-2">
                      {currentLocale === 'ru' ? 'Возможные причины:' : 'Mumkin bo\'lgan sabablar:'}
                    </p>
                    <ul className="text-amber-700 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        <span>
                          {currentLocale === 'ru' 
                            ? 'Неверный ID автомобиля' 
                            : 'Noto\'g\'ri avtomobil ID si'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        <span>
                          {currentLocale === 'ru' 
                            ? 'Модель была удалена из каталога' 
                            : 'Model katalogdan olib tashlangan'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        <span>
                          {currentLocale === 'ru' 
                            ? 'Опечатка в адресе страницы' 
                            : 'Sahifa manzilida xatolik'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Кнопки действий */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  {currentLocale === 'ru' 
                    ? 'Выберите автомобиль из нашего актуального каталога' 
                    : 'Bizning dolzarb katalogimizdan avtomobil tanlang'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/#cars"
                    className={clsx(
                      "inline-flex items-center justify-center gap-2",
                      "px-6 py-3 rounded-xl",
                      "bg-primary text-white font-medium",
                      "hover:bg-primary/90 transition-all",
                      "hover:shadow-lg hover:shadow-primary/20",
                      "transform hover:-translate-y-0.5"
                    )}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>
                      {currentLocale === 'ru' ? 'Перейти к каталогу' : 'Katalogga o\'tish'}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
  
const carId = String(car.model_id); // убеждаемся, что ID — это строка
const link = carModels[currentLocale]?.[carId];

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      {isProcessing && <ContractProcessing />}
      <div className="container-fluid">
        <div className="py-4">
          <Link 
            href="/#cars" 
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t('cars.back')}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 py-8">
          {/* Мобильный заголовок */}
          <div className="lg:hidden">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{car.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{t('cars.title')}</p>
          </div>
          
          {/* Левая колонка - изображение и характеристики */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <motion.div 
                layout
                className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedColor?.color_id || 'default'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={selectedColor?.photo_sha666 || car.photo_sha666}
                      alt={car.name}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
            
            <motion.div 
              layout
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Заголовок и описание */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 uppercase">{car.name} {selectedMod.name}</h3>
              {/* <p className="text-gray-600 mb-6">{carModelsDesc[currentLocale][car.name]}</p> */}

              {/* Характеристики */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div layout className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">{t('cars.specs.power')}</span>
                  <motion.span 
                    layout
                    key={`power-${selectedMod.horsepower}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {selectedMod.horsepower} {getUnit('powerUnit')}
                  </motion.span>
                </motion.div>
                <motion.div layout className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">{t('cars.specs.acceleration')}</span>
                  <motion.span 
                    layout
                    key={`accel-${selectedMod.acceleration}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {selectedMod.acceleration} {getUnit('secondUnit')}
                  </motion.span>
                </motion.div>
                <motion.div layout className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">{t('cars.specs.fuel')} </span>
                  <motion.span 
                    layout
                    key={`fuel-${selectedMod.fuel_consumption}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {selectedMod.fuel_consumption} { t('cars.specs.fuel2')}
                  </motion.span>
                </motion.div>
                <motion.div layout className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-sm text-gray-500 block mb-1">{t('cars.specs.transmission')}</span>
                  <motion.span 
                    layout
                    key={`trans-${selectedMod.transmission}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {selectedMod.transmission}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Блок скачивания документов */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/50 rounded-xl">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('cars.features.title')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{t('cars.features.description')}</p>
                    </div>
                  </div>
                  
                  <Link
                   href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-primary text-white rounded-xl flex items-center gap-2 transition-all hover:bg-primary/90 hover:shadow-lg group"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    <span>{t('cars.features.download')}</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Блок с особенностями комплектации (только для десктопа) */}
            {selectedMod.options_obj?.length > 0 && selectedMod.options_obj[0].name && (
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t('cars.features.title')}
                    </h3>
                  </div>
                  <div className="p-5">
                    <FeaturesSlider 
                      options={selectedMod.options_obj}
                      defaultImage={getImageUrl(selectedColor?.photo_sha)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Правая колонка - конфигурация и рассрочка */}
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
              <p className="text-lg text-gray-600">{t('cars.title')}</p>
            </div>

            {/* Основной блок с табами */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Табы верхнего уровня */}
              <div className="flex border-b">
                <button
                  onClick={() => handleTabChange('configuration')}
                  className={clsx(
                    "flex-1 py-4 relative transition-all",
                    activeTopTab === 'configuration' 
                      ? "text-primary font-medium" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Car className="w-6 h-6" />
                    <span>{t('cars.tabs.configuration')}</span>
                  </div>
                  {activeTopTab === 'configuration' && (
                    <motion.div 
                      layoutId="activeTopTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary" 
                    />
                  )}
                </button>
                
                {/* Показываем вкладку рассрочки независимо от доступности для диагностики */}
                <button
                  onClick={() => handleTabChange('installment')}
                  disabled={!isInstallmentAvailable}
                  className={clsx(
                    "flex-1 py-4 relative transition-all",
                    !isInstallmentAvailable && "opacity-50 cursor-not-allowed",
                    activeTopTab === 'installment' 
                      ? "text-primary font-medium" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span>{tPayment('payment.installment')}</span>
                  </div>
                  {activeTopTab === 'installment' && (
                    <motion.div 
                      layoutId="activeTopTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary" 
                    />
                  )}
                  
                  {!isInstallmentAvailable && (
                    <div className="absolute -top-1 -right-1 bg-yellow-100 rounded-full p-0.5">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                </button>
              </div>
              
              {/* Содержимое табов верхнего уровня */}
              <AnimatePresence mode="wait">
                {activeTopTab === 'configuration' ? (
                 <motion.div
                    key="configuration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Блок выбора модификации */}
                    <div className="border-b border-gray-100">
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {t('cars.modification')}
                          </h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const container = document.getElementById('modifications-list');
                                container?.scrollBy({ top: -160, behavior: 'smooth' });
                              }}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              aria-label="Scroll up"
                            >
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                              onClick={() => {
                                const container = document.getElementById('modifications-list');
                                container?.scrollBy({ top: 160, behavior: 'smooth' });
                              }}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              aria-label="Scroll down"
                            >
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <motion.div 
                        id="modifications-list"
                        layout
                        transition={{ duration: 0.3 }}
                        className="max-h-[280px] overflow-y-auto custom-scrollbar p-5 space-y-3"
                        style={{ height: modBlockHeight, minHeight: "100px" }}
                      >
                        {car.modifications.map((mod) => (
                          <ModificationButton
                            key={mod.modification_id}
                            mod={mod}
                            isSelected={selectedMod.modification_id === mod.modification_id}
                            onClick={() => handleModificationSelect(mod)}
                            price={mod.price}
                            locale={currentLocale}
                          />
                        ))}
                      </motion.div>
                    </div>
                    
                    {/* Блок выбора цвета */}
                    <motion.div layout>
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{t('cars.color')}</h3>
                          {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <PaginationButton
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                direction="prev"
                              />
                              <span className="text-sm text-gray-600">
                                {currentPage} / {totalPages}
                              </span>
                              <PaginationButton
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                direction="next"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.div 
                        layout
                        id="colors-grid"
                        className="p-5"
                        style={{ minHeight: "120px" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                          <AnimatePresence initial={false} mode="wait">
                            <motion.div 
                              key={`color-grid-${currentPage}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="grid grid-cols-5 sm:grid-cols-6 gap-3 col-span-full"
                            >
                              {currentColors.map((color) => (
                                <ColorButton
                                  key={color.color_id}
                                  color={color}
                                  isSelected={selectedColor?.color_id === color.color_id}
                                  onClick={() => {
                                    setSelectedColor(color);
                                    setStoreSelectedColor(color);
                                    localStorage.setItem('selected_color', color.color_id);
                                    
                                    // Если есть выбранный регион, обновляем только список дилеров
                                    // Но НЕ обновляем данные о рассрочке
                                    if (selectedRegion) {
                                      loadDealersForRegion(
                                        selectedMod.modification_id,
                                        color.color_id,
                                        selectedRegion
                                      );
                                    }
                                  }}
                                />
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <motion.div 
                          layout 
                          className="mt-4 px-3 py-2 bg-gray-50 rounded-lg w-fit"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-sm text-gray-700">{selectedColor?.name}</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="installment"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5">
                      <InstallmentCalculator 
                        price={parseInt(selectedMod.price)}
                        tPayment={tPayment}
                        installmentActions={installmentActions}
                        onInstallmentConfigured={(config) => {
                          console.log('Installment config updated:', config);
                          setInstallmentConfig(config);
                        }}
                        currentLocale={currentLocale}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Блок выбора региона и дилера - показываем только для конфигурации */}
            {activeTopTab === 'configuration' && (
              <motion.div 
                layout
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tRegionDealer('buttons.selectRegionAndDealer')}
                    </h3>
                    {selectedRegionCode && (
                      <button
                        onClick={() => setSelectedRegionCode(null)}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        {tRegionDealer('region.changeRegion')}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    {!selectedRegionCode ? (
                      // Если регион не выбран, показываем селектор региона с табами
                      <motion.div
                        key="region-selector"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RegionSelectorTabs 
                          regions={regions}
                          selectedRegionCode={selectedRegionCode}
                          handleRegionSelect={handleRegionSelect}
                          trd={tRegionDealer}
                          isLoadingMap={isLoadingMap}
                          isMobile={isMobile}
                          t={t}
                          currentLocale={currentLocale}
                          regionAvailability={regionAvailability}
                        />
                      </motion.div>
                    ) : (
                      // Если регион выбран, показываем его название и список дилеров
                      <motion.div
                        key="dealer-selector"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <DealersList 
                            dealersWithStock={dealersWithStock}
                            allDealers={regionDealers}
                            isLoading={isLoadingDealers}
                            selectedDealer={selectedDealer}
                            setSelectedDealer={setSelectedDealer}
                            isMobile={isMobile}
                            trd={tRegionDealer}
                            regionAvailability={regionAvailability}
                            selectedRegionCode={selectedRegionCode}
                            regionMapping={regionMapping}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
           
            {/* Информация о наличии - показываем только для конфигурации */}
            {activeTopTab === 'configuration' && (
              <motion.div 
                layout
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('cars.availability.title')}
                  </h3>
                </div>
                
                <div className="p-5 space-y-3">
                  <AnimatePresence mode="wait">
                    {selectedColor && (
                      <motion.div
                        key={`availability-${selectedColor.color_id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{t('cars.availability.status')}</span>
                          <span className={clsx(
                            "font-medium px-3 py-1 rounded-full text-sm",
                            calculateTotalStock(selectedColor.stock_data) > 0 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          )}>
                            {calculateTotalStock(selectedColor.stock_data) > 0 
                              ? t('cars.availability.inStock', { count: calculateTotalStock(selectedColor.stock_data) })
                              : t('cars.availability.inQueue')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{t('cars.availability.deliveryDate')}</span>
                          <span className="font-medium">
                            {selectedColor.expect_date || t('cars.availability.noData')}
                          </span>
                        </div>
                        {calculateTotalStock(selectedColor.stock_data) === 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t('cars.availability.queuePosition')}</span>
                            <span className="font-medium">
                              #{selectedColor.queue_no || t('cars.availability.noData')}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Сообщение о недоступности рассрочки */}
            <AnimatePresence>
              {!isInstallmentAvailable && activeTopTab === 'installment' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700">
                        {tPayment('payment.installmentNotAvailable')}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        {tPayment('payment.chooseAnotherModification')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Динамическая кнопка с подсказками */}
      {activeTopTab === 'configuration' && (
  <motion.button
    layout
    onClick={selectedRegionCode && selectedDealer ? handleOrder : null}
    className={clsx(
      "w-full py-4 px-6",
      "rounded-xl text-lg font-medium text-center",
      "transition-all duration-300",
      "flex items-center justify-center gap-2",
      selectedRegionCode && selectedDealer
        ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:transform active:scale-[0.98]"
        : "bg-gray-100 text-gray-500 cursor-default"
    )}
    disabled={isProcessing || !selectedRegionCode || !selectedDealer}
    whileHover={selectedRegionCode && selectedDealer ? { scale: 1.02 } : {}}
    whileTap={selectedRegionCode && selectedDealer ? { scale: 0.98 } : {}}
  >
    {isProcessing ? (
      <>
        <Loader className="w-5 h-5 animate-spin" />
        {tRegionDealer('buttons.processing')}
      </>
    ) : !selectedRegionCode ? (
      <>
        <MapPin className="w-5 h-5" />
        {tRegionDealer('buttons.selectRegion')}
      </>
    ) : !selectedDealer ? (
      <>
        <Store className="w-5 h-5" />
        {tRegionDealer('buttons.selectDealer')}
      </>
    ) : (
      <>
        <FileText className="w-5 h-5" />
        {t('cars.getContract')}
      </>
    )}
  </motion.button>
)}
          </div>

          {/* Блок с особенностями комплектации (мобильная версия) */}
          {selectedMod.options_obj?.length > 0 && selectedMod.options_obj[0].name && (
            <div className="col-span-full lg:hidden mt-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('cars.features.title')}
                  </h3>
                </div>
                <div className="p-5">
                  <FeaturesSlider 
                    options={selectedMod.options_obj}
                    defaultImage={getImageUrl(selectedColor?.photo_sha)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Стили для исправления z-index */
        [role="listbox"],
        [role="menu"] {
          z-index: 50 !important;
        }
        
        .headlessui-popover {
          z-index: 100 !important;
        }
      `}</style>
    </div>
  );
}