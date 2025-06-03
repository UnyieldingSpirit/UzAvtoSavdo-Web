'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, Clock, Shield, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import { translations } from '@/app/profile/profile.localization';
import { Contract } from '@/types/contract';
import { formatPrice } from '@/utils/payment';
import { useLanguageStore } from '@/store/language';
import { useAuthStore } from '@/store/auth';

interface Payment {
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'future' | 'overdue' | 'partially-paid';
  isPaymentDay: boolean;
}

interface InstallmentDetails {
  totalAmount: number;
  prepaymentAmount: number;
  monthlyPayment: number;
  remainingAmount: number;
  paidAmount: number;
  paidPercentage: number;
  nextPaymentDate: Date | null;
}

interface InstallmentCardProps {
  contract: Contract;
}

export const InstallmentCard = ({ contract }: InstallmentCardProps) => {
  const { t } = useTranslation(translations);
  const { currentLocale } = useLanguageStore();
  const { userInfo } = useAuthStore();
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, ] = useState<string>('');
  const [installmentDetails, setInstallmentDetails] = useState<InstallmentDetails>({
    totalAmount: 0,
    prepaymentAmount: 0,
    monthlyPayment: 0,
    remainingAmount: 0,
    paidAmount: 0,
    paidPercentage: 0,
    nextPaymentDate: null,
  });
  const [payments, setPayments] = useState<Payment[]>([]);

  // Определяем отображение валюты в зависимости от языка
  const currencyLabel = currentLocale === 'ru' ? 'сум' : 'so\'m';

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t('testDrive.errors.invalidDate');
    
    const currentLocale = useLanguageStore.getState().currentLocale;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const uzMonths = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];
    
    const ruMonths = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    if (currentLocale === 'uz') {
      return `${day}-${uzMonths[month]} ${year}-yil`;
    } else {
      return `${day} ${ruMonths[month]} ${year} г.`;
    }
  }, [t]);

  const calculatePaidMonths = (
    totalPrice: number,
    prepaymentAmount: number,
    remainingAmount: number,
    monthlyPayment: number
  ) => {
    const rawMonths = (totalPrice - prepaymentAmount - remainingAmount) / monthlyPayment;
    const decimalPart = rawMonths % 1;
    const fullPaidMonths = decimalPart >= 0.9 ? Math.ceil(rawMonths) : Math.floor(rawMonths);
    const isPartiallyPaid = decimalPart > 0 && decimalPart < 0.9;
    return { fullPaidMonths, isPartiallyPaid };
  };

  const getNextPaymentDate = (currentDate: Date, monthDay: number): Date => {
    const nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), monthDay);
    if (currentDate.getDate() > monthDay) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    return nextPaymentDate;
  };

  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return new Date();
    
    try {
      const [day, month, year] = dateString.split('.').map(num => parseInt(num));
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  };

  useEffect(() => {
    const initializeData = () => {
      try {
        const totalAmount = parseFloat(contract.price_action || '0');
        const prepaymentAmount = parseFloat(contract.prepayment_amount || '0');
        const remainingAmount = parseFloat(contract.remain_amount || '0');
        const paidAmount = parseFloat(contract.paid_amount || '0');
        const totalMonths = parseInt(contract.month || '36');
        const monthDay = parseInt(contract.month_day || '15');
        const currentDate = new Date();
        
        const monthlyPayment = (totalAmount - prepaymentAmount) / totalMonths;
        
        const { fullPaidMonths, isPartiallyPaid } = calculatePaidMonths(
          totalAmount,
          prepaymentAmount,
          remainingAmount,
          monthlyPayment
        );
        
        const paidPercentage = (paidAmount / totalAmount) * 100;

        setInstallmentDetails({
          totalAmount,
          prepaymentAmount,
          monthlyPayment,
          remainingAmount,
          paidAmount,
          paidPercentage,
          nextPaymentDate: getNextPaymentDate(currentDate, monthDay)
        });

        const startDate = parseDate(contract.order_date);
        const generatedPayments = generatePayments(
          monthlyPayment,
          totalMonths,
          fullPaidMonths,
          isPartiallyPaid,
          startDate,
          monthDay
        );
        setPayments(generatedPayments);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, [contract]);

  const generatePayments = (
    monthlyPayment: number,
    totalMonths: number,
    fullPaidMonths: number,
    isPartiallyPaid: boolean,
    startDate: Date,
    monthDay: number
  ): Payment[] => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    return Array.from({ length: totalMonths }, (_, index) => {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + index, monthDay);
      
      const isCurrentMonth = paymentDate.getMonth() === currentDate.getMonth() && 
                            paymentDate.getFullYear() === currentDate.getFullYear();
      const isPaymentDay = isCurrentMonth;
      const isPaymentOverdue = today > monthDay;

      let status: Payment['status'];

      if (index < fullPaidMonths) {
        status = 'paid';
      } else if (index === fullPaidMonths) {
        status = isPartiallyPaid ? 'partially-paid' : 
                 (isCurrentMonth && isPaymentOverdue) ? 'overdue' : 'pending';
      } else {
        if (paymentDate < currentDate || (isCurrentMonth && isPaymentOverdue)) {
          status = 'overdue';
        } else if (isCurrentMonth) {
          status = 'pending';
        } else {
          status = 'future';
        }
      }

      return {
        date: paymentDate.toISOString(),
        amount: monthlyPayment,
        status,
        isPaymentDay
      };
    });
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'partially-paid':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'future':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    return t(`profile.paymentStatus.${status}`);
  };

  const filteredPayments = payments.filter(payment => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = formatDate(payment.date).toLowerCase().includes(searchLower) ||
           payment.amount.toString().includes(searchLower) ||
           getStatusText(payment.status).toLowerCase().includes(searchLower);
    
    if (!selectedRegion) {
      return matchesSearch;
    }
    
    return matchesSearch && contract.region === selectedRegion;
  });

  // Функция для генерации URL оплаты
  const generatePaymentUrls = () => {
    const pinfl = userInfo?.inn || contract.inn || '';
    const monthlyPayment = installmentDetails.monthlyPayment;
    const urls = { asaka: '', payme: '' };

    if (parseFloat(contract.remain_amount) > 0 && monthlyPayment > 0) {
      if (pinfl.length === 14) {
        // Физическое лицо
        urls.asaka = `https://my.asakabank.uz/payment?merchant_id=133&pinfl=${pinfl}&contract-number=${contract.contract_code}&contract-date=${contract.order_date}&pay-type=3&amount=${Math.round(monthlyPayment) * 100}`;
        urls.payme = `https://payme.uz/fallback/merchant/?id=5cd505543dd3183058ae7093&amount=${Math.round(monthlyPayment) * 100}&contract_d=${contract.order_date}&contract_n=${contract.contract_code}&payment_type=01&pinfl=${pinfl}`;
      } else {
        // Юридическое лицо - только Payme
        urls.payme = `https://payme.uz/fallback/merchant/?id=5cd505543dd3183058ae7093&amount=${Math.round(monthlyPayment) * 100}&contract_d=${contract.order_date}&contract_n=${contract.contract_code}&payment_type=02&inn=${pinfl}`;
      }
    }

    return urls;
  };

  const paymentUrls = generatePaymentUrls();
  const showPaymentButtons = parseFloat(contract.remain_amount) > 0;
  const pinfl = userInfo?.inn || contract.inn || '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-medium">{t('profile.paymentSchedule')}</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('profile.searchPayments')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          {!isNaN(installmentDetails.paidPercentage) && installmentDetails.paidPercentage > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('profile.progress')}</span>
                <span className="font-medium">{Math.floor(installmentDetails.paidPercentage)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${installmentDetails.paidPercentage}%` }}
                  className="h-full bg-primary"
                  transition={{ duration: 1 }}
                />
              </div>
            </>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">{t('profile.totalAmount')}</p>
            <p className="text-lg font-medium mt-1 text-gray-900">
              {formatPrice(installmentDetails.totalAmount)} {currencyLabel}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">{t('profile.paidAmount')}</p>
            <p className="text-lg font-medium mt-1 text-gray-900">
              {formatPrice(installmentDetails.paidAmount)} {currencyLabel}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">{t('profile.remainingAmount')}</p>
            <p className="text-lg font-medium mt-1 text-gray-900">
              {formatPrice(installmentDetails.remainingAmount)} {currencyLabel}
            </p>
          </div>
        </div>

        {/* Next Payment Info with Payment Buttons */}
        {installmentDetails.nextPaymentDate && showPaymentButtons && (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">{t('profile.nextPayment')}</p>
                  <p className="text-base text-blue-900 mt-1">
                    {formatDate(installmentDetails.nextPaymentDate.toISOString())}
                    <span className="ml-2 font-medium">
                      {formatPrice(installmentDetails.monthlyPayment)} {currencyLabel}
                    </span>
                  </p>
                </div>
              </div>
              
              {/* Payment Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Asaka Bank Button - только для физических лиц */}
                {pinfl.length === 14 && paymentUrls.asaka && (
                  <button
                    onClick={() => window.location.href = paymentUrls.asaka}
                    className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    {/* Фон с градиентом в красных тонах Asaka Bank */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C94A4A] to-[#B43E3E] opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Декоративный элемент */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    
                    {/* Контент кнопки */}
                    <div className="relative px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-3 mb-1">
                            {/* Белый логотип Asaka Bank */}
                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1.5">
                              <svg viewBox="0 0 24 24" width="28" height="28">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.86642 18.9738L2.36855 20.4734C1.57997 21.2629 0.787882 22.0552 0 22.845V18.9777L0.00314953 18.9738H3.86642Z" fill="#C94A4A"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.2521 18.9738V24H1.15825L3.45413 21.7022L4.47787 20.6805L6.17942 18.9738H17.2521Z" fill="#C94A4A"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.2521 7.89519V17.3364H7.81843C10.9186 14.2355 14.1079 11.0419 17.2521 7.89519Z" fill="#C94A4A"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M24 1.13298V24H18.8876V6.25395C19.8101 5.33085 20.7324 4.40669 21.6517 3.48359L24 1.13298Z" fill="#C94A4A"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M22.819 0C16.6525 6.17944 10.8292 12.0123 5.50544 17.3365H1.61946L18.7336 0H22.819Z" fill="#C94A4A"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.4335 0L0 16.6481V0H16.4335Z" fill="#C94A4A"></path>
                              </svg>
                            </div>
                            <span className="text-white font-semibold text-base">
                              {t('profile.paymentSection.payWithAsaka')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                )}

                {/* Payme Button - для всех */}
                {paymentUrls.payme && (
                  <button
                    onClick={() => window.location.href = paymentUrls.payme}
                    className={clsx(
                      "group relative overflow-hidden rounded-xl transition-all duration-300",
                      "hover:transform hover:scale-[1.02] hover:shadow-lg",
                      pinfl.length !== 14 && "sm:col-span-2"
                    )}
                  >
                    {/* Фон с градиентом */}
                    <div className="absolute inset-0 bg-[#00CCCC] opacity-90 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Декоративный элемент */}
                    <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    
                    {/* Контент кнопки */}
                    <div className="relative px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-3 mb-1">
                            {/* Логотип Payme */}
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                              <img 
                                src="https://api.logobank.uz/media/logos_png/payme-01.png" 
                                alt="Payme" 
                                className="w-full h-full object-contain scale-150"
                              />
                            </div>
                            <span className="text-white font-semibold text-base">
                              {t('profile.paymentSection.payWithPayme')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Информационная подсказка */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-600">
                  {currentLocale === 'ru' 
                    ? 'Платеж будет обработан в защищенном режиме через официальный сайт платежной системы'
                    : "To'lov rasmiy to'lov tizimi saytida xavfsiz rejimda amalga oshiriladi"
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payments List */}
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-3 text-sm font-medium text-gray-500 px-4">
            <span>{t('profile.date')}</span>
            <span>{t('profile.amount')}</span>
            <span>{t('profile.statuss')}</span>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('profile.noPayments')}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPayments.map((payment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={clsx(
                    "border rounded-lg",
                    expandedPayment === index ? "bg-gray-50" : "bg-white"
                  )}
                >
                  {/* Desktop View */}
                  <div className="hidden sm:grid grid-cols-3 items-center p-4">
                    <span className="text-sm">{formatDate(payment.date)}</span>
                    <span className="text-sm font-medium">
                      {formatPrice(payment.amount)} {currencyLabel}
                    </span>
                    <span className={clsx(
                      "inline-flex px-3 py-1 rounded-full text-xs font-medium border w-fit",
                      getStatusColor(payment.status)
                    )}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>

                  {/* Mobile View */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setExpandedPayment(expandedPayment === index ? null : index)}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-left">{formatDate(payment.date)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatPrice(payment.amount)} {currencyLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={clsx(
                          "inline-flex px-2 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(payment.status)
                        )}>
                          {getStatusText(payment.status)}
                        </span>
                        <ChevronDown className={clsx(
                          "w-4 h-4 transition-transform",
                          expandedPayment === index && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {/* Mobile Expanded Details */}
                    <AnimatePresence>
                      {expandedPayment === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-gray-100"
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Дата платежа</span>
                              <span>{formatDate(payment.date)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Сумма платежа</span>
                              <span className="font-medium">{formatPrice(payment.amount)} {currencyLabel}</span>
                            </div>
                            {payment.isPaymentDay && (
                              <div className="mt-2 pt-2 border-t">
                                <span className="text-xs text-primary font-medium">
                                  Текущий платеж
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};