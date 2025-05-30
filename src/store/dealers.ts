// dealers.ts
import { create } from 'zustand';
import type { Dealer } from '@/types/dealers';
import { fetchDealers } from '@/api/dealers';

interface DealersState {
    dealers: Dealer[];
    selectedRegion: string | null;
    isLoading: boolean;
    error: string | null;
    fetchDealers: () => Promise<void>;
    setSelectedRegion: (region: string) => void;
    saveDealerSelection: (dealerId: string) => Promise<void>;
}

export const useDealersStore = create<DealersState>((set) => ({
    dealers: [],
    selectedRegion: null,
    isLoading: false,
    error: null,
    setSelectedRegion: (region) => set({ selectedRegion: region }),
    fetchDealers: async () => {
        set({ isLoading: true });
        try {
            const dealers = await fetchDealers();
            set({ dealers, error: null });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set({ error: 'Failed to fetch dealers' });
        } finally {
            set({ isLoading: false });
        }
    },
    saveDealerSelection: async (dealerId: string) => {
        try {
            localStorage.setItem('selected_dealer_id', dealerId);
            const selectedDealer = await fetchDealers().then(dealers =>
                dealers.find(dealer => dealer.dealer_id === dealerId)
            );
            if (selectedDealer) {
                localStorage.setItem('selected_dealer', JSON.stringify(selectedDealer));
            }
        } catch (error) {
            console.error('Error saving dealer:', error);
            throw error;
        }
    }
}));