import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';

const USERS_KEY = ['users'];

const useUsers = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...USERS_KEY, params],
    queryFn: () => userService.getUsers(params),
    staleTime: 1000 * 60 * 3,
    select: (d) => ({
      users: d.users ?? d.data ?? [],
      pagination: d.pagination ?? { page: 1, limit: 10, total: 0, total_pages: 0 },
    }),
  });

  const users      = data?.users      ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, total_pages: 0 };
  const error      = queryError?.message ?? queryError?.error ?? null;

  const patchUser = (userId, patch) =>
    queryClient.setQueriesData({ queryKey: USERS_KEY }, (prev) => {
      if (!prev) return prev;
      const list = prev.users ?? prev;
      const updated = Array.isArray(list)
        ? list.map((u) => (u.id === userId ? { ...u, ...patch } : u))
        : list;
      return prev.users ? { ...prev, users: updated } : updated;
    });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => userService.changeRole(userId, role),
    onSuccess: (data, { userId, role }) =>
      patchUser(userId, { role: (data.user ?? data).role ?? role }),
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: (_, userId) =>
      queryClient.setQueriesData({ queryKey: USERS_KEY }, (prev) => {
        if (!prev) return prev;
        const list = prev.users ?? prev;
        const updated = Array.isArray(list) ? list.filter((u) => u.id !== userId) : list;
        return prev.users ? { ...prev, users: updated } : updated;
      }),
  });

  return {
    users,
    user: null,
    loading,
    error,
    pagination,
    fetchUsers: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
    fetchUserById: userService.getUserById,
    changeRole: (userId, role) => changeRoleMutation.mutateAsync({ userId, role }),
    deleteUser: deleteMutation.mutateAsync,
    clearError: () => {},
    clearState: () => queryClient.removeQueries({ queryKey: USERS_KEY }),
  };
};

export default useUsers;