export const mockUsers = [
    {
      id: 1,
      nombre: 'Admin User',
      email: 'admin@test.com',
      role: 'admin'
    },
    {
      id: 2,
      nombre: 'Cliente User',
      email: 'cliente@test.com',
      role: 'cliente'
    },
    {
      id: 3,
      nombre: 'Tecnico User',
      email: 'tecnico@test.com',
      role: 'tecnico'
    }
  ];
  
  export const mockAdminUser = mockUsers[0];
  export const mockClienteUser = mockUsers[1];
  export const mockTecnicoUser = mockUsers[2];
  
  export const mockAuthResponse = {
    token: 'mock-jwt-token-12345',
    user: mockClienteUser
  };
  
  export const mockLoginCredentials = {
    email: 'test@test.com',
    password: 'password123'
  };
  
  export const mockRegisterData = {
    nombre: 'Nuevo Usuario',
    email: 'nuevo@test.com',
    password: 'password123',
    confirmPassword: 'password123'
  };