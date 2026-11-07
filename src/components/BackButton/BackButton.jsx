import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ onClick, label = 'Назад' }) => {
  const location = useLocation();
  const isGameRoute = /\/game\/[^/]+\/?$/.test(location.pathname);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleClick = () => {
    if (isGameRoute) setConfirmOpen(true);
    else onClick?.();
  };
  const confirmExit = () => {
    setConfirmOpen(false);
    onClick?.();
  };

  return (
    <>
    <button
      className="back-button"
      onClick={handleClick}
      aria-label={label}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>{label}</span>
    </button>
    {confirmOpen && <div className="header-exit-overlay" onPointerDown={(event) => { if (event.target === event.currentTarget) setConfirmOpen(false); }}>
      <section className="header-exit-dialog" role="dialog" aria-modal="true" aria-labelledby="back-exit-title">
        <h2 id="back-exit-title">Ты действительно хочешь выйти?</h2>
        <p>Текущий прогресс останется, если ты продолжишь игру.</p>
        <div className="header-exit-actions">
          <button type="button" onClick={() => setConfirmOpen(false)}>Остаться</button>
          <button type="button" onClick={confirmExit}>Выйти</button>
        </div>
      </section>
    </div>}
    </>
  );
};

export default BackButton;
