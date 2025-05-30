import { useAuthStore, UserInfo } from '@/store/auth';
import { getRcode } from '../utils/rcode';
import axios from 'axios';


export const authApi = {
    async getCaptchaUrl(): Promise<string> {
        const rcode = await getRcode();
        return `https://uzavtosavdo.uz/t/captcha?token=${rcode}&t=${Date.now()}`;
    },

    async checkCaptcha(captchaValue: string): Promise<string | false> {
        try {
            const rcode = await getRcode();
            localStorage.setItem('rtoken', rcode);

            const url = `https://uzavtosavdo.uz/t/core/m$oauth2_gen_params?code=oneid&company_code=savdo_uzavtosanoat_uz&lang_code=uz`;
            const response = await axios.get(url, {
                headers: {
                    rcode,
                    captcja: captchaValue,
                }
            });

            if (response.data?.url) {
                localStorage.setItem('oneIdSecretKey', response.data.secret_key);
                return response.data.url;
            }

            return false;
        } catch (error) {
            console.error('Captcha check error:', error);
            return false;
        }
    },

    async openOneIdUrl(url: string): Promise<void> {
        if (!url) return;
        try {
            window.location.href = url;
        } catch (error) {
            console.error('OneID redirect error:', error);
            window.location.href = url;
        }
    },

    async handleAuthCompletion(): Promise<void> {
        try {
            const rcode = localStorage.getItem('rtoken');
            const oauth2Token = localStorage.getItem('oneIdSecretKey');

            if (!rcode || !oauth2Token) return;

            try {
                const response = await axios.post(
                    'https://uzavtosavdo.uz/t/ap/stream/ph$user_info',
                    { filial_id: 100 },
                    {
                        headers: {
                            rcode,
                            oauth2_token: oauth2Token
                        }
                    }
                );
                if (response.data) {
                    useAuthStore.getState().setUserInfo(response.data);
                    useAuthStore.getState().setAuthorized(true);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem('rtoken');
                    localStorage.removeItem('oneIdSecretKey');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    useAuthStore.getState().setAuthorized(false);
                    useAuthStore.getState().setUserInfo(null as unknown as UserInfo);

                    const response = await this.handleOneIdCallback();
                    if (response) {
                        const secondResponse = await axios.post(
                            'https://uzavtosavdo.uz/t/ap/stream/ph$user_info',
                            { filial_id: 100 },
                            {
                                headers: {
                                    rcode,
                                    oauth2_token: oauth2Token
                                }
                            }
                        );

                        if (secondResponse.data) {
                            localStorage.setItem('userInfo', JSON.stringify(secondResponse.data));
                            useAuthStore.getState().setAuthorized(true);
                            useAuthStore.getState().setUserInfo(secondResponse.data);
                        }
                    }
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        } catch (error) {
            console.error('Auth completion error:', error);
            throw error;
        }
    },

    async handleOneIdCallback(): Promise<boolean> {
        try {
            const rcode = localStorage.getItem('rtoken');
            const oneIdSecretKey = localStorage.getItem('oneIdSecretKey');

            if (!oneIdSecretKey) return false;

            const response = await axios.post(
                'https://uzavtosavdo.uz/t/core/m$oauth2_token',
                {},
                {
                    headers: {
                        rcode,
                        token: oneIdSecretKey,
                    },
                }
            );

            if (response.data?.oauth2_token) {
                localStorage.setItem('token', response.data.oauth2_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('OneID callback error:', error);
            return false;
        }
    },
};