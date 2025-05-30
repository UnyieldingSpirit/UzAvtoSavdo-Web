/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/models-cars.ts

import { create } from 'zustand';
import { useLanguageStore } from '@/store/language';

/**
 * Генерирует URL изображения на основе хеша
 * @param sha - Идентификатор изображения
 * @param width - Ширина изображения
 * @param height - Высота изображения
 */
export const getImageUrl = (sha: string | undefined, width: number = 400, height: number = 400): string => {
    if (!sha) return '';

    // Если уже полный URL, возвращаем как есть
    if (sha.startsWith('http')) {
        return sha;
    }

    return `https://uzavtosavdo.uz/b/core/m$load_image?sha=${sha}&width=${width}&height=${height}`;
};

export interface StockData {
    available: number;
    region_id: string;
    stock: string;
}

export interface CarColor {
    color_id: string;
    name: string;
    hex_value: string;
    photo_sha: string;
    photo_sha666: string; // Это поле будем заполнять обработанным URL
    expect_date?: string;
    queue_no?: string;
    stock_data?: StockData[];
}

export interface FeatureOption {
    name: string;
    description: string;
    imagesha?: string;
}

export interface CarModification {
    actions: boolean;
    modification_id: string;
    name: string;
    horsepower: string;
    transmission: string;
    price: string;
    acceleration: string;
    fuel_consumption: string;
    producing?: string;
    colors: CarColor[];
    options: string[];
    options_obj: FeatureOption[];
}

export interface Car {
    actions: boolean;
    colors: any;
    model_id: string;
    name: string;
    photo_sha: string;
    photo_sha666: string; // Это поле будем заполнять обработанным URL
    modifications: CarModification[];
}

interface CarsState {
    cars: Car[];
    isLoading: boolean;
    error: string | null;
    fetchCars: () => Promise<void>;
}

export const useCarsStore = create<CarsState>((set) => ({
    cars: [],
    isLoading: false,
    error: null,
    fetchCars: async () => {
        set({ isLoading: true });
        try {
            // Получаем текущий язык из хранилища языка
            const { currentLocale } = useLanguageStore.getState();

            // Формируем URL в зависимости от текущего языка
            const url = currentLocale === 'uz'
                ? 'https://uzavtosavdo.uz/models2_uz.json'
                : 'https://uzavtosavdo.uz/models2.json';

            console.log(`Загрузка моделей автомобилей для языка: ${currentLocale} из: ${url}`);

            const response = await fetch(url);
            const data = await response.json();

            // Обрабатываем полученные данные
            const processedData = data.map((car: Car) => {
                // Создаем копию автомобиля и добавляем обработанный URL в photo_sha666
                const processedCar = {
                    ...car,
                    photo_sha666: getImageUrl(car.photo_sha, 800, 600) // Заполняем photo_sha666 обработанным URL
                };

                // Обрабатываем модификации
                if (Array.isArray(processedCar.modifications)) {
                    processedCar.modifications = processedCar.modifications.map((mod: CarModification) => {
                        const processedMod = { ...mod };

                        // Обрабатываем цвета в каждой модификации
                        if (Array.isArray(processedMod.colors)) {
                            processedMod.colors = processedMod.colors.map((color: CarColor) => ({
                                ...color,
                                photo_sha666: getImageUrl(color.photo_sha, 800, 600) // Заполняем photo_sha666 обработанным URL
                            }));
                        }

                        // Обрабатываем опции и особенности
                        if (Array.isArray(processedMod.options_obj)) {
                            processedMod.options_obj = processedMod.options_obj.map((option: FeatureOption) => ({
                                ...option
                            }));
                        }

                        return processedMod;
                    });
                }

                return processedCar;
            });

            console.log('Обработанные данные с photo_sha666:', processedData);
            set({ cars: processedData, error: null });

        } catch (error) {
            set({ error: 'Не удалось загрузить данные автомобилей' });
            console.error('Ошибка загрузки автомобилей:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));