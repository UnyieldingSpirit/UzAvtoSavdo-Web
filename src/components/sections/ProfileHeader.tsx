'use client';

import { User, Phone, Mail, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { translations } from '@/app/profile/profile.localization';
import { useAuthStore } from '@/store/auth';

export const ProfileHeader = () => {
 const { t } = useTranslation(translations);
 const [isMobile, setIsMobile] = useState(false);
 const { userInfo } = useAuthStore();
 
 useEffect(() => {
   const checkMobile = () => setIsMobile(window.matchMedia('(hover: none)').matches);
   checkMobile();
   window.addEventListener('resize', checkMobile);
   return () => window.removeEventListener('resize', checkMobile);
 }, []);

 if (!userInfo) return null;

 // Удаляем все нецифровые символы из номера телефона
 const cleanPhoneNumber = userInfo.phone_number.replace(/\D/g, '');
 // Форматируем телефон с единым стилем, добавляя "+" только если его еще нет
 const formattedPhone = cleanPhoneNumber.length === 12 
   ? `+${cleanPhoneNumber.slice(0, 3)} ${cleanPhoneNumber.slice(3, 5)} ${cleanPhoneNumber.slice(5, 8)} ${cleanPhoneNumber.slice(8, 10)} ${cleanPhoneNumber.slice(10)}`
   : `+${cleanPhoneNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`;

 // Если email существует, преобразуем его к нижнему регистру
 const formattedEmail = userInfo.email ? userInfo.email.toLowerCase() : '';

 return (
   <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
     <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
       <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
         <div className="space-y-2">
           <div className="flex items-start gap-3">
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
               <User className="w-5 h-5 text-primary" />
             </div>
             <div className="space-y-3">
               <div>
                 <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                   {userInfo.name}
                 </h1>
                 <p className="text-sm text-gray-500 mt-1">
                   {t(userInfo.client_kind === 'N' ? 'profile.clientTypes.individual' : 'profile.clientTypes.entity')}
                 </p>
               </div>

               <div className="grid gap-2">
                 <div className="flex items-center gap-2">
                   <Phone className="w-4 h-4 text-gray-400" />
                   <p className="text-sm text-gray-500">{formattedPhone}</p>
                 </div>

                 {formattedEmail && (
                   <div className="flex items-center gap-2">
                     <Mail className="w-4 h-4 text-gray-400" />
                     <p className="text-sm text-gray-500">{formattedEmail}</p>
                   </div>
                 )}

                 <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4 text-gray-400" />
                   <p className="text-sm text-gray-500">{t('profile.idNumber')}: {userInfo.inn}</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <motion.button 
           className={clsx(
             "flex items-center gap-2 px-4 py-2 rounded-lg",
             "text-sm font-medium transition-colors",
             "bg-gray-50 border border-gray-200",
             !isMobile && "hover:bg-gray-100 hover:text-gray-900",
             isMobile && "active:bg-gray-100 active:text-gray-900",
             "text-gray-700"
           )}
           whileTap={!isMobile ? { scale: 0.95 } : undefined}
           onClick={() => {
             localStorage.clear();
             window.location.href = '/';
           }}
         >
           <User className="w-4 h-4" />
           <span>{t('profile.logout')}</span>
         </motion.button>
       </div>
     </div>
   </div>
 );
};