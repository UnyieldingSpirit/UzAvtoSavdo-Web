'use client';

import { FileText, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { translations } from '@/app/profile/profile.localization';

interface DocumentCardProps {
  contractNumber: string;
  orderDate: string;
}

export const DocumentCard = ({ contractNumber, orderDate }: DocumentCardProps) => {
  const { t } = useTranslation(translations);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(hover: none)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('oneIdSecretKey');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const downloadUrl = `https://uzavtosavdo.uz/t/core/get_order?id=${contractNumber}&token=${token}`;
      window.location.href = downloadUrl;

    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isLoading}
      className={clsx(
        "flex items-center gap-3 p-4 w-full rounded-xl border transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        !isMobile && [
          "border-gray-200 hover:border-primary",
          "group"
        ],
        isMobile && [
          "border-gray-200 active:border-primary",
          "touch-manipulation"
        ],
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={clsx(
        "p-3 rounded-lg",
        !isMobile && [
          "bg-gray-100 group-hover:bg-primary/10"
        ],
        isMobile && [
          "bg-gray-100 active:bg-primary/10"
        ]
      )}>
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <FileText className={clsx(
            "w-6 h-6",
            !isMobile && "text-gray-500 group-hover:text-primary",
            isMobile && "text-gray-500 active:text-primary"
          )} />
        )}
      </div>
      
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-gray-900">
          {t('profile.contract')} № {contractNumber}
        </p>
        <p className="text-xs text-gray-500 mt-1">{orderDate}</p>
      </div>

      <Download className={clsx(
        "w-5 h-5",
        !isMobile && "text-gray-400 group-hover:text-primary",
        isMobile && "text-gray-400 active:text-primary"
      )} />
    </button>
  );
};