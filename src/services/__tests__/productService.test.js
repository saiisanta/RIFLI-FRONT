import { describe, it, expect, vi, beforeEach } from 'vitest';
import productService from '../productService';
import api from '../api';

vi.mock('../api');

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('hace la petición GET correcta', async () => {
      const mockData = [{ id: 1, name: 'Producto' }];
      api.get.mockResolvedValue({ data: mockData });
      
      const result = await productService.getProducts();
      
      expect(api.get).toHaveBeenCalledWith('/products', {
        params: expect.any(Object)
      });
      expect(result).toEqual(mockData);
    });

    it('maneja parámetros de búsqueda correctamente', async () => {
      api.get.mockResolvedValue({ data: [] });
      
      await productService.getProducts({
        search: 'cámara',
        category: 'Cámaras',
        page: 2
      });
      
      expect(api.get).toHaveBeenCalledWith('/products', {
        params: expect.objectContaining({
          search: 'cámara',
          category: 'Cámaras',
          page: 2
        })
      });
    });

    it('maneja errores correctamente', async () => {
      const error = { response: { data: { message: 'Error del servidor' } } };
      api.get.mockRejectedValue(error);
      
      await expect(productService.getProducts()).rejects.toEqual(error.response.data);
    });
  });

  describe('getProductById', () => {
    it('hace la petición GET con ID correcto', async () => {
      const mockProduct = { id: 1, name: 'Producto' };
      api.get.mockResolvedValue({ data: mockProduct });
      
      const result = await productService.getProductById(1);
      
      expect(api.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('hace la petición POST correcta', async () => {
      const newProduct = { name: 'Nuevo', price: 100 };
      const createdProduct = { id: 1, ...newProduct };
      
      api.post.mockResolvedValue({ data: createdProduct });
      
      const result = await productService.createProduct(newProduct);
      
      expect(api.post).toHaveBeenCalledWith('/products', newProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('hace la petición PUT correcta', async () => {
      const updatedData = { name: 'Actualizado', price: 150 };
      const updatedProduct = { id: 1, ...updatedData };
      
      api.put.mockResolvedValue({ data: updatedProduct });
      
      const result = await productService.updateProduct(1, updatedData);
      
      expect(api.put).toHaveBeenCalledWith('/products/1', updatedData);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('hace la petición DELETE correcta', async () => {
      api.delete.mockResolvedValue({ data: { success: true } });
      
      await productService.deleteProduct(1);
      
      expect(api.delete).toHaveBeenCalledWith('/products/1');
    });

    it('lanza error si falla la eliminación', async () => {
      const error = { response: { data: { message: 'No encontrado' } } };
      api.delete.mockRejectedValue(error);
      
      await expect(productService.deleteProduct(999))
        .rejects.toEqual(error.response.data);
    });
  });
});