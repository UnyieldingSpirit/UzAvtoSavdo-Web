export interface ContractData {
    modification_id: string;
    color_id: string;
    dealer_id: string;
}

export interface Contract {
    inn: string;
    action_id: string;
    price_action: string;
    prepayment_amount: string;
    month: string;
    month_day: string;
    code: string;
    color: {
        color_id: string;
        name: string;
        hex_value: string;
    } | null;
    contract_approved: string;
    contract_code: string;
    contract_generated: string;
    dealer_approved: string;
    dealer_id: string;
    dealer_name: string;
    expect_date: string;
    filial_id: string;
    hint?: string;
    hint_class?: string;
    kind: string;
    model_id: string;
    model_name: string;
    modification: {
        modification_id: string;
        name: string;
    } | null;
    order_date: string;
    order_id: string;
    order_kind: string;
    paid_amount: string;
    payment_amount: string;
    photo_sha666: string;
    price: string;
    queue_no: string;
    remain_amount: string;
    state: string;
    state_html: string;
    vin_code: string;
    region?: string;
}

export interface OrderData {
    captcha: string;
    color_id: string;
    dealer_id: string;
    filial_id: number;
    modification_id: string;
}

export interface OrderResponse {
    success: boolean;
    order_id?: string;
    error?: string;
}

