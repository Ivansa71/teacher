// src/api/client.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',   // nginx сам отправит дальше в backend:4000
});
