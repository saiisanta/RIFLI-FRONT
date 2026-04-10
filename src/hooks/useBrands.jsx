import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import brandService from '../services/brandService';

const BRANDS_KEY = ['brands'];

const useBrands = () => {
  const queryClient = useQueryClient();

  const {
    data: brands = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: BRANDS_KEY,
    queryFn: () =>
      brandService.getBrands().then((d) => (Array.isArray(d) ? d : d.brands ?? [])),
    staleTime: 1000 * 60 * 10,
  });

  const error = queryError?.message ?? null;

  const createMutation = useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: (newBrand) =>
      queryClient.setQueryData(BRANDS_KEY, (prev = []) => [...prev, newBrand]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ brandId, brandData }) => brandService.updateBrand(brandId, brandData),
    onSuccess: (updated) =>
      queryClient.setQueryData(BRANDS_KEY, (prev = []) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: (_, brandId) =>
      queryClient.setQueryData(BRANDS_KEY, (prev = []) =>
        prev.filter((b) => b.id !== brandId)
      ),
  });

  return {
    brands,
    loading,
    error,
    fetchBrands: () => queryClient.invalidateQueries({ queryKey: BRANDS_KEY }),
    createBrand: createMutation.mutateAsync,
    updateBrand: (id, data) => updateMutation.mutateAsync({ brandId: id, brandData: data }),
    deleteBrand: deleteMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useBrands;