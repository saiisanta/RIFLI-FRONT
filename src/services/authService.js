import api from './api';

const authService = {
  register: (userData) =>
    api.post('/auth/register', userData).then(res => res.data),

  login: (credentials) =>
    api.post('/auth/login', credentials).then(res => res.data),

  logout: () =>
    api.post('/auth/logout').then(res => res.data),

  refreshToken: () =>
    api.post('/auth/refresh-token').then(res => res.data),

  forgotPassword: (email) =>
    api.post('/users/request-reset', { email }).then(res => res.data),

  resetPassword: (token, newPassword) =>
    api.post(`/users/reset-password/${token}`, { newPassword }).then(res => res.data),

  verifyEmail: (token) =>
    api.get(`/auth/verify-email/${token}`).then(res => res.data),

  resendVerification: (email) =>
    api.post('/auth/resend-verification', { email }).then(res => res.data),

  getCurrentUser: () =>
    api.get('/auth/me').then(res => res.data),

  checkAuth: () =>
    api.get('/auth/check').then(res => res.data),
};

export default authService;