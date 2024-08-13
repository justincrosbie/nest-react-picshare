// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const login = (username: string) => api.post('/auth/login', { username });
export const getPictures = () => api.get('/pictures');
// Add other API calls as needed