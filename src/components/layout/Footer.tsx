'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import translations from './Footer.localization';
import { Mail, Phone, MapPin, Bot, ChevronRight, ExternalLink, LinkIcon, Building2, Globe, Handshake, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation(translations);

  return (
    <footer className={clsx("bg-primary text-white py-6 sm:py-8 relative overflow-hidden", "border-t border-white/10", className)}>
      {/* Декоративные элементы для визуального интереса */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/3 blur-3xl"></div>
      
      <div className="container-fluid px-4 sm:px-6 relative z-10">
        {/* Верхний блок с логотипом и кнопкой дилеров */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-white/10">
          <div className="mb-4 md:mb-0">
            <Image
              src="/img/uzauto_logo.svg"
              alt="UzAuto Motors"
              width={160}
              height={50}
              className="h-10 w-auto brightness-[10]"
            />
          </div>
          
          <Link 
            href="/dealers"
            className="bg-white/10 hover:bg-white/20 transition-all rounded-xl overflow-hidden block"
          >
            <div className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                 <Building2 className="w-4 h-4" /> 
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('footer.findDealer')}</h4>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-white/80">
                    <span>{t('footer.viewDealers')}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Основные колонки контента футера */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Контактная информация */}
          <div className="md:col-span-3">
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-white" />
              </div>
              {t('footer.contacts')}
            </h3>
            <div className="space-y-3">
              <a href={`tel:${t('footer.phone')}`} 
                 className="group flex items-center hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">{t('footer.phone')}</span>
              </a>
              
              <a href={`mailto:${t('footer.email')}`} 
                 className="group flex items-center hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors break-all">{t('footer.email')}</span>
              </a>
              
              <div className="group p-2 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-1">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-white/80">{t('footer.address')}</p>
                    <p className="text-sm text-white/80">{t('footer.addresss')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Официальные сайты */}
          <div className="md:col-span-3">
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-white" />
              </div>
              {t('footer.site')}
            </h3>
            
            <div className="space-y-3">
              <a 
                href="https://uzautomotors.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm text-white/80 font-medium">UZAUTOMOTORS</span>
              </a>
              
              <a 
                href="https://chevrolet.uz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-sm text-white/80 font-medium">CHEVROLET</span>
              </a>
            </div>
            
            {/* Социальные сети: заголовок */}
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mt-6 mb-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <LinkIcon className="w-3.5 h-3.5 text-white" />
              </div>
              {t('footer.followSocial')}
            </h3>
            
            {/* Социальные сети: иконки */}
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://fb.com/UzAutoMotorsOfficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2]/80 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com/uzautomotorsofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-80 flex items-center justify-center hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.youtube.com/c/UzAutoMotors/videos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FF0000]/80 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              <a 
                href="https://t.me/uzautomotorscom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#28a8ea] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Приложения и Telegram ботов */}
          <div className="md:col-span-3">
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5 text-white" />
              </div>
              {t('footer.downloadApps')}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a href="https://apps.apple.com/uz/app/uzavtosavdo/id1438093426" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-white/70">{t('footer.appStore.prefix')}</div>
                  <div className="text-sm font-medium text-white">{t('footer.appStore.name')}</div>
                </div>
              </a>
              
              <a href="https://play.google.com/store/apps/details?id=uzavtosanoat.uz" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-white/70">{t('footer.googlePlay.prefix')}</div>
                  <div className="text-sm font-medium text-white">{t('footer.googlePlay.name')}</div>
                </div>
              </a>
            </div>
            
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
                </svg>
              </div>
              {t('footer.followUs')}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <a href="https://t.me/UzAvtoSavdo_bot" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#28a8ea]/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#28a8ea]" />
                </div>
                <div className="text-sm font-medium text-white">{t('footer.bot')}</div>
              </a>
              
              <a href="https://t.me/uzautomotorscom" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#28a8ea]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#28a8ea]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
                  </svg>
                </div>
                <div className="text-sm font-medium text-white">{t('footer.channel')}</div>
              </a>
            </div>
          </div>

          {/* ПАРТНЕРЫ (с иконкой рукопожатия) */}
          <div className="md:col-span-3">
            <h3 className="text-base font-bold text-white/90 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Handshake className="w-3.5 h-3.5 text-white" />
              </div>
              {t('footer.quickLinks')}
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Кибербезопасность - стандартизированный стиль */}
              <a 
                href="https://csec.uz/ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Image
                    src="/security-icon.png"
                    alt="Security"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{t('footer.cyberSecurity.title')}</h4>
                  <p className="text-xs text-white/70 mt-1">{t('footer.cyberSecurity.desc')}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </div>
              </a>
              
              {/* OneID - стандартизированный стиль */}
              <a 
                href="https://id.egov.uz/ru"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-all rounded-lg p-3 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">ONE ID</h4>
                  <p className="text-xs text-white/70 mt-1">{t('footer.oneIdDesc')}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-white/60">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};