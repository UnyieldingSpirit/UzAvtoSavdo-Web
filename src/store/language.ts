// src/store/language.ts
import { create } from 'zustand';
import { useCarsStore } from './models-cars';
import { useDealersStore } from './dealers';

type Locale = 'ru' | 'uz';

interface LanguageState {
    currentLocale: Locale;
    setLocale: (locale: Locale) => void;
    setLocaleAndRefreshData: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    currentLocale: (typeof window !== 'undefined' && localStorage.getItem('language') as Locale) || 'uz',

    setLocale: (locale: Locale) => {
        localStorage.setItem('language', locale);
        set({ currentLocale: locale });

        // Также обновляем дилеров при обычной смене языка
        const { fetchDealers } = useDealersStore.getState();
        fetchDealers();
    },

    // Функция, которая обновляет язык и перезагружает данные
    setLocaleAndRefreshData: (locale: Locale) => {
        // Сначала устанавливаем язык
        localStorage.setItem('language', locale);
        set({ currentLocale: locale });

        // Затем обновляем данные автомобилей
        const { fetchCars } = useCarsStore.getState();
        fetchCars();

        // Обновляем также дилеров
        const { fetchDealers } = useDealersStore.getState();
        fetchDealers();
    }
}));