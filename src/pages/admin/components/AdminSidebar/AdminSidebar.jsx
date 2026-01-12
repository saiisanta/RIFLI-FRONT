import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BoxArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Box,
  People,
  Tools,
  Receipt,
  ChatDots,
  BarChartLine
} from 'react-bootstrap-icons';
import './AdminSidebar.scss';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/products', label: 'Productos', icon: Box },
    { path: '/admin/users', label: 'Usuarios', icon: People },
    { path: '/admin/services', label: 'Servicios', icon: Tools },
    { path: '/admin/orders', label: 'Pedidos', icon: Receipt },
    { path: '/admin/quotes', label: 'Cotizaciones', icon: ChatDots },
    { path: '/admin/stats', label: 'Estadísticas', icon: BarChartLine },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        <button
          className="admin-sidebar-btn-back"
          onClick={() => navigate('/dashboard')}
          title="Volver al dashboard"
        >
          <BoxArrowLeft size={20} />
        </button>
        {sidebarOpen && <h2 className="admin-sidebar-logo">ADMIN</h2>}
      </div>

      {sidebarOpen && (
        <nav className="admin-sidebar-nav">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <button
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
};

export default AdminSidebar;