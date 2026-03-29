import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useServices from "../../hooks/useServices";
import ServicesNavbar from "./components/ServicesNavbar/ServicesNavbar";
import "./Services.scss";

const API_URL = import.meta.env.VITE_API_URL;

const Services = () => {
  const navigate = useNavigate();
  const { services, loading, error, fetchServices } = useServices();

  // Track which image is active per service { [serviceId]: index }
  const [activeImages, setActiveImages] = useState({});

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const setActiveImage = (serviceId, index) => {
    setActiveImages((prev) => ({ ...prev, [serviceId]: index }));
  };

  const getActiveIndex = (serviceId) => activeImages[serviceId] ?? 0;

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="services-page-wrapper">
        <ServicesNavbar onLogout={handleLogout} />
        <div className="services-container">
          <div className="services-page-header">
            <span className="services-page-label">Nuestros Servicios</span>
            <h1 className="services-page-title">
              Soluciones <span>Profesionales</span>
            </h1>
          </div>
          <div className="services-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="service-detail-card service-detail-card--skeleton">
                <div className="sdk-media skeleton-block" />
                <div className="sdk-body">
                  <div className="skeleton-block sk-icon" />
                  <div className="skeleton-block sk-title" />
                  <div className="skeleton-block sk-text" />
                  <div className="skeleton-block sk-text sk-short" />
                  <div className="skeleton-block sk-text sk-shorter" />
                  <div className="sk-chips">
                    {[1, 2, 3].map((c) => (
                      <div key={c} className="skeleton-block sk-chip" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="services-page-wrapper">
        <ServicesNavbar onLogout={handleLogout} />
        <div className="services-container">
          <div className="services-error-state">
            <h3>Error al cargar servicios</h3>
            <p>{error}</p>
            <button className="services-error-btn" onClick={() => fetchServices()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page-wrapper">
      <ServicesNavbar onLogout={handleLogout} />

      <div className="services-container">

        {/* ── Header ── */}
        <div className="services-page-header">
          <span className="services-page-label">Nuestros Servicios</span>
          <h1 className="services-page-title">
            Soluciones <span>Profesionales</span>
          </h1>
          <p className="services-page-subtitle">
            Seleccioná el servicio que necesitás y solicitá tu presupuesto sin cargo
          </p>
        </div>

        {/* ── Service cards ── */}
        <div className="services-list">
          {services.map((service, index) => {
            const images = Array.isArray(service.images) ? service.images : [];
            const features = Array.isArray(service.features) ? service.features : [];
            const activeIdx = getActiveIndex(service.id);
            const activeImage = images[activeIdx]
              ? `${API_URL}${images[activeIdx]}`
              : null;

            return (
              <article
                key={service.id}
                className="service-detail-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* ── Media column ── */}
                <div className="sdk-media">
                  {/* Main image */}
                  <div className="sdk-main-image-wrapper">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={service.type}
                        className="sdk-main-image"
                      />
                    ) : (
                      <div className="sdk-main-image sdk-main-image--placeholder" />
                    )}
                    <div className="sdk-image-overlay" />

                    {/* Index badge */}
                    {images.length > 1 && (
                      <span className="sdk-image-counter">
                        {activeIdx + 1} / {images.length}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="sdk-thumbnails">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          className={`sdk-thumb ${idx === activeIdx ? "active" : ""}`}
                          onClick={() => setActiveImage(service.id, idx)}
                          aria-label={`Ver imagen ${idx + 1}`}
                        >
                          <img
                            src={`${API_URL}${img}`}
                            alt={`Vista ${idx + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Content column ── */}
                <div className="sdk-body">
                  {/* Icon + title */}
                  <div className="sdk-header">
                    <div className="sdk-icon-wrapper">
                      {service.icon ? (
                        <img
                          src={`${API_URL}${service.icon}`}
                          alt={service.type}
                          className="sdk-icon"
                        />
                      ) : (
                        <span className="sdk-icon-fallback">⚡</span>
                      )}
                    </div>
                    <div>
                      <h2 className="sdk-title">{service.type}</h2>
                      {service.short_description && (
                        <p className="sdk-short-desc">{service.short_description}</p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="sdk-divider" />

                  {/* Long description */}
                  {service.long_description && (
                    <p className="sdk-long-desc">{service.long_description}</p>
                  )}

                  {/* Features */}
                  {features.length > 0 && (
                    <div className="sdk-features-section">
                      <span className="sdk-features-label">¿Qué incluye?</span>
                      <div className="sdk-features-grid">
                        {features.map((feat, idx) => (
                          <span key={idx} className="sdk-feature-chip">
                            <svg className="sdk-chip-check" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M3 8l3.5 3.5L13 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="sdk-cta">
                    <button
                      className="sdk-btn-primary"
                      onClick={() => navigate("/presupuestos")}
                    >
                      <span>Solicitar presupuesto</span>
                      <svg className="sdk-btn-arrow" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M4 10h12M10 4l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <span className="sdk-cta-hint">Sin cargo · Respuesta en 24hs</span>
                  </div>
                </div>

                {/* Glow */}
                <div className="sdk-glow" />
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Services;