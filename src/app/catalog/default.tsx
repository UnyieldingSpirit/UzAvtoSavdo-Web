'use client';

import { useState, useEffect } from 'react';
import { useCarsStore } from '@/store/models-cars';
import { motion } from 'framer-motion';
import { MapPin, Car, Check, AlertTriangle, Settings, Palette, Store, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { Car as CarType, CarModification, CarColor } from '@/store/models-cars';
import type { StockData as ModelStockData } from '@/store/models-cars';
import { useTranslation } from '@/hooks/useTranslation';
import { translations } from './catalog.localization';
import { UzbekistanMap } from '@/components/shared/UzbekistanMap';
import { RegionSelector } from '@/components/sections/RegionSelector';
import { fetchDealersWithStock } from '@/api/dealers';
import { useDealersStore } from '@/store/dealers';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface DealerStock {
  dealer_id: string;
  stock_count: number;
}

interface DealersMap {
  [key: string]: DealerStock[];
}

export default function CatalogPage() {
  const { t } = useTranslation(translations);
  const { cars, isLoading, fetchCars } = useCarsStore();
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<{[key: string]: string}>({});
  const [selectedMods, setSelectedMods] = useState<{[key: string]: string}>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [dealersWithStock, setDealersWithStock] = useState<DealersMap>({});
  const [isLoadingDealers, setIsLoadingDealers] = useState<{[key: string]: boolean}>({});
  const { dealers, fetchDealers } = useDealersStore();
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [showMap, setShowMap] = useState(true); // Состояние для отображения/скрытия карты
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Маппинг регионов из карты к ID регионов для API
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


  // Получаем ID региона для API из кода региона
  const selectedRegion = selectedRegionCode 
    ? regionMapping[selectedRegionCode as keyof typeof regionMapping] || null 
    : null;

  // Подготовка данных для регионов
  const regions = Object.entries(regionMapping).map(([key]) => ({
    id: key,
    name: t(`catalog.car.regions.${key.toLowerCase().replace('uz-', '')}`)
  }));

  useEffect(() => {
    fetchCars();
    fetchDealers();
  }, [fetchCars, fetchDealers]);

  useEffect(() => {
    if (selectedRegion) {
      setShowMap(false); // Скрываем карту после выбора региона
    }
  }, [selectedRegion]);

  // Удаляем любые эффекты, блокирующие скролл
  useEffect(() => {
    // Гарантируем, что скролл никогда не блокируется
    document.body.style.overflow = 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getColorAvailability = (color: CarColor, regionId: string | null): number => {
    if (!regionId || !color.stock_data) return 0;
    const stockData = color.stock_data.find(
      (data: ModelStockData) => data.region_id === regionId
    );
    return stockData ? parseInt(String(stockData.stock)) : 0;
  };

  const getTotalAvailability = (car: CarType, regionId: string | null): number => {
    if (!regionId) return 0;
    const selectedMod = getSelectedModification(car);
    return selectedMod.colors.reduce((total: number, color: CarColor) => {
      return total + getColorAvailability(color, regionId);
    }, 0);
  };

  const getSelectedModification = (car: CarType): CarModification => {
    const selectedModId = selectedMods[car.model_id];
    return car.modifications.find((mod: CarModification) => mod.modification_id === selectedModId) 
      || car.modifications[0];
  };

  // Получение названия выбранного региона
  const getSelectedRegionName = () => {
    if (!selectedRegionCode) return '';
    
    // Преобразуем UZ-XX в формат для поиска в локализации
    const regionKey = selectedRegionCode.toLowerCase().replace('uz-', '');
    return t(`catalog.car.regions.${regionKey}`);
  };

  // Универсальный обработчик выбора региона, используемый для обоих компонентов
  const handleRegionSelect = (regionCode: string) => {
    setIsLoadingMap(true);
    setSelectedRegionCode(regionCode);
    setIsLoadingMap(false);
  };

  const updateDealersStock = async (car: CarType, modificationId: string, colorId: string) => {
    if (!selectedRegion) return;
   
    setIsLoadingDealers(prev => ({...prev, [car.model_id]: true}));
   
    try {
      const dealersData = await fetchDealersWithStock(
        modificationId,
        colorId,
        dealers,
        selectedRegion
      );
      setDealersWithStock(prev => ({
        ...prev,
        [car.model_id]: dealersData
      }));
    } catch (error) {
      console.error('Error fetching dealers stock:', error);
    } finally {
      setIsLoadingDealers(prev => ({...prev, [car.model_id]: false}));
    }
  };

  useEffect(() => {
    if (selectedRegion) {
      cars.forEach(car => {
        const mod = getSelectedModification(car);
        const colorId = selectedColors[car.model_id] || mod.colors[0]?.color_id;
        if (mod && colorId) {
          updateDealersStock(car, mod.modification_id, colorId);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, cars]);

  const MobileDealersList = ({ carId }: { carId: string }) => {
    const dealersData = dealersWithStock[carId] || [];
    const isLoading = isLoadingDealers[carId];
    
    if (isLoading) {
      return (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!dealersData.length) {
      return (
        <div className="text-center py-2 text-gray-500 text-sm">
          {t('catalog.dealers.noStockDealers')}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="w-full px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>{t('catalog.dealers.withStock')} ({dealersData.length})</span>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          {dealersData.map((dealer) => {
            const dealerInfo = dealers.find(d => d.dealer_id === dealer.dealer_id);
            
            return (
              <div 
                key={dealer.dealer_id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {dealerInfo?.name || `${t('catalog.dealers.dealer')} #${dealer.dealer_id}`}
                  </div>
                  {dealerInfo?.address && (
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {dealerInfo.address}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  <span className="text-sm font-medium text-primary">{dealer.stock_count}</span>
                  <span className="text-xs text-gray-500">{t('catalog.dealers.inStock')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DealersList = ({ carId }: { carId: string }) => {
    const dealersData = dealersWithStock[carId] || [];
    const isLoading = isLoadingDealers[carId];
    
    // На мобильных устройствах используем упрощенное отображение
    if (isMobile) {
      return <MobileDealersList carId={carId} />;
    }
    
    if (isLoading) {
      return (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!dealersData.length) {
      return (
        <div className="text-center py-2 text-gray-500 text-sm">
          {t('catalog.dealers.noStockDealers')}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <Menu as="div" className="relative w-full">
          <Menu.Button className={clsx(
            "w-full flex items-center justify-between",
            "px-4 py-2 rounded-lg text-sm",
            "bg-gray-50 hover:bg-gray-100",
            "transition-colors duration-200"
          )}>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span className="font-medium">{t('catalog.dealers.withStock')} ({dealersData.length})</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items 
              className="absolute z-30 mt-2 w-full rounded-lg bg-white shadow-lg border border-gray-100 focus:outline-none"
              static
              modal={false}
            >
              <div className="p-2 space-y-1 max-h-[240px] overflow-auto custom-scrollbar">
                {dealersData.map((dealer) => {
                  const dealerInfo = dealers.find(d => d.dealer_id === dealer.dealer_id);
                
                  return (
                    <Menu.Item key={dealer.dealer_id}>
                      {({ active }) => (
                        <div className={clsx(
                          "flex items-center p-2 rounded-lg",
                          "transition-colors duration-200 cursor-pointer",
                          active ? "bg-gray-50" : ""
                        )}>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {dealerInfo?.name || `${t('catalog.dealers.dealer')} #${dealer.dealer_id}`}
                            </div>
                            {dealerInfo?.address && (
                              <div className="text-xs text-gray-500 mt-0.5 truncate">
                                {dealerInfo.address}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <span className="text-sm font-medium text-primary">{dealer.stock_count}</span>
                            <span className="text-xs text-gray-500">{t('catalog.dealers.inStock')}</span>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px] relative">
      {/* Вместо fixed, используем absolute для сохранения скролла */}
      {showMap && (
        <div className="absolute inset-0 z-20 bg-white pt-[80px] overflow-auto">
          {isMobile ? (
            <div className="container-fluid py-4">
              <RegionSelector
                regions={regions}
                selectedRegion={selectedRegionCode}
                setSelectedRegion={handleRegionSelect}
                t={t}
              />
            </div>
          ) : (
            <div className="container-fluid py-4 max-w-7xl mx-auto">
              <div className="flex flex-col gap-6">
                {/* Селектор региона на всю ширину сверху */}
                <div className="w-full">
                  <RegionSelector
                    regions={regions}
                    selectedRegion={selectedRegionCode}
                    setSelectedRegion={handleRegionSelect}
                    t={t}
                  />
                </div>
                
                {/* Карта под селектором */}
                <div className="w-full flex justify-center mb-8">
                  <UzbekistanMap 
                    dataType="cars"
                    onRegionSelect={handleRegionSelect}
                    selectedRegion={selectedRegionCode}
                    isLoading={isLoadingMap}
                    className="w-full max-w-7xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Заголовок страницы с кнопкой возврата к карте */}
      {selectedRegion && !showMap && (
        <div className="sticky top-[80px] z-20 bg-white shadow-sm">
          <div className="container-fluid py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  {getSelectedRegionName()}
                </h2>
              </div>
              <button
                onClick={() => setShowMap(true)}
                className="flex items-center text-sm font-medium text-primary px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('catalog.region.choose')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid py-6">
        {/* Отображение списка автомобилей */}
        {!showMap && selectedRegion ? (
          isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => {
                const selectedMod = getSelectedModification(car);
                const selectedColorId = selectedColors[car.model_id] || selectedMod.colors[0]?.color_id;
                const selectedColor = selectedMod.colors.find(c => c.color_id === selectedColorId);
                const isExpanded = expandedCard === car.model_id;
                const totalAvailable = getTotalAvailability(car, selectedRegion);

                return (
                  <motion.div
                    key={car.model_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      "bg-white rounded-xl",
                      "border border-gray-100",
                      "transition-all duration-300",
                      "hover:shadow-lg",
                      "flex flex-col"
                    )}
                  >
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Car className="w-4 h-4 text-primary" />
                            {selectedRegion ? (
                              totalAvailable > 0 ? (
                                <span className="text-sm text-primary">
                                  {t('catalog.car.availability.inStock', { count: totalAvailable })}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  {t('catalog.car.availability.preOrder')}
                                </span>
                              )
                            ) : (
                              <span className="text-sm text-gray-500">
                                {t('catalog.car.availability.choose')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="relative aspect-[16/9] mb-4 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={selectedColor?.photo_sha666 || car.photo_sha666}
                          alt={car.name}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Settings className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-medium text-gray-700">{t('catalog.car.modifications')}</h4>
                        </div>
                        
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar-x">
                          {car.modifications.map((mod: CarModification) => (
                            <button
                              key={mod.modification_id}
                              onClick={() => {
                                setSelectedMods({
                                  ...selectedMods,
                                  [car.model_id]: mod.modification_id
                                });
                                const colorId = mod.colors[0]?.color_id;
                                setSelectedColors(prev => ({
                                  ...prev,
                                  [car.model_id]: colorId
                                }));
                               
                                if (selectedRegion) {
                                  updateDealersStock(car, mod.modification_id, colorId);
                                }
                              }}
                              className={clsx(
                                "flex-shrink-0 px-4 py-2 rounded-lg transition-all",
                                "whitespace-nowrap",
                                selectedMod.modification_id === mod.modification_id
                                  ? "bg-primary/5 border-2 border-primary"
                                  : "bg-gray-50 border-2 border-transparent hover:border-primary/30"
                              )}
                            >
                              <p className="text-sm text-gray-600 mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {mod.name.length > 25 
                                  ? mod.name.substring(0, 25) + '...'
                                  : mod.name
                                }
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{mod.horsepower} {t('catalog.car.specs.power')}</span>
                                <span className="text-xs text-gray-500">{mod.transmission}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                          
                      </div>
                      
                      <div className="mb-4 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-medium text-gray-700">{t('catalog.car.colors')}</h4>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                          {selectedMod.colors.slice(0, isExpanded ? undefined : 6).map((color: CarColor) => {
                            const stockCount = getColorAvailability(color, selectedRegion);
                            return (
                              <button
                                key={color.color_id}
                                onClick={() => {
                                  setSelectedColors(prev => ({
                                    ...prev,
                                    [car.model_id]: color.color_id
                                  }));
                                 
                                  if (selectedRegion) {
                                    updateDealersStock(car, selectedMod.modification_id, color.color_id);
                                  }
                                }}
                                className={clsx(
                                  "relative p-2 sm:p-3 rounded-lg",
                                  "transition-all duration-200",
                                  selectedColorId === color.color_id
                                    ? "bg-primary/5 border border-primary"
                                    : "bg-gray-50 border border-transparent hover:border-primary/30"
                                )}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div className="relative flex-shrink-0">
                                    <div 
                                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-white shadow-sm" 
                                      style={{ backgroundColor: color.hex_value }}
                                    />
                                    {selectedColorId === color.color_id && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  {selectedRegion && (
                                    <span className={clsx(
                                      "text-[10px] sm:text-xs text-center",
                                      "line-clamp-2",
                                      stockCount > 0 ? "text-green-600" : "text-yellow-600"
                                    )}>
                                      {stockCount > 0 
                                        ? `${stockCount} ${t('catalog.car.units.car_count')}`
                                        : `${t('catalog.car.units.queue')} #${color.queue_no || '-'}`
                                      }
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {selectedColor && (
                          <div className="px-3 py-2 bg-white border mt-2 border-gray-200 rounded-lg shadow-sm w-fit">
                            <span className="text-sm text-gray-700">{selectedColor.name}</span>
                          </div>
                        )}
                      </div>

                      {selectedRegion && <DealersList carId={car.model_id} />}

                      <div className="mt-auto pt-4">
                        <div className="flex items-center gap-2">
                          {selectedMod.colors.length > 6 && (
                            <button
                              onClick={() => setExpandedCard(isExpanded ? null : car.model_id)}
                              className={clsx(
                                "flex-1 px-4 py-2 rounded-lg text-sm font-medium",
                                "transition-colors duration-200",
                                "bg-gray-100 text-gray-700",
                                "hover:bg-gray-200"
                              )}
                            >
                              {isExpanded 
                                ? t('catalog.car.collapse')
                                : t('catalog.car.showMore', { count: selectedMod.colors.length - 6 })}
                            </button>
                          )}
                          <Link
                            href={`/cars/${car.model_id}`}
                            className={clsx(
                              "flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center",
                              "transition-colors duration-200",
                              "bg-primary text-white",
                              "hover:bg-primary/90"
                            )}
                          >
                            {t('catalog.car.details')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : null}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: #888;
           border-radius: 3px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: #555;
         }
         
         .custom-scrollbar-x::-webkit-scrollbar {
           height: 4px;
         }
        .custom-scrollbar-x::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Разрешаем скролл */
        html, body {
          overflow-x: hidden;
          overflow-y: auto !important;
          position: relative;
          height: auto;
        }
      `}</style>
    </main>
  );
}