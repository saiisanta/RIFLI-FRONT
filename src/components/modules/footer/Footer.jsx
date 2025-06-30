import React from "react";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>RIFLI</h2>
          <p>
            Nos dedicamos a brindar soluciones integrales en instalaciones eléctricas,
            seguridad, gas, construcción en seco y distribución de materiales. 
            Garantizamos calidad, experiencia y compromiso en cada proyecto.
          </p>
        </div>

        <div className="footer-side">
          <div className="footer-links">
            <h4>Servicios</h4>
            <ul>
              <li>Seguridad</li>
              <li>Electricidad</li>
              <li>Gasista</li>
              <li>Trabajos en seco</li>
              <li>Distribución</li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li>📞 +54 9 11 1234 5678</li>
              <li>✉️ riflisoporte@gmail.com</li>
              <li>📍 Firmat, Santa Fe</li>
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
