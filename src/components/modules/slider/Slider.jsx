import React, { useEffect, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import "./Slider.scss";

const logos = [
  "/src/assets/img/marcas/Hikvision_logo.png",
  "/src/assets/img/marcas/Dahua_logo.png",
  "/src/assets/img/marcas/Garnet_logo.png",
  "/src/assets/img/marcas/Dsc_logo.png",
  "/src/assets/img/marcas/Imou_logo.png",
  "/src/assets/img/marcas/Tplink_logo.png",
  "/src/assets/img/marcas/Bosch_logo.png",
];

const Slider = () => {
  const trackRef = useRef(null);

  useEffect(() => {
    const moveSlider = () => {
      const track = trackRef.current;
      if (!track || !track.firstElementChild) return;

      const cardWidth = track.firstElementChild.getBoundingClientRect().width;

      track.style.transition = "transform 1s ease-in-out";
      track.style.transform = `translateX(-${cardWidth}px)`;

      const handleTransitionEnd = () => {
        track.style.transition = "none";
        track.appendChild(track.firstElementChild);
        track.style.transform = "translateX(0)";
        track.removeEventListener("transitionend", handleTransitionEnd);
      };

      track.addEventListener("transitionend", handleTransitionEnd);
    };

    const interval = setInterval(moveSlider, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider-section">
      <div id="marcas" className="section-top-divider"></div>
      <Container className="text-center">
        <h2 className="fw-bold mb-3">
          Las Marcas que eligen los Profesionales
        </h2>
        <p className="lead mb-5">
          Las marcas preferidas por técnicos y profesionales, por su calidad,
          durabilidad y confianza.
        </p>

        <div className="slider-wrapper">
          <div className="slider-track" ref={trackRef}>
            {logos.map((src, i) => (
              <div key={i} className="slider-logo">
                <img
                  src={src}
                  alt={`Logo ${i}`}
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline-dark" size="lg" className="mt-5">
          Conocé más...
        </Button>
      </Container>
      <div className="section-bottom-divider"></div>
    </section>
  );
};

export default Slider;