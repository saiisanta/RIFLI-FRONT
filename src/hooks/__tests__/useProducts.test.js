import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useProducts from '../useProducts';
import * as productService from '../../services/productService';

vi.mock('../../services/productService');

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('estado inicial es correcto', () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchProducts carga productos correctamente con array directo', async () => {
    const mockProducts = [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 200 }
    ];
    
    productService.default.getProducts = vi.fn().mockResolvedValue(mockProducts);
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.fetchProducts();
    
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
    });
  });

  it('fetchProducts carga productos correctamente con objeto', async () => {
    const mockData = {
      products: [
        { id: 1, name: 'Producto 1', price: 100 }
      ],
      pagination: { page: 1, total: 1 }
    };
    
    productService.default.getProducts = vi.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.fetchProducts();
    
    await waitFor(() => {
      expect(result.current.products).toEqual(mockData.products);
      expect(result.current.pagination).toEqual(mockData.pagination);
    });
  });

  it('maneja errores correctamente', async () => {
    const error = { message: 'Error al cargar productos' };
    productService.default.getProducts = vi.fn().mockRejectedValue(error);
    
    const { result } = renderHook(() => useProducts());
    
    try {
      await result.current.fetchProducts();
    } catch (err) {
      // Error esperado
    }
    
    await waitFor(() => {
      expect(result.current.error).toBe('Error al cargar productos');
    });
  });

  it('createProduct agrega producto al estado', async () => {
    const newProduct = { id: 3, name: 'Nuevo', price: 150 };
    productService.default.createProduct = vi.fn().mockResolvedValue({ product: newProduct });
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.createProduct(newProduct);
    
    await waitFor(() => {
      expect(result.current.products).toContainEqual(newProduct);
    });
  });

  it('updateProduct actualiza producto en el estado', async () => {
    const mockProducts = [{ id: 1, name: 'Producto 1', price: 100 }];
    const updatedProduct = { id: 1, name: 'Producto Actualizado', price: 150 };
    
    productService.default.getProducts = vi.fn().mockResolvedValue(mockProducts);
    productService.default.updateProduct = vi.fn().mockResolvedValue({ product: updatedProduct });
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.fetchProducts();
    await result.current.updateProduct(1, { name: 'Producto Actualizado', price: 150 });
    
    await waitFor(() => {
      expect(result.current.products[0].name).toBe('Producto Actualizado');
    });
  });

  it('deleteProduct elimina producto del estado', async () => {
    const mockProducts = [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 200 }
    ];
    
    productService.default.getProducts = vi.fn().mockResolvedValue(mockProducts);
    productService.default.deleteProduct = vi.fn().mockResolvedValue(true);
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.fetchProducts();
    await result.current.deleteProduct(1);
    
    await waitFor(() => {
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].id).toBe(2);
    });
  });

  it('clearError limpia el error', () => {
    const { result } = renderHook(() => useProducts());
    
    result.current.clearError();
    
    expect(result.current.error).toBeNull();
  });
});