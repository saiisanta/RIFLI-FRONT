import React, { useState, useRef, useEffect } from "react";
import Services, { serviceDetails } from "../Services/Services.jsx";
import { QuotesDetail } from "./QuotesDetail";
import "./quotes.css";

export default function Quotes() {
  const [activeIdx, setActiveIdx]   = useState(null);
  const [prevIdx, setPrevIdx]       = useState(null);
  const [animType, setAnimType]     = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const detailRef = useRef(null);

  const handleSelect = (idx) => {
    if (activeIdx === idx) {
        // Si ya se está cerrando, no hacer nada
        if (animType === "vertical-close") return;
      
        // Inicia cierre
        setAnimType("vertical-close");
      
        // Espera que termine la animación y recién desmonta
        setTimeout(() => {
          setShowDetail(false);
          setActiveIdx(null);
          setPrevIdx(null);
          setAnimType(null);
        }, 500); // Tiempo igual a duración de slideUp
        return;
      }
      
    // abres: si no había detalle, persiana, si ya había alguno, lateral
    setPrevIdx(activeIdx);
    setActiveIdx(idx);
    setAnimType(activeIdx === null ? "vertical-open" : "lateral");
    setShowDetail(true);
  };

  // tras cualquier apertura (vertical o lateral) aseguro que el panel esté visible
  useEffect(() => {
    if (animType === "vertical-open" || animType === "lateral") {
      setShowDetail(true);
    }
  }, [animType]);


  // scroll suave tras bajar persiana
  useEffect(() => {
    if (animType === "vertical-open") {
      const t = setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth" });
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
