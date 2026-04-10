import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/adminService';

const DASHBOARD_KEY = ['admin', 'dashboard'];

const useAdminStats = () => {
  const queryClient = useQueryClient();

  const {
    data: stats = null,
    isLoading: loading,
    error: queryError,
    refetch: fetchDashboard,
  } = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: adminService.getDashboard,
    staleTime: 1000 * 60 * 2,
  });

  const error = queryError?.message ?? null;

  const fetchAnalytics = (params = {}) => adminService.getAnalytics(params);

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }) => adminService.banUser(userId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  const unbanMutation = useMutation({
    mutationFn: adminService.unbanUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  return {
    stats,
    loading,
    error,
    fetchDashboard,
    fetchAnalytics,
    banUser: (userId, reason = '') => banMutation.mutateAsync({ userId, reason }),
    unbanUser: unbanMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useAdminStats;