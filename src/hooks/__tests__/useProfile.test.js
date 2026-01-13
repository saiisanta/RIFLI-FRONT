import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useProfile from '../useProfile';
import * as userService from '../../services/userService';

vi.mock('../../services/userService');

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('estado inicial es correcto', () => {
    const { result } = renderHook(() => useProfile());
    
    expect(result.current.profile).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchProfile carga el perfil correctamente', async () => {
    const mockProfile = { id: 1, name: 'Usuario Test', email: 'test@test.com' };
    
    userService.default.getMyProfile = vi.fn().mockResolvedValue({ user: mockProfile });
    
    const { result } = renderHook(() => useProfile());
    
    await result.current.fetchProfile();
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.loading).toBe(false);
    });
  });

  it('updateProfile actualiza el perfil', async () => {
    const updatedProfile = { id: 1, name: 'Usuario Actualizado', email: 'test@test.com' };
    
    userService.default.updateMyProfile = vi.fn().mockResolvedValue({ user: updatedProfile });
    
    const { result } = renderHook(() => useProfile());
    
    await result.current.updateProfile({ name: 'Usuario Actualizado' });
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(updatedProfile);
    });
  });

  it('changePassword cambia la contraseña', async () => {
    userService.default.changePassword = vi.fn().mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useProfile());
    
    const response = await result.current.changePassword({
      currentPassword: 'old123',
      newPassword: 'new123'
    });
    
    expect(response.success).toBe(true);
  });

  it('deleteProfile elimina el perfil', async () => {
    userService.default.deleteMyProfile = vi.fn().mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useProfile());
    
    await result.current.deleteProfile();
    
    await waitFor(() => {
      expect(result.current.profile).toBeNull();
    });
  });

  it('maneja errores correctamente', async () => {
    const error = { message: 'Error al cargar perfil' };
    userService.default.getMyProfile = vi.fn().mockRejectedValue(error);
    
    const { result } = renderHook(() => useProfile());
    
    try {
      await result.current.fetchProfile();
    } catch (err) {
      // Error esperado
    }
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('clearError limpia el error', () => {
    const { result } = renderHook(() => useProfile());
    
    result.current.clearError();
    
    expect(result.current.error).toBeNull();
  });
});