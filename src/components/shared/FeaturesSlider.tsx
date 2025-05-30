'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface FeaturesSliderProps {
  options: Array<{
    name: string;
    description: string;
    imagesha?: string;
  }>;
  defaultImage: string; // Прямой URL изображения
}

export const FeaturesSlider = ({ options, defaultImage }: FeaturesSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState('240px');
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          buttonRef.current && 
          !dropdownRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Добавим эффект для определения оптимальной высоты изображения в зависимости от размера экрана
  useEffect(() => {
    const updateImageHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setImageHeight('180px');
      } else if (width < 768) {
        setImageHeight('220px');
      } else if (width < 1024) {
        setImageHeight('240px');
      } else {
        setImageHeight('280px');
      }
    };

    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => window.removeEventListener('resize', updateImageHeight);
  }, []);

  // Функция для форматирования URL изображения из imagesha
  const formatImageUrl = (imagesha?: string): string => {
    if (!imagesha) return defaultImage;
    return `https://uzavtosavdo.uz/b/core/m$load_image?sha=${imagesha}&width=400&height=400`;
  };

  if (!options.length) return null;
  const activeOption = options[activeIndex];

  return (
    <div className="relative bg-white rounded-xl">
      {/* Мобильная навигация */}
      <div className="relative md:hidden mb-4">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-left"
        >
          <span className="font-medium">{activeOption.name}</span>
          <ChevronDown className={clsx(
            "w-5 h-5 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>
        {isOpen && (
          <div 
            ref={dropdownRef}
            style={{
              top: buttonRef.current ? buttonRef.current.offsetHeight + 8 : 0,
              left: 0,
              right: 0,
              position: 'absolute'
            }}
            className="z-20 bg-white rounded-lg shadow-lg border border-gray-100  overflow-y-auto"
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left p-3",
                  "hover:bg-gray-50",
                  index === activeIndex && "text-primary font-medium"
                )}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Десктопная версия */}
      <div className="grid md:grid-cols-[1fr,2fr] gap-4">
        <div className="hidden md:flex flex-col">
          <div className="space-y-2 md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "w-full text-left p-3 rounded-lg transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  activeIndex === index ? "bg-primary text-white" : "bg-gray-50"
                )}
              >
                <h4 className={clsx(
                  "text-base font-medium mb-1",
                  activeIndex === index ? "text-white" : "text-gray-900"
                )}>
                  {option.name}
                </h4>
                <p className={clsx(
                  "text-sm line-clamp-2",
                  activeIndex === index ? "text-white/80" : "text-gray-600"
                )}>
                  {/* {option.description.replace(/<[^>]*>/g, '')} */}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          {/* Изменение контейнера изображения для большей адаптивности */}
         <div className="w-full flex justify-center items-center mb-4">
  <div
    className="w-full rounded-xl overflow-hidden"
    style={{ height: imageHeight }}
  >
    <Image
      src={formatImageUrl(activeOption.imagesha)}
      alt={activeOption.name}
      width={400}
      height={400}
      className="object-contain w-full h-full"
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  </div>
</div>
          <div 
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: activeOption.description }}
          />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};