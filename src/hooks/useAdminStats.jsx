import { useState, useCallback} from 'react';
import adminService from '../services/adminService';

export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchDashboard = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getDashboard();
        setStats(data);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar dashboard');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const fetchAnalytics = useCallback(async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAnalytics(params);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar analytics');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const banUser = useCallback(async (userId, reason = '') => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.banUser(userId, reason);
        return data;
      } catch (err) {
        setError(err.message || 'Error al banear usuario');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const unbanUser = useCallback(async (userId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.unbanUser(userId);
        return data;
      } catch (err) {
        setError(err.message || 'Error al desbanear usuario');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const clearError = useCallback(() => {
      setError(null);
    }, []);
  
    return {
      stats,
      loading,
      error,
      fetchDashboard,
      fetchAnalytics,
      banUser,
      unbanUser,
      clearError,
    };
  };

  export default useAdminStats;