import { useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const isCheckingAuth = useRef(false);
  const hasCheckedAuth = useRef(false);

  const checkAuthStatus = useCallback(async () => {
    if (isCheckingAuth.current) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setUser(null);
      setIsAuthenticated(false);
      hasCheckedAuth.current = true;
      return;
    }

    try {
      isCheckingAuth.current = true;
      setLoading(true);
      const data = await authService.getCurrentUser();
      setUser(data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
      isCheckingAuth.current = false;
      hasCheckedAuth.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      checkAuthStatus();
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userData);
      
      if (data.token) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
      
      return data;
    } catch (err) {
      const errorMsg = err.message || err.error || 'Error al registrar usuario';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al iniciar sesión';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      hasCheckedAuth.current = false;
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al solicitar recuperación';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.resetPassword(token, newPassword);
      return data;
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al resetear contraseña';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.verifyEmail(token);
      return data;
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al verificar email';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.resendVerification(email);
      return data;
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al reenviar verificación';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    checkAuthStatus,
    updateUser,
    clearError,
  };
};

export default useAuth;