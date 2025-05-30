import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Percent, InfoIcon, ChevronDown, Calendar, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const InstallmentCalculator = ({ 
  price, 
  tPayment, 
  installmentActions = [],
  onInstallmentConfigured,
  currentLocale
}) => {
  // Для отображения валюты в зависимости от языка
  const currencySymbol = currentLocale === 'uz' ? "so'm" : "сум";
  
  // Проверка наличия данных от API
  const hasApiData = installmentActions && installmentActions.length > 0;
  const isInstallmentAvailable = hasApiData && installmentActions.some(action => action.price && action.payment_months);
  
  // Состояния
  const [selectedAction, setSelectedAction] = useState(null);
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  
  // Используем useRef для отслеживания первого рендера
  const isFirstRender = useRef(true);
  const lastCalculation = useRef(null);
  
  // Выбираем по умолчанию первое действие при загрузке, если данные есть
  useEffect(() => {
    if (hasApiData && isInstallmentAvailable && installmentActions[0] && !selectedAction) {
      setSelectedAction(installmentActions[0]);
    }
  }, [hasApiData, installmentActions, selectedAction, isInstallmentAvailable]);

  // Функция расчета платежей
  const calculatePayments = () => {
    if (!isInstallmentAvailable) {
      return {
        actionId: '',
        originalPrice: price,
        installmentPrice: price,
        priceDifference: 0,
        priceDifferencePercent: "0.00",
        downPayment: price / 2,
        downPaymentPercent: 50,
        period: 0,
        monthlyPayment: 0,
        totalPayment: price
      };
    }
    
    if (selectedAction) {
      const actionPrice = parseInt(selectedAction.price);
      const downPayment = parseInt(selectedAction.prepayment_amount);
      const period = parseInt(selectedAction.payment_months);
      const monthlyPayment = Number(selectedAction.month_pay);
      const totalPayment = downPayment + (monthlyPayment * period);
      
      // Разница между ценой в рассрочку и обычной ценой
      const priceDifference = actionPrice - price;
      const priceDifferencePercent = ((priceDifference / price) * 100).toFixed(2);
      
      return {
        actionId: selectedAction.action_id,
        originalPrice: price,
        installmentPrice: actionPrice,
        priceDifference,
        priceDifferencePercent,
        downPayment,
        downPaymentPercent: parseInt(selectedAction.prepayment_percent),
        period,
        monthlyPayment,
        totalPayment
      };
    }
    
    // Если нет данных API, делаем стандартный расчет
    const downPayment = Math.round(price * 0.5); // 50% первоначальный взнос
    const period = 30; // По умолчанию 30 месяцев
    // Расчетная наценка в случае рассрочки (+10%)
    const installmentPrice = Math.round(price * 1.1);
    const priceDifference = installmentPrice - price;
    const monthlyPayment = Math.round((installmentPrice - downPayment) / period);
    
    return {
      actionId: '',
      originalPrice: price,
      installmentPrice,
      priceDifference,
      priceDifferencePercent: "10.00",
      downPayment,
      downPaymentPercent: 50,
      period,
      monthlyPayment,
      totalPayment: downPayment + (monthlyPayment * period)
    };
  };
  
  // Обновляем конфигурацию ТОЛЬКО в определенных случаях, чтобы избежать бесконечного цикла
  useEffect(() => {
    // Пропускаем первый рендер
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Вычисляем текущие платежи
    const currentPayments = calculatePayments();
    
    // Проверяем, изменились ли платежи существенно
    const hasChanged = !lastCalculation.current || 
      JSON.stringify(lastCalculation.current) !== JSON.stringify(currentPayments);
    
    // Если есть изменения и callback предоставлен - вызываем его
    if (hasChanged && onInstallmentConfigured) {
      // Сохраняем последний расчет
      lastCalculation.current = currentPayments;
      
      // Используем setTimeout, чтобы избежать проблем с циклом рендеринга
      setTimeout(() => {
        onInstallmentConfigured(currentPayments);
      }, 0);
    }
  }, [selectedAction, price, onInstallmentConfigured, isInstallmentAvailable]);

  // Получаем график платежей для визуализации
  const getPaymentSchedule = () => {
    const payments = calculatePayments();
    if (payments.period === 0 || payments.monthlyPayment === 0) {
      return [];
    }
    
    const today = new Date();
    return Array.from({ length: Math.min(payments.period, 12) }, (_, i) => {
      const paymentDate = new Date(today);
      paymentDate.setMonth(today.getMonth() + i + 1);
      
      return {
        month: i + 1,
        amount: payments.monthlyPayment,
        date: paymentDate.toLocaleDateString(currentLocale === 'uz' ? 'uz-UZ' : 'ru-RU', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })
      };
    });
  };

  // Если загружаем данные, показываем прелоадер
  if (hasApiData && !selectedAction && isInstallmentAvailable) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500">{tPayment('payment.loading')}</p>
      </div>
    );
  }

  // Если рассрочка недоступна, показываем уведомление
  if (!isInstallmentAvailable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-700">{tPayment('payment.installmentNotAvailable')}</h4>
            <p className="text-sm text-yellow-600 mt-1">{tPayment('payment.chooseAnotherModification')}</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{tPayment('payment.carPrice')}</span>
            <span className="font-bold text-gray-900">
              {parseInt(price).toLocaleString()} {currencySymbol}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Вычисляем платежи прямо перед рендером
  const payments = calculatePayments();
  const paymentSchedule = getPaymentSchedule();

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Заголовок - Оплата в рассрочку */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-primary mr-2 md:mr-3" />
          <h3 className="font-semibold text-base md:text-lg text-gray-900">
            {tPayment('payment.installment')}
          </h3>
        </div>
        
        {/* Если разница в цене - показываем бейдж */}
        {/* {payments.priceDifference > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            +{payments.priceDifferencePercent}% {tPayment('payment.priceDifference')}
          </span>
        )} */}
      </div>
    
      {/* Информация о первоначальном взносе */}
      <div className="p-3 md:p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-amber-200 p-1.5 md:p-2 rounded-full">
            <Percent className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm md:text-base text-amber-800">
              {payments.downPaymentPercent}%  - {tPayment('payment.downPayment')}
            </h4>
            <p className="text-xs md:text-sm text-amber-700 mt-0.5 md:mt-1">
              {`${payments.downPayment.toLocaleString()} ${currencySymbol}`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Информация о сроке рассрочки */}
      <div className="flex items-center p-2 md:p-3 bg-blue-50 rounded-lg">
        <InfoIcon className="text-blue-500 w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 flex-shrink-0" />
        <p className="text-xs md:text-sm text-blue-700">
          {`${tPayment('payment.period')}: ${payments.period} ${tPayment('payment.months')}`}
        </p>
      </div>
      
      {/* Выбор варианта рассрочки, если их несколько */}
      {/* {installmentActions.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {installmentActions.map((action) => (
            <button
              key={action.payment_months}
              onClick={() => setSelectedAction(action)}
              className={clsx(
                "p-3 rounded-lg border-2 text-sm transition-all",
                selectedAction?.action_id === action.action_id
                  ? "border-primary bg-primary/5 font-medium"
                  : "border-gray-200 hover:border-primary/60"
              )}
            >
              <div className="text-center">
                <div className="font-bold">{action.payment_months} {tPayment('payment.months')}</div>
                <div className="text-xs text-gray-500 mt-1">{action.prepayment_percent}% {tPayment('payment.initialFee')}</div>
              </div>
            </button>
          ))}
        </div>
      )} */}
      
      {/* Результат расчета */}
      <div className="bg-primary/5 p-4 md:p-5 rounded-xl">
        <div className="space-y-3 md:space-y-4">
          {/* Стоимость в рассрочку с показом разницы */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-gray-700">{tPayment('payment.carPrice')}</span>
              <span className="font-bold text-sm md:text-base text-gray-900">
                {`${payments.installmentPrice.toLocaleString()} ${currencySymbol}`}
              </span>
            </div>
            
            {/* {payments.priceDifference > 0 && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-amber-600">
                  +{payments.priceDifference.toLocaleString()} {currencySymbol} {tPayment('payment.toBasePrice')}
                </span>
              </div>
            )} */}
          </div>
          
          {/* Первоначальный взнос */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-700">{tPayment('payment.downPayment')} </span>
            <span className="font-bold text-sm md:text-base">
              {`${payments.downPayment.toLocaleString()} ${currencySymbol}`}
            </span>
          </div>
          
          {/* Ежемесячный платеж */}
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-700">{tPayment('payment.monthlyPayment')}</span>
            <span className="font-bold text-lg md:text-xl text-primary">
              {`${Math.round(payments.monthlyPayment).toLocaleString()} ${currencySymbol}`}
            </span>
          </div>
          
          <hr className="border-t border-gray-200" />
          
          {/* Общая сумма выплат */}
          <div className="flex justify-between items-center font-medium">
            <span className="text-sm md:text-base text-gray-700">{tPayment('payment.totalPayment')}</span>
            <span className="font-bold text-sm md:text-base">
              {`${Math.round(payments.totalPayment).toLocaleString()} ${currencySymbol}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* График платежей (показывается по кнопке) */}
      {/* {payments.period > 0 && (
        <div>
          <button
            onClick={() => setShowPaymentSchedule(!showPaymentSchedule)}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {showPaymentSchedule ? tPayment('payment.hideSchedule') : tPayment('payment.showSchedule')}
              </span>
            </div>
            <ChevronDown className={clsx(
              "w-4 h-4 text-gray-600 transition-transform",
              showPaymentSchedule ? "rotate-180" : ""
            )} />
          </button>
          
          <AnimatePresence>
            {showPaymentSchedule && paymentSchedule.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden"
              >
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">{tPayment('payment.scheduleTitle')}</h4>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 text-left">
                            {tPayment('payment.scheduleNumber')}
                          </th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 text-left">
                            {tPayment('payment.scheduleDate')}
                          </th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 text-right">
                            {tPayment('payment.scheduleAmount')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentSchedule.map((payment, index) => (
                          <tr key={index} className={index % 2 ? "bg-gray-50" : ""}>
                            <td className="px-3 py-2 text-sm text-gray-700">
                              {payment.month}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700">
                              {payment.date}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-700 text-right font-medium">
                              {Math.round(payment.amount).toLocaleString()} {currencySymbol}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {payments.period > paymentSchedule.length && (
                    <div className="p-3 border-t border-gray-200 text-center">
                      <span className="text-sm text-gray-500">
                        {tPayment('payment.morePayments')} {payments.period - paymentSchedule.length}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )} */}
      
      {/* Стили для скроллбара */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #999;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </div>
  );
};

export default InstallmentCalculator;