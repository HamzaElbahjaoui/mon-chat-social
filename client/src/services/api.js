import axios from 'axios';
import { userStorage } from './authService';

// 1. Définition de l'URL (Prod ou Dev)
const API_URL = import.meta.env.PROD
  ? 'https://mon-chat-social-hamzat.replit.app/api' 
  : 'http://localhost:3000/api';

// 2. Création de l'instance Axios
const api = axios.create({
  baseURL: API_URL, // <--- CORRECTION ICI (C'était API_BASE_URL)
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: API_URL, // <--- CORRECTION ICI AUSSI
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Intercepteur pour ajouter le token (si tu l'utilises)
authApi.interceptors.request.use((config) => {
  const user = userStorage.getUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export { api, authApi };