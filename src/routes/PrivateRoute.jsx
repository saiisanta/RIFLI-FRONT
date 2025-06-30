// src/routes/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // o spinner de carga
  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
}
