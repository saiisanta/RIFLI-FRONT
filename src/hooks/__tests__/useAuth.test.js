import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useAuth from '../useAuth';
import * as authService from '../../services/authService';

vi.mock('../../services/authService');

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('estado inicial es correcto', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('login autentica usuario correctamente', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    authService.default.login = vi.fn().mockResolvedValue({ user: mockUser });
    
    const { result } = renderHook(() => useAuth());
    
    await result.current.login({ email: 'test@test.com', password: '123456' });
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('register registra usuario correctamente', async () => {
    const mockUser = { id: 1, email: 'new@test.com' };
    authService.default.register = vi.fn().mockResolvedValue({ user: mockUser });
    
    const { result } = renderHook(() => useAuth());
    
    await result.current.register({ email: 'new@test.com', password: '123456' });
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('logout cierra sesión correctamente', async () => {
    authService.default.logout = vi.fn().mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useAuth());
    
    await result.current.logout();
    
    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('maneja errores de login', async () => {
    const error = 'Credenciales inválidas';
    authService.default.login = vi.fn().mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());
    
    try {
      await result.current.login({ email: 'test@test.com', password: 'wrong' });
    } catch (err) {
      // Error esperado
    }
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});