// src/components/QuotesDetail.jsx
import React, { useEffect, useRef } from "react";

// Componente que muestra el detalle y formulario con fondo animado
export function QuotesDetail({ detail, prevDetail, animType }) {
  const blockRef = useRef(null);
  const formRef  = useRef(null);

  useEffect(() => {
    // Aplica animación al cambiar de servicio (cambio lateral)
    if (animType === "lateral") {
      blockRef.current.classList.remove("animate-bg");
      void blockRef.current.offsetWidth; // forzar reflow
      blockRef.current.classList.add("animate-bg");
    }

    // Siempre reinicia la animación del formulario
    formRef.current.classList.remove("animate-form");
    void formRef.current.offsetWidth;
    formRef.current.classList.add("animate-form");
  }, [detail, animType]);

  return (
    <div className="detail-block-wrapper">
      <div className="quotes-divider-fixed" />

      {/* Fondo del servicio anterior (solo para animación lateral) */}
      {animType === "lateral" && prevDetail && (
        <div
          className="background-layer previous"
          style={{ backgroundImage: `url(${prevDetail.backgroundImageUrl})` }}
        />
      )}

      {/* Fondo actual con animación */}
      <div
        ref={blockRef}
        className={`background-layer current ${animType === "lateral" ? "animate-bg" : ""}`}
        style={{ backgroundImage: `url(${detail.backgroundImageUrl})` }}
      >
        {/* Contenedor del formulario del servicio */}
        <div ref={formRef} className="form-container">
          {detail.form}
        </div>
      </div>
    </div>
  );
}
