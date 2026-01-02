// src/components/Hero.jsx

import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import './Hero.css';

// Componente principal de la sección Hero
const Hero = () => {

  // Efecto de luz que sigue el cursor sobre la sección Hero
  useEffect(() => {
    const hero = document.querySelector('.hero-section');

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
      hero.classList.add('light-spot');
    };

    hero?.addEventListener('mousemove', handleMouseMove);

    return () => {
      hero?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="hero-section">
      <Container className="text-white text-center text-md-start roboto">
        <div className="Brand-text">
          <h1 className="fw-bold display-5">
            Soluciones Eléctricas <br /> y de Seguridad a Medida
          </h1>
          <p className="lead mb-4">
            Instalaciones profesionales, confiables y modernas para tu hogar o empresa
          </p>

          <div className="d-flex flex-column flex-md-row gap-3">
            <Button
              className="presupuesto"
              href="#servicios"
              variant="warning"
              size="lg"
            >
              Solicitar presupuesto
            </Button>
            <Button
              className="shop"
              href="#shop"
              variant="outline-light"
              size="lg"
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
