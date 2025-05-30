import React from 'react';
import { MapPin, Phone, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
// import { useAuth } from '@/hooks/useAuth';

interface DealerProps {
  dealer: {
    dealer_id: string;
    name: string;
    address: string;
    phone_number: string[];
    availability?: {
      count: number;
      status: 'inStock' | 'preOrder'; 
    };
  };
  onSelect?: (dealerId: string) => Promise<void>;
  t: (key: string) => string;
  isSelected?: boolean;
}

export const TestDriveDealerCard = ({ dealer, t, isSelected, onSelect }: DealerProps) => {
  // const { handleAuthRequired } = useAuth();
  const hasPhones = Array.isArray(dealer.phone_number) && dealer.phone_number.length > 0;

  const handleDealerSelect = async () => {
    // if (!await handleAuthRequired()) {
    //   return;
    // }
    
    if (onSelect) {
      await onSelect(dealer.dealer_id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className={clsx(
        "bg-white rounded-xl overflow-hidden border-2 transition-all",
        isSelected ? "border-primary" : "border-gray-100"
      )}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Заголовок с индикатором выбора */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{dealer.name}</h3>
          
          {isSelected && (
            <div className="flex-shrink-0 bg-primary rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        {/* Информация */}
        <div className="flex-1 space-y-3 mb-5">
          {/* Адрес */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
            <p className="text-gray-600 text-sm line-clamp-2">{dealer.address}</p>
          </div>
          
          {/* Телефон */}
          {hasPhones && (
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <a href={`tel:${dealer.phone_number[0]}`} className="text-gray-600 text-sm hover:text-primary transition-colors">
                {dealer.phone_number[0]}
              </a>
            </div>
          )}
          
        </div>
        
        {/* Кнопка выбора */}
        <button
          onClick={handleDealerSelect}
          className={clsx(
            "w-full py-2.5 rounded-lg text-sm font-medium transition-all",
            "flex items-center justify-center gap-2",
            isSelected
              ? "bg-primary/10 text-primary"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isSelected 
            ? t('availability.dealerSelected')
            : t('availability.chooseDealer')
          }
        </button>
      </div>
    </motion.div>
  );
};