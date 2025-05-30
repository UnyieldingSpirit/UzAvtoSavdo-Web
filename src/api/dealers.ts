import axios from 'axios';
import { Dealer } from '@/types/dealers';
import { useLanguageStore } from '@/store/language';

interface StockResponse {
    status: string;
    stocks: Array<{
        dealer_id: string;
        stock: string;
    }>;
}

// Type for dealer with stock count
interface DealerWithStock extends Dealer {
    stock_count: number;
}

export const fetchDealers = async (): Promise<Dealer[]> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        // Получаем текущий язык
        const { currentLocale } = useLanguageStore.getState();

        // Формируем URL в зависимости от языка
        const url = currentLocale === 'uz'
            ? `https://uzavtosavdo.uz/dealers_uz.json?${timestamp}`
            : `https://uzavtosavdo.uz/dealers.json?${timestamp}`;

        const response = await axios.get(url);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return response.data.flatMap((item: any) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item.dealers.map((dealer: any) => ({
                ...dealer,
                phone_number: dealer.phone_number ? [dealer.phone_number] : [],
                region: dealer.region,
                rating: dealer.rating
            }))
        );
    } catch (error) {
        console.error('Error fetching dealers:', error);
        throw error;
    }
};

export const saveDealerSelection = async (dealerId: string) => {
    try {
        localStorage.setItem('selected_dealer_id', dealerId);
    } catch (error) {
        console.error('Error saving dealer:', error);
        throw error;
    }
};

// Обновленная функция в api/dealers.ts
export const fetchDealersWithStock = async (
    modificationId: string,
    colorId: string,
    allDealers: Dealer[],
    regionId: string
): Promise<DealerWithStock[]> => {
    try {
        const response = await axios.get<StockResponse>(`https://uzavtosavdo.uz/backendbot/stocks`, {
            params: {
                color: colorId,
                mod: modificationId
            }
        });

        if (response.data?.status !== 'ok' || !Array.isArray(response.data.stocks)) {
            return [];
        }

        // Преобразуем данные о наличии в удобный формат
        const dealersWithStock = response.data.stocks
            .filter((stock): stock is { dealer_id: string; stock: string } =>
                Boolean(stock.dealer_id && stock.stock)
            )
            .map(({ dealer_id, stock }) => ({
                dealer_id,
                stock_count: parseInt(stock, 10) || 0
            }));

        // Возвращаем информацию для всех дилеров в регионе
        return allDealers
            .filter(dealer => {
                // Фильтруем только по региону, независимо от наличия
                const inRegion = regionId === 'all' || dealer.region === regionId;
                return inRegion;
            })
            .map(dealer => {
                // Добавляем информацию о наличии, если есть
                const stockInfo = dealersWithStock.find(d => d.dealer_id === dealer.dealer_id);
                return {
                    ...dealer,
                    stock_count: stockInfo?.stock_count || 0
                };
            });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};