import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Globe } from 'lucide-react';
import clsx from 'clsx';
import { useLanguageStore } from '@/store/language';
import { Fragment } from 'react';

interface Props {
  className?: string;
}

const languages = [
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: `O'zbekcha` }
] as const;

export const LanguageSwitcher: React.FC<Props> = ({ className }) => {
  const { currentLocale, setLocaleAndRefreshData } = useLanguageStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 991);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ru' ? 'uz' : 'ru';
    setLocaleAndRefreshData(nextLocale);
  };

  if (isMobile) {
    return (
      <button 
        onClick={toggleLanguage}
        className="flex items-center text-white hover:text-[#2EA894] px-2 py-1 rounded transition-colors duration-300"
      >
        <Globe className="w-5 h-5 md:mr-2" />
        <span className="hidden md:block">{languages.find(lang => lang.code === currentLocale)?.label || currentLocale.toUpperCase()}</span>
      </button>
    );
  }
  
  return (
    <Menu as="div" className={clsx("relative", className)}>
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center text-white hover:text-[#2EA894] px-2 py-1 rounded transition-colors duration-300">
            <Globe className="w-5 h-5 md:mr-2" />
            <span className="hidden md:block">{currentLocale.toUpperCase()}</span>
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items 
              static
              className="absolute right-0 mt-2 w-36 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 divide-y divide-gray-100 focus:outline-none"
              style={{ zIndex: 100 }}
            >
              {languages.map(({ code, label }) => (
                <Menu.Item key={code}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        'w-full text-left px-4 py-2 text-sm',
                        active ? 'bg-gray-50' : '',
                        code === currentLocale ? 'font-medium' : ''
                      )}
                      onClick={() => setLocaleAndRefreshData(code)}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};