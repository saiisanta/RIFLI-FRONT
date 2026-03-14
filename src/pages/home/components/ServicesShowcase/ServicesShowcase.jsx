import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import useServices from "../../../../hooks/useServices";
import "./ServicesShowcase.scss";

const API_URL = "http://localhost:4001";

const ServicesShowcase = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { services, loading, fetchServices } = useServices();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleViewMore = () => {
    if (user && user.email) {
      navigate("/servicios");
    } else {
      navigate("/login");
    }
  };

  // Skeleton cards mientras carga
  if (loading) {
    return (
      <section id="servicios" className="services-showcase">
        <div className="showcase-header">
          <span className="section-label">Nuestros Servicios</span>
          <h2 className="section-title">
            Soluciones <span>Profesionales</span>
          </h2>
        </div>
        <div className="services-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="service-card service-card--skeleton">
              <div className="service-image-wrapper skeleton-image" />
              <div className="service-content">
                <div className="skeleton-icon" />
                <div className="skeleton-title" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
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
  }

  return (
    <section id="servicios" className="services-showcase">
      <div className="showcase-header">
        <span className="section-label">Nuestros Servicios</span>
        <h2 className="section-title">
          Soluciones <span>Profesionales</span>
        </h2>
      </div>

      <div className="services-grid">
        {services.map((service, index) => {
          const mainImage = Array.isArray(service.images) && service.images.length > 0
            ? `${API_URL}${service.images[0]}`
            : null;

          const features = Array.isArray(service.features) ? service.features : [];

          return (
            <div
              key={service.id}
              className="service-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="service-image-wrapper">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={service.type}
                    className="service-image"
                  />
                ) : (
                  <div className="service-image service-image--placeholder" />
                )}
                <div className="image-overlay"></div>
              </div>

              <div className="service-content">
                <div className="service-icon-wrapper">
                  {service.icon ? (
                    <img
                      src={`${API_URL}${service.icon}`}
                      alt={`${service.type} icon`}
                      className="service-icon service-icon--img"
                    />
                  ) : (
                    <span className="service-icon service-icon--fallback">
                      ⚡
                    </span>
                  )}
                </div>

                <h3 className="service-title">{service.type}</h3>
                <p className="service-description">
                  {service.short_description || ""}
                </p>

                {features.length > 0 && (
                  <div className="service-features">
                    {features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="service-feature-chip">
                        <svg className="chip-check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                <button className="btn-service" onClick={handleViewMore}>
                  <span>Ver servicio</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              <div className="card-glow"></div>
            </div>
          );
        })}
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