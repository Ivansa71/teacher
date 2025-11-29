import axios from 'axios';

const authTokenKey = 'accessToken';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token =
        typeof window !== 'undefined'
            ? window.localStorage.getItem(authTokenKey)
            : null;

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
