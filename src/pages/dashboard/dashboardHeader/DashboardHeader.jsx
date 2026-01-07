import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import "./DashboardHeader.scss";

const DashboardHeader = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-header-bar">
      <Button 
        className="btn-back" 
        onClick={() => navigate("/")}
      >
        <FaArrowLeft /> <span>Sitio Principal</span>
      </Button>
      
      <Button 
        className="btn-logout" 
        onClick={onLogout}
      >
        <FaSignOutAlt /> <span>Salir</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;