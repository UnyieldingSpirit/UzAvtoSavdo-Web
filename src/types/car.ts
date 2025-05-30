export interface CarColor {
    color_id: string;
    name: string;
    hex_value: string;
    photo_sha: string;
    photo_sha666?: string;
    expect_date?: string;
    queue_no?: string;
    stock_data?: Array<{
        region_id: string;
        stock: string;
    }>;
}

export interface CarModification {
    modification_id: string;
    name: string;
    horsepower: string;
    transmission: string;
    price: string;
    acceleration: string;
    fuel_consumption: string;
    producing?: string;
    colors: CarColor[];
    options: string[];
    options_obj: Array<{
        name: string;
        description: string;
        imagesha?: string;
    }>;
}

export type SelectedColor = CarColor & {
    photo_sha666: string;
};