import { create } from 'zustand';

interface ToastState {
    message: string | null;
    type: 'error' | 'success' | 'warning' | null;
    isModal: boolean;
    showToast: (message: string, type: 'error' | 'success' | 'warning', isModal?: boolean) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: null,
    type: null,
    isModal: false,
    showToast: (message, type, isModal = false) => {
        set({ message, type, isModal });

        if (!isModal) {
            setTimeout(() => {
                set((state) => {
                    if (state.message === message && state.type === type) {
                        return { message: null, type: null, isModal: false };
                    }
                    return state;
                });
            }, 8000);
        }
    },
    hideToast: () => set({ message: null, type: null, isModal: false })
}));