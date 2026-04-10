import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '../services/notificationService';
import { AuthContext } from '../context/AuthContext';

const NOTIFICATIONS_KEY = ['notifications'];
const POLL_INTERVAL = 30_000;

const useNotifications = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () =>
      notificationService.getAll({ limit: 20 }).then((d) => ({
        notifications: Array.isArray(d) ? d : (d.notifications ?? []),
      })),
    enabled: !!user,
    staleTime: POLL_INTERVAL,
    refetchInterval: POLL_INTERVAL,
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const error = queryError?.message ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_, id) =>
      queryClient.setQueryData(NOTIFICATIONS_KEY, (prev) => {
        if (!prev) return prev;
        return {
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        };
      }),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () =>
      queryClient.setQueryData(NOTIFICATIONS_KEY, (prev) => {
        if (!prev) return prev;
        return {
          notifications: prev.notifications.map((n) => ({ ...n, is_read: true })),
        };
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: (_, id) =>
      queryClient.setQueryData(NOTIFICATIONS_KEY, (prev) => {
        if (!prev) return prev;
        return {
          notifications: prev.notifications.filter((n) => n.id !== id),
        };
      }),
  });

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications: invalidate,
    fetchUnreadCount: invalidate,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
    clearError: () => {},
    clearState: () => queryClient.removeQueries({ queryKey: NOTIFICATIONS_KEY }),
  };
};

export default useNotifications;