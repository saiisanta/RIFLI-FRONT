// src/components/NavBar.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { PersonCircle , BoxArrowRight } from 'react-bootstrap-icons';
import { AuthContext } from '../../../context/AuthContext';
import AuthModal from '../authModal/AuthModal';
import './nav.css';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Detecta si la sección hero está visible para ocultar el navbar al hacer scroll
  useEffect(() => {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const obs = new IntersectionObserver(
      ([e]) => setIsHeroVisible(e.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        bg="transparent"
        variant="dark"
        className={`Nav position-fixed w-100 ${!isHeroVisible ? 'navbar-hidden' : ''}`}
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container fluid className="NavbarContainer px-3">
          
          {/* LOGOTIPO IZQUIERDA */}
          <Navbar.Brand href="#" className="logotipo">
            <img src="./src/assets/img/rifli/icono_white.png" alt="Icono" className="icono" />
            <img src="./src/assets/img/rifli/rifli_white.png" alt="RIFLI" className="logo" />
          </Navbar.Brand>

          {/* BOTÓN HAMBURGUESA (MOBILE) */}
          <Navbar.Toggle 
            aria-controls="navbar-content" 
            className="d-lg-none border-0"
          />

          {/* MENÚ PRINCIPAL (DERECHA) */}
          <Navbar.Collapse id="navbar-content" className="justify-content-end">
            <div className="d-flex align-items-center gap-lg-4">

              {/* NAVLINKS */}
              <Nav className="me-lg-3">
                {['servicios', 'marcas'].map(item => (
                  <Nav.Link 
                    key={item} 
                    href={`#${item}`} 
                    className="nav-link-custom"
                    onClick={() => setExpanded(false)}
                  >
                    {item === 'servicios'
                      ? 'Servicios'
                      : item === 'quienes-somos'
                      ? 'Quiénes somos'
                      : 'Marcas'}
                  </Nav.Link>
                ))}
                
                {/* LINK AL PANEL ADMIN SI HAY USUARIO ADMIN */}
                {user && user.role === 'admin' && (
                  <Nav.Link href="/admin" onClick={() => setExpanded(false)} className="nav-link-custom">
                    Admin
                  </Nav.Link>
                )}
              </Nav>

              {/* LOGIN / LOGOUT ICON */}
              <Nav className="login-icon">
                {user ? (
                  <Nav.Link onClick={logout}>
                    <BoxArrowRight size={32} className='icon' />
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={() => setShowAuth(true)}>
                    <PersonCircle size={32} className="icon" />
                  </Nav.Link>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MODAL DE LOGIN / REGISTER */}
      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default NavBar;
