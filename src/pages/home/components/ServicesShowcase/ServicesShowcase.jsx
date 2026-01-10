import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lightning, Fire } from "react-bootstrap-icons";
import { AuthContext } from "../../../../context/AuthContext";
import "./ServicesShowcase.scss";

const ServicesShowcase = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const services = [
    {
      id: 1,
      title: "Seguridad",
      icon: Shield,
      image: "/src/assets/img/servicios/seguridadHero.png",
      description: "Sistemas de seguridad avanzados para tu hogar o negocio",
      features: ["Alarmas", "Cámaras", "Monitoreo 24/7"]
    },
    {
      id: 2,
      title: "Electricidad",
      icon: Lightning,
      image: "/src/assets/img/servicios/electricidadHero.png",
      description: "Instalaciones eléctricas profesionales y certificadas",
      features: ["Instalaciones", "Reparaciones", "Mantenimiento"]
    },
    {
      id: 3,
      title: "Gasista",
      icon: Fire,
      image: "/src/assets/img/servicios/gasistaHero.png",
      description: "Servicio de gas matriculado y confiable",
      features: ["Instalaciones", "Certificaciones", "Reparaciones"]
    }
  ];

  const handleViewMore = () => {
    if (user && user.email) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="servicios" className="services-showcase">
      <div className="showcase-header">
        <span className="section-label">Nuestros Servicios</span>
        <h2 className="section-title">
          Soluciones <span>Profesionales</span>
        </h2>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="service-card"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="service-image-wrapper">
              <img 
                src={service.image} 
                alt={service.title}
                className="service-image"
              />
              <div className="image-overlay"></div>
            </div>

            <div className="service-content">
              <div className="service-icon-wrapper">
                <service.icon className="service-icon" size={40} />
              </div>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>

              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-dot"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className="btn-service"
                onClick={handleViewMore}
              >
                Ver más
                <span className="btn-arrow">→</span>
              </button>
            </div>

            <div className="card-glow"></div>
          </div>
        ))}
      </div>

      <div className="showcase-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </section>
  );
};

export default ServicesShowcase;