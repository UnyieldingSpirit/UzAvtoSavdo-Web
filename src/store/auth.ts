import { create } from 'zustand';

export interface UserInfo {
    client_kind: string;
    email: string;
    inn: string;
    name: string;
    phone_number: string;
    user_id: string;
}

interface AuthState {
    isAuthorized: boolean;
    userInfo: UserInfo | null;
    setAuthorized: (value: boolean) => void;
    setUserInfo: (info: UserInfo) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthorized: false,
    userInfo: null,
    setAuthorized: (value) => set({ isAuthorized: value }),
    setUserInfo: (info) => set({ userInfo: info })
}));