import axios, { AxiosInstance } from 'axios';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    // Recupera el token del localStorage
    const token = localStorage.getItem('jwt_token');

    // Si existe el token, lo añade a la cabecera Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;