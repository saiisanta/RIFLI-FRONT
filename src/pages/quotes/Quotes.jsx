// src/components/Quotes.jsx
import React, { useState, useRef, useEffect } from "react";
import Services, { serviceDetails } from "../Services/Services.jsx";
import { QuotesDetail } from "./QuotesDetail.jsx";
import "./quotes.css";

export default function Quotes() {
  // Estados para gestionar el servicio seleccionado y la animación actual
  const [activeIdx, setActiveIdx]   = useState(null);
  const [prevIdx, setPrevIdx]       = useState(null);
  const [animType, setAnimType]     = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const detailRef = useRef(null);

  // Lógica para seleccionar un servicio o cerrar si se hace click sobre el mismo
  const handleSelect = (idx) => {
    if (activeIdx === idx) {
      if (animType === "vertical-close") return;
      setAnimType("vertical-close");
      setTimeout(() => {
        setShowDetail(false);
        setActiveIdx(null);
        setPrevIdx(null);
        setAnimType(null);
      }, 500); // debe coincidir con duración del slideUp
      return;
    }

    // Cambia a otro servicio (animación vertical o lateral)
    setPrevIdx(activeIdx);
    setActiveIdx(idx);
    setAnimType(activeIdx === null ? "vertical-open" : "lateral");
    setShowDetail(true);
  };

  // Forzar visualización del panel tras cambiar animación
  useEffect(() => {
    if (animType === "vertical-open" || animType === "lateral") {
      setShowDetail(true);
    }
  }, [animType]);

  // Auto scroll hacia el detalle si no entra en pantalla tras apertura vertical
  useEffect(() => {
    if (animType === "vertical-open") {
      const t = setTimeout(() => {
        const el = detailRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const isFullyVisible =
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

          if (!isFullyVisible) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "end"
            });
          }
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [animType]);

  return (
    <div className="quotes-section">
      <div className="section-top-divider" />

      <div className="quotes-services">
        <Services onSelect={handleSelect} selectedIndex={activeIdx} />
      </div>

      {/* Panel expandible para mostrar formulario del servicio */}
      {showDetail && activeIdx !== null && (
        <div
          ref={detailRef}
          className={`quotes-detail
            ${animType === "vertical-open"   ? "vertical-open"  : ""}
            ${animType === "vertical-close"  ? "vertical-close" : ""}
            ${animType === "lateral"         ? "lateral"        : ""}`}
        >
          <QuotesDetail
            detail     ={ serviceDetails[activeIdx] }
            prevDetail ={ serviceDetails[prevIdx] }
            animType   ={ animType }
          />
        </div>
      )}

      <div className="section-bottom-divider" />
    </div>
  );
}
