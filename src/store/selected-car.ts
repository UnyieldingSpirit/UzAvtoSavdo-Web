import { create } from 'zustand';

interface ContractState {
    isContractFlow: boolean;
    carId: string | null;
    selectedColor: {
        color_id: string;
        name: string;
        hex_value: string;
    } | null;
    selectedDealer: string | null;
    selectedMod: {
        modification_id: string;
        name: string;
    } | null;
    captchaModalOpen: boolean;
    setContractFlow: (value: boolean, carId: string | null) => void;
    setSelectedColor: (color: ContractState['selectedColor']) => void;
    setSelectedDealer: (dealerId: string | null) => void;
    setSelectedMod: (mod: ContractState['selectedMod']) => void;
    setCaptchaModalOpen: (open: boolean) => void;
    resetContract: () => void;
    resetDealerState: () => void;
}

const initialState = {
    isContractFlow: false,
    carId: null,
    selectedColor: null,
    selectedDealer: null,
    selectedMod: null,
    captchaModalOpen: false,
};

export const useContractStore = create<ContractState>((set) => ({
    ...initialState,
    setContractFlow: (value, carId) => set({ isContractFlow: value, carId }),
    setSelectedColor: (color) => set({ selectedColor: color }),
    setSelectedDealer: (dealerId) => set({ selectedDealer: dealerId }),
    setSelectedMod: (mod) => set({ selectedMod: mod }),
    setCaptchaModalOpen: (open) => set({ captchaModalOpen: open }),
    resetContract: () => set(initialState),
    resetDealerState: () => set({
        isContractFlow: false,
        carId: null,
        selectedColor: null,
        selectedDealer: null,
        selectedMod: null,
        captchaModalOpen: false
    }),
}));