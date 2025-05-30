export interface StockData {
    stock: number;
    dealer_id: number;
    available: number;
}

export interface CarColor {
    totalAvailable: number;
    color_id: string;
    name: string;
    hex_value: string;
    photo_sha: string;
    photo_sha666: string;
    expect_date?: string;
    queue_no: string;
    stock_data: StockData[];
}

export interface CarModification {
    actions(actions: unknown): unknown;
    modification_id: string;
    name: string;
    producing: string;
    price: string;
    horsepower: string;
    acceleration: string;
    fuel_consumption: string;
    transmission: string;
    colors: CarColor[];
    options: string[];
    options_obj: {
        name: string,
        description: string;
        imagesha?: string;
    }[];
}

export type Params = { id: string; }

export interface ColorButtonProps {
    color: CarColor;
    isSelected: boolean;
    onClick: () => void;
}

export interface ModificationButtonProps {
    mod: CarModification;
    isSelected: boolean;
    onClick: () => void;
    price: string;
    locale: string;
}

export interface PaginationButtonProps {
    onClick: () => void;
    disabled: boolean;
    direction: 'prev' | 'next';
}
