import React, { useContext } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, FaTools, FaShoppingCart, 
  FaFileInvoiceDollar, FaCogs 
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import DashboardHeader from "./dashboardHeader/DashboardHeader";
import DashboardCard from "./dashboardCard/DashboardCard";
import "./dashboard.scss";

const Dashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Configuración de las tarjetas del dashboard
  const dashboardCards = [
    { 
      title: "Mi Perfil", 
      icon: FaUserCircle, 
      path: "/perfil", 
      type: "profile" 
    },
    { 
      title: "Servicios", 
      icon: FaTools, 
      path: "/servicios", 
      type: "tools" 
    },
    { 
      title: "Tienda", 
      icon: FaShoppingCart, 
      path: "/shop", 
      type: "shop" 
    },
    { 
      title: "Presupuestos", 
      icon: FaFileInvoiceDollar, 
      path: "/presupuestos", 
      type: "billing" 
    }
  ];

  // Agregar tarjeta de Admin si el usuario es admin
  if (user.role === 'admin') {
    dashboardCards.push({ 
      title: "Admin", 
      icon: FaCogs, 
      path: "/admin", 
      type: "admin" 
    });
  }

  return (
    <div className="dashboard-wrapper">
      <div className="polygon-bg"></div>
      
      {/* Header con botones de navegación */}
      <DashboardHeader onLogout={handleLogout} />
      
      <Container className="dashboard-content">
        {/* Welcome Section */}
        <header className="dashboard-welcome">
          <div className="accent-line"></div>
          <p className="welcome-label">Terminal de Control</p>
          <h1>
            Hola, <span>{user.nombre || "Usuario"}</span>
          </h1>
        </header>

        {/* Grid de tarjetas */}
        <Row className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              icon={card.icon}
              path={card.path}
              type={card.type}
              onClick={navigate}
            />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;