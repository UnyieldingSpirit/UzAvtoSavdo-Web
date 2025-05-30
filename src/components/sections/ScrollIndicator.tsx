import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

// Добавляем локализацию
const translations = {
  "uz": {
    "scrollDown": "Pastga aylantiring"
  },
  "ru": {
    "scrollDown": "Прокрутите вниз"
  }
} as const;

interface ScrollIndicatorProps {
  textColor?: string;
  accentColor?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  textColor = "#003974",
  accentColor = "#4ba82e"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation(translations);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
       <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
  className="fixed bottom-10 right-1/2 translate-x-1/2 z-40 pointer-events-none"
>
  <div className="flex flex-col items-center">
    <motion.p 
      className="text-base font-semibold mb-3"
      style={{ color: textColor }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {t('scrollDown')}
    </motion.p>
    
    <motion.div
      animate={{ 
        y: [0, 12, 0], 
        opacity: [0.2, 1, 0.2]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg width="60" height="60" viewBox="0 0 40 40">
        <motion.path
          d="M20 5 L20 30 M12 22 L20 30 L28 22"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="20"
          cy="20"
          r="18"
          stroke={accentColor}
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  </div>
</motion.div>
      )}
    </AnimatePresence>
  );
};