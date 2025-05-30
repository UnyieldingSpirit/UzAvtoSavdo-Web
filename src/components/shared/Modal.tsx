import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import Image from 'next/image';

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div className={clsx("flex justify-end gap-4 pt-6", className)}>
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4'
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = 'md',
  footer
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-40"
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={clsx(
                  'w-full transform rounded-lg bg-white p-6',
                  'shadow-xl transition-all',
                  'relative',
                  sizeClasses[size],
                  className
                )}
              >
                {/* Изображение поверх модального окна */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-40">
                  <div className="relative w-full h-full">
                    <Image
                      src="https://i.imgur.com/ZqR1Pag.jpg"
                      alt="Декоративный элемент"
                      width={160}
                      height={40}
                      className="object-contain"
                      style={{
                        mixBlendMode: 'multiply', // Помогает убрать светлый фон
                        filter: 'brightness(1.1) contrast(1.2)' // Улучшает видимость объекта
                      }}
                      priority
                    />
                  </div>
                </div>
                
                {/* Остальное содержимое модального окна */}
                <div className="relative z-20 mt-10"> {/* Добавлен отступ сверху для изображения */}
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between mb-4">
                      {title && (
                        <Dialog.Title className="text-lg font-semibold text-gray-dark">
                          {title}
                        </Dialog.Title>
                      )}
                      {showCloseButton && (
                        <button
                          onClick={onClose}
                          className={clsx(
                            "rounded-full p-2 transition-colors",
                            "hover:bg-gray-light focus:outline-none",
                            "focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                          )}
                        >
                          <X className="h-5 w-5 text-gray" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className={contentClassName}>
                    {children}
                  </div>

                  {footer && (
                    <ModalFooter>
                      {footer}
                    </ModalFooter>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );  
};