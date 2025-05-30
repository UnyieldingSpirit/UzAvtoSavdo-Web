import { create } from 'zustand';

interface CaptchaState {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const useCaptchaStore = create<CaptchaState>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
}));