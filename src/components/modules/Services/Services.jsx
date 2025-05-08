import React from "react";
import "./services.css";

// Íconos
import seguridadIcon from "/src/assets/img/icons/seguridad.svg";
import electricidadIcon from "/src/assets/img/icons/electricidad.svg";
import secoIcon from "/src/assets/img/icons/seco.svg";
import gasistaIcon from "/src/assets/img/icons/gasista.svg";
import distribucionIcon from "/src/assets/img/icons/distribucion.svg";

const servicesData = [
  { icon: seguridadIcon, title: "Sistemas de Seguridad" },
  { icon: electricidadIcon, title: "Instalaciones Eléctricas" },
  { icon: secoIcon, title: "Trabajos en Seco" },
  { icon: gasistaIcon, title: "Gasista Matriculado" },
  { icon: distribucionIcon, title: "Distribución de Productos" },
];

const Services = () => {
  return (
    <section className="services-section-vertical">
      {servicesData.map((service, index) => (
        <div
          key={index}
          className={`service-band-vertical ${index % 2 === 0 ? "dark" : "darker"}`}
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
  );
};

export default Services;
