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
  // Índice del servicio seleccionado (null si no hay ninguno)
  const [selectedIndex, setSelectedIndex] = useState(null);
  // Nueva bandera que indica si estamos reproduciendo la animación de cierre
  const [isClosing, setIsClosing] = useState(false);
  // Ref a la sección de servicios (fila superior)
  const servicesRef = useRef(null);
  // Ref a la sección expandida (aparece al hacer click)
  const expandedRef = useRef(null);

  // Efecto: cuando selectedIndex cambia a un servicio real, hacemos scroll hasta expandedRef
  useEffect(() => {
    if (selectedIndex !== null && expandedRef.current) {
      // Espera mínima para asegurar que el DOM haya renderizado expandedRef
      // (en la práctica suele bastar con un requestAnimationFrame)
      requestAnimationFrame(() => {
        expandedRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [selectedIndex]);

  const handleClose = () => {
    // 1) Primero ponemos la bandera de “closing” para que se ejecute la animación inversa
    setIsClosing(true);

    // 2) Tras 500ms (duración de fadeOutUp), ya quitamos realmente el componente
    setTimeout(() => {
      setSelectedIndex(null);
      setIsClosing(false);
    }, 500);

    // 3) Opcional: desplazarse hacia arriba mientras se reproduce la animación
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  // Obtenemos el objeto del servicio seleccionado (null si ninguno)
  const selectedService = selectedIndex !== null ? servicesData[selectedIndex] : null;

  return (
    <>
      {/* ─── 1. FILA DE SERVICIOS HORIZONTALES ─── */}
      {/* Añadimos ref={servicesRef} para poder hacer scroll aquí */}
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
              setIsClosing(false); // asegurarse de que no haya “closing” previo
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
        // Añadimos ref={expandedRef} para hacer scrollIntoView
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
              src={selectedService.image}
              alt={selectedService.title}
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
    </>
  );
};

export default Services;
