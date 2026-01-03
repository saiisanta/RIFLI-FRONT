// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Shop from '../components/modules/shop/Shop';
import Quotes from '../components/modules/quotes/Quotes';
import AdminPanel from '../components/modules/admin/AdminPanel';
import Profile from '../components/modules/user/Profile';
import Dashboard from '../components/modules/dashboard/Dashboard';
import { PrivateRoute } from './PrivateRoute';
import NavBar from '../components/modules/nav/Nav';

export default function AppRoutes() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<App />} />
    
      <Route path="/shop" element={<Shop />} />
      <Route path="/servicios" element={<Quotes />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute adminOnly>
          <AdminPanel />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}