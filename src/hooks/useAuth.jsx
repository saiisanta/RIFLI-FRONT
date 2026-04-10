import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/authService';

export const AUTH_KEY = ['auth', 'me'];

const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => authService.getCurrentUser().then((d) => d.user ?? d),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const isAuthenticated = !!user;
  const error = queryError?.message ?? queryError?.error ?? null;

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (d) => {
      if (d.user) queryClient.setQueryData(AUTH_KEY, d.user);
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (d) => queryClient.setQueryData(AUTH_KEY, d.user),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }) => authService.resetPassword(token, newPassword),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
  });

  const resendVerificationMutation = useMutation({
    mutationFn: authService.resendVerification,
  });

  const updateUser = (userData) => {
    queryClient.setQueryData(AUTH_KEY, (prev) => prev ? { ...prev, ...userData } : prev);
  };

  const checkAuthStatus = () => {
    queryClient.invalidateQueries({ queryKey: AUTH_KEY });
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: ({ token, newPassword }) => resetPasswordMutation.mutateAsync({ token, newPassword }),
    verifyEmail: verifyEmailMutation.mutateAsync,
    resendVerification: resendVerificationMutation.mutateAsync,
    checkAuthStatus,
    updateUser,
    clearError: () => {},
  };
};

export default useAuth;