// src/api/service.ts
import axios from 'axios';

const BASE_URL = 'https://uzavtosavdo.uz/tds';

export interface ServiceAvailabilitySlot {
    time: string;
    status: 'available' | 'occupied';
}

export interface ServiceRequest {
    model_id: string;
    model_name: string;
    service_type_id: string;
    service_type_name: string;
    dealer_id: string;
    dealer_name: string;
    region_id: string;
    region_name: string;
    datetime: string;
    client_id: string;
    client_name: string;
    client_phone: string;
}

export interface ServiceResponse {
    _id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const serviceApi = {
    // Получение доступных слотов на выбранную дату
    async getAvailabilityByDate(date: string): Promise<ServiceAvailabilitySlot[]> {
        try {
            const response = await axios.get(`${BASE_URL}/services/availability`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching service availability:', error);
            throw error;
        }
    },

    // Создание заявки на сервисное обслуживание
    async createServiceRequest(data: ServiceRequest): Promise<ServiceResponse> {
        try {
            const response = await axios.post(`${BASE_URL}/services`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating service request:', error);
            throw error;
        }
    }
};