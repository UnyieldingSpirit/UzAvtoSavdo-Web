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
Shield,
ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { translations } from '@/app/profile/profile.localization';
import { Contract } from '@/types/contract';
import { useLanguageStore } from '@/store/language';
import { useAuthStore } from '@/store/auth';

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
const { currentLocale } = useLanguageStore();
const { userInfo } = useAuthStore();
const remainingAmount = parseInt(car.remain_amount);

// Определяем отображение валюты в зависимости от языка
const currencyLabel = currentLocale === 'ru' ? 'сум' : "so'm";

// Функция для генерации URL оплаты
const generatePaymentUrls = () => {
 const pinfl = userInfo?.inn || car.inn || '';
 const urls = { asaka: '', payme: '' };

 if (remainingAmount > 0) {
   if (pinfl.length === 14) {
     // Физическое лицо
     urls.asaka = `https://my.asakabank.uz/payment?merchant_id=133&pinfl=${pinfl}&contract-number=${car.contract_code}&contract-date=${car.order_date}&pay-type=3&amount=${remainingAmount * 100}`;
     urls.payme = `https://payme.uz/fallback/merchant/?id=5cd505543dd3183058ae7093&amount=${remainingAmount * 100}&contract_d=${car.order_date}&contract_n=${car.contract_code}&payment_type=01&pinfl=${pinfl}`;
   } else {
     // Юридическое лицо - только Payme
     urls.payme = `https://payme.uz/fallback/merchant/?id=5cd505543dd3183058ae7093&amount=${remainingAmount * 100}&contract_d=${car.order_date}&contract_n=${car.contract_code}&payment_type=02&inn=${pinfl}`;
   }
 }

 return urls;
};

const paymentUrls = generatePaymentUrls();
const showPaymentButtons = remainingAmount > 0;
const pinfl = userInfo?.inn || car.inn || '';

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

     {/* Кнопки оплаты - улучшенный дизайн */}
     {showPaymentButtons && (
       <div className="mt-8 pt-6 border-t border-gray-200">
         {/* Заголовок секции */}
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg">
               <CreditCard className="w-5 h-5 text-primary" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900">
                 {t('profile.paymentSection.title')}
               </h3>
               <p className="text-sm text-gray-500 mt-0.5">
                 {remainingAmount.toLocaleString()} {currencyLabel}
               </p>
             </div>
           </div>
           <div className="flex items-center gap-1.5 text-xs text-gray-500">
             <Shield className="w-3.5 h-3.5" />
             <span>{t('profile.paymentSection.securePayment')}</span>
           </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {/* Кнопка Asaka Bank - только для физических лиц */}
           {pinfl.length === 14 && paymentUrls.asaka && (
             <button
               onClick={() => window.location.href = paymentUrls.asaka}
               className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg"
             >
               {/* Фон с градиентом */}
               <div className="absolute inset-0 bg-gradient-to-br from-[#00B050] to-[#00A859] opacity-90 group-hover:opacity-100 transition-opacity" />
               
               {/* Декоративный элемент */}
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               
               {/* Контент кнопки */}
               <div className="relative px-6 py-5">
                 <div className="flex items-center justify-between">
                   <div className="flex flex-col items-start">
                     <div className="flex items-center gap-3 mb-1">
                        {/* Логотип или иконка банка */}
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.86642 18.9738L2.36855 20.4734C1.57997 21.2629 0.787882 22.0552 0 22.845V18.9777L0.00314953 18.9738H3.86642Z" fill="#F61E2E"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2521 18.9738V24H1.15825L3.45413 21.7022L4.47787 20.6805L6.17942 18.9738H17.2521Z" fill="#F61E2E"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2521 7.89519V17.3364H7.81843C10.9186 14.2355 14.1079 11.0419 17.2521 7.89519Z" fill="#F61E2E"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 1.13298V24H18.8876V6.25395C19.8101 5.33085 20.7324 4.40669 21.6517 3.48359L24 1.13298Z" fill="#F61E2E"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.819 0C16.6525 6.17944 10.8292 12.0123 5.50544 17.3365H1.61946L18.7336 0H22.819Z" fill="#F61E2E"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4335 0L0 16.6481V0H16.4335Z" fill="#F61E2E"></path></svg>
                       <span className="text-white font-semibold text-base">
                         Asaka Bank
                       </span>
                     </div>
                     <span className="text-white/80 text-sm">
                     </span>
                   </div>
                   <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
             </button>
           )}

           {/* Кнопка Payme - для всех */}
           {paymentUrls.payme && (
             <button
               onClick={() => window.location.href = paymentUrls.payme}
               className={clsx(
                 "group relative overflow-hidden rounded-xl transition-all duration-300",
                 "hover:transform hover:scale-[1.02] hover:shadow-lg",
                 pinfl.length !== 14 && "sm:col-span-2" // Если юрлицо, кнопка на всю ширину
               )}
             >
               {/* Фон с градиентом */}
               <div className="absolute inset-0 bg-[#00c1ca] opacity-90 group-hover:opacity-100 transition-opacity" />
               
               {/* Декоративный элемент */}
               <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               
               {/* Контент кнопки */}
               <div className="relative px-6 py-5">
                 <div className="flex items-center justify-between">
                   <div className="flex flex-col items-start">
                     <div className="flex items-center gap-3 mb-1">
                       {/* Логотип Payme */}
                       <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <img src="https://api.logobank.uz/media/logos_png/payme-01.png" alt="" />
                       </div>
                       <span className="text-white font-semibold text-base">
                         Payme
                       </span>
                     </div>
                     <span className="text-white/80 text-sm">
                     </span>
                   </div>
                   <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
             </button>
           )}
         </div>

         {/* Информационная подсказка */}
         <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
           <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
           <p className="text-xs text-gray-500">
             {currentLocale === 'ru' 
               ? 'Платеж будет обработан в защищенном режиме через официальный сайт платежной системы'
               : "To'lov rasmiy to'lov tizimi saytida xavfsiz rejimda amalga oshiriladi"
             }
           </p>
         </div>
       </div>
     )}
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