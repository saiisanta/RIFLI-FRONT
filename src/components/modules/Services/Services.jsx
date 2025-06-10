import React, { useState, useRef, useEffect } from "react";
import "./services.css";

// Íconos
import seguridadIcon from "/src/assets/img/icons/seguridad1.svg";
import electricidadIcon from "/src/assets/img/icons/electricidad1.svg";
import secoIcon from "/src/assets/img/icons/seco1.svg";
import gasistaIcon from "/src/assets/img/icons/gasista1.svg";
import distribucionIcon from "/src/assets/img/icons/distribucion1.svg";

const servicesData = [
  {
    icon: seguridadIcon,
    title: "Sistemas de Seguridad",
    image: "/src/assets/img/servicios/seguridadHero1.png",
    description: "Instalación y mantenimiento de alarmas, cámaras y sistemas de vigilancia 24/7 para máxima protección."
  },
  {
    icon: electricidadIcon,
    title: "Instalaciones Eléctricas",
    image: "/src/assets/img/servicios/electricidadHero1.png",
    description: "Soluciones eléctricas completas desde cableado básico hasta instalaciones industriales certificadas."
  },
  {
    icon: secoIcon,
    title: "Trabajos en Seco",
    image: "/src/assets/img/servicios/secoHero1.png",
    description: "Construcción y remodelación con placas de yeso, cielorrasos y tabiquería de alta calidad."
  },
  {
    icon: gasistaIcon,
    title: "Gasista Matriculado",
    image: "/src/assets/img/servicios/gasistaHero.png",
    description: "Instalaciones seguras de gas natural y envasado, con certificación oficial y garantía."
  },
  {
    icon: distribucionIcon,
    title: "Distribución",
    image: "/src/assets/img/servicios/distribucionHero1.png",
    description: "Suministro de materiales eléctricos, de seguridad y construcción con entrega a domicilio."
  }
];

const Services = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [allowOpenScroll, setAllowOpenScroll] = useState(true); // 👈 bandera de control

  const servicesRef = useRef(null);
  const expandedRef = useRef(null);

  useEffect(() => {
    if (selectedIndex !== null && expandedRef.current && allowOpenScroll) {
      requestAnimationFrame(() => {
        expandedRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [selectedIndex, allowOpenScroll]);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setSelectedIndex(null);
      setIsClosing(false);
      setAllowOpenScroll(true); // habilita scroll para la próxima vez
    }, 500);

    // ========= NUEVA LÓGICA: SOLO SCROLLEAR SI ESTAMOS MÁS ABAJO QUE servicesRef =========
    if (servicesRef.current) {
      // Obtenemos la distancia de servicesRef respecto al top del documento
      const serviciosTop = servicesRef.current.getBoundingClientRect().top + window.pageYOffset;
      // Obtenemos la posición actual del scroll (píxeles scrolleados desde arriba)
      const scrollActual = window.pageYOffset;

      // Si el scroll actual está POR DEBAJO de la sección de servicios, entonces sí scrollear
      if (scrollActual > serviciosTop) {
        servicesRef.current.scrollIntoView({ behavior: "smooth" });
      }
      // Si scrollActual <= serviciosTop, no hacemos nada: ya estamos arriba o justo en la posición
    }
  };

  const selectedService = selectedIndex !== null ? servicesData[selectedIndex] : null;

  return (
    <>
      {/* ─── 1. FILA DE SERVICIOS HORIZONTALES ─── */}
      <section className="services-section-vertical" ref={servicesRef}>
        {servicesData.map((service, index) => (
          <div
            key={index}
            className={
              `service-band-vertical ${index % 2 === 0 ? "dark" : "darker"} ` +
              `${selectedIndex === index ? "selected" : ""}`
            }
            onClick={() => {
              setSelectedIndex(index);
              setIsClosing(false);
              setAllowOpenScroll(false); // 👈 evita scroll al abrir
            }}
          >
            <div className="service-card">
              <div className="icon-wrapper">
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* ─── 2. ÁREA EXPANDIDA (DEBAJO) ─── */}
      {selectedService && (
        <div
          className={`service-expanded-area${isClosing ? " closing" : ""}`}
          ref={expandedRef}
        >
          <div className="expanded-text">
            <h2 className="fw-bold display-4 mb-3">{selectedService.title}</h2>
            <p className="lead mb-3">{selectedService.description}</p>
          </div>
          <div className="expanded-image-wrapper">
            <img
              // src={selectedService.image}
              // alt={selectedService.title}
              className="expanded-service-image"
            />
          </div>
          <div className="close-button-container">
            <button className="close-button" onClick={handleClose}>
              ▲ Cerrar
            </button>
          </div>
        </div>
      )}

      <section className="slider-section">
        <div className="section-top-divider"></div>
      </section>
    </>
  );
};

export default Services;
