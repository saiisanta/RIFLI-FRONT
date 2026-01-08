import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
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
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  const handleKnowMore = () => {
    if (user && user.email) {
      navigate("/shop");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="shop" className="slider-section">
      <div id="marcas" className="section-top-divider"></div>
      <Container className="text-center">
        <h1 className="section-title fw-bold mb-3">
          Las Marcas que eligen los Profesionales
        </h1>
        <h2 className="section-subtitle mb-5">
          Las marcas preferidas por técnicos y profesionales, por su calidad,
          durabilidad y confianza.
        </h2>

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

        <Button 
          variant="outline-dark" 
          size="lg" 
          className="mt-5"
          onClick={handleKnowMore}
        >
          Conocé más...
        </Button>
      </Container>
      <div className="section-bottom-divider"></div>
    </section>
  );
};

export default Slider;