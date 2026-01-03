import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await fetch('http://localhost:4001/api/users/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false); 
    };
    initAuth();
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await fetch('http://localhost:4001/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar perfil');
      
      const userData = await res.json();
      setUser(userData);
      return userData;
    } catch (error) {
      logout();
      return null;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Credenciales incorrectas');
      }

      const { token: jwt } = await res.json();
      localStorage.setItem('token', jwt);
      setToken(jwt);
      await fetchProfile(jwt);
    } catch (error) {
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch('http://localhost:4001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al registrar');
      }

      await login({ email, password });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}