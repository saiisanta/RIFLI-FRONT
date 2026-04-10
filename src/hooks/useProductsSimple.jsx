import { useQuery, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';

const PRODUCTS_SIMPLE_KEY = ['products', 'simple'];

export const useProductsSimple = (initialFilters = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...PRODUCTS_SIMPLE_KEY, initialFilters],
    queryFn: () => productService.getProducts({ page: 1, limit: 100, ...initialFilters }),
    staleTime: 1000 * 60 * 5,
    select: (response) => {
      if (response.products) {
        return {
          products: response.products,
          pagination: {
            currentPage:    response.currentPage    ?? 1,
            totalPages:     response.totalPages     ?? 1,
            totalProducts:  response.totalProducts  ?? response.products.length,
            limit:          response.limit          ?? 100,
          },
        };
      }
      if (Array.isArray(response)) {
        return {
          products: response,
          pagination: { currentPage: 1, totalPages: 1, totalProducts: response.length, limit: 100 },
        };
      }
      return {
        products: [],
        pagination: { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 100 },
      };
    },
  });

  const products   = data?.products   ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 100 };
  const error      = queryError?.message ?? null;

  const reload = (filters = {}) =>
    queryClient.invalidateQueries({ queryKey: [...PRODUCTS_SIMPLE_KEY, filters] });

  return { products, loading, error, reload, pagination };
};