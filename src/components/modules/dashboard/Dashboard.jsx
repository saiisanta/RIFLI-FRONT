import React, { useContext } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, FaTools, FaShoppingCart, 
  FaFileInvoiceDollar, FaSignOutAlt, FaCogs, FaArrowLeft 
} from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext"; 
import "./dashboard.scss";

const DashboardCard = ({ title, icon: Icon, path, onClick, type }) => (
  <Col xs={6} md={4} lg={3} xl={2} className="dashboard-col">
    <Card className={`dashboard-card card-type-${type}`} onClick={() => onClick(path)}>
      <div className="card-glass-effect"></div>
      <div className="dashboard-card-icon-wrapper">
        <Icon className="dashboard-card-icon" />
      </div>
      <Card.Body>
        <Card.Title className="dashboard-card-title">{title}</Card.Title>
      </Card.Body>
    </Card>
  </Col>
);

const Dashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return (
    <div className="dashboard-loading">
      <Spinner animation="border" variant="warning" />
    </div>
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="polygon-bg"></div>
      
      <div className="dashboard-header-bar">
        <Button className="btn-back" onClick={() => navigate("/")}>
          <FaArrowLeft /> <span>Sitio Principal</span>
        </Button>
        <Button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Salir</span>
        </Button>
      </div>
      
      <Container className="dashboard-content">
        <header className="dashboard-welcome">
          <div className="accent-line"></div>
          <p className="welcome-label">Terminal de Control</p>
          <h1>Hola, <span>{user.nombre || "Usuario"}</span></h1>
        </header>

        <Row className="dashboard-grid justify-content-center">
          <DashboardCard title="Mi Perfil" icon={FaUserCircle} path="/perfil" onClick={navigate} type="profile" />
          <DashboardCard title="Servicios" icon={FaTools} path="/servicios" onClick={navigate} type="tools" />
          <DashboardCard title="Tienda" icon={FaShoppingCart} path="/shop" onClick={navigate} type="shop" />
          <DashboardCard title="Presupuestos" icon={FaFileInvoiceDollar} path="/presupuestos" onClick={navigate} type="billing" />

          {user.role === 'admin' && (
            <DashboardCard title="Admin" icon={FaCogs} path="/admin" onClick={navigate} type="admin" />
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;