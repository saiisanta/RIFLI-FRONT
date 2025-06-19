import React, { useEffect } from 'react';  // Importación de React y useEffect
import { Button, Container } from 'react-bootstrap';  // Importación de componentes de React Bootstrap
import './Hero.css';  // Importación de estilos CSS específicos para el Hero

// Componente Hero principal
const Hero = () => {

  // Hook useEffect para manejar el movimiento del mouse y aplicar la animación
  useEffect(() => {
    const hero = document.querySelector('.hero-section');  // Selecciona la sección hero

    // Función que maneja el movimiento del mouse
    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();  // Obtiene las dimensiones de la sección hero
      const x = e.clientX - rect.left;  // Calcula la posición X del mouse respecto a la sección
      const y = e.clientY - rect.top;   // Calcula la posición Y del mouse respecto a la sección

      // Actualiza las variables CSS para el gradiente en base a la posición del mouse
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
      
      // Agrega la clase que activa el efecto de luz
      hero.classList.add('light-spot');
    };

    // Añade el evento de movimiento del mouse a la sección hero
    hero?.addEventListener('mousemove', handleMouseMove);

    // Limpieza del evento al desmontar el componente
    return () => {
      hero?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="hero-section">  {/* Contenedor principal de la sección Hero */}
      <Container className="text-white text-center text-md-start roboto"> {/* Contenedor con clases de estilo */}
        <div className="Brand-text"> {/* Contenedor del texto de la marca */}
          <h1 className="fw-bold display-5"> {/* Título de la sección */}
            Soluciones Eléctricas <br /> y de Seguridad a Medida
          </h1>
          <p className="lead mb-4">  {/* Descripción corta */}
            Instalaciones profesionales, confiables y modernas para tu hogar o empresa
          </p>
          {/* Botones de acción */}
          <div className="d-flex flex-column flex-md-row gap-3">
            <Button className="presupuesto" href='#servicios' variant="warning" size="lg"> {/* Botón para solicitar presupuesto */}
              Solicitar presupuesto
            </Button>
            <Button className="shop" href='#shop' variant="outline-light" size="lg"> {/* Botón para ver servicios */}
              Ver Catálogo
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;  // Exporta el componente Hero
