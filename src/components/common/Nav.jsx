import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Tag,
  Zap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../NotificationBell/NotificationBell";
import "./nav.scss";

const HIDDEN_PATHS = [
  "/dashboard", "/admin", "/admin/products", "/admin/categories",
  "/admin/brands", "/admin/users", "/admin/services", "/admin/orders",
  "/admin/quotes", "/admin/stats", "/shop", "/login", "/register",
  "/forgot-password", "/profile", "/servicios", "/presupuestos",
];

const NAV_LINKS = [
  { label: "Home",      renderIcon: (s, sw) => <Home size={s} strokeWidth={sw} />, href: "/#hero",      section: ".hero-section"  },
  { label: "Marcas",    renderIcon: (s, sw) => <Tag  size={s} strokeWidth={sw} />, href: "/#marcas",    section: ".slider-section" },
  { label: "Servicios", renderIcon: (s, sw) => <Zap  size={s} strokeWidth={sw} />, href: "/#servicios", section: "#servicios"      },
];

const getY = () => document.body.scrollTop;

const NavBar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const isAuthenticated = !!(user && user.email);

  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const [visible, setVisible]             = useState(true);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState(".hero-section");

  const lastScrollY = useRef(getY());

  useEffect(() => {
    lastScrollY.current = getY();
    const handleScroll = () => {
      const current = getY();
      const delta   = current - lastScrollY.current;
      setIsScrolled(current > 60);
      if (current <= 60)       setVisible(true);
      else if (delta > 4)    { setVisible(false); setMobileOpen(false); }
      else if (delta < -4)     setVisible(true);
      lastScrollY.current = current;
    };
    document.body.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const detectActive = () => {
      const trigger = window.innerHeight * 0.5;
      let current   = NAV_LINKS[0].section;
      for (const { section } of NAV_LINKS) {
        const el = document.querySelector(section);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= trigger) current = section;
      }
      setActiveSection(current);
    };
    const t = setTimeout(detectActive, 200);
    document.body.addEventListener("scroll", detectActive, { passive: true });
    return () => { clearTimeout(t); document.body.removeEventListener("scroll", detectActive); };
  }, [pathname]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout     = () => { logout(); setMobileOpen(false); navigate("/"); };
  const handleLoginClick = () => { setMobileOpen(false); navigate("/login"); };

  const handleNotifOpen = () => setMobileOpen(false);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <header className={`Nav ${!visible ? "Nav--hidden" : ""} ${isScrolled ? "Nav--scrolled" : ""}`}>
      
      <Link to="/" className="Nav__logo">
        <img src="./src/assets/img/rifli/rifli_white.png" alt="RIFLI" className="Nav__logo-img" draggable="false" />
      </Link>
      <div className="Nav__pill">
        <nav className="Nav__links">
          {NAV_LINKS.map(({ label, renderIcon, href, section }) => {
            const isActive = activeSection === section;
            return (
              <a key={href} href={href} className={`Nav__link ${isActive ? "Nav__link--active" : ""}`} title={label}>
                {renderIcon(17, 2.2)}
                {isActive && <span className="Nav__link-label">{label}</span>}
              </a>
            );
          })}
        </nav>

        <div className="Nav__separator" />

        <div className="Nav__actions">
          {!loading && (
            <>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="Nav__action-btn Nav__action-btn--dashboard" title="Dashboard">
                    <LayoutDashboard size={21} strokeWidth={2} />
                  </Link>
                  <NotificationBell onOpen={handleNotifOpen} />
                  <button className="Nav__action-btn Nav__action-btn--logout" onClick={handleLogout} title="Cerrar sesión">
                    <LogOut size={21} strokeWidth={2} />
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <button className="Nav__action-btn Nav__action-btn--login" onClick={handleLoginClick} title="Iniciar sesión">
                  <LogIn size={21} strokeWidth={2} />
                  <span className="Nav__login-label">Ingresar</span>
                </button>
              )}
            </>
          )}
          <button className="Nav__burger" onClick={() => setMobileOpen(v => !v)} aria-label="Menú">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`Nav__mobile ${mobileOpen ? "Nav__mobile--open" : ""}`}>
        {NAV_LINKS.map(({ label, renderIcon, href, section }) => (
          <a key={href} href={href}
            className={`Nav__mobile-link ${activeSection === section ? "Nav__mobile-link--active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {renderIcon(18, 2)}
            <span>{label}</span>
          </a>
        ))}
        <div className="Nav__mobile-divider" />
        {!loading && isAuthenticated && (
          <>
            <Link to="/dashboard" className="Nav__mobile-link" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={18} strokeWidth={2} /><span>Dashboard</span>
            </Link>
            <button className="Nav__mobile-link Nav__mobile-link--logout" onClick={handleLogout}>
              <LogOut size={18} strokeWidth={2} /><span>Cerrar sesión</span>
            </button>
          </>
        )}
        {!loading && !isAuthenticated && (
          <button className="Nav__mobile-link Nav__mobile-link--login" onClick={handleLoginClick}>
            <LogIn size={18} strokeWidth={2} /><span>Ingresar</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;