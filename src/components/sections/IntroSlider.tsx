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
  modelId?: string;
  externalLink?: string;
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
    name: 'Kapitalbank Partnership',
    externalLink: 'https://chevrolet.uz/page/sovmestnoe-predlozenie-ot-ao-uzauto-motors-i-akb-kapitalbank',
    images: {
      uz: {
        desktop: 'https://chevrolet.uz/storage/images/sliders_uz/74/04UNIzir4w7H5Npn96edalML1LH46qmuBXBQ3Cp0.jpg',
        mobile: 'https://chevrolet.uz/storage/images/sliders_mobile_uz/74/7zx6qCxCEgVVIC0pDMmr1nToszkUCwTWOvqMgpWb.jpg'
      },
      ru: {
        desktop: 'https://chevrolet.uz/storage/images/sliders/74/PS1nwZu6IDkZXdHNkyMEiFaJow9vawRuUVL5UAnI.jpg',
        mobile: 'https://chevrolet.uz/storage/images/sliders_mobile_ru/74/fjf1y545RAKYMm0767vboifAse9BiLsQif7eTKtL.jpg'
      }
    }
  },
  {
    name: 'Onix',
    modelId: '516',
    images: {
      uz: {
        desktop: '/img/cars/JA9NmG6VuxvuezTMad2IHDse9LAWOU5KxZcJRRyi.webp',
        mobile: 'https://chevrolet.uz/storage/images/sliders_mobile_uz/71/VNdOY4Lz4UwGLYHk63GThGpCOzfWLULh2Rrovwns.webp'
      },
      ru: {
        desktop: '/img/cars/desc2.webp',
        mobile: '/img/cars/mob-uz2.webp'
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
        desktop: '/img/cars/desc1.webp',
        mobile: '/img/cars/mob-uz1.webp'
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

  const handleImageClick = (slide: Slide) => {
    if (slide.externalLink) {
      // Открываем внешнюю ссылку в новой вкладке
      window.open(slide.externalLink, '_blank', 'noopener,noreferrer');
    } else if (slide.modelId) {
      // Переходим на страницу автомобиля
      router.push(`/cars/${slide.modelId}`);
    }
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
                onClick={() => handleImageClick(slide)}
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
          transition: transform 0.3s ease;
        }
        
        .banner-image:hover {
          transform: scale(1.02);
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

        .swiper-pagination {
          position: absolute;
          bottom: 20px !important;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};

