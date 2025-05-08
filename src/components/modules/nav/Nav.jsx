import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import '../nav/nav.css';

const NavBar = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const heroElement = document.querySelector('.hero-section');
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // apenas se ve el hero-section, lo considera visible
      }
    );

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`Nav position-fixed top-0 start-0 end-0 w-100 ${!isHeroVisible ? 'navbar-hidden' : ''}`}
      style={{ zIndex: 9999 }}
    >
      <Container fluid className="Navbar px-4">
        <div className="logotipo">
          <Navbar.Brand href="#" className="d-flex align-items-center gap-2">
            <img
              src="./src/assets/img/rifli/icono_white.png"
              alt="Icono"
              className="icono"
              style={{ width: '70px', height: '70px' }}
            />
            <img
              src="./src/assets/img/rifli/rifli_white.png"
              alt="RIFLI"
              className="logo"
              style={{ height: '55px' }}
            />
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto align-items-center roboto">
            {['servicios', 'quienes-somos', 'contacto'].map((item) => (
              <Nav.Link
                key={item}
                href={`#${item}`}
                className="light-hover"
              >
                {item === 'servicios' && 'Servicios'}
                {item === 'quienes-somos' && 'Quiénes somos'}
                {item === 'contacto' && 'Contacto'}
              </Nav.Link>
            ))}
            <Nav.Link href="#perfil" className="ms-2 login-icon">
              <PersonCircle size={32} className="icon" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
