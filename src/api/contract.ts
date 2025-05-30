import axios from 'axios';
import { getRcode } from '../utils/rcode';
import { Contract } from '@/types/contract';


export interface OrderStatusResponse {
    orderStatus: {
        status: string;
        message?: string;
    };
    orders: Contract[] | null;
}


export const contractApi = {
    async submitOrder(orderData: {
        captcha: string;
        color_id: string;
        dealer_id: string;
        filial_id: number;
        modification_id: string;
    }): Promise<unknown> {
        const oauth2_token = await localStorage.getItem('oneIdSecretKey');
        const rcode = await localStorage.getItem('rtoken');

        try {
            const response = await axios.post(`https://uzavtosavdo.uz/t/ap/stream/ph$order_save_`, orderData, {
                headers: {
                    oauth2_token,
                    rcode,
                },
            });

            return response.data;
        } catch (error) {
            if (error) {
                throw new Error('Неверно введен код с картинки');
            }
            throw error;
        }
    },

    async checkOrderStatus(modificationId: string): Promise<OrderStatusResponse> {
        const rToken = localStorage.getItem('oneIdSecretKey');
        const oauth2Token = localStorage.getItem('oneIdSecretKey');
        const rcode = await getRcode();

        if (!modificationId || !rToken) {
            throw new Error('Missing required parameters');
        }

        const response = await fetch(
            `https://uzavtosavdo.uz/t/ap/runorder?mod=${modificationId}&token=${rToken}`
        );

        const orderStatus = await response.json();
        const status = String(orderStatus.status);

        if (status === '-2' || status === '-1') {
            throw new Error(orderStatus.message || 'Ошибка оформления заказа');
        }

        if (status === '1') {
            const ordersResponse = await fetch(
                'https://uzavtosavdo.uz/t/ap/stream/ph$load_orders',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        oauth2_token: oauth2Token || '',
                        rcode,
                    },
                    body: JSON.stringify({ filial_id: 100 })
                }
            );

            const orders = await ordersResponse.json();
            return { orderStatus, orders };
        }

        // Продолжаем обработку
        return { orderStatus, orders: null };
    },

    async getContracts(): Promise<Contract[]> {
        const oauth2Token = localStorage.getItem('oneIdSecretKey');
        const rcode = localStorage.getItem('rtoken');

        if (!oauth2Token || !rcode) {
            throw new Error('Missing auth tokens');
        }

        const response = await axios.post(
            'https://uzavtosavdo.uz/t/ap/stream/ph$load_orders',
            { filial_id: 100 },
            {
                headers: {
                    oauth2_token: oauth2Token,
                    rcode
                }
            }
        );

        return response.data;
    }
};