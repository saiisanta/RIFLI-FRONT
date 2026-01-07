import React, { useState, useEffect, useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthModal from "./AuthModal";
import "./nav.scss";

const NavBar = () => {
  const { user, logout, loading } = useContext(AuthContext);

  const isAuthenticated = !!(user && user.email);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setExpanded(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const hero = document.querySelector(".hero-section");

    if (!hero) {
      setIsHeroVisible(true);
      setIsScrolled(true);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    setIsScrolled(window.scrollY > 50);

    const obs = new IntersectionObserver(
      ([e]) => setIsHeroVisible(e.isIntersecting),
      { threshold: 0.1 }
    );

    window.addEventListener("scroll", handleScroll);
    obs.observe(hero);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      obs.disconnect();
    };
  }, [pathname]);

  if (pathname === "/dashboard" || pathname === "/admin" || pathname === "/shop" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <>
      <Navbar
        expand="lg"
        className={`Nav ${!isHeroVisible ? "Nav--hidden" : ""} ${
          isScrolled ? "Nav--scrolled" : ""
        }`}
        expanded={expanded}
        onToggle={(val) => setExpanded(val)}
      >
        <Container fluid className="Nav__container px-4">
          <Navbar.Brand
            as={Link}
            to="/"
            className="Nav__brand"
            onClick={closeMenu}
          >
            <div className="Nav__logo-wrapper">
              <img
                src="./src/assets/img/rifli/rifli_white.png"
                alt="RIFLI"
                className="logo"
                draggable="false"
              />
            </div>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbar-content"
            className="Nav__toggler"
          />

          <Navbar.Collapse id="navbar-content" className="Nav__collapse">
            <div className="Nav__menu-wrapper">
              <Nav className="Nav__nav-list">
                <Nav.Link
                  href="/#servicios"
                  className="Nav__link"
                  onClick={closeMenu}
                >
                  Servicios
                </Nav.Link>
                <Nav.Link
                  href="/#marcas"
                  className="Nav__link"
                  onClick={closeMenu}
                >
                  Marcas
                </Nav.Link>

                {user && user.email && (
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className="Nav__link Nav__link--dashboard"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Nav.Link>
                )}
              </Nav>

              <div className="Nav__auth-container">
                {!loading &&
                  (isAuthenticated ? (
                    <div
                      className="d-flex align-items-center gap-3"
                      key="logged-in"
                    >
                      <button onClick={handleLogout} className="Nav__auth-btn">
                        <BoxArrowRight size={28} />
                      </button>
                    </div>
                  ) : (
                    <button
                      key="guest"
                      onClick={() => {
                        setShowAuth(true);
                        closeMenu();
                      }}
                      className="Nav__auth-btn"
                    >
                      <PersonCircle size={30} />
                    </button>
                  ))}
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default NavBar;
