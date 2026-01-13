import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { vi } from 'vitest';

const mockUser = {
  id: 1,
  nombre: 'Usuario Test',
  email: 'test@test.com',
  role: 'cliente'
};

export function renderWithProviders(
  ui,
  {
    user = mockUser,
    isAuthenticated = true,
    loading = false,
    ...renderOptions
  } = {}
) {
  const mockAuthContext = {
    user: isAuthenticated ? user : null,
    loading,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          {children}
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAuthContext,
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };