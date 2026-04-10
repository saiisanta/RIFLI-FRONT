import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bankAccountService from '../services/bankAccountService';

export const BANK_KEY = ['bankAccount'];

const useBankAccount = () => {
  const queryClient = useQueryClient();

  const {
    data: account = null,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: BANK_KEY,
    queryFn: bankAccountService.getBankAccount,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const error = queryError?.message ?? queryError?.error ?? null;

  const createMutation = useMutation({
    mutationFn: bankAccountService.createBankAccount,
    onSuccess: (data) => queryClient.setQueryData(BANK_KEY, data),
  });

  const updateMutation = useMutation({
    mutationFn: bankAccountService.updateBankAccount,
    onSuccess: (data) => queryClient.setQueryData(BANK_KEY, data),
  });

  const toggleMutation = useMutation({
    mutationFn: bankAccountService.toggleBankAccount,
    onSuccess: (data) => queryClient.setQueryData(BANK_KEY, data.account ?? data),
  });

  return {
    account,
    loading,
    error,
    fetchBankAccount: () => queryClient.invalidateQueries({ queryKey: BANK_KEY }),
    createBankAccount: createMutation.mutateAsync,
    updateBankAccount: updateMutation.mutateAsync,
    toggleBankAccount: toggleMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending || toggleMutation.isPending,
    clearError: () => queryClient.resetQueries({ queryKey: BANK_KEY }),
    clearState: () => queryClient.removeQueries({ queryKey: BANK_KEY }),
  };
};

export default useBankAccount;