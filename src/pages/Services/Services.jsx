//import React, { useState, useRef, useEffect } from "react";
import ServicesNavbar from './components/ServicesNavbar/ServicesNavbar';
import { useNavigate } from 'react-router-dom';
import "./Services.scss";



const Services  = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div className="services-page-wrapper">
      <ServicesNavbar onLogout={handleLogout} />
      
      <div className="services-container">
      
    </div>
 </div>
  );
};

export default Services;
