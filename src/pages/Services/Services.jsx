import React, { useState, useRef } from "react";
import "./services.css";

// Importación de íconos de cada servicio
import seguridadIcon from "/src/assets/img/icons/seguridad1.svg";
import electricidadIcon from "/src/assets/img/icons/electricidad1.svg";
import secoIcon from "/src/assets/img/icons/seco1.svg";
import gasistaIcon from "/src/assets/img/icons/gasista1.svg";
import distribucionIcon from "/src/assets/img/icons/distribucion1.svg";

// ===========================
// Detalles de cada servicio
// ===========================
export const serviceDetails = [
  {
    title: "Sistemas de Seguridad",
    description: (
      <>
        Instalación y mantenimiento de alarmas, cámaras<br />
        y sistemas de vigilancia 24/7 para máxima protección.
      </>
    ),
    icon: seguridadIcon,
    backgroundImageUrl: "/src/assets/img/servicios/seguridadHero.png",
    form: (
      <form className="quote-form">
        {/* Campos del formulario */}
        <div className="field-group">
          <label>Nombre Completo</label>
          <input type="text" name="name" placeholder="Tu nombre" required />
        </div>
        <div className="field-group">
          <label>Teléfono de Contacto</label>
          <input type="tel" name="phone" placeholder="+54 9 11 1234‑5678" required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@ejemplo.com" required />
        </div>
        <div className="field-group">
          <label>Tipo de Servicio</label>
          <select name="serviceType" required>
            <option value="">Selecciona...</option>
            <option value="alarm-install">Instalación de Alarma</option>
            <option value="camera-install">Instalación de Cámaras</option>
            <option value="monitoring">Monitoreo 24/7</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
        <div className="field-group">
          <label>Cantidad de Puntos</label>
          <input type="number" name="points" placeholder="Ej. 4 cámaras / 2 sensores" required />
        </div>
        <div className="field-group">
          <label>Ubicación del Proyecto</label>
          <input type="text" name="location" placeholder="Dirección o descripción" required />
        </div>
        <div className="field-group full-width">
          <label>Detalles Adicionales</label>
          <textarea name="notes" rows="4" placeholder="Requerimientos extra..." />
        </div>
        <button type="submit">Enviar Solicitud</button>
      </form>
    ),
  },

  // Instalaciones eléctricas
  {
    title: "Instalaciones Eléctricas",
    description: (
      <>
        Soluciones eléctricas completas desde cableado básico<br />
        hasta instalaciones industriales certificadas.
      </>
    ),
    icon: electricidadIcon,
    backgroundImageUrl: "/src/assets/img/servicios/electricidadHero.png",
    form: (
      <form className="quote-form">
        <div className="field-group">
          <label>Nombre Completo</label>
          <input type="text" name="name" placeholder="Tu nombre" required />
        </div>
        <div className="field-group">
          <label>Teléfono de Contacto</label>
          <input type="tel" name="phone" placeholder="+54 9 11 1234‑5678" required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@ejemplo.com" required />
        </div>
        <div className="field-group">
          <label>Tipo de Instalación</label>
          <select name="installType" required>
            <option value="">Selecciona...</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
        <div className="field-group">
          <label>Superficie Aproximada</label>
          <input type="text" name="area" placeholder="Metros cuadrados" required />
        </div>
        <div className="field-group">
          <label>Voltaje / Requerimientos</label>
          <input type="text" name="voltage" placeholder="Ej. 220V monofásico" />
        </div>
        <div className="field-group full-width">
          <label>Detalles Adicionales</label>
          <textarea name="notes" rows="4" placeholder="Particularidades..." />
        </div>
        <button type="submit">Solicitar Presupuesto</button>
      </form>
    ),
  },

  // Trabajos en seco
  {
    title: "Trabajos en Seco",
    description: (
      <>
        Construcción y remodelación con placas de yeso,<br />
        cielorrasos y tabiquería de alta calidad.
      </>
    ),
    icon: secoIcon,
    backgroundImageUrl: "/src/assets/img/servicios/secoHero.png",
    form: (
      <form className="quote-form">
        <div className="field-group">
          <label>Nombre Completo</label>
          <input type="text" name="name" placeholder="Tu nombre" required />
        </div>
        <div className="field-group">
          <label>Teléfono de Contacto</label>
          <input type="tel" name="phone" placeholder="+54 9 11 1234‑5678" required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@ejemplo.com" required />
        </div>
        <div className="field-group">
          <label>Tipo de Trabajo</label>
          <select name="dryType" required>
            <option value="">Selecciona...</option>
            <option value="pladur-wall">Tabiques de Pladur</option>
            <option value="false-ceiling">Cielorrasos</option>
            <option value="remodel">Remodelación</option>
          </select>
        </div>
        <div className="field-group">
          <label>Metros Cuadrados</label>
          <input type="number" name="sqm" placeholder="Ej. 25" required />
        </div>
        <div className="field-group">
          <label>Altura de Techo</label>
          <input type="text" name="height" placeholder="Ej. 2.5 m" />
        </div>
        <div className="field-group full-width">
          <label>Detalles Adicionales</label>
          <textarea name="notes" rows="4" placeholder="Acabados, colores..." />
        </div>
        <button type="submit">Obtener Cotización</button>
      </form>
    ),
  },

  // Gasista
  {
    title: "Gasista Matriculado",
    description: (
      <>
        Instalaciones seguras de gas natural y envasado,<br />
        con certificación oficial y garantía.
      </>
    ),
    icon: gasistaIcon,
    backgroundImageUrl: "/src/assets/img/servicios/gasistaHero.png",
    form: (
      <form className="quote-form">
        <div className="field-group">
          <label>Nombre Completo</label>
          <input type="text" name="name" placeholder="Tu nombre" required />
        </div>
        <div className="field-group">
          <label>Teléfono de Contacto</label>
          <input type="tel" name="phone" placeholder="+54 9 11 1234‑5678" required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@ejemplo.com" required />
        </div>
        <div className="field-group">
          <label>Tipo de Instalación de Gas</label>
          <select name="gasType" required>
            <option value="">Selecciona...</option>
            <option value="natural">Gas Natural</option>
            <option value="envasado">Gas Envasado</option>
            <option value="calefon">Calefón</option>
          </select>
        </div>
        <div className="field-group">
          <label>Puntos de Consumo</label>
          <input type="number" name="points" placeholder="Ej. 2 hornallas" required />
        </div>
        <div className="field-group">
          <label>Ubicación / Acceso</label>
          <input type="text" name="location" placeholder="Descripción del lugar" />
        </div>
        <div className="field-group full-width">
          <label>Detalles Adicionales</label>
          <textarea name="notes" rows="4" placeholder="Permisos, urgencia..." />
        </div>
        <button type="submit">Pedir Presupuesto</button>
      </form>
    ),
  },

  // Distribución
  {
    title: "Distribución de Productos",
    description: (
      <>
        Suministro de materiales eléctricos, de seguridad<br />
        y construcción con entrega a domicilio.
      </>
    ),
    icon: distribucionIcon,
    backgroundImageUrl: "/src/assets/img/servicios/distribucionHero.png",
    form: (
      <form className="quote-form">
        <div className="field-group">
          <label>Nombre Completo</label>
          <input type="text" name="name" placeholder="Tu nombre" required />
        </div>
        <div className="field-group">
          <label>Teléfono de Contacto</label>
          <input type="tel" name="phone" placeholder="+54 9 11 1234‑5678" required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@ejemplo.com" required />
        </div>
        <div className="field-group">
          <label>Tipo de Producto</label>
          <select name="productType" required>
            <option value="">Selecciona...</option>
            <option value="electricos">Eléctricos</option>
            <option value="seguridad">Seguridad</option>
            <option value="construccion">Construcción</option>
          </select>
        </div>
        <div className="field-group">
          <label>Cantidad Estimada</label>
          <input type="text" name="quantity" placeholder="Ej. 50 unidades" required />
        </div>
        <div className="field-group">
          <label>Lugar de Entrega</label>
          <input type="text" name="address" placeholder="Dirección completa" required />
        </div>
        <div className="field-group full-width">
          <label>Detalles Adicionales</label>
          <textarea name="notes" rows="4" placeholder="Embalaje especial..." />
        </div>
        <button type="submit">Cotizar Productos</button>
      </form>
    ),
  },
];

// ===========================
// Componente de selección visual
// ===========================
const Services = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const servicesRef = useRef(null);

  // Manejo de clic sobre un servicio
  const handleClick = (idx) => {
    const newIndex = selectedIndex === idx ? null : idx;
    setSelectedIndex(newIndex);
    if (onSelect) onSelect(newIndex);
  };

  return (
    <section id="servicios" className="services-section-vertical" ref={servicesRef}>
      {serviceDetails.map((svc, idx) => (
        <div
          key={idx}
          className={
            `service-band-vertical ${idx % 2 === 0 ? "dark" : "darker"} ` +
            (selectedIndex === idx ? " selected" : "")
          }
          onClick={() => handleClick(idx)}
        >
          <div className="service-card">
            <div className="icon-wrapper">
              <img src={svc.icon} alt={svc.title} />
            </div>
            <h3>{svc.title}</h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Services;
