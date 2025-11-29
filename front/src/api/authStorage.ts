
const authTokenKey = 'accessToken';

export const authStorage = {
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(authTokenKey);
    },

    setToken(token: string) {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(authTokenKey, token);
    },

    clearToken() {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(authTokenKey);
    },
};
