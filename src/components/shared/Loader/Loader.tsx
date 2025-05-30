'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, FileSearch, Shield, FileText, Send, Database, Server } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import translations from './Loader.localization';
import clsx from 'clsx';

const ContractProcessing = () => {
  const { t } = useTranslation(translations);
  const [step, setStep] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [particleCount] = useState(30);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Расширенная серия шагов с новыми иконками
  const steps = [
    { icon: FileSearch, text: t('processing.steps.documents') },
    { icon: Shield, text: t('processing.steps.verification') },
    { icon: Database, text: t('processing.steps.database') },
    { icon: Server, text: t('processing.steps.server') },
    { icon: FileCheck, text: t('processing.steps.contract') },
    { icon: FileText, text: t('processing.steps.details') },
    { icon: Send, text: t('processing.steps.signing') }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    const scanInterval = requestAnimationFrame(function animate() {
      setScanLine((prev) => (prev + 0.5) % 100);
      requestAnimationFrame(animate);
    });

    return () => {
      clearInterval(stepInterval);
      cancelAnimationFrame(scanInterval);
    };
  }, [steps.length]);

  const CurrentIcon = steps[step].icon;
  
  // Генерация частиц для фона
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.7 + 0.3
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#001030] via-[#001845] to-[#002060] z-50">
      {/* Фоновые анимированные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Сетка */}
        {Array.from({ length: isMobile ? 10 : 20 }).map((_, i) => (
          <motion.div
            key={`grid-h-${i}`}
            className="absolute h-px w-full bg-blue-400/10"
            style={{ top: `${i * (isMobile ? 10 : 5)}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleX: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
        
        {Array.from({ length: isMobile ? 10 : 20 }).map((_, i) => (
          <motion.div
            key={`grid-v-${i}`}
            className="absolute w-px h-full bg-blue-400/10"
            style={{ left: `${i * (isMobile ? 10 : 5)}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleY: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
        
        {/* Цифровые частицы */}
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className={clsx(
              "absolute rounded-full bg-blue-400/50",
              "blur-[0.5px]"
            )}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 0.7, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              y: {
                duration: 20 / particle.speed,
                repeat: Infinity,
                ease: "linear",
                repeatType: "reverse"
              },
              opacity: {
                duration: 10 / particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              },
              scale: {
                duration: 5 / particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
          />
        ))}

        {/* Декоративные цифровые линии кода */}
        <div className="absolute inset-0 pointer-events-none text-blue-400/30 text-xs overflow-hidden flex flex-wrap">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={`code-${i}`}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 5,
                delay: Math.random() * 10,
                repeat: Infinity,
                repeatDelay: Math.random() * 20
              }}
            >
              {Math.random().toString(36).substring(2, 10) + " "}
            </motion.div>
          ))}
        </div>
      </div>

      <div className={clsx(
        "relative w-full mx-4",
        isMobile ? "max-w-sm" : "max-w-lg"
      )}>
        <motion.div 
          className={clsx(
            "bg-[#00205A]/40 backdrop-blur-lg rounded-2xl border border-blue-500/30",
            "shadow-[0_0_40px_rgba(0,30,100,0.5)]",
            isMobile ? "p-4" : "p-8"
          )}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 60, 220, 0.3)',
              '0 0 40px rgba(0, 60, 220, 0.6)',
              '0 0 20px rgba(0, 60, 220, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className={clsx(
            "relative",
            isMobile ? "h-48" : "h-60"
          )}>
            {/* Сканирующая линия */}
            <motion.div 
              className="absolute inset-x-0 h-0.5 bg-blue-400"
              style={{ 
                top: `${scanLine}%`,
                boxShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6'
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              {/* Пульсирующие кольца */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className={clsx(
                    "absolute border rounded-full",
                    ring === 1 ? "border-blue-400" : "border-blue-500/60"
                  )}
                  style={{
                    width: isMobile ? (100 + ring * 25) : (150 + ring * 30),
                    height: isMobile ? (100 + ring * 25) : (150 + ring * 30),
                  }}
                  animate={{
                    rotate: 360 * (ring % 2 === 0 ? 1 : -1),
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    rotate: { duration: 15 - ring * 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              ))}

              {/* Шестиугольная сетка */}
              <svg className="absolute w-full h-full opacity-20">
                <pattern id="hexagonPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path 
                    d="M25 0 L50 14.433 L50 43.3 L25 57.735 L0 43.3 L0 14.433 Z" 
                    fill="none" 
                    stroke="#4a90e2" 
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
              </svg>

              {/* Центральная иконка с анимацией появления/исчезновения */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ scale: 0, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0, opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="flex flex-col items-center z-10"
                >
                  <div className={clsx(
                    "bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4",
                    "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                    isMobile ? "p-4" : "p-6"
                  )}>
                    <CurrentIcon className={clsx(
                      "text-white",
                      isMobile ? "w-8 h-8" : "w-12 h-12"
                    )} />
                  </div>
                  <motion.p 
                    className={clsx(
                      "text-center font-medium",
                      isMobile ? "text-base" : "text-lg",
                      "text-blue-100"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {steps[step].text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Прогресс бар */}
          <div className={clsx(
            "mt-8",
            isMobile ? "px-2" : "px-4"
          )}>
            <motion.div 
              className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                animate={{
                  width: ["0%", "100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            <div className={clsx(
              "flex justify-between mt-2 text-blue-200/80",
              isMobile ? "text-xs" : "text-sm"
            )}>
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {t('processing.status.wait')}
              </motion.span>
              
              {/* Добавим счетчик времени */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <span className="text-blue-200/80 inline-block w-10 text-right">
                  <TimeCounter />
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Компонент для отображения времени обработки
const TimeCounter = () => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  return formatTime();
};

export default ContractProcessing;