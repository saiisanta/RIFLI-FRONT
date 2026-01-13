export const mockAuthToken = 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const mockAuthResponse = {
  success: true,
  token: mockAuthToken,
  user: {
    id: 1,
    nombre: 'Usuario Test',
    email: 'test@test.com',
    role: 'cliente'
  }
};

export const mockLoginRequest = {
  email: 'test@test.com',
  password: 'password123'
};

export const mockRegisterRequest = {
  nombre: 'Nuevo Usuario',
  email: 'nuevo@test.com',
  password: 'password123',
  confirmPassword: 'password123'
};

export const mockAuthError = {
  success: false,
  message: 'Credenciales inválidas'
};

export const mockTokenExpiredError = {
  success: false,
  message: 'Token expirado'
};