import { create } from 'zustand';
import { contractApi, OrderStatusResponse } from '@/api/contract';
import type { ContractData } from '@/types/contract';

interface ContractState {
    contractData: ContractData | null;
    orderStatus: OrderStatusResponse | null;
    isLoading: boolean;
    error: string | null;
    selectedDealer: string | null;
    setSelectedDealer: (dealerId: string) => void;
    setContractData: (data: ContractData) => void;
    submitOrder: (captcha: string) => Promise<void>;
    checkOrderStatus: () => Promise<void>;
    clearContract: () => void;
}

export const useContractStore = create<ContractState>((set, get) => ({
    contractData: null,
    orderStatus: null,
    isLoading: false,
    error: null,
    selectedDealer: null,

    setSelectedDealer: (dealerId) => {
        set({ selectedDealer: dealerId });
    },

    setContractData: (data) => {
        set({ contractData: data });
        localStorage.setItem('selected_modification', data.modification_id);
        localStorage.setItem('selected_color', data.color_id);
    },

    submitOrder: async (captcha: string) => {
        const { contractData } = get();
        if (!contractData) {
            set({ error: 'No contract data available' });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const orderData = {
                captcha,
                ...contractData,
                filial_id: 100
            };

            await contractApi.submitOrder(orderData);

            setTimeout(() => {
                get().checkOrderStatus();
            }, 15000);

        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to submit order' });
        } finally {
            set({ isLoading: false });
        }
    },

    checkOrderStatus: async () => {
        const { contractData } = get();
        if (!contractData?.modification_id) return;

        set({ isLoading: true });

        try {
            const status = await contractApi.checkOrderStatus(contractData.modification_id);
            set({ orderStatus: status  });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to check order status' });
        } finally {
            set({ isLoading: false });
        }
    },

    clearContract: () => {
        set({
            contractData: null,
            orderStatus: null,
            error: null,
            selectedDealer: null
        });
        localStorage.removeItem('selected_modification');
        localStorage.removeItem('selected_color');
    }
}));