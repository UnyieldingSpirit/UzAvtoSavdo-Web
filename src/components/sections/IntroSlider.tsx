'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useLanguageStore } from '@/store/language';
import { useRouter } from 'next/navigation';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Slide {
  name: string;
  modelId: string;
  images: {
    uz: {
      desktop: string;
      mobile: string;
    };
    ru: {
      desktop: string;
      mobile: string;
    };
  };
}

// Обновленная структура данных слайдов с изображениями для обоих языков
const slides: Slide[] = [
  {
    name: 'Onix',
    modelId: '516',
    images: {
      uz: {
        desktop: '/img/cars/JA9NmG6VuxvuezTMad2IHDse9LAWOU5KxZcJRRyi.webp',
        mobile: 'https://chevrolet.uz/storage/images/sliders_mobile_uz/71/VNdOY4Lz4UwGLYHk63GThGpCOzfWLULh2Rrovwns.webp'
      },
      ru: {
        // Здесь укажите пути к изображениям для русского языка
        desktop: '/img/cars/desc2.webp', // Замените на реальный путь
        mobile: '/img/cars/mob-uz2.webp'    // Замените на реальный путь
      }
    }
  },
  {
    name: 'TRACKER-2',
    modelId: '445',
    images: {
      uz: {
        desktop: '/img/cars/fflPJFWkqb6LscWSs0dkdWHPHxb8fqCl7J2kj63J.webp',
        mobile: 'https://chevrolet.uz/storage/images/sliders_mobile_uz/72/uZR9lGaUdCURV3ccS5VDjnqBUnurSNrdx1KzkYF7.webp'
      },
      ru: {
        // Здесь укажите пути к изображениям для русского языка
        desktop: '/img/cars/desc1.webp', // Замените на реальный путь
        mobile: '/img/cars/mob-uz1.webp'    // Замените на реальный путь
      }
    }
  }
];




export const IntroSlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { currentLocale } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 770);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageClick = (modelId: string) => {
    router.push(`/cars/${modelId}`);
  };

  // Используем изображения в зависимости от текущего языка и устройства
  const getImageForSlide = (slide: Slide) => {
    // Проверка на наличие изображений для текущего языка
    const localeImages = slide.images[currentLocale as 'uz' | 'ru'];
    if (!localeImages) {
      // Если изображений для текущего языка нет, используем изображения для узбекского языка
      return isMobile ? slide.images.uz.mobile : slide.images.uz.desktop;
    }
    
    return isMobile ? localeImages.mobile : localeImages.desktop;
  };

  return (
    <div className="intro relative mt-[80px]">
      <Swiper
        className="intro__sl dots-white arrow-white arrow-mob"
        modules={[Pagination, Autoplay]}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        slidesPerView={1}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="intro__item"
          >
            <div className="banner-wrapper">
              <img 
                src={getImageForSlide(slide)}
                alt={`${slide.name} фото`}
                className="banner-image"
                onClick={() => handleImageClick(slide.modelId)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Стили непосредственно для этого компонента - без риска конфликтов */}
      <style jsx global>{`
        .intro {
          width: 100%;
          height: auto;
          overflow: hidden;
        }
        
        .intro__sl {
          width: 100% !important;
        }

        .banner-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
        }
        
        .banner-image {
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }
        
        .banner-content {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }
        
        .banner-title {
          background-color: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
        }
        
        .banner-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        @media (min-width: 768px) {
          .banner-content {
            bottom: 4rem;
            right: 4rem;
          }
          
          .banner-buttons {
            flex-direction: row;
          }
        }

        .swiper-pagination-bullet {
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          transform: scale(1.3);
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};