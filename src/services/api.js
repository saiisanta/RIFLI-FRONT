import axios from 'axios';

const AUTH_ROUTES = ['/auth/login', '/auth/me', '/auth/refresh-token', '/auth/check'];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api',
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = AUTH_ROUTES.some(route => 
      error.config?.url?.includes(route)
    );
    const alreadyOnLogin = window.location.pathname === '/login';

    if (error.response?.status === 401 && !isAuthRoute && !alreadyOnLogin) {
      window.location.href = '/login';
    }

    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      console.error('Error de red:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;