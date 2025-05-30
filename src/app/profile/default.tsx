/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { ProfileHeader } from '@/components/sections/ProfileHeader';
import { CarCard } from '@/components/sections/CarCard';
import { DocumentCard } from '@/components/sections/DocumentCard';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';
import { translations } from './profile.localization';
import { useContractsStore } from '@/store/car-contracts';
import { Contract } from '@/types/contract';
import { InstallmentCard } from '@/components/sections/InstallmentCard';
import { useLanguageStore } from '@/store/language';

interface CarPreview {
  id: string;
  model: string;
  image: string;
  price: number;
  status: 'new' | 'processing' | 'ready';
  modification: string;
  color: string;
  dealer: string;
  contractNumber: string;
  orderDate: string;
  orderNumber: string;
  queueNumber: string;
  vin?: string;
  expectedDate: string;
  hint?: string;
  hint_class?: string;
  state_html: string;
}

interface Payment {
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const tabs = [
  { id: 'overview', icon: '📋' },
  { id: 'payments', icon: '💰' },
  { id: 'documents', icon: '📄' }
] as const;

const formatHint = (hint: string): string => {
  // Форматируем числа с разделителями
  const formattedNumbers = hint.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  
  // Форматируем даты из формата DD-MMM-YY в DD.MM.YYYY
  const dateRegex = /(\d{2})-([A-Z]{3})-(\d{2})/g;
  const monthMap: { [key: string]: string } = {
    'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
    'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
    'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
  };

  return formattedNumbers.replace(dateRegex, (_, day, month, year) => {
    return `${day}.${monthMap[month]}.20${year}`;
  });
};

const mapContractToPreview = (contract: Contract): CarPreview => ({
  id: contract.code,
  model: contract.model_name,
  image: contract.photo_sha666,
  price: parseInt(contract.price),
  status: contract.state === 'N' ? 'new' :
    contract.state === 'P' ? 'processing' : 'ready',
  modification: contract.modification?.name || '',
  color: contract.color?.name || '',
  dealer: contract.dealer_name,
  contractNumber: contract.contract_code,
  orderDate: contract.order_date,
  orderNumber: contract.code,
  queueNumber: contract.queue_no,
  vin: contract.vin_code || '-',
  expectedDate: contract.expect_date,
  hint: contract.hint ? formatHint(contract.hint) : undefined,
  hint_class: contract.hint_class,
  state_html: contract.state_html
});

export default function ProfilePage() {
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation(translations);
  const { contracts, isLoading, error, fetchContracts } = useContractsStore();
  const { currentLocale } = useLanguageStore();
  const currencySymbol = currentLocale === 'uz' ? "so'm" : "сум";

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  type TabId = 'overview' | 'payments' | 'documents';

  interface Tab {
    id: TabId;
    icon: string;
  }
  const [activeTab, setActiveTab] = useState<TabId>('overview');

const hasInstallmentOption = (contract: Contract | undefined): boolean => {
  if (!contract) return false;
  
  // Выводим все свойства контракта для диагностики
  console.log('Full contract data:', JSON.stringify(contract));
  
  // Проверяем наличие action_id с учетом возможных вариаций имени
  const hasActionId = Boolean(contract.action_id);
  
  // Выводим дополнительную информацию для отладки
  
  return hasActionId;
}

  // Функция для получения доступных вкладок
const getAvailableTabs = (contract: Contract | null | undefined): Tab[] => {
    // Базовые вкладки, которые всегда доступны
    const defaultTabs: Tab[] = [
      { id: 'overview' as TabId, icon: '📋' },
      { id: 'documents' as TabId, icon: '📄' }
    ];
    
    // Проверяем наличие рассрочки только для текущего контракта
    if (contract && hasInstallmentOption(contract)) {
      console.log(`Contract ${contract.code} has installment option - showing payments tab`);
      // Вставляем вкладку payments между overview и documents
      defaultTabs.splice(1, 0, { id: 'payments' as TabId, icon: '💰' });
    }
    
    return defaultTabs;
  };

  // Получаем выбранный контракт
  const selectedContract = selectedCar ? contracts.find((c: { code: string; }) => c.code === selectedCar) : null;
  
  // Получаем доступные вкладки для выбранного контракта
  const availableTabs = getAvailableTabs(selectedContract);
  
  // Проверяем, доступна ли текущая активная вкладка
  useEffect(() => {
    if (selectedContract) {
      const isTabAvailable = availableTabs.some(tab => tab.id === activeTab);
      if (!isTabAvailable) {
        setActiveTab('overview');
      }
    }
  }, [selectedCar, selectedContract, availableTabs, activeTab]);
  
  const generatePayments = (totalPrice: number): Payment[] => {
    const monthlyPayment = Math.round(totalPrice / 36);
    return Array.from({ length: 36 }, (_, i) => ({
      date: new Date(2025, 1 + i, 15).toLocaleDateString(),
      amount: monthlyPayment,
      status: 'pending' as const 
    }));
  };
  
  function extractTextFromHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim().toLowerCase();
  }
    
type StatusType = 'новый' | 'в очереди' | 'распределено' | 'в пути' | 'у дилера' | 'реализован' | 'бронь';

const statusMap: Record<StatusType, string> = {
  'новый': 'bg-blue-100 text-blue-700',
  'в очереди': 'bg-yellow-100 text-yellow-700',
  'распределено': 'bg-indigo-100 text-indigo-700',  
  'в пути': 'bg-purple-100 text-purple-700',
  'у дилера': 'bg-cyan-100 text-cyan-700',
  'реализован': 'bg-green-100 text-green-700',
  'бронь': 'bg-orange-100 text-orange-700'
};

  const getStatusColor = (status: string): string => {
    return statusMap[status.toLowerCase() as StatusType] || 'bg-gray-100 text-gray-700';
  };

  const getSelectedCarData = (contract: Contract) => ({
    ...contract, // Включаем все поля из оригинального контракта
    code: contract.code,
    color: contract.color,
    contract_approved: contract.contract_approved,
    contract_code: contract.contract_code,
    contract_generated: contract.contract_generated,
    dealer_approved: contract.dealer_approved,
    dealer_id: contract.dealer_id,
    dealer_name: contract.dealer_name,
    expect_date: contract.expect_date,
    filial_id: contract.filial_id,
    hint: contract.hint,
    hint_class: contract.hint_class,
    kind: contract.kind,
    model_id: contract.model_id,
    model_name: contract.model_name,
    modification: contract.modification,
    order_date: contract.order_date,
    order_id: contract.order_id,
    order_kind: contract.order_kind,
    paid_amount: contract.paid_amount,
    payment_amount: contract.payment_amount,
    photo_sha666: contract.photo_sha666,
    price: contract.price,
    queue_no: contract.queue_no,
    remain_amount: contract.remain_amount,
    state: contract.state,
    state_html: contract.state_html,
    vin_code: contract.vin_code,
    totalPrice: parseInt(contract.price), 
    paidAmount: parseInt(contract.paid_amount),
    payments: generatePayments(parseInt(contract.price)),
    model: contract.model_name,
    contractNumber: contract.contract_code,
    orderDate: contract.order_date,
    orderNumber: contract.code, 
    dealer: contract.dealer_name,
    queueNumber: contract.queue_no,
    vin: contract.vin_code || '-'
  });
    
  const CarPreviewCard = ({ car }: { car: CarPreview }) => (
    <div className={clsx(
      "bg-white rounded-xl overflow-hidden",
      "border border-gray-100 transition-all",
      !isMobile && "hover:shadow-lg",
      "cursor-pointer touch-manipulation",
      "flex flex-col h-full" 
    )}>
      <div className="relative h-48 bg-gray-50">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.model}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Нет изображения</div>
          </div>
        )}
      </div>
        
      <div className="flex flex-col flex-1 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{car.model}</h3>
          <span className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium",
            getStatusColor(extractTextFromHTML(car.state_html))
          )}>
            {t(`profile.status.${extractTextFromHTML(car.state_html)}`)}
          </span>
        </div>

        {car.hint && (
          <div className={clsx(
            "p-3 rounded-lg mb-4",
            car.hint_class === 'alert-warning' && "bg-yellow-50 text-yellow-700",
            car.hint_class === 'alert-success' && "bg-green-50 text-green-700",
            car.hint_class === 'alert-danger' && "bg-red-50 text-red-700"
          )}>
            <p className="text-sm">{car.hint}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('profile.vehicleInfo')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.modification')}</span>
                <span className="font-medium text-gray-dark">{car.modification}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.color')}</span>
                <span className="font-medium text-gray-dark">{car.color}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('profile.contractInfo')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.contractNumber')}</span>
                <span className="font-medium text-gray-dark">{car.contractNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.orderDate')}</span>
                <span className="font-medium text-gray-dark">{car.orderDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.dealer')}</span>
                <span className="font-medium text-gray-dark">{car.dealer}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.price')}</span>
                <span className="font-medium text-primary">
                  {car.price.toLocaleString()} {currencySymbol}
                </span>
              </div>
            </div>
          </div>
   {extractTextFromHTML(car.state_html) !== 'реализован' && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('profile.deliveryInfo')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.queueNumber')}</span>
                <span className="font-medium text-gray-dark">{car.queueNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray">{t('profile.expectedDate')}</span>
                <span className="font-medium text-gray-dark">{car.expectedDate}</span>
              </div>
            </div>
            </div>
            )}
        </div>

        
        <div className="mt-auto"> {/* mt-auto для перемещения кнопки вниз */}
          <button
            onClick={() => setSelectedCar(car.id)}
            className={clsx(
              "w-full py-3 px-4 rounded-lg text-sm font-medium",
              "bg-primary text-white transition-colors",
              "hover:bg-primary/90 active:bg-primary/80",
              "shadow-sm hover:shadow"
            )}
          >
            {t("profile.details")}
          </button>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, icon, isActive }: {
    id: typeof tabs[number]['id'],
    icon: string,
    isActive: boolean
  }) => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return (
      <motion.button
        {...(!isMobile && {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        })}
        onClick={() => {
          setActiveTab(id);
          scrollToTop();
        }}
        className={clsx(
          "px-4 sm:px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200",
          "flex items-center space-x-2 touch-manipulation",
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
          isMobile && "active:bg-gray-100"
        )}
      >
        <span>{icon}</span>
        <span>{t(`profile.${id}`)}</span>
      </motion.button>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      );
    }

    if (!selectedCar) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {contracts.length > 0 ? (
            contracts.map((contract: Contract) => (
              <CarPreviewCard 
                key={contract.code}
                car={mapContractToPreview(contract)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray">
              {t('profile.noOrders')}
            </div>
          )}
        </div>
      );
    }

    if (!selectedContract) return null; 
    const selectedCarData = getSelectedCarData(selectedContract);

    return (
      <div className="mt-6 space-y-6">
        <div className={clsx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
          "sticky top-[80px] bg-gray-50 z-10 py-2"
        )}>
          <button
            onClick={() => {
              setSelectedCar(null);
              setActiveTab('overview');
            }}
            className={clsx(
              "flex items-center text-primary transition-colors duration-200",
              "font-medium touch-manipulation",
              !isMobile && "hover:text-primary/80",
              isMobile && "active:text-primary/80"
            )}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('profile.backToList')}
          </button>

          <div className="flex flex-wrap gap-2">
            {availableTabs.map(tab => (
              <TabButton
                key={tab.id}
                id={tab.id}
                icon={tab.icon}
                isActive={activeTab === tab.id}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-3 sm:p-6">
              {activeTab === 'overview' && <CarCard car={selectedCarData} />}
              {activeTab === 'payments' && hasInstallmentOption(selectedContract) && (
                <InstallmentCard contract={selectedContract} />
              )}
              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DocumentCard
                    contractNumber={selectedCarData.contractNumber}
                    orderDate={selectedCarData.orderDate}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="container-fluid py-4 sm:py-8">
        <ProfileHeader />
        {renderContent()}
      </div>
    </main>
  );
}