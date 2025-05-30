// src/api/testDrive.ts

import axios from 'axios';

const BASE_URL = 'https://uzavtosavdo.uz/tds';

export interface TestDriveAvailabilitySlot {
    time: string;
    status: 'available' | 'occupied';
}

export interface TestDriveRequest {
    model_id: string;
    model_name: string;
    modification_id: string;
    modification_name: string;
    datetime: string;
    client_id: string;
    client_fio: string;
    client_phone: string;
    dealer_id: string;
    dealer_name: string;
    region_id: string;
    region_name: string;
}

export interface TestDriveResponse {
    _id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const testDriveApi = {
    // Получение доступных слотов на выбранную дату
    async getAvailabilityByDate(date: string): Promise<TestDriveAvailabilitySlot[]> {
        try {
            const response = await axios.get(`${BASE_URL}/test-drives/availability`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching test drive availability:', error);
            throw error;
        }
    },

    // Создание заявки на тест-драйв
    async createTestDriveRequest(data: TestDriveRequest): Promise<TestDriveResponse> {
        try {
            const response = await axios.post(`${BASE_URL}/test-drives`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating test drive request:', error);
            throw error;
        }
    }
};