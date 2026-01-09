import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
   // checkAuthStatus(); TEMPORAL
   setLoading(false);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      setUser(data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
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
      setError(err || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err || 'Error al cerrar sesión');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err) {
      setError(err || 'Error al solicitar recuperación');
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
      setError(err || 'Error al resetear contraseña');
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
      setError(err || 'Error al verificar email');
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
      setError(err || 'Error al reenviar verificación');
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