import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/toast';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

const Toast = () => {
  const { message, type, isModal, hideToast } = useToastStore();

  // 🔒 Disable scroll when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // 🔁 Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModal]);

  if (!message || !type) return null;

  const icons = {
    error: <XCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />
  };

  if (isModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={clsx(
              "flex items-center gap-3 px-6 py-5 rounded-xl shadow-xl max-w-lg w-full",
              "border bg-white",
              type === 'error' && "text-red-600 border-red-200",
              type === 'success' && "text-green-600 border-green-200",
              type === 'warning' && "text-yellow-600 border-yellow-200"
            )}
          >
            <div className={clsx(
              "p-2 rounded-full",
              type === 'error' && "bg-red-50",
              type === 'success' && "bg-green-50",
              type === 'warning' && "bg-yellow-50"
            )}>
              {icons[type]}
            </div>
            <span className="text-base font-medium flex-1">{message}</span>
            <button
              onClick={hideToast}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Standard toast notification
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={clsx(
            "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg",
            "border backdrop-blur-sm",
            type === 'error' && "bg-red-50/90 text-red-600 border-red-200",
            type === 'success' && "bg-green-50/90 text-green-600 border-green-200",
            type === 'warning' && "bg-yellow-50/90 text-yellow-600 border-yellow-200"
          )}
        >
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={hideToast}
            className="ml-2 p-1 rounded-full hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Toast;