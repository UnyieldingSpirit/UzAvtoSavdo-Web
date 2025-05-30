'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image"; 
import Link from "next/link";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, X, FlaskConical } from 'lucide-react';
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
  const [showTestInfo, setShowTestInfo] = useState(false);
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[21] bg-primary">
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
              <div className="hidden lg:flex items-center gap-4">
                {/* Кнопка-бейдж тестового режима для десктопа */}
                <div className="relative">
                  <button
                    onClick={() => setShowTestInfo(!showTestInfo)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>{t('header.testMode.message') || 'Сайт в режиме тестирования'}</span>
                  </button>

                  {/* Выпадающая подсказка */}
                  <AnimatePresence>
                    {showTestInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 text-gray-700"
                      >
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
                        <h4 className="font-semibold mb-2">{t('header.testMode.infoTitle') || 'Информация о тестировании'}</h4>
                        <p className="text-sm text-gray-600">
                          {t('header.testMode.infoText') || 'Некоторые функции могут работать нестабильно. Мы активно работаем над улучшением сервиса.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AuthButton />
                <LanguageSwitcher />
              </div>
              
              <div className="lg:hidden flex items-center gap-2">
                {/* Компактная версия для мобильных */}
                <button
                  onClick={() => setShowTestInfo(!showTestInfo)}
                  className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t('header.testMode.short') || 'Тест'}</span>
                </button>
                
                <AuthButton />
                <LanguageSwitcher />
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#4BA82E]/10 transition-colors ml-1"
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

        {/* Мобильная версия выпадающей информации */}
        <AnimatePresence>
          {showTestInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-orange-500/90 backdrop-blur-sm overflow-hidden"
            >
              <div className="container-fluid px-4 py-3">
                <p className="text-sm text-white">
                  {t('header.testMode.infoText') || 'Некоторые функции могут работать нестабильно. Мы активно работаем над улучшением сервиса.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[80px] z-50 lg:hidden bg-black/30 overflow-hidden"
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
    </>
  );
};