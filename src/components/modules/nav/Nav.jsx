import React, { useState, useEffect, useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { AuthContext } from '../../../context/AuthContext';
import AuthModal from '../authModal/AuthModal';
import './nav.scss';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => {
    setExpanded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const obs = new IntersectionObserver(
      ([e]) => setIsHeroVisible(e.isIntersecting),
      { threshold: 0.1 }
    );

    window.addEventListener('scroll', handleScroll);
    obs.observe(hero);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        className={`Nav ${!isHeroVisible ? 'Nav--hidden' : ''} ${isScrolled ? 'Nav--scrolled' : ''}`}
        expanded={expanded}
        onToggle={(val) => setExpanded(val)}
      >
        <Container fluid className="Nav__container px-4">
          
          <Navbar.Brand href="#" className="Nav__brand">
            <div className="Nav__logo-wrapper">
              <img src="./src/assets/img/rifli/rifli_white.png" alt="RIFLI" className="logo" draggable="false"/>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="navbar-content" 
            className="Nav__toggler"
          >
            <span className="Nav__toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbar-content" className="Nav__collapse">
            <div className="Nav__menu-wrapper">
              <Nav className="Nav__nav-list">
                {['servicios', 'marcas'].map(item => (
                  <Nav.Link 
                    key={item} 
                    href={`#${item}`} 
                    className="Nav__link"
                    onClick={closeMenu}
                  >
                    {item === 'servicios' ? 'Servicios' : 'Marcas'}
                  </Nav.Link>
                ))}
                
                {user && user.role === 'admin' && (
                  <Nav.Link href="/admin" onClick={closeMenu} className="Nav__link">
                    Admin
                  </Nav.Link>
                )}
              </Nav>

              <Nav className="Nav__auth">
                {user ? (
                  <button onClick={() => { logout(); closeMenu(); }} className="Nav__auth-btn">
                    <BoxArrowRight size={30} />
                  </button>
                ) : (
                  <button onClick={() => { setShowAuth(true); closeMenu(); }} className="Nav__auth-btn">
                    <PersonCircle size={30} />
                  </button>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default NavBar;