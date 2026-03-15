import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuotesNavbar from './components/QuotesNavbar/QuotesNavBar';
import QuoteWizard from './components/QuoteWizard/QuoteWizard';
import QuotesList from './components/QuotesList/QuotesList';
import { FiPlusCircle, FiList } from 'react-icons/fi';
import './Quotes.scss';

const Quotes = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('list');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleWizardSuccess = () => {
    setActiveView('list');
  };

  return (
    <div className="quotes-page-wrapper">
      <QuotesNavbar onLogout={handleLogout} />

      <div className="quotes-container">

        {/* ── Page header ── */}
        <div className="quotes-page-header">
          <span className="quotes-page-label">Presupuestos</span>
          <h1 className="quotes-page-title">
            Mis <span>Solicitudes</span>
          </h1>
          <p className="quotes-page-subtitle">
            Solicitá presupuestos para tus proyectos y hacé seguimiento del estado
          </p>
        </div>

        {/* ── View tabs ── */}
        <div className="quotes-tabs">
          <button
            className={`quotes-tab ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            <FiList size={16} />
            Mis solicitudes
          </button>
          <button
            className={`quotes-tab ${activeView === 'new' ? 'active' : ''}`}
            onClick={() => setActiveView('new')}
          >
            <FiPlusCircle size={16} />
            Nueva solicitud
          </button>
        </div>

        {/* ── Views ── */}
        {activeView === 'new' ? (
          <QuoteWizard onSuccess={handleWizardSuccess} />
        ) : (
          <QuotesList onNewQuote={() => setActiveView('new')} />
        )}

      </div>
    </div>
  );
};

export default Quotes;