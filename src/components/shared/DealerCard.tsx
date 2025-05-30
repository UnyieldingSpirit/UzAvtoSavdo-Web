import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Star, ExternalLink, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useContractStore } from '@/store/contract';
import { useCaptchaStore } from '@/store/captcha';
import { useAuth } from '@/hooks/useAuth';

interface DealerProps {
 dealer: {
   dealer_id: string;
   name: string;
   address: string;
   phone_number: string[];
   lat_lng?: string;
   photo_sha?: string;
   rating?: number;
   stock?: number;
   availability?: {
     count: number;
     status: 'inStock' | 'preOrder'; 
   };
 };
 onSelect?: (dealerId: string) => Promise<void>;
 t: (key: string) => string;
 mode?: 'select' | 'view';
 isSelected?: boolean;
}

export const DealerCard = ({ dealer, t, mode = 'view', isSelected }: DealerProps) => {
 const [mapLoadAttempts, setMapLoadAttempts] = useState(0);
 const [isMapLoaded, setIsMapLoaded] = useState(false);
 const maxAttempts = 3;
 const retryDelay = 2000;
 const hasLocation = Boolean(dealer.lat_lng);
 const hasPhones = Array.isArray(dealer.phone_number) && dealer.phone_number.length > 0;
 const { handleAuthRequired } = useAuth();

 useEffect(() => {
   if (hasLocation && !isMapLoaded && mapLoadAttempts < maxAttempts) {
     const timer = setTimeout(() => {
       setMapLoadAttempts(prev => prev + 1);
     }, retryDelay);
     return () => clearTimeout(timer);
   }
 }, [hasLocation, isMapLoaded, mapLoadAttempts]);

 const handleMapLoad = () => {
   setIsMapLoaded(true);
 };

 const handleMapError = () => {
   if (mapLoadAttempts < maxAttempts) {
     console.log(`Map load attempt ${mapLoadAttempts + 1} failed, retrying...`);
   }
 };

 const formatCoordinates = (latLng: string) => {
   return latLng.replace(/\s+/g, '');
 };

 const handleMapClick = () => {
   if (!hasLocation) return;
   const [lat, lng] = dealer.lat_lng!.split(',').map(coord => coord.trim());
   if (lat && lng) {
     window.open(`https://yandex.ru/maps/?pt=${formatCoordinates(lng)},${formatCoordinates(lat)}&z=17&l=map`, '_blank');
   }
 };

 const handleDealerSelect = async () => {
   if (mode === 'select') {
     if (!await handleAuthRequired()) {
       return;
     }

     const modification_id = localStorage.getItem('selected_modification');
     const color_id = localStorage.getItem('selected_color');
     
     if (!modification_id || !color_id) {
       console.error('Missing contract data');
       return;
     }

     localStorage.setItem('selected_dealer_id', dealer.dealer_id);

     const { setContractData } = useContractStore.getState();
     await setContractData({
       modification_id,
       color_id,
       dealer_id: dealer.dealer_id
     });

     const { setIsOpen } = useCaptchaStore.getState();
     setIsOpen(true);
   }
 };

 const staticMapUrl = hasLocation ? 
   `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${dealer.lat_lng!.split(',').map(coord => coord.trim()).reverse().join(',')}&z=14&l=map&size=400,200&pt=${dealer.lat_lng!.split(',').map(coord => coord.trim()).reverse().join(',')},pm2rdm` 
   : '/img/map-placeholder.jpg';

 const PhoneNumbers = mode === 'view' ? (
   hasPhones ? (
     <div className="space-y-2">
       {dealer.phone_number.map((phone, index) => (
         <div key={`${phone}-${index}`} className="flex items-center">
           <Phone className="w-5 h-5 text-primary flex-shrink-0" />
           <a href={`tel:${phone}`} className="ml-3 text-gray-600 hover:text-primary transition-colors line-clamp-1">
             {phone}
           </a>
         </div>
       ))}
     </div>
   ) : (
     <div className="flex items-center text-gray-500">
       <Phone className="w-5 h-5 flex-shrink-0" />
       <span className="ml-3">{t('dealers.noPhone')}</span>
     </div>
   )
 ) : null;

return (
 <div className={clsx(
   "bg-white rounded-xl shadow-sm overflow-hidden",
   "transform transition-all duration-300",
   "hover:shadow-lg hover:-translate-y-1"
 )}>
   <div className={clsx(
     "p-6 h-full",
     "flex flex-col", 
     mode === 'select' ? "min-h-[200px]" : "min-h-[280px]",
     "relative",
   )}>
     <div className={clsx(
       "flex-1",
       mode === 'select' ? "mb-14" : "mb-16" // Отступ для кнопки
     )}>
       <div className="flex items-start gap-2">
         <h3 className="text-xl uppercase font-semibold text-gray-900 flex-1 min-h-[3.5rem]">
           {dealer.name}
         </h3>
         {dealer.rating && (
           <div className="flex items-center bg-yellow-50 px-2 py-1 rounded flex-shrink-0">
             <Star className="w-5 h-5 text-yellow-400" />
             <span className="ml-1 text-gray-700 font-medium">{dealer.rating}</span>
           </div>
         )}
       </div>

       {mode === 'select' ? (
         <div className={clsx(
           "py-2 px-3 rounded-lg mt-2",
           dealer.availability?.status === 'inStock' && dealer.availability.count > 0
             ? "bg-green-50"
             : "bg-orange-50"
         )}>
           <span className={clsx(
             "text-sm font-medium flex items-center gap-2",
             dealer.availability?.status === 'inStock' && dealer.availability.count > 0
               ? "text-green-700"
               : "text-orange-700"
           )}>
             {dealer.availability?.status === 'inStock' && dealer.availability.count > 0 ? (
               t('dealers.availability.inStock').replace('{count}', dealer.availability.count.toString())
             ) : (
               <>
                 <Clock className="w-4 h-4" />
                 {t('dealers.availability.preOrder')}
               </>
             )}
           </span>
         </div>
       ) : (
         <div className="mt-4 space-y-4">
           <div className="flex items-start">
             <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
             <p className="ml-3 text-gray-600 line-clamp-3">{dealer.address}</p>
           </div>

           {PhoneNumbers}

           {hasLocation && (
             <div className="cursor-pointer" onClick={handleMapClick}>
               <div className="relative h-32 rounded-lg overflow-hidden">
                 <Image 
                   src={staticMapUrl}
                   alt={`Карта ${dealer.name}`}
                   fill
                   className={clsx(
                     "object-cover transition-all duration-300",
                     isMapLoaded ? "opacity-100 hover:opacity-80" : "opacity-0"
                   )}
                   onLoad={handleMapLoad}
                   onError={handleMapError}
                 />
                 {!isMapLoaded && mapLoadAttempts < maxAttempts && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                     <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                   </div>
                 )}
                 {!isMapLoaded && mapLoadAttempts >= maxAttempts && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                     <div className="text-center px-4">
                       <p className="text-gray-500 text-sm mb-2">{t('dealers.mapLoadError')}</p>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setMapLoadAttempts(0);
                           setIsMapLoaded(false);
                         }}
                         className="text-primary text-sm hover:underline"
                       >
                         {t('dealers.retryLoad')}
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           )}
         </div>
       )}
     </div>

     <div className="absolute bottom-6 left-6 right-6">
       {mode === 'select' ? (
         <button
           onClick={handleDealerSelect}
           className={clsx(
             "w-full flex items-center justify-center",
             "px-4 py-2.5 rounded-lg transition-all duration-300",
             isSelected 
               ? "bg-primary/10 text-primary border-2 border-primary"
               : "bg-primary text-white hover:bg-primary/90"
           )}
         >
           {isSelected 
             ? t('dealers.availability.dealerSelected')
             : t('dealers.availability.chooseDealer')
           }
         </button>
       ) : (
         hasLocation && (
           <button
             onClick={handleMapClick}
             disabled={!isMapLoaded}
             className={clsx(
               "w-full flex items-center justify-center",
               "px-4 py-2.5 rounded-lg transition-all duration-300",
               isMapLoaded ? [
                 "bg-primary/10 text-primary",
                 "hover:bg-primary hover:text-white"
               ] : [
                 "bg-gray-100 text-gray-400 cursor-not-allowed"
               ]
             )}
           >
             <ExternalLink className="w-4 h-4 mr-2" />
             {isMapLoaded ? t('dealers.openMap') : t('dealers.loadingMap')}
           </button>
         )
       )}
     </div>
   </div>
 </div>
);
};