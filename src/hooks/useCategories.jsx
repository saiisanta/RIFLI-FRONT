import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../services/categoryService';

const CATEGORIES_KEY = ['categories'];

const useCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () =>
      categoryService.getCategories().then((d) => (Array.isArray(d) ? d : d.categories ?? [])),
    staleTime: 1000 * 60 * 10,
  });

  const error = queryError?.message ?? null;

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: (newCat) =>
      queryClient.setQueryData(CATEGORIES_KEY, (prev = []) => [...prev, newCat]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, categoryData }) =>
      categoryService.updateCategory(categoryId, categoryData),
    onSuccess: (updated) =>
      queryClient.setQueryData(CATEGORIES_KEY, (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (_, categoryId) =>
      queryClient.setQueryData(CATEGORIES_KEY, (prev = []) =>
        prev.filter((c) => c.id !== categoryId)
      ),
  });

  return {
    categories,
    loading,
    error,
    fetchCategories: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
    createCategory: createMutation.mutateAsync,
    updateCategory: (id, data) => updateMutation.mutateAsync({ categoryId: id, categoryData: data }),
    deleteCategory: deleteMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useCategories;