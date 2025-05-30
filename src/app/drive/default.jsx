// src/app/drive/default.jsx
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Settings, 
  MapPin, 
  Phone, 
  Calendar,
  Clock, 
  CheckCircle, 
  User,  
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Check,
  Info,
  ArrowLeft,
  Gauge,
  Fuel,
  Star,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { useToastStore } from '@/store/toast';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/auth';
import { useCaptchaStore } from '@/store/captcha';
import { useCarsStore } from '@/store/models-cars';
import { fetchDealers } from '@/api/dealers';
import { testDriveApi } from '@/api/testDrive';
import translations from './drive.localization';
import { useLanguageStore } from '@/store/language';

// Константы конфигурации
const AVAILABLE_DATES_COUNT = 14;
const TIME_SLOT_INTERVAL = 30;
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

// Компонент кастомного селекта для регионов
const CustomRegionSelect = React.memo(({ regions, selectedRegion, onChange, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const allRegions = useMemo(() => [
    { id: 'all', name: t('testDrive.regions.all') },
    ...regions
  ], [regions, t]);
  
  const selectedRegionData = useMemo(
    () => allRegions.find(r => r.id === selectedRegion),
    [allRegions, selectedRegion]
  );
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full p-3 sm:p-4 bg-white border-2 rounded-xl transition-all duration-200",
          "flex items-center justify-between text-left",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
          isOpen ? "border-primary shadow-lg" : "border-gray-200"
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={clsx(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            selectedRegion ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
          )}>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">{t('testDrive.regions.title')}</p>
            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
              {selectedRegionData ? selectedRegionData.name : t('testDrive.regions.select')}
            </p>
          </div>
        </div>
        
        <ChevronDown className={clsx(
          "w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 sm:max-h-80 overflow-y-auto">
              {allRegions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => {
                    onChange(region.id);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 transition-colors",
                    "flex items-center gap-2 sm:gap-3 border-b border-gray-100 last:border-0",
                    selectedRegion === region.id && "bg-primary/5"
                  )}
                >
                  <div className={clsx(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    selectedRegion === region.id 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {selectedRegion === region.id ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <span className={clsx(
                    "font-medium text-sm sm:text-base",
                    selectedRegion === region.id ? "text-primary" : "text-gray-700"
                  )}>
                    {region.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CustomRegionSelect.displayName = 'CustomRegionSelect';

// Компонент выбора даты с улучшенным UI
const DateSelector = React.memo(({ appointmentDate, setAppointmentDate, t }) => {
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= AVAILABLE_DATES_COUNT; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, []);
  
  const formatDateShort = useCallback((date) => {
    const currentLocale = useLanguageStore.getState().currentLocale;
    
    const weekdaysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const weekdaysUz = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    const monthsRu = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const monthsUz = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
    
    const weekdays = currentLocale === 'uz' ? weekdaysUz : weekdaysRu;
    const months = currentLocale === 'uz' ? monthsUz : monthsRu;
    
    return {
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
      month: months[date.getMonth()]
    };
  }, []);
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
      <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        {t('testDrive.dateTimeSelection.selectDate')}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {availableDates.map((date) => {
          const dateIsoString = date.toISOString().split('T')[0];
          const isSelected = appointmentDate === dateIsoString;
          const { day, weekday, month } = formatDateShort(date);
          const isToday = date.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString();
          
          return (
            <motion.button
              key={dateIsoString}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAppointmentDate(dateIsoString)}
              className={clsx(
                "p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 relative",
                isSelected
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white border-gray-200 hover:border-primary/50"
              )}
            >
              {isToday && (
                <span className={clsx(
                  "absolute -top-1 -right-1 text-xs px-2 py-0.5 rounded-full",
                  isSelected ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {t('testDrive.dateTimeSelection.tomorrow')}
                </span>
              )}
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold">{day}</div>
                <div className="text-xs mt-0.5 sm:mt-1">
                  {weekday}, {month}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

DateSelector.displayName = 'DateSelector';

// Компонент времени с улучшенным дизайном
const TimeSlotSelector = React.memo(({ availableSlots, selectedTime, onTimeSelect, isLoading, t }) => {
  const groupedSlots = useMemo(() => {
    const morning = [];
    const afternoon = [];
    const evening = [];
    
    availableSlots
      .filter(slot => slot.status === 'available')
      .forEach(slot => {
        const hour = parseInt(slot.time.split(':')[0]);
        if (hour >= 9 && hour < 12) morning.push(slot);
        else if (hour >= 12 && hour < 17) afternoon.push(slot);
        else if (hour >= 17 && hour < 20) evening.push(slot);
      });
    
    return { morning, afternoon, evening };
  }, [availableSlots]);
  
  const renderTimeSlots = (slots, periodName, icon) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="mb-3 sm:mb-4 last:mb-0">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-sm text-gray-600">{periodName}</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {slots.map((slot) => (
            <motion.button
              key={slot.time}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onTimeSelect(slot.time);
              }}
              className={clsx(
                "p-1.5 sm:p-2 rounded-lg border text-xs sm:text-sm font-medium transition-all",
                selectedTime === slot.time
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white border-gray-200 hover:border-primary hover:text-primary"
              )}
            >
              {slot.time}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const { morning, afternoon, evening } = groupedSlots;
  
  return (
    <div>
      {renderTimeSlots(morning, t('testDrive.dateTimeSelection.morning'), 
        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
        </div>
      )}
      {renderTimeSlots(afternoon, t('testDrive.dateTimeSelection.afternoon'),
        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        </div>
      )}
      {renderTimeSlots(evening, t('testDrive.dateTimeSelection.evening'),
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
        </div>
      )}
      
      {morning.length === 0 && afternoon.length === 0 && evening.length === 0 && (
        <p className="text-gray-500 text-center py-4 text-sm">
          {t('testDrive.dateTimeSelection.noTimeAvailable')}
        </p>
      )}
    </div>
  );
});

TimeSlotSelector.displayName = 'TimeSlotSelector';

// Компонент для проверки авторизации
const AuthRequiredComponent = ({ t }) => {
  const { setIsOpen } = useCaptchaStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3 text-gray-900">
          {t('testDrive.requiresAuth.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed">
          {t('testDrive.requiresAuth.message')}
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 sm:py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {t('testDrive.requiresAuth.login')}
        </button>
      </motion.div>
    </div>
  );
};

// Компонент карточки автомобиля с улучшенным дизайном
const CarCard = React.memo(({ car, isSelected, onClick,t }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        "relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group",
        isSelected
          ? "ring-2 ring-primary shadow-lg"
          : "border border-gray-200 hover:shadow-md hover:border-primary/50"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-primary text-white p-1 sm:p-1.5 rounded-full"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.div>
        </div>
      )}
      
      <div className="relative h-32 sm:h-40 bg-gradient-to-b from-gray-50 to-white">
        <Image
          src={car.photo_sha666}
          alt={car.name}
          fill
          className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{car.name}</h3>
        {car.modifications && car.modifications.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              <span>{car.modifications[0].horsepower} {t('testDrive.horsepower')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              <span>{car.modifications[0].fuel_consumption}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

CarCard.displayName = 'CarCard';

// Компонент карточки дилера с встроенным выбором времени
const DealerCardWithTime = React.memo(({ 
  dealer, 
  isSelected, 
  onClick, 
  appointmentDate, 
  appointmentTime, 
  onTimeSelect, 
  availableSlots, 
  isLoadingSlots,
  t 
}) => {
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  
  const handleClick = () => {
    onClick();
    setShowTimeSlots(!showTimeSlots);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200",
        isSelected ? "border-primary shadow-lg" : "border-gray-200 hover:border-primary/50"
      )}
    >
      <div 
        onClick={handleClick}
        className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 truncate uppercase">{dealer.name}</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm line-clamp-2">{dealer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{dealer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">09:00 - 18:00</span>
              </div>
            </div>
          </div>
          
          <ChevronDown className={clsx(
            "w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
            showTimeSlots && isSelected ? "transform rotate-180" : ""
          )} />
        </div>
      </div>
      
      <AnimatePresence>
        {showTimeSlots && isSelected && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4 sm:p-5 bg-gray-50">
              <h5 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                {t('testDrive.dateTimeSelection.selectTime')}
              </h5>
              
              {appointmentDate ? (
                <TimeSlotSelector
                  availableSlots={availableSlots}
                  selectedTime={appointmentTime}
                  onTimeSelect={onTimeSelect}
                  isLoading={isLoadingSlots}
                  t={t}
                />
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">
                  {t('testDrive.dateTimeSelection.selectDateFirst')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

DealerCardWithTime.displayName = 'DealerCardWithTime';

// Компонент подтверждения с полностью переработанным дизайном
const ConfirmationStep = ({ selectedCar, selectedDealer, appointmentDate, appointmentTime, userInfo, handlePrevStep, handleSubmit, isSubmitting, formatDate, t }) => {
  const currentLocale = useLanguageStore.getState().currentLocale;
  // Берем первую модификацию для отображения характеристик
  const selectedModification = selectedCar?.modifications?.[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Заголовок секции */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('testDrive.confirmation.almostDone')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('testDrive.confirmation.checkDetails')}
        </p>
      </div>

      {/* Основной контент в виде карточек */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Карточка автомобиля */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50">
            <Image
              src={selectedCar?.photo_sha666 || ''}
              alt={selectedCar?.name || ''}
              fill
              className="object-contain p-4"
              priority
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-xs font-medium text-gray-600">{t('testDrive.confirmation.yourCar')}</p>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedCar?.name}</h3>
            {selectedModification && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>{selectedModification.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Gauge className="w-4 h-4 text-gray-400" />
                  <span>{selectedModification.horsepower} {t('testDrive.modSelection.horsepower')}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Карточка даты и времени */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('testDrive.confirmation.testDrive')}</p>
                  <h4 className="font-semibold text-gray-900">{t('testDrive.confirmation.dateTime')}</h4>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{t('testDrive.confirmation.date')}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatDate(appointmentDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{t('testDrive.confirmation.time')}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {appointmentTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Карточка дилера */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('testDrive.confirmation.dealerCenter')}</p>
                  <h4 className="font-semibold text-gray-900">{selectedDealer?.name}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mt-auto">
              <p className="leading-relaxed">{selectedDealer?.address}</p>
              <a 
                href={`tel:${selectedDealer?.phone}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                {selectedDealer?.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Информация о клиенте */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          {t('testDrive.confirmation.clientInfo')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{t('testDrive.confirmation.name')}</p>
            <p className="font-medium text-gray-900">{userInfo?.name || t('testDrive.confirmation.notSpecified')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{t('testDrive.confirmation.phone')}</p>
            <p className="font-medium text-gray-900">{userInfo?.phone_number || t('testDrive.confirmation.notSpecified')}</p>
          </div>
        </div>
      </motion.div>

      {/* Дополнительная информация */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 mb-8"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">{t('testDrive.confirmation.importantInfo')}</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>{t('testDrive.confirmation.infoPoint1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>{t('testDrive.confirmation.infoPoint2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>{t('testDrive.confirmation.infoPoint3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Кнопки действий */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={handlePrevStep}
          className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t('testDrive.confirmation.back')}
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('testDrive.confirmation.submitting')}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t('testDrive.confirmation.confirm')}</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

// Генерация слотов времени
const generateTimeSlots = () => {
  const slots = [];
  
  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL) {
      if (hour === WORK_END_HOUR && minute > 0) continue;
      
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      const status = Math.random() > 0.3 ? 'available' : 'occupied';
      
      slots.push({ time, status });
    }
  }
  
  return slots;
};

// Главный компонент
const TestDrivePage = () => {
  // Состояния
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [step, setStep] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Данные
  const [dealersList, setDealersList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingDealers, setIsLoadingDealers] = useState(false);
  
  // Refs для предотвращения повторных загрузок
  const dealersLoadedRef = useRef(false);
  const carsLoadedRef = useRef(false);
  
  const { showToast } = useToastStore();
  const { t } = useTranslation(translations);
  const router = useRouter();
  const { isAuthorized, userInfo } = useAuthStore();
  const { cars, fetchCars } = useCarsStore();
  
  // Мемоизированные функции для предотвращения повторных вызовов
  const loadCars = useCallback(async () => {
    if (carsLoadedRef.current || cars.length > 0) return;
    
    carsLoadedRef.current = true;
    try {
      await fetchCars();
    } catch (error) {
      console.error('Error loading cars:', error);
      showToast(t('testDrive.errors.loadCars'), 'error');
      carsLoadedRef.current = false;
    }
  }, [fetchCars, showToast, t, cars.length]);
  
  const loadDealers = useCallback(async () => {
    if (dealersLoadedRef.current || dealersList.length > 0) return;
    
    dealersLoadedRef.current = true;
    setIsLoadingDealers(true);
    try {
      const dealersData = await fetchDealers();
      
      const formattedDealers = dealersData.map(dealer => ({
        id: dealer.dealer_id,
        name: dealer.name,
        address: dealer.address,
        phone: dealer.phone_number ? dealer.phone_number[0] : '-',
        rating: dealer.rating || 4.5,
        workingHours: "09:00 - 18:00",
        services: [""],
        load: "Средняя",
        region: dealer.region
      }));
      
      setDealersList(formattedDealers);
    } catch (error) {
      console.error('Error loading dealers:', error);
      showToast(t('testDrive.errors.loadDealers'), 'error');
      dealersLoadedRef.current = false;
    } finally {
      setIsLoadingDealers(false);
    }
  }, [showToast, t, dealersList.length]);
  
  // Мемоизированные значения
  const regions = useMemo(() => [
    { id: '1', name: t('catalog.car.regions.tashkent') },
    { id: '2', name: t('catalog.car.regions.andijan') },
    { id: '3', name: t('catalog.car.regions.bukhara') },
    { id: '4', name: t('catalog.car.regions.jizzakh') },
    { id: '5', name: t('catalog.car.regions.kashkadarya') },
    { id: '6', name: t('catalog.car.regions.navoi') },
    { id: '7', name: t('catalog.car.regions.namangan') },
    { id: '8', name: t('catalog.car.regions.samarkand') },
    { id: '9', name: t('catalog.car.regions.surkhandarya') },
    { id: '10', name: t('catalog.car.regions.syrdarya') },
    { id: '11', name: t('catalog.car.regions.tashkent_region') },
    { id: '12', name: t('catalog.car.regions.ferghana') },
    { id: '13', name: t('catalog.car.regions.khorezm') },
    { id: '14', name: t('catalog.car.regions.karakalpakstan') }
  ], [t]);
  
  const filteredDealers = useMemo(() => 
    selectedRegion === 'all'
      ? dealersList
      : dealersList.filter(dealer => dealer.region === selectedRegion),
    [dealersList, selectedRegion]
  );

  // Загрузка автомобилей
  useEffect(() => {
    if (isAuthorized) {
      loadCars();
    }
  }, [isAuthorized]);
  
  // Загрузка дилеров
  useEffect(() => {
    if (isAuthorized) {
      loadDealers();
    }
  }, [isAuthorized]);
  
  // Загрузка слотов времени
  useEffect(() => {
    if (!appointmentDate) {
      setAvailableSlots([]);
      return;
    }
    
    let timeoutId;
    
    const loadSlots = async () => {
      setIsLoadingSlots(true);
      try {
        let slots;
        try {
          slots = await testDriveApi.getAvailabilityByDate(appointmentDate);
        } catch (error) {
          slots = generateTimeSlots();
        }
        
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading slots:', error);
        showToast(t('testDrive.errors.loadSlots'), 'error');
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    timeoutId = setTimeout(loadSlots, 300);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [appointmentDate, showToast]);

  // Функции навигации
  const handleNextStep = useCallback(() => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrevStep = useCallback(() => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Проверка возможности перехода на следующий шаг
  const canProceedToNextStep = useCallback(() => {
    switch (step) {
      case 1:
        return selectedCar;
      case 2:
        return selectedDealer && appointmentDate && appointmentTime;
      default:
        return true;
    }
  }, [step, selectedCar, selectedDealer, appointmentDate, appointmentTime]);

  // Отправка формы
  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      
      // Берем первую модификацию для тест-драйва
      const selectedModification = selectedCar.modifications[0];
      
      const testDriveData = {
        model_id: selectedCar.model_id,
        model_name: selectedCar.name,
        modification_id: selectedModification.modification_id,
        modification_name: selectedModification.name,
        dealer_id: selectedDealer.id,
        dealer_name: selectedDealer.name,
        region_id: selectedDealer.region,
        region_name: regions.find(r => r.id === selectedDealer.region)?.name || 'Неизвестный регион',
        datetime: `${appointmentDate}T${appointmentTime}:00.000Z`,
        client_id: userInfo?.user_id || '',
        client_fio: userInfo?.name || '',
        client_phone: userInfo?.phone_number || ''
      };
      
      try {
        await testDriveApi.createTestDriveRequest(testDriveData);
      } catch (error) {
        console.error('Error submitting through API:', error);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      showToast(t('testDrive.success.submitted'), 'success', true);
      router.push('/');
    } catch (error) {
      console.error('Error submitting test drive request:', error);
      showToast(t('testDrive.errors.submitFailed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCar, selectedDealer, appointmentDate, appointmentTime, userInfo, regions, showToast, t, router]);

  // Форматирование даты
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t('testDrive.errors.invalidDate');
    
    const currentLocale = useLanguageStore.getState().currentLocale;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const uzMonths = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    
    const ruMonths = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    if (currentLocale === 'uz') {
      return `${day}-${uzMonths[month]} ${year}-yil`;
    } else {
      return `${day} ${ruMonths[month]} ${year} г.`;
    }
  }, [t]);

  if (!isAuthorized) {
    return <AuthRequiredComponent t={t} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b mt-8 from-gray-50 to-white pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {t('testDrive.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {t('testDrive.subtitle')}
          </p>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex items-center">
                  <motion.div
                    className={clsx(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 text-sm sm:text-base",
                      i === step
                        ? "bg-primary text-white shadow-lg scale-110"
                        : i < step
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {i < step ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : i}
                  </motion.div>
                  <span className={clsx(
                    "ml-2 sm:ml-3 text-xs sm:text-sm font-medium hidden sm:block",
                    i <= step ? "text-gray-900" : "text-gray-400"
                  )}>
                    {i === 1 && t('testDrive.steps.car')}
                    {i === 2 && t('testDrive.steps.timeAndPlace')}
                    {i === 3 && t('testDrive.steps.confirmation')}
                  </span>
                </div>
                {i < 3 && (
                  <div className={clsx(
                    "flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300",
                    i < step ? "bg-primary/20" : "bg-gray-100"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Шаг 1: Выбор автомобиля */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Выбор автомобиля */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {t('testDrive.carSelection.title')}
                </h2>
                {cars.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-2xl">
                    <Car className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{t('testDrive.carSelection.noCars')}</p>
                    <button
                      onClick={() => router.push('/cars')}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm sm:text-base"
                    >
                      {t('testDrive.carSelection.exploreCars')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {cars.map((car) => (
                      <CarCard
                        key={car.model_id}
                        car={car}
                        t={t}
                        isSelected={selectedCar?.model_id === car.model_id}
                        onClick={() => setSelectedCar(car)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Кнопка далее */}
              <div className="flex justify-end pt-2 sm:pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className={clsx(
                    "px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 text-sm sm:text-base",
                    canProceedToNextStep()
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {t('testDrive.buttons.next')}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Шаг 2: Выбор времени и дилера */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Информация о выборе */}
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{t('testDrive.selected.car')}</p>
                    <p className="font-medium text-sm sm:text-base">{selectedCar?.name}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Левая колонка: Дата и регион */}
                <div className="space-y-4 sm:space-y-6">
                  <DateSelector 
                    appointmentDate={appointmentDate}
                    setAppointmentDate={setAppointmentDate}
                    t={t}
                  />

                  <CustomRegionSelect
                    regions={regions}
                    selectedRegion={selectedRegion}
                    onChange={setSelectedRegion}
                    t={t}
                  />
                </div>

                {/* Правая колонка: Список дилеров */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {t('testDrive.dealerSelection.title')}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {t('testDrive.dealerSelection.found')}: {filteredDealers.length}
                    </span>
                  </div>
                  
                  {isLoadingDealers ? (
                    <div className="flex justify-center py-8 sm:py-12">
                      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredDealers.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2">
                      {filteredDealers.map((dealer) => (
                        <DealerCardWithTime
                          key={dealer.id}
                          dealer={dealer}
                          isSelected={selectedDealer?.id === dealer.id}
                          onClick={() => setSelectedDealer(dealer)}
                          appointmentDate={appointmentDate}
                          appointmentTime={appointmentTime}
                          onTimeSelect={setAppointmentTime}
                          availableSlots={availableSlots}
                          isLoadingSlots={isLoadingSlots}
                          t={t}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-2xl">
                      <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base text-gray-500">
                        {t('testDrive.dealerSelection.noDealers')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопки навигации */}
              <div className="flex justify-between pt-4 sm:pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevStep}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 flex items-center gap-2 transition-all text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('testDrive.buttons.back')}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className={clsx(
                    "px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 text-sm sm:text-base",
                    canProceedToNextStep()
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {t('testDrive.buttons.next')}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Шаг 3: Подтверждение */}
          {step === 3 && (
            <ConfirmationStep
              selectedCar={selectedCar}
              selectedDealer={selectedDealer}
              appointmentDate={appointmentDate}
              appointmentTime={appointmentTime}
              userInfo={userInfo}
              handlePrevStep={handlePrevStep}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              formatDate={formatDate}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default TestDrivePage;