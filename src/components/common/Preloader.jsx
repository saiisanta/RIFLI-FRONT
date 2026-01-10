import React, { useState, useEffect } from 'react';
import './preloader.scss';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 600); 
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!loading) return null;

  return (
    <div className={`preloader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-container">
        <div className="preloader-spinner"></div>
      </div>
    </div>
  );
};

export default Preloader;