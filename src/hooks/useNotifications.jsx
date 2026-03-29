import { useState, useCallback, useEffect, useContext } from 'react';
import notificationService from '../services/notificationService';
import { AuthContext } from '../context/AuthContext';

const POLL_INTERVAL = 30_000; // 30 segundos

const useNotifications = () => {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  // ─── Fetch lista completa ──────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAll({ limit: 20, ...params });
      const list = Array.isArray(data) ? data : data.notifications ?? [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar notificaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Polling liviano de conteo ─────────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      const count = data?.count ?? 0;
      setUnreadCount((prev) => {
        if (prev !== count) fetchNotifications();
        return count;
      });
      return count;
    } catch (err) {
      console.error('Error al obtener conteo de notificaciones:', err);
    }
  }, [fetchNotifications]);

  // ─── Marcar una como leída ────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      setError(null);
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message || 'Error al marcar notificación como leída');
      throw err;
    }
  }, []);

  // ─── Marcar todas como leídas ─────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || 'Error al marcar todas como leídas');
      throw err;
    }
  }, []);

  // ─── Eliminar notificación ────────────────────────────────────────────────
  const deleteNotification = useCallback(async (id) => {
    try {
      setError(null);
      await notificationService.delete(id);
      setNotifications((prev) => {
        const removed = prev.find((n) => n.id === id);
        if (removed && !removed.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    } catch (err) {
      setError(err.message || 'Error al eliminar notificación');
      throw err;
    }
  }, []);

  // ─── Limpiar error ────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  // ─── Limpiar estado ───────────────────────────────────────────────────────
  const clearState = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setError(null);
  }, []);

  // ─── Efectos ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError,
    clearState,
  };
};

export default useNotifications;