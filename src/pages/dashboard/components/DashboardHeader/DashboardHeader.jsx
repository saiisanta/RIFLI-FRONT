import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import "./DashboardHeader.scss";

const DashboardHeader = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-header-bar">
      <button 
        className="dashboard-btn-back" 
        onClick={() => navigate("/")}
      >
        <FaArrowLeft /> 
        <span>Sitio Principal</span>
      </button>
      
      <button 
        className="dashboard-btn-logout" 
        onClick={onLogout}
      >
        <FaSignOutAlt /> 
        <span>Salir</span>
      </button>
    </div>
  );
};

export default DashboardHeader;