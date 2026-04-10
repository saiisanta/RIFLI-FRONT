import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import addressService from '../services/addressService';

export const ADDRESSES_KEY = ['addresses'];

const useAddresses = () => {
  const queryClient = useQueryClient();

  const {
    data: addresses = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: () =>
      addressService.getMyAddresses().then((d) => (Array.isArray(d) ? d : d.addresses ?? [])),
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError?.message ?? null;
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

  const createMutation = useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ addressId, addressData }) => addressService.updateAddress(addressId, addressData),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: addressService.deleteAddress,
    onSuccess: (_, addressId) =>
      queryClient.setQueryData(ADDRESSES_KEY, (prev = []) =>
        prev.filter((a) => a.id !== addressId)
      ),
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressService.setDefaultAddress,
    onSuccess: invalidate,
  });

  return {
    addresses,
    loading,
    error,
    fetchAddresses: invalidate,
    createAddress: createMutation.mutateAsync,
    updateAddress: (id, data) => updateMutation.mutateAsync({ addressId: id, addressData: data }),
    deleteAddress: deleteMutation.mutateAsync,
    setDefaultAddress: setDefaultMutation.mutateAsync,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      setDefaultMutation.isPending,
    clearError: () => {},
    validateArgentinaPostalCode: addressService.validateArgentinaPostalCode,
    formatFullAddress: addressService.formatFullAddress,
  };
};

export default useAddresses;