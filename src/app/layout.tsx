/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/layout.tsx
'use client';

import './globals.css'
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import Toast from '@/components/shared/Toast';
import { authApi } from '@/api/auth';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showScroll, setShowScroll] = useState(false);
  const [isTestBannerVisible, setIsTestBannerVisible] = useState(true);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);
   
  useEffect(() => {
    authApi.handleAuthCompletion();
  }, []);

  useEffect(() => {
    // Проверяем состояние баннера при загрузке
    const bannerHidden = localStorage.getItem('testBannerHidden');
    if (bannerHidden) {
      setIsTestBannerVisible(false);
    }

    // Слушаем изменения состояния баннера от Header
    const handleBannerChange = (event: CustomEvent) => {
      setIsTestBannerVisible(event.detail.isVisible);
    };

    window.addEventListener('testBannerVisibilityChange' as any, handleBannerChange);
    
    return () => {
      window.removeEventListener('testBannerVisibilityChange' as any, handleBannerChange);
    };
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://savdo.uzavtosanoat.uz/favicon.ico" />
        <link rel="shortcut icon" href="https://savdo.uzavtosanoat.uz/favicon.ico" />
      </head>
      <body>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(102607686, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img 
              src="https://mc.yandex.ru/watch/102607686" 
              style={{ position: "absolute", left: "-9999px" }} 
              alt="" 
            />
          </div>
        </noscript>

        <Header />
        {/* Обёртка с динамическим отступом */}
        <div 
          className={clsx(
            "min-h-screen transition-all duration-300",
            isTestBannerVisible ? "pt-[48px]" : "pt-[0px]" 
          )}
        >
          {children}
        </div>
        <button
          onClick={scrollTop}
          className={clsx(
            "fixed bottom-8 right-8 z-50",
            "w-12 h-12 rounded-full",
            "bg-[#4ba82e] hover:bg-[#34861c]",
            "flex items-center justify-center",
            "text-white shadow-lg", 
            "transition-all duration-300",
            showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          )}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <Toast />
        <Footer />
      </body>
    </html>
  )
}