'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { 
MapPin, 
Car,
Building2, 
CreditCard,
Calendar,
FileText,
AlertTriangle,
CheckCircle,
AlertCircle,
Palette,
Fingerprint,
AlignStartVertical,
} from 'lucide-react';
import clsx from 'clsx';
import { translations } from '@/app/profile/profile.localization';
import { Contract } from '@/types/contract';
import { useLanguageStore } from '@/store/language';

interface CarCardProps {
car: Contract;
onDownload?: () => void;
onPay?: () => void;
className?: string;
}

interface DetailSectionProps {
icon: React.ReactNode;
title: string;
items: Array<{
 label: string;
 value: string | undefined
 highlight?: boolean;
 icon?: React.ReactNode;
}>;
}

interface InfoBlockProps {
label: string;
value: string | undefined;
highlight?: boolean;
icon?: React.ReactNode;
}

const getAlertIcon = (className?: string) => {
switch(className) {
  case 'alert-warning':
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  case 'alert-success':
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  case 'alert-danger':
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  default:
    return null;
}
};

// Обновленный тип StatusType с добавлением 'бронь'
type StatusType = 'новый' | 'в очереди' | 'распределено' | 'в пути' | 'у дилера' | 'реализован' | 'бронь';

// Обновленный statusMap с добавлением стиля для 'бронь'
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

const formatHint = (hint: string): string => {
 const formattedNumbers = hint.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
 
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

export const CarCard = ({ car, className }: CarCardProps) => {
const { t } = useTranslation(translations);
const { currentLocale } = useLanguageStore(); // Добавляем доступ к текущей локали
const remainingAmount = parseInt(car.price) - parseInt(car.paid_amount);

// Определяем отображение валюты в зависимости от языка
const currencyLabel = currentLocale === 'ru' ? 'сум' : "so'm";

function extractTextFromHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim().toLowerCase();
}

return (
  <div className={clsx(
    "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
    className
  )}>
    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{car.model_name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
            <span className="text-xs sm:text-sm">VIN: {car.code}</span>
          </div>
          {car.state && (
         <span className={clsx(
 "px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
 getStatusColor(extractTextFromHTML(car.state_html))
)}>
 {t(`profile.status.${extractTextFromHTML(car.state_html)}`)}
</span>
          )}
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-6">
      {car.hint && (
        <div className={clsx(
          "mb-6 p-4 rounded-lg flex items-start gap-3",
          car.hint_class === 'alert-warning' && "bg-yellow-50 text-yellow-700 border border-yellow-200",
          car.hint_class === 'alert-success' && "bg-green-50 text-green-700 border border-green-200", 
          car.hint_class === 'alert-danger' && "bg-red-50 text-red-700 border border-red-200"
        )}>
          {getAlertIcon(car.hint_class)}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-line">{formatHint(car.hint)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 relative h-[200px] sm:h-[300px] bg-gray-50 rounded-xl overflow-hidden">
          <Image 
            src={car.photo_sha666}
            alt={car.model_name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
            className="object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <InfoBlock 
            label={t('profile.contractNumber')} 
            value={car.contract_code}
            icon={<FileText className="w-4 h-4 text-gray-400" />}
          />
          <InfoBlock 
            label={t('profile.orderDate')} 
            value={car.order_date}
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />
          <InfoBlock 
            label={t('profile.dealer')} 
            value={car.dealer_name}
            icon={<Building2 className="w-4 h-4 text-gray-400" />}
          />
         <InfoBlock 
  label={t('profile.price')} 
  value={`${parseInt(car.price).toLocaleString()} ${currencyLabel}`}
  highlight
  icon={<CreditCard className="w-4 h-4 text-primary" />}
/>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 pt-6 border-t border-dashed border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailSection
            icon={<Car className="w-5 h-5 text-primary" />}
            title={t('profile.vehicle')}
            items={[
              { 
                label: t('profile.modification'), 
                value: car.modification?.name,
                icon: <FileText className="w-4 h-4 text-gray-400" />
              },
              { 
                label: t('profile.color'), 
                value: car.color?.name,
                icon: <Palette className="w-4 h-4 text-gray-400" />
              },
              { 
                label: t('profile.vin'), 
                value: car.vin_code || '—',
                 icon: <Fingerprint className="w-4 h-4 text-gray-400" /> 
              }
            ]}
          />

          <DetailSection
            icon={<MapPin className="w-5 h-5 text-primary" />}
            title={t('profile.delivery')}
            items={[
              { 
                label: t('profile.queueNumber'), 
                value: car.queue_no,
                icon: <AlignStartVertical className="w-4 h-4 text-gray-400" />
              },
              { 
                label: t('profile.expectedDate'), 
                value: car.expect_date,
                icon: <Calendar className="w-4 h-4 text-gray-400" />
              }
            ]}
          />

          <DetailSection
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            title={t('profile.payment')}
            items={[
              { 
                label: t('profile.paidAmount'),
                value: `${parseInt(car.paid_amount).toLocaleString()} ${currencyLabel}`,
                icon: <CreditCard className="w-4 h-4 text-gray-400" />
              },
              { 
                label: t('profile.remainingAmount'),
                value: `${remainingAmount.toLocaleString()} ${currencyLabel}`,
                highlight: true,
                icon: <CreditCard className="w-4 h-4 text-primary" />
              }
            ]}
          />
        </div>
      </div>
    </div>
  </div>
);
};

const DetailSection = ({ icon, title, items }: DetailSectionProps) => (
<div className="space-y-3 sm:space-y-4">
  <div className="flex items-center gap-2 text-gray-900">
    {icon}
    <h3 className="font-medium">{title}</h3>
  </div>
  <div className="space-y-3">
    {items.map((item, index) => (
      <InfoBlock
        key={index}
        label={item.label}
        value={item.value}
        highlight={item.highlight}
        icon={item.icon}
      />
    ))}
  </div>
</div>
);

const InfoBlock = ({ label, value, highlight, icon }: InfoBlockProps) => (
<div>
  <div className="flex items-center gap-2 text-gray-500 mb-1">
    {icon}
    <p className="text-xs sm:text-sm">{label}</p>
  </div>
  <p className={clsx(
    "font-medium text-sm sm:text-base",
    highlight ? "text-primary" : "text-gray-900"
  )}>{value}</p>
</div>
);