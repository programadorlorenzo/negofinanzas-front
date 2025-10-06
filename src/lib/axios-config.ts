import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Crear instancia de axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  timeout: 10000,
});

// Cache de sesión para evitar múltiples llamadas
let sessionCache: { token: string | null; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getCachedSession = async () => {
  const now = Date.now();
  
  // Si no hay cache o ha expirado, obtener nueva sesión
  if (!sessionCache || (now - sessionCache.timestamp) > CACHE_DURATION) {
    try {
      const session = await getSession();
      sessionCache = {
        token: session?.accessToken || null,
        timestamp: now
      };
    } catch (error) {
      console.warn('Error obteniendo sesión:', error);
      sessionCache = { token: null, timestamp: now };
    }
  }
  
  return sessionCache.token;
};

// Función para limpiar el cache (útil al hacer logout)
export const clearSessionCache = () => {
  sessionCache = null;
  
  // También limpiar cualquier cache interno de axios
  if (typeof window !== 'undefined') {
    // Forzar limpieza de cualquier interceptor que pueda tener cache
    apiClient.defaults.headers.common['Authorization'] = '';
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Solo en el cliente
    if (typeof window !== 'undefined') {
      const token = await getCachedSession();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // En caso de error 401, NextAuth manejará la redirección
      console.warn('Token expirado o inválido');
    }
    return Promise.reject(error);
  }
);

export default apiClient;