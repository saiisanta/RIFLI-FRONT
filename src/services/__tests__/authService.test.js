import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../authService';
import api from '../api';

vi.mock('../api');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login hace la petición POST correcta', async () => {
    const mockResponse = { user: { id: 1, email: 'test@test.com' }, token: 'abc123' };
    api.post.mockResolvedValue({ data: mockResponse });
    
    const result = await authService.login({ email: 'test@test.com', password: '123456' });
    
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: '123456' });
    expect(result).toEqual(mockResponse);
  });

  it('register hace la petición POST correcta', async () => {
    const userData = { email: 'new@test.com', password: '123456', nombre: 'Test' };
    const mockResponse = { user: { id: 1, ...userData }, token: 'abc123' };
    api.post.mockResolvedValue({ data: mockResponse });
    
    const result = await authService.register(userData);
    
    expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
    expect(result).toEqual(mockResponse);
  });

  it('logout hace la petición POST correcta', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    await authService.logout();
    
    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('getCurrentUser obtiene el usuario actual', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    api.get.mockResolvedValue({ data: mockUser });
    
    const result = await authService.getCurrentUser();
    
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(mockUser);
  });

  it('maneja errores correctamente', async () => {
    const error = { response: { data: { error: 'No autorizado' } } };
    api.post.mockRejectedValue(error);
    
    await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toEqual('No autorizado');
  });
});