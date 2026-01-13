import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProductsSimple } from '../useProductsSimple';

global.fetch = vi.fn();

describe('useProductsSimple', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('carga productos correctamente', async () => {
    const mockProducts = [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 200 }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProductsSimple());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores de fetch', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useProductsSimple());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toEqual([]);
  });

  it('reload vuelve a cargar productos', async () => {
    const mockProducts = [{ id: 1, name: 'Producto', price: 100 }];

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProductsSimple());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.reload();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});