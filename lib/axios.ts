import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// NUEVA FUNCIÓN: Permite configurar el token de forma manual e inmediata
export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Si el token es null (logout), eliminamos la cabecera
    delete api.defaults.headers.common['Authorization'];
  }
};
// FIN NUEVA FUNCIÓN

// Interceptor de Solicitudes: Adjunta el token JWT (USANDO setAuthHeader para consistencia)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      // En lugar de leer y asignar directamente, delegamos a setAuthHeader
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        // También eliminamos la cabecera de la instancia de Axios
        setAuthHeader(null); 
        window.dispatchEvent(new CustomEvent('auth:unauthorized')); 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
