//import React, { useState, useRef, useEffect } from "react";
import QuotesNavbar from './components/QuotesNavbar/QuotesNavBar';
import { useNavigate } from 'react-router-dom';
import "./Quotes.scss";



const Quotes  = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div className="quotes-page-wrapper">
      <QuotesNavbar onLogout={handleLogout} />
      
      <div className="quotes-container">
      
    </div>
 </div>
  );
};

export default Quotes;
