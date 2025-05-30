import React from 'react';
import { RefreshCw, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import clsx from 'clsx';
import { useCaptchaStore } from '@/store/captcha';
import { useProcessingStore } from '@/store/processing';
import { useToastStore } from '@/store/toast';
import translations from './CaptchaModal.localization';

const CAPTCHA_LENGTH = 6;

export const CaptchaModal = () => {
  const { t } = useTranslation(translations);
  const { isOpen, setIsOpen } = useCaptchaStore();
  const { isAuthorized } = useAuthStore();
  const { showToast } = useToastStore();
  const [captchaUrl, setCaptchaUrl] = React.useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [agreed, setAgreed] = React.useState(false);
  const [, setAttempts] = React.useState(0);
  const [retryTimer, setRetryTimer] = React.useState<number>(0);

  const mode = isAuthorized ? 'contract' : 'auth';

  const refreshCaptcha = React.useCallback(async () => {
    try {
      const url = await authApi.getCaptchaUrl();
      setCaptchaUrl(url);
      setCaptchaValue('');
      setError(null);
    } catch (err) {
      console.error('Error getting captcha:', err);
      setError(t('captcha.errors.loading'));
      showToast(t('captcha.errors.loading'), 'error');
    }
  }, [t, showToast]);

  React.useEffect(() => {
    if (isOpen && !captchaUrl) {
      refreshCaptcha();
    }
    if (!isOpen) {
      setCaptchaUrl(null);
      setCaptchaValue('');
      setError(null);
      setAgreed(false);
      setAttempts(0);
      setRetryTimer(0);
    }
  }, [isOpen, captchaUrl, refreshCaptcha]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (retryTimer > 0) {
      interval = setInterval(() => {
        setRetryTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [retryTimer]);

  const validateCaptcha = (): boolean => {
    if (!captchaValue.trim()) {
      setError(t('captcha.errors.required'));
      return false;
    }
    if (!agreed) {
      setError(t('captcha.errors.agreement'));
      return false;
    }
    if (retryTimer > 0) {
      setError(t('captcha.errors.wait', { seconds: retryTimer }));
      return false;
    }
    return true;
  };

const handleSubmit = async () => {
    if (!validateCaptcha()) return;


    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'auth') {
        const result = await authApi.checkCaptcha(captchaValue);
        if (typeof result === 'string') {
          await authApi.openOneIdUrl(result);
          setIsOpen(false);
          showToast(t('captcha.success.auth'), 'success');
        } else {
          throw new Error(t('captcha.errors.invalid'));
        }
      } else {
        const modification_id = localStorage.getItem('selected_modification');
        const color_id = localStorage.getItem('selected_color');
        const dealer_id = localStorage.getItem('selected_dealer_id');

        if (!modification_id || !color_id || !dealer_id) {
          throw new Error(t('captcha.errors.missingData'));
        }

          await useProcessingStore.getState().submitContract({ 
            captcha: captchaValue, 
            t 
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Captcha error:', error);
      setAttempts(prev => prev + 1);
      setError(t('captcha.errors.invalid'));
      showToast(t('captcha.errors.invalid'), 'error');
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
};
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
      setCaptchaValue(value);
      setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && setIsOpen(false)}
      title={t(`captcha.title.${mode}`)}
      size="sm"
      footer={
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={clsx(
              "py-2.5 px-4 text-sm font-medium rounded-xl",
              "text-gray-700 bg-gray-100/80",
              "hover:bg-gray-200/80 active:bg-gray-200",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {t('captcha.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={clsx(
              "py-2.5 px-4 text-sm font-medium rounded-xl",
              "text-white bg-primary",
              "hover:bg-primary/90 active:bg-primary/80",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={isLoading || !captchaValue.trim() || !agreed || retryTimer > 0}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('captcha.verification')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {t('captcha.continue')}
              </span>
            )}
          </button>
        </div>
      }
      closeOnOverlayClick={!isLoading}
      className="bg-white"
      contentClassName="p-4"
    >
      <div className="space-y-4">
        <div className="relative h-[70px] bg-gray-50 rounded-xl flex items-center justify-center px-4">
          {captchaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={captchaUrl}
              alt="Captcha"
              className="max-h-full"
            />
          ) : (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          )}
          <button
            type="button"
            onClick={refreshCaptcha}
            disabled={isLoading || retryTimer > 0}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 right-4",
              "p-3 rounded-lg",
              "bg-white hover:bg-gray-50",
              "text-gray-400 hover:text-primary",
              "border border-gray-100",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={captchaValue}
            onChange={handleInputChange}
            placeholder={t('captcha.enterCode')}
            maxLength={CAPTCHA_LENGTH}
            className={clsx(
              "w-full py-2.5 px-4",
              "text-base text-center tracking-[0.2em]",
              "bg-white rounded-xl border-2",
              "placeholder:text-gray-400",
              "transition-all duration-200",
              error 
                ? "border-red-200 focus:border-red-300" 
                : "border-gray-100 focus:border-primary",
              "focus:outline-none focus:ring-4",
              error
                ? "focus:ring-red-100"
                : "focus:ring-primary/10",
              "disabled:bg-gray-50 disabled:cursor-not-allowed"
            )}
            disabled={isLoading || retryTimer > 0}
            required
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
          />

          {retryTimer > 0 && (
            <div className="text-center text-sm text-gray-500">
              {t('captcha.errors.wait', { seconds: retryTimer })}
            </div>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError(null);
              }}
              disabled={isLoading}
              className={clsx(
                "mt-1 w-4 h-4 rounded border-2",
                "border-gray-300 text-primary",
                "focus:ring-primary/20",
                "transition-colors duration-200",
                "cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <label htmlFor="agreement" className="flex-grow text-sm text-gray-600">
              <Link 
                href="https://lex.uz/docs/4396428"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                {t('captcha.agreement')}
              </Link>
            </label>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-2 text-red-500 px-2"
              >
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};