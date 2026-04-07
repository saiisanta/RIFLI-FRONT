import React from "react";
import "./footer.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>RIFLI</h2>
          <p>
            Nos dedicamos a brindar soluciones integrales en instalaciones eléctricas,
            seguridad y de gas.
          </p>
        </div>

        <div className="footer-side">
          <div className="footer-links">
            <h4>Servicios</h4>
            <ul>
              <li>Seguridad</li>
              <li>Electricidad</li>
              <li>Gasista</li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li>+54 9 11 1234 5678</li>
              <li>riflisoporte@gmail.com</li>
              <li>Firmat, Santa Fe</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} RIFLI. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
