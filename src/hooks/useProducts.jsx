import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';

const PRODUCTS_KEY = ['products'];
const productKey = (id) => ['products', id];

const useProducts = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...PRODUCTS_KEY, params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5,
    select: (d) => ({
      products: Array.isArray(d) ? d : (d.products ?? d.data ?? []),
      pagination: d.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 },
    }),
  });

  const products   = data?.products   ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 };
  const error      = queryError?.message ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });

  const patchProduct = (productId, patch) =>
    queryClient.setQueriesData({ queryKey: PRODUCTS_KEY }, (prev) => {
      if (!prev) return prev;
      const list = prev.products ?? prev;
      const updated = Array.isArray(list)
        ? list.map((p) => (p.id === productId ? { ...p, ...patch } : p))
        : list;
      return prev.products ? { ...prev, products: updated } : updated;
    });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, productData }) => productService.updateProduct(productId, productData),
    onSuccess: (data, { productId }) => patchProduct(productId, data.product ?? data),
  });

  const patchMutation = useMutation({
    mutationFn: ({ productId, productData }) => productService.patchProduct(productId, productData),
    onSuccess: (data, { productId }) => patchProduct(productId, data.product ?? data),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: (_, productId) =>
      queryClient.setQueriesData({ queryKey: PRODUCTS_KEY }, (prev) => {
        if (!prev) return prev;
        const list = prev.products ?? prev;
        const updated = Array.isArray(list) ? list.filter((p) => p.id !== productId) : list;
        return prev.products ? { ...prev, products: updated } : updated;
      }),
  });

  const uploadImagesMutation = useMutation({
    mutationFn: ({ productId, formData }) => productService.uploadProductImages(productId, formData),
    onSuccess: (data, { productId }) =>
      queryClient.setQueryData(productKey(productId), (prev) =>
        prev ? { ...prev, images: data.images } : prev
      ),
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imageId }) => productService.deleteProductImage(productId, imageId),
    onSuccess: (_, { productId, imageId }) =>
      queryClient.setQueryData(productKey(productId), (prev) =>
        prev ? { ...prev, images: prev.images?.filter((img) => img.id !== imageId) } : prev
      ),
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, stockData }) => productService.updateProductStock(productId, stockData),
    onSuccess: (data, { productId }) => patchProduct(productId, { stock: data.stock }),
  });

  return {
    products,
    product: null,
    loading,
    error,
    pagination,
    fetchProducts: invalidate,
    fetchProductById: (id) =>
      queryClient.fetchQuery({
        queryKey: productKey(id),
        queryFn: () => productService.getProductById(id),
        staleTime: 1000 * 60 * 5,
      }),
    createProduct: createMutation.mutateAsync,
    updateProduct: (id, data) => updateMutation.mutateAsync({ productId: id, productData: data }),
    patchProduct: (id, data) => patchMutation.mutateAsync({ productId: id, productData: data }),
    deleteProduct: deleteMutation.mutateAsync,
    fetchProductReviews: productService.getProductReviews,
    createReview: productService.createProductReview,
    searchProducts: productService.searchProducts,
    uploadImages: (id, files) => {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));
      return uploadImagesMutation.mutateAsync({ productId: id, formData });
    },
    deleteImage: (productId, imageId) => deleteImageMutation.mutateAsync({ productId, imageId }),
    fetchRelatedProducts: productService.getRelatedProducts,
    fetchFeaturedProducts: productService.getFeaturedProducts,
    fetchProductsOnSale: productService.getProductsOnSale,
    updateStock: (id, stockData) => updateStockMutation.mutateAsync({ productId: id, stockData }),
    clearError: () => {},
    clearState: () => queryClient.removeQueries({ queryKey: PRODUCTS_KEY }),
  };
};

export default useProducts;