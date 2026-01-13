import { describe, it, expect, vi, beforeEach } from 'vitest';
import userService from '../userService';
import api from '../api';

vi.mock('../api');

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMyProfile obtiene el perfil', async () => {
    const mockProfile = { id: 1, email: 'test@test.com' };
    api.get.mockResolvedValue({ data: mockProfile });
    
    const result = await userService.getMyProfile();
    
    expect(api.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(mockProfile);
  });

  it('updateMyProfile actualiza el perfil', async () => {
    const updateData = { nombre: 'Nuevo Nombre' };
    const mockResponse = { id: 1, nombre: 'Nuevo Nombre' };
    api.put.mockResolvedValue({ data: mockResponse });
    
    const result = await userService.updateMyProfile(updateData);
    
    expect(api.put).toHaveBeenCalledWith('/users/me', updateData);
    expect(result).toEqual(mockResponse);
  });

  it('changePassword cambia la contraseña', async () => {
    const passwordData = { currentPassword: 'old', newPassword: 'new' };
    api.put.mockResolvedValue({ data: { success: true } });
    
    await userService.changePassword(passwordData);
    
    expect(api.put).toHaveBeenCalledWith('/users/change-password', passwordData);
  });

  it('deleteMyProfile elimina el perfil', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    
    await userService.deleteMyProfile();
    
    expect(api.delete).toHaveBeenCalledWith('/users/me');
  });
});