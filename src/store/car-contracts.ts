import { create } from 'zustand';
import { contractApi } from '@/api/contract';
import { Contract } from '@/types/contract';

interface ContractsState {
    contracts: Contract[];
    isLoading: boolean;
    error: string | null;
    fetchContracts: () => Promise<void>;
}

export const useContractsStore = create<ContractsState>((set) => ({
    contracts: [],
    isLoading: false,
    error: null,

    fetchContracts: async () => {
        set({ isLoading: true });
        try {
            const data = await contractApi.getContracts();
            const formattedContracts = data
                .filter((order: unknown) => order != null)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((order: any) => ({
                    code: String(order.code || order.order_id || order.contract_code),
                    color: order.color ? {
                        color_id: String(order.color.color_id || ''),
                        name: String(order.color.name || ''),
                        hex_value: String(order.color.hex_value || '')
                    } : null,
                    // Остальные поля остаются без изменений
                    contract_approved: String(order.contract_approved || ''),
                    action_id: String(order.action_id || ''),
                    inn: String(order.inn || ''),
                    contract_code: String(order.contract_code || ''),
                    contract_generated: String(order.contract_generated || ''),
                    dealer_approved: String(order.dealer_approved || ''),
                    dealer_id: String(order.dealer_id || ''),
                    dealer_name: String(order.dealer_name || ''),
                    expect_date: String(order.expect_date || ''),
                    filial_id: String(order.filial_id || ''),
                    hint: String(order.hint || ''),
                    price_action: String(order.price_action || '0'),
                    prepayment_amount: String(order.prepayment_amount || '0'),
                    month: String(order.month || '36'),
                    month_day: String(order.month_day || '15'),
                    hint_class: String(order.hint_class || ''),
                    kind: String(order.kind || ''),
                    model_id: String(order.model_id || ''),
                    model_name: String(order.model_name || ''),
                    modification: order.modification ? {
                        modification_id: String(order.modification.modification_id || ''),
                        name: String(order.modification.name || '')
                    } : null,
                    order_date: String(order.order_date || ''),
                    order_id: String(order.order_id || ''),
                    order_kind: String(order.order_kind || ''),
                    paid_amount: String(order.paid_amount || ''),
                    payment_amount: String(order.payment_amount || ''),
                    photo_sha666: String(order.photo_sha666 || ''),
                    price: String(order.price || '0'),
                    queue_no: String(order.queue_no || ''),
                    remain_amount: String(order.remain_amount || ''),
                    state: String(order.state || ''),
                    state_html: String(order.state_html || ''),
                    vin_code: String(order.vin_code || '')
                }));

            set({ contracts: formattedContracts, error: null });
        } catch (error) {
            set({ error: 'Failed to load contracts' });
            console.error('Contract fetch error:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));