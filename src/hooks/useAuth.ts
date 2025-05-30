import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
import { useCaptchaStore } from '@/store/captcha';

export const useAuth = () => {
    const { isAuthorized } = useAuthStore();
    const { setIsOpen } = useCaptchaStore();
    const router = useRouter();

    const handleAuthCheck = async () => {
        if (!isAuthorized) {
            await authApi.handleAuthCompletion();
        }
    };

    const handleAuthRequired = async (redirectTo?: string) => {
        if (!isAuthorized) {
            setIsOpen(true);
            if (redirectTo) {
                router.push(redirectTo);
            }
            return false;
        }
        return true;
    };

    useEffect(() => {
        handleAuthCheck();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isAuthorized,
        handleAuthRequired
    };
};