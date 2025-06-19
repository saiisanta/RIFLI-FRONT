import React, { useEffect, useRef } from "react";

export function QuotesDetail({ detail, prevDetail, animType }) {
  const blockRef = useRef(null);
  const formRef  = useRef(null);

  useEffect(() => {
    if (animType === "lateral") {
      blockRef.current.classList.remove("animate-bg");
      void blockRef.current.offsetWidth;
      blockRef.current.classList.add("animate-bg");
    }
    formRef.current.classList.remove("animate-form");
    void formRef.current.offsetWidth;
    formRef.current.classList.add("animate-form");
  }, [detail, animType]);

  return (
    <div className="detail-block-wrapper">
      <div className="quotes-divider-fixed" />

      {animType === "lateral" && prevDetail && (
        <div
          className="background-layer previous"
          style={{ backgroundImage: `url(${prevDetail.backgroundImageUrl})` }}
        />
      )}

      <div
        ref={blockRef}
        className={`background-layer current ${
          animType === "lateral" ? "animate-bg" : ""
        }`}
        style={{ backgroundImage: `url(${detail.backgroundImageUrl})` }}
      >
        <div ref={formRef} className="form-container">
          {detail.form}
        </div>
      </div>
    </div>
  );
}
