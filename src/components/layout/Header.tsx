// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import {
 User, Menu, X,
 // Sparkles, Rocket, Code2, Zap
} from 'lucide-react';
import translations from "./Header.localization";
import { CaptchaModal } from "../sections/CaptchaModal";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useContractStore } from '@/store/selected-car';

interface Props {
 className?: string;
}

interface NavItem {
 label: keyof typeof translations.ru.header.nav;
 href: string;
}

const mainNavItems: NavItem[] = [
 { label: "home", href: "/" },
 { label: "services", href: "/services" },
 { label: "drive", href: "/drive" },
];

const sideVariants = {
 closed: {
   x: "-100%",
   transition: {
     staggerChildren: 0.1,
     staggerDirection: -1
   }
 },
 open: {
   x: 0,
   transition: {
     staggerChildren: 0.1,
     staggerDirection: 1
   }
 }
};

const itemVariants = {
 closed: {
   x: -20,
   opacity: 0
 },
 open: {
   x: 0,
   opacity: 1
 }
};

export const Header: React.FC<Props> = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [mounted, setMounted] = useState(false);
 const [isTestBannerVisible, setIsTestBannerVisible] = useState(true);
 const { t } = useTranslation(translations);
 const pathname = usePathname();
 const { resetDealerState } = useContractStore();

 const handleNavClick = (href: string) => {
   if (pathname === '/dealers' && href !== '/dealers') {
     resetDealerState();
     localStorage.removeItem('selected_dealer_id');
     localStorage.removeItem('selected_modification');
     localStorage.removeItem('selected_color');
   }
 };

 useEffect(() => {
   setMounted(true);
   // Проверяем, не скрыл ли пользователь баннер ранее
   const bannerHidden = localStorage.getItem('testBannerHidden');
   if (bannerHidden) {
     setIsTestBannerVisible(false);
     // Отправляем событие при инициализации
     window.dispatchEvent(new CustomEvent('testBannerVisibilityChange', { 
       detail: { isVisible: false } 
     }));
   } else {
     // Отправляем событие что баннер виден
     window.dispatchEvent(new CustomEvent('testBannerVisibilityChange', { 
       detail: { isVisible: true } 
     }));
   }
 }, []);

 useEffect(() => {
   if (isMenuOpen) {
     document.body.style.overflow = 'hidden';
   } else {
     document.body.style.overflow = 'unset';
   }
   
   return () => {
     document.body.style.overflow = 'unset';
   };
 }, [isMenuOpen]);

 const handleCloseBanner = () => {
   setIsTestBannerVisible(false);
   // Отправляем событие об изменении видимости баннера
   window.dispatchEvent(new CustomEvent('testBannerVisibilityChange', { 
     detail: { isVisible: false } 
   }));
   // localStorage.setItem('testBannerHidden', 'true');
 };

 const AuthButton = () => {
   const { isAuthorized, handleAuthRequired } = useAuth();
   const router = useRouter();
   return isAuthorized ? (
     <Link
       href="/profile"
       onClick={async (e) => {
         e.preventDefault();
         handleNavClick('/profile');
         if (await handleAuthRequired('/profile')) {
           router.push('/profile');
         }
       }}
       className="flex items-center text-white hover:text-[#2EA894] transition-colors"
     >
       <User className="w-5 h-5" />
       <span className="hidden sm:inline ml-2">{t('header.auth.profile')}</span>
     </Link>
   ) : (
     <button
       onClick={() => handleAuthRequired()}
       className="flex items-center text-white hover:text-[#2EA894] transition-colors"
     >
       <User className="w-5 h-5" />
       <span className="hidden sm:inline ml-2">{t('header.auth.signIn')}</span>
     </button>
   );
 };

 if (!mounted) {
   return null;
 }

 const topOffset = isTestBannerVisible ? 'top-[48px]' : 'top-0';
 const mobileMenuOffset = isTestBannerVisible ? 'top-[128px]' : 'top-[80px]';

 return (
   <>
     {/* Стильная информационная полоса о тестовом режиме */}
     <AnimatePresence>
       {isTestBannerVisible && (
         <motion.div
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: 48, opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="fixed top-0 left-0 right-0 z-[22] overflow-hidden"
         >
           <div className="relative h-full bg-primary">
             {/* Анимированный фон */}
             <div className="absolute inset-0 bg-black/20"></div>
             
             <div className="relative container-fluid h-full">
               <div className="flex items-center justify-center gap-3 h-full px-4">
                 {/* Основной текст */}
                 <div className="flex items-center gap-2 text-white">
                   <p className="text-sm font-medium text-center flex items-center gap-1">
                     <span>{t('header.testMode.message') || 'Сайт в режиме бета-тестирования'}</span>
                   </p>
                 </div>

                 {/* Кнопка закрытия */}
                 <button
                   onClick={handleCloseBanner}
                   className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors group"
                   aria-label="Скрыть баннер"
                 >
                   <X className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                 </button>
               </div>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>

     {/* Основной хедер */}
     <header className={`fixed ${topOffset} left-0 right-0 z-[21] bg-primary transition-all duration-300`}>
       <div className="container-fluid">
         <div className="flex items-center justify-between h-[80px]">
           <div className="flex items-center space-x-6 lg:space-x-10">
             <Link 
               href="/"
               onClick={() => handleNavClick('/')} 
               className="block flex-shrink-0"
             >
               <Image
                 src="/img/uzauto_logo.svg"
                 alt="Logo"
                 width={137}
                 height={40}
                 className="w-[120px] lg:w-[137px] h-auto"
               />
             </Link>

             <nav className="hidden lg:block">
               <ul className="flex items-center space-x-8">
                 {mainNavItems.map((item) => (
                   <motion.li 
                     key={item.label}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     <Link
                       href={item.href}
                       onClick={() => handleNavClick(item.href)}
                       className="text-white hover:text-[#2EA894] text-lg font-light transition-colors duration-300"
                     >
                       {t(`header.nav.${item.label}`)}
                     </Link>
                   </motion.li>
                 ))}
               </ul>
             </nav>
           </div>

           <div className="flex items-center">
             <div className="hidden lg:flex items-center gap-6">
               <AuthButton />
               <LanguageSwitcher />
             </div>
             
             <div className="lg:hidden flex items-center gap-2">
               <AuthButton />
               <LanguageSwitcher />
               <button
                 className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#4BA82E]/10 transition-colors ml-2"
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                 {isMenuOpen ? (
                   <X className="w-5 h-5 text-white" />
                 ) : (
                   <Menu className="w-5 h-5 text-white" />
                 )}
               </button>
             </div>
           </div>
         </div>
       </div>

       <AnimatePresence>
         {isMenuOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className={`fixed inset-0 ${mobileMenuOffset} z-50 lg:hidden bg-black/30 overflow-hidden`}
             onClick={() => setIsMenuOpen(false)}
           >
             <motion.div
               initial="closed"
               animate="open"
               exit="closed"
               variants={sideVariants}
               className="h-full bg-primary w-full max-w-[320px] relative"
               onClick={e => e.stopPropagation()}
             >
               <div className="flex flex-col h-full p-6">
                 <ul className="space-y-6">
                   {mainNavItems.map((item) => (
                     <motion.li 
                       key={item.label}
                       variants={itemVariants}
                       whileHover={{ x: 10 }}
                       transition={{ type: "spring", stiffness: 300 }}
                     >
                       <Link
                         href={item.href}
                         className="block text-white hover:text-[#2EA894] text-lg font-light transition-colors duration-300"
                         onClick={() => {
                           handleNavClick(item.href);
                           setIsMenuOpen(false);
                         }}
                       >
                         {t(`header.nav.${item.label}`)}
                       </Link>
                     </motion.li>
                   ))}
                 </ul>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </header>
     
     <CaptchaModal />

     {/* Стили для градиентной анимации */}
     <style jsx>{`
       @keyframes gradient {
         0% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
         100% { background-position: 0% 50%; }
       }
       .animate-gradient {
         animation: gradient 5s ease infinite;
       }
     `}</style>
   </>
 );
};