import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isSoundEnabled, setSoundEnabled, subscribeToSoundPreference } from '../../utils/audioPreference';
import logoImage from '../../assets/logo.webp';
import './Header.css';

const categoryNames = {
  articulation: 'Артикуляция', sounds: 'Звуки', syllables: 'Слоги',
  words: 'Слова', sentences: 'Предложения', texts: 'Тексты'
};

const Header = ({ isGame = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [soundEnabled, updateSoundEnabled] = useState(isSoundEnabled);
  const [exitOpen, setExitOpen] = useState(false);
  const sound = location.pathname.match(/^\/sound\/([^/]+)/)?.[1];
  const currentCategory = location.pathname.match(/\/category\/([^/]+)/)?.[1];
  const title = location.pathname === '/' ? 'Выбор звука'
    : location.pathname.includes('/categories') ? 'Выбор категории'
      : location.pathname.includes('/games') ? 'Выбор игры'
        : isGame ? 'Игра' : categoryNames[currentCategory] || 'Занятие';

  useEffect(() => subscribeToSoundPreference(updateSoundEnabled), []);

  const back = () => {
    if (isGame) {
      setExitOpen(true);
      return;
    }
    if (location.pathname === '/') return;
    navigate(-1);
  };

  const confirmExit = () => {
    const target = currentCategory === 'sounds' || location.pathname.includes('/sound-path')
      ? `/sound/${sound}/category/sounds/games`
      : `/sound/${sound}/category/syllables/games`;
    setExitOpen(false);
    navigate(target, { replace: true });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    updateSoundEnabled(next);
    setSoundEnabled(next);
    if (!next) window.speechSynthesis?.cancel();
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            {location.pathname !== '/' && <button className="header-btn header-back" onClick={back} aria-label="Назад" title="Назад">←</button>}
            <button type="button" className="header-logo" onClick={() => navigate('/')} aria-label="LogoToti — на главную">
              <img src={logoImage} alt="LogoToti" className="logo-image" />
              <span className="logo-text">LogoToti</span>
            </button>
            <span className="header-page-title">{title}</span>
          </div>
          <div className="header-right">
            {sound && <span className="header-sound-badge" aria-label={`Звук ${sound.toUpperCase()}`}>{sound.toUpperCase()}</span>}
            <button className="header-btn" onClick={toggleSound} aria-label={soundEnabled ? 'Выключить звук озвучивания' : 'Включить звук озвучивания'} aria-pressed={soundEnabled} title="Звук озвучивания">
              <span className="btn-icon" aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
            </button>
          </div>
        </div>
      </header>
      {exitOpen && <div className="header-exit-overlay" onPointerDown={(event) => { if (event.target === event.currentTarget) setExitOpen(false); }}>
        <section className="header-exit-dialog" role="dialog" aria-modal="true" aria-labelledby="header-exit-title">
          <h2 id="header-exit-title">Ты действительно хочешь выйти?</h2>
          <p>Текущий прогресс останется, если ты продолжишь игру.</p>
          <div className="header-exit-actions">
            <button type="button" onClick={() => setExitOpen(false)}>Остаться</button>
            <button type="button" onClick={confirmExit}>Выйти</button>
          </div>
        </section>
      </div>}
    </>
  );
};

export default Header;
