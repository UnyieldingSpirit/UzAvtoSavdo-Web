import { create } from 'zustand';
import { contractApi } from '@/api/contract';
import { useToastStore } from '@/store/toast';
interface ProcessingState {
    isProcessing: boolean;
    error: string | null;
    setProcessing: (value: boolean) => void;
    setError: (error: string | null) => void;
    submitContract: (params: {
        captcha: string;
        t: (key: string) => string;
    }) => Promise<void>;
}
export const useProcessingStore = create<ProcessingState>((set) => ({
    isProcessing: false,
    error: null,
    setProcessing: (value) => set({ isProcessing: value }),
    setError: (error) => set({ error }),
    submitContract: async ({ captcha, t }) => {
        const { showToast } = useToastStore.getState();
        const modification_id = localStorage.getItem('selected_modification');
        const color_id = localStorage.getItem('selected_color');
        const dealer_id = localStorage.getItem('selected_dealer_id');

        if (!modification_id || !color_id || !dealer_id) {
            showToast(t('captcha.errors.missingData'), 'error');
            throw new Error(t('captcha.errors.missingData'));
        }

        set({ isProcessing: true, error: null });

        try {
            await contractApi.submitOrder({
                captcha,
                modification_id,
                color_id,
                dealer_id,
                filial_id: 100
            }); 

            const checkOrderStatus = async (retryCount = 0, maxRetries = 20): Promise<void> => {
                if (retryCount >= maxRetries) {
                    throw new Error(t('captcha.errors.timeout'));
                }

                const response = await contractApi.checkOrderStatus(modification_id);
                const status = response.orderStatus.status;
                const message = response.orderStatus.message;

                if (status === '-2' || status === '-1') {
                    set({ isProcessing: false });
                    showToast(message || t('captcha.errors.orderFailed'), 'error');
                    return;
                }

                if (status === '1') {
                    set({ isProcessing: false });
                    showToast(t('captcha.success.contract'), 'success');
                    window.location.href = '/profile';
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 15000));
                await checkOrderStatus(retryCount + 1);
            };

            await checkOrderStatus();

        } catch (error) {
            set({ isProcessing: false });
            const errorMessage = error instanceof Error ? error.message : t('captcha.errors.default');
            showToast(errorMessage, 'error');
        }
    }
}));