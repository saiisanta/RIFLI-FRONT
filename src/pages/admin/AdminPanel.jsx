import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';
import ProductManager from './sections/ProductManager/ProductManager';
import UserManager from './sections/UserManager/UserManager';
import ServiceManager from './sections/ServiceManager/ServiceManager';
import OrderManager from './sections/OrderManager/OrderManager';
import QuoteManager from './sections/QuoteManager/QuoteManager';
import Stats from './sections/Stats/Stats';
import './AdminPanel.scss';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      
      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="quotes" element={<QuoteManager />} />
          <Route path="stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;