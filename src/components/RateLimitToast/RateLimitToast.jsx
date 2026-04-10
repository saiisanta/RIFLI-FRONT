import React, { useEffect, useRef, useState } from 'react';
import { FiClock, FiX } from 'react-icons/fi';
import './RateLimitToast.scss';

const RateLimitToast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!message) return;

    setVisible(false);

    rafRef.current = requestAnimationFrame(() => {
      setVisible(true);
    });

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => {
        onClose?.();
      }, 400);
    }, 8000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [message, onClose]);

  const handleClose = () => {
    setVisible(false);
    closeTimerRef.current = setTimeout(() => onClose?.(), 400);
  };

  if (!message) return null;

  return (
    <div className={`rlt-wrapper ${visible ? 'rlt-wrapper--visible' : ''}`}>
      <div className="rlt-toast">
        <div className="rlt-icon">
          <FiClock size={18} />
        </div>
        <div className="rlt-content">
          <span className="rlt-title">Demasiados intentos</span>
          <span className="rlt-message">{message}</span>
        </div>
        <button className="rlt-close" onClick={handleClose} aria-label="Cerrar">
          <FiX size={15} />
        </button>
        <div className="rlt-progress" />
      </div>
    </div>
  );
};

export default RateLimitToast;