'use client';

import { useCarsStore } from '@/store/models-cars';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/store/language';
import { CreditCard } from 'lucide-react';

const translations = {
  "uz": {
      "availableCars": {
          "title": "Modellar ro'yxati",
          "subtitle": "Hududingizdagi dilerlar zaxirasida mavjud avtomobillar bilan tanishing. Bu yerda Siz modifikatsiyalar tavsifi va joriy narxlarni topishingiz, shuningdek, o'zingizga yoqqan avtomobilni bir necha klik orqali rasmiylashtirishingiz mumkin.",
          "price": {
              "from": "Boshlang‘ich narxi",
              "installment": "Nasiya",
              "yes": "ha",
              "months": "oy",
              "monthly": "To‘lov",
              "available": "Muddatli to'lov",
              "creditInfo": "Hisoblar taxminiy. Aniq kredit shartlarini menejerdan tekshiring."
          },
          "specs": {
              "power": "Dvigatel quvvati",
              "transmission": "Uzatmalar qutisi",
              "engine": {
                  "title": "Dvigatel turi",
                  "type": "Benzin"
              },
              "drive": {
                  "title": "Uzatma",
                  "type": "Oldi"
              },
              "powerUnit": "o.k."
          },
          "equipment": {
              "title": "Jihozlash",
              "items": {
                  "climate": "Iqlim-nazorat",
                  "seats": "O'rindiqlar isitgichi", 
                  "cruise": "Kruiz-nazorat"
              }
          },
          "orderButton": "Avtomobilni rasmiylashtirish",
          "viewDetails": "Batafsil",
          "orderWithInstallment": "Nasiyaga rasmiylashtirish",
          "prepayment": "Boshlang'ich to'lov"
      }
  },
  "ru": {
      "availableCars": {
          "title": "Модельный ряд",
          "subtitle": "Посмотрите какие автомобили есть в наличии у дилеров в Вашем регионе. Здесь Вы найдете описание комплектаций и актуальные цены, а также сможете сравнить и забронировать понравившиеся автомобили одним кликом.",
          "price": {
              "from": "Стоимость от",
              "installment": "Рассрочка",
              "yes": "да",
              "months": "месяцев",
              "monthly": "Ежемесячный платеж",
              "available": "Доступна рассрочка",
              "creditInfo": "Расчёт приблизительный. Точные условия кредита уточняйте у менеджера."
          },
          "specs": {
              "power": "Мощность",
              "transmission": "Тип трансмиссии",
              "engine": {
                  "title": "Тип двигателя",
                  "type": "Бензиновый"
              },
              "drive": {
                  "title": "Привод",
                  "type": "Передний"
              },
              "powerUnit": "л.с."
          },
          "equipment": {
              "title": "Комплектация",
              "items": {
                  "climate": "Климат-контроль",
                  "seats": "Подогрев сидений",
                  "cruise": "Круиз-контроль"
              }
          },
          "orderButton": "Оформить машину",
          "viewDetails": "Подробнее",
          "orderWithInstallment": "Оформить в рассрочку",
          "prepayment": "Первоначальный взнос"
      }
  }
};

// Функция для агрегации характеристик с отладочной информацией
const aggregateSpecs = (modifications) => {
  // Проверяем наличие модификаций
  if (!modifications || !Array.isArray(modifications) || modifications.length === 0) {
    return {
      horsepower: '',
      transmission: ''
    };
  }
  
  // Для мощности находим уникальные значения и сортируем
  const horsepowers = [...new Set(modifications.map(mod => mod.horsepower))]
    .map(hp => {
      const parsed = parseInt(hp, 10);
      if (isNaN(parsed)) {
        // console.warn(`Не удалось преобразовать значение мощности "${hp}" в число`);
      }
      return parsed;
    })
    .filter(hp => !isNaN(hp))
    .sort((a, b) => a - b);
  
  // Для трансмиссии находим уникальные значения
  const transmissions = [...new Set(modifications.map(mod => mod.transmission))];
  
  // Форматируем мощность как диапазон или список
  let horsepowerDisplay = horsepowers[0] || '';
  if (horsepowers.length > 1) {
    horsepowerDisplay = `${horsepowers[0]} / ${horsepowers[horsepowers.length - 1]}`;
  }
  
  // Форматируем трансмиссию
  let transmissionDisplay = transmissions.join(' / ');
  // Если текст получается слишком длинным, сокращаем
  if (transmissionDisplay.length > 20) {
    transmissionDisplay = transmissions.map(t => {
      if (!t) return '';
      // Сокращаем "Автоматическая" до "Авт." и т.д.
      return t.replace(/Автоматическая/i, 'Авт.')
              .replace(/Механическая/i, 'Мех.')
              .replace(/Вариатор/i, 'Вар.')
              .replace(/ступенчатая/i, 'ст.');
    }).join(' / ');
  }
  
  const result = {
    horsepower: horsepowerDisplay,
    transmission: transmissionDisplay
  };
  
  return result;
};

export const AvailableCars = () => {
  const { t } = useTranslation(translations);
  const { currentLocale } = useLanguageStore();
  const { cars, isLoading, error, fetchCars } = useCarsStore();
  const [selectedCar, setSelectedCar] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Функция для проверки наличия экшенов рассрочки
  const checkInstallmentAvailability = (car) => {
    // Проверяем у модификации
    const firstMod = car.modifications[0];
    if (firstMod.actions && Array.isArray(firstMod.actions) && firstMod.actions.length > 0) {
      return {
        available: true,
        action: firstMod.actions[0]
      };
    }

    // Проверяем у самой машины
    if (car.actions && Array.isArray(car.actions) && car.actions.length > 0) {
      const modActions = car.actions.filter(action => 
        Math.abs(parseInt(action.price) - parseInt(firstMod.price)) < 1000000
      );
      
      if (modActions.length > 0) {
        return {
          available: true,
          action: modActions[0]
        };
      }
    }
    
    return {
      available: false,
      action: null
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg max-w-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="cars bg-white py-10" id="cars">
      <div className="container-fluid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="title text-center mb-12"
          suppressHydrationWarning
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 uppercase">
            {t('availableCars.title')}
          </h2>
          <p className="text-sm md:text-base font-light max-w-3xl mx-auto px-4">
            {t('availableCars.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cars.map((car) => {
            const firstMod = car.modifications[0];
            const installmentResult = checkInstallmentAvailability(car);
            const formattedImage = car.photo_sha666.startsWith('http') 
              ? car.photo_sha666 
              : `https://savdo.uzavtosanoat.uz/files/${car.photo_sha666}`;

            // Создаем объект с информацией о рассрочке, если она доступна
            let installmentInfo = null;
            
            if (installmentResult.available && installmentResult.action) {
              const action = installmentResult.action;
              
              // Получаем процент первоначального взноса из API
              const prepaymentPercent = parseInt(action.prepayment_percent || "0");
              
              const period = parseInt(action.payment_months);
              
              // Используем данные из экшена, если они есть, или вычисляем примерно
              const monthlyPayment = action.month_pay 
                ? parseFloat(action.month_pay) 
                : Math.round((parseInt(firstMod.price) * (1 - prepaymentPercent/100)) / period);
                
              installmentInfo = {
                prepaymentPercent,
                period,
                monthlyPayment,
                actionId: action.action_id
              };
            }

            // Получаем агрегированные спецификации для всех модификаций
            const aggregatedSpecs = aggregateSpecs(car.modifications);

            return (
              <CarCard 
                key={car.model_id}
                modelId={car.model_id}
                name={car.name}
                image={formattedImage}
                basePrice={parseInt(firstMod.price)}
                specs={aggregatedSpecs} // Используем агрегированные спецификации
                isExpanded={selectedCar === car.model_id}
                onToggle={() => setSelectedCar(selectedCar === car.model_id ? null : car.model_id)}
                showInfo={showInfo === car.model_id}
                onInfoToggle={() => setShowInfo(showInfo === car.model_id ? null : car.model_id)}
                isMobile={isMobile}
                t={t}
                currentLocale={currentLocale}
                installmentInfo={installmentInfo}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

function CarCard({
  modelId,
  name,
  image,
  basePrice,
  specs,
  isExpanded,
  t,
  currentLocale,
  installmentInfo
}) {
  const router = useRouter();
  const normalizedName = typeof name === 'string' ? name.toUpperCase() : name;
  // Создаем повторяющийся контент карточки
  const cardContent = (
    <>
      {/* Верхняя часть с изображением */}
      <div className="w-full bg-gray-50/50 relative">          
        <div className="relative p-3 md:p-6 h-[220px]">
          <Image
            src={image}
            alt={`${name} фото`}
            fill
            className="object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
      
      {/* Информационная часть */}
      <div className="w-full p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
            {normalizedName}
          </h3>
          
          {/* Индикатор доступности рассрочки */}
          {installmentInfo && (
            <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              <span>{t('availableCars.price.available')}</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow space-y-4">
          {/* Блок с ценой */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">{t('availableCars.price.from')}</span>
              <span className="text-xl font-bold text-gray-900">
                {basePrice.toLocaleString()} {currentLocale === 'uz' ? "so'm" : "сум"}
              </span>
            </div>
            
            {/* Информация о рассрочке (если доступна) */}
            {installmentInfo && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-primary">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">{installmentInfo.period} {t('availableCars.price.months')}</span>
                  </div>
                  <div className="font-medium text-primary">
                    {installmentInfo.prepaymentPercent}%
                  </div>
                </div>
                
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{t('availableCars.price.monthly')}</span>
                  <span className="text-lg font-bold text-primary">
                    {`${Math.round(installmentInfo.monthlyPayment).toLocaleString()} ${currentLocale === 'uz' ? "so'm" : "сум"}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Характеристики */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 rounded-xl bg-gray-50">
              <span className="block text-gray-500 text-xs mb-1">{t('availableCars.specs.power')}</span>
              <span className="font-medium text-sm text-gray-900">{specs.horsepower} {t('availableCars.specs.powerUnit')}</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50">
              <span className="block text-gray-500 text-xs mb-1">{t('availableCars.specs.transmission')}</span>
              <span className="font-medium text-sm text-gray-900">{specs.transmission}</span>
            </div>
          </div>
        </div>

        {/* Кнопка оформления */}
        <div className="mt-6">
          <button
            onClick={(e) => {
              e.preventDefault(); // Предотвращаем действие по умолчанию для Link
              router.push(`/cars/${name}`);
            }}
            className={clsx(
              'w-full flex items-center justify-center',
              'px-4 py-3 rounded-xl bg-primary text-white',
              'text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
              installmentInfo && 'hover:-translate-y-0.5'
            )}
          >
            {t('availableCars.viewDetails')}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      layout
      animate={{ height: isExpanded ? 'auto' : 'auto' }}
      className={clsx(
        "cars__item bg-white overflow-hidden",
        "rounded-2xl border border-gray-100",
        "hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
        "transition-all duration-300 ease-in-out",
        "group relative",
          "cursor-pointer"
      )}
    >
      {/* Используем условный рендеринг для компонента Link */}
    <div className="flex flex-col h-full" onClick={() => router.push(`/cars/${name}`)}>
  {cardContent}
</div>
      
      {/* Угловой маркер для авто с рассрочкой */}
      {installmentInfo && (
        <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden">
          <div className="absolute top-0 right-0 w-0 h-0 
               border-t-[56px] border-t-primary 
               border-l-[56px] border-l-transparent"></div>
          <div className="absolute top-3 right-2 text-white">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
}