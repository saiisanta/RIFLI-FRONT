import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../AuthContext';

describe('AuthContext', () => {
  it('AuthProvider renderiza children correctamente', () => {
    render(
      <AuthProvider>
        <div>Test Children</div>
      </AuthProvider>
    );
    
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('useAuthContext lanza error si se usa fuera del provider', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      const TestComponent = () => {
        useAuthContext();
        return <div>Success</div>;
      };
      render(<TestComponent />);
    }).toThrow('useAuthContext debe usarse dentro de un AuthProvider');

    console.error = originalError;
  });
});