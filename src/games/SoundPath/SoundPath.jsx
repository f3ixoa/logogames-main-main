import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../../utils/speechRecognition';
import { speakText } from '../../utils/speechSynthesis';
import { isSoundEnabled, setSoundEnabled as saveSoundEnabled, subscribeToSoundPreference } from '../../utils/audioPreference';
import './SoundPath.css';

const BUMP_PROGRESS = [0.29, 0.57, 0.82];
const MOVEMENT_PER_SECOND = 0.075;
const VOICE_THRESHOLD = 5.2;
const MIN_BUMP_MS = 80;
const MAX_BUMP_MS = 650;

const PATH_POINTS = [
  { x: 95, y: 470 }, { x: 180, y: 435 }, { x: 265, y: 380 },
  { x: 335, y: 335 }, { x: 420, y: 340 }, { x: 505, y: 385 },
  { x: 585, y: 395 }, { x: 660, y: 350 }, { x: 735, y: 290 },
  { x: 825, y: 280 }, { x: 905, y: 320 }
];

const CHARACTER_BY_SOUND = {
  'hard-r': '🐯',
  'soft-r': '🐯',
  'hard-l': '🐿️',
  'soft-l': '🐿️',
  'hard-s': '🐍',
  'soft-s': '🐍',
  'hard-z': '🐝',
  'soft-z': '🐝',
  'hard-sh': '🐍',
  'hard-zh': '🪲',
  'soft-shch': '🐍'
};

const getPointAtProgress = (progress) => {
  const lengths = PATH_POINTS.slice(1).map((point, index) => Math.hypot(point.x - PATH_POINTS[index].x, point.y - PATH_POINTS[index].y));
  let distance = lengths.reduce((sum, length) => sum + length, 0) * progress;
  for (let index = 0; index < lengths.length; index += 1) {
    if (distance <= lengths[index]) {
      const ratio = lengths[index] ? distance / lengths[index] : 0;
      return {
        x: PATH_POINTS[index].x + (PATH_POINTS[index + 1].x - PATH_POINTS[index].x) * ratio,
        y: PATH_POINTS[index].y + (PATH_POINTS[index + 1].y - PATH_POINTS[index].y) * ratio
      };
    }
    distance -= lengths[index];
  }
  return PATH_POINTS[PATH_POINTS.length - 1];
};

const SoundPath = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const character = CHARACTER_BY_SOUND[soundId] || '🐯';
  const mediaRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const stopRecognitionRef = useRef(null);
  const pointerActiveRef = useRef(false);
  const startingRef = useRef(false);
  const voiceActiveRef = useRef(false);
  const voiceMatchedRef = useRef(false);
  const progressRef = useRef(0);
  const lastFrameRef = useRef(0);
  const bumpIndexRef = useRef(0);
  const bumpVoiceStartRef = useRef(0);
  const bumpSpeechMatchRef = useRef(false);
  const bumpPulseRef = useRef(false);
  const completedRef = useRef(false);
  const bumpWarnedRef = useRef([]);
  const waitingForBumpRef = useRef(false);
  const bumpSpeechReadyRef = useRef(false);
  const ttsSpeakingRef = useRef(false);
  const bumpTimeoutRef = useRef(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMatched, setVoiceMatched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bumpsCleared, setBumpsCleared] = useState([]);
  const [feedback, setFeedback] = useState('Удерживай микрофон и тяни выбранный звук.');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const soundEnabledRef = useRef(true);
  const recognitionSupported = isSpeechRecognitionSupported();

  const stopAudio = useCallback(() => {
    pointerActiveRef.current = false;
    voiceActiveRef.current = false;
    voiceMatchedRef.current = false;
    bumpVoiceStartRef.current = 0;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    ttsSpeakingRef.current = false;
    window.speechSynthesis?.cancel();
    if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
    bumpTimeoutRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    stopRecognitionRef.current?.();
    stopRecognitionRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    mediaRef.current = null;
    startingRef.current = false;
    setIsListening(false);
    setVoiceMatched(false);
  }, []);

  useEffect(() => subscribeToSoundPreference((enabled) => {
    soundEnabledRef.current = enabled;
    setSoundEnabled(enabled);
    if (!enabled) {
      window.speechSynthesis?.cancel();
      if (waitingForBumpRef.current) finishBumpWarning(bumpIndexRef.current);
    }
  }), []);

  useEffect(() => () => stopAudio(), [stopAudio]);
  useEffect(() => {
    const stopOnHide = () => { if (document.visibilityState !== 'visible') stopAudio(); };
    document.addEventListener('visibilitychange', stopOnHide);
    return () => document.removeEventListener('visibilitychange', stopOnHide);
  }, [stopAudio]);

  useEffect(() => {
    if (!sound) navigate('/', { replace: true });
  }, [navigate, sound]);

  if (!sound) return null;

  const targetSound = sound?.sound.replace(/[`']/g, '') || '';
  const updateRecognition = ({ matched }) => {
    if (ttsSpeakingRef.current || !pointerActiveRef.current) return;
    voiceMatchedRef.current = matched;
    setVoiceMatched(matched);
    if (waitingForBumpRef.current) {
      if (bumpSpeechReadyRef.current && matched) {
        bumpSpeechMatchRef.current = true;
        if (bumpPulseRef.current) clearBump();
      }
    } else if (matched && bumpIndexRef.current >= BUMP_PROGRESS.length) {
      setError('');
      setFeedback(`Звук «${targetSound}» услышан — герой движется!`);
    } else if (!matched) {
      setFeedback(waitingForBumpRef.current ? `Скажи коротко: ${targetSound}-${targetSound}-${targetSound}!` : `Пауза — тяни звук «${targetSound}», чтобы герой шёл дальше.`);
    }
  };

  const finishBumpWarning = (index) => {
    if (bumpIndexRef.current !== index || !waitingForBumpRef.current) return;
    ttsSpeakingRef.current = false;
    if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
    bumpTimeoutRef.current = null;
    bumpSpeechReadyRef.current = true;
    bumpVoiceStartRef.current = 0;
    voiceActiveRef.current = false;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    setFeedback(`Теперь коротко произнеси: ${targetSound}-${targetSound}-${targetSound}!`);
  };

  const warnAtBump = (index) => {
    if (bumpWarnedRef.current.includes(index)) return;
    bumpWarnedRef.current = [...bumpWarnedRef.current, index];
    if (!soundEnabledRef.current) {
      waitingForBumpRef.current = true;
      finishBumpWarning(index);
      return;
    }
    waitingForBumpRef.current = true;
    bumpSpeechReadyRef.current = false;
    ttsSpeakingRef.current = true;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    voiceMatchedRef.current = false;
    setVoiceMatched(false);
    const message = `Ой, впереди кочка! Давай перепрыгнем! Произноси коротко: ${targetSound.split('').join('-')}!`;
    setFeedback(`Слушай подсказку. ${message}`);
    const didSpeak = speakText(message, {
      onEnd: () => finishBumpWarning(index),
      onError: () => finishBumpWarning(index)
    });
    if (!didSpeak) finishBumpWarning(index);
    else {
      bumpTimeoutRef.current = setTimeout(() => finishBumpWarning(index), 7000);
    }
  };

  function clearBump() {
    const index = bumpIndexRef.current;
    if (index >= BUMP_PROGRESS.length || !bumpSpeechMatchRef.current || !bumpPulseRef.current) return;
    bumpIndexRef.current += 1;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    bumpVoiceStartRef.current = 0;
    voiceActiveRef.current = false;
    lastFrameRef.current = 0;
    voiceMatchedRef.current = false;
    waitingForBumpRef.current = false;
    bumpSpeechReadyRef.current = false;
    setVoiceMatched(false);
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 420);
    setBumpsCleared((previous) => previous.includes(index) ? previous : [...previous, index]);
    setError('');
    setFeedback('Перепрыгнули! Снова тяни выбранный звук.');
  }

  const startMic = async () => {
    if (startingRef.current || pointerActiveRef.current || completedRef.current) return;
    startingRef.current = true;
    pointerActiveRef.current = true;
    voiceActiveRef.current = false;
    voiceMatchedRef.current = false;
    bumpVoiceStartRef.current = 0;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    lastFrameRef.current = 0;
    if (waitingForBumpRef.current && !bumpSpeechReadyRef.current) {
      bumpSpeechReadyRef.current = true;
    }
    setVoiceMatched(false);
    setError('');
    setFeedback(waitingForBumpRef.current
      ? `Теперь коротко произнеси: ${targetSound}-${targetSound}-${targetSound}!`
      : 'Слушаю… произнеси выбранный звук.');
    try {
      if (!recognitionSupported) throw new Error('Распознавание речи не поддерживается. Попробуй Chrome или Edge.');
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Микрофон доступен через HTTPS или localhost.');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!pointerActiveRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        startingRef.current = false;
        return;
      }
      mediaRef.current = stream;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Аудиоанализатор не поддерживается в этом браузере.');
      const context = new AudioContextClass();
      await context.resume();
      if (!pointerActiveRef.current) {
        await context.close();
        stream.getTracks().forEach((track) => track.stop());
        startingRef.current = false;
        return;
      }
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      audioContextRef.current = context;
      sourceRef.current = source;
      analyserRef.current = analyser;
      const samples = new Uint8Array(analyser.fftSize);
      const loop = (timestamp) => {
        if (!pointerActiveRef.current || !analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(samples);
        let power = 0;
        for (let i = 0; i < samples.length; i += 1) power += (samples[i] - 128) ** 2;
        const voiced = Math.sqrt(power / samples.length) > VOICE_THRESHOLD;
        const previousVoice = voiceActiveRef.current;
        voiceActiveRef.current = voiced;

        if (waitingForBumpRef.current) {
          if (bumpSpeechReadyRef.current && !ttsSpeakingRef.current) {
            if (voiced && !previousVoice) bumpVoiceStartRef.current = timestamp;
            if (!voiced && previousVoice && bumpVoiceStartRef.current) {
              const duration = timestamp - bumpVoiceStartRef.current;
              bumpPulseRef.current = duration >= MIN_BUMP_MS && duration <= MAX_BUMP_MS;
              bumpVoiceStartRef.current = 0;
              if (bumpPulseRef.current && bumpSpeechMatchRef.current) clearBump();
              else if (!bumpPulseRef.current) {
                bumpSpeechMatchRef.current = false;
                setFeedback(`Не получилось. Попробуй коротко произнести ${targetSound}!`);
              }
            }
          }
        } else if (voiced && voiceMatchedRef.current) {
          const delta = lastFrameRef.current ? Math.min((timestamp - lastFrameRef.current) / 1000, 0.05) : 0;
          const nextBump = BUMP_PROGRESS[bumpIndexRef.current];
          const nextProgress = Math.min(progressRef.current + MOVEMENT_PER_SECOND * delta, 1);
          if (nextBump !== undefined && nextProgress >= nextBump) {
            progressRef.current = nextBump;
            setProgress(nextBump);
            voiceActiveRef.current = false;
            bumpVoiceStartRef.current = 0;
            warnAtBump(bumpIndexRef.current);
          } else {
            progressRef.current = nextProgress;
            setProgress(nextProgress);
          }
          if (progressRef.current >= 1 && bumpIndexRef.current === BUMP_PROGRESS.length) {
            completedRef.current = true;
            setCompleted(true);
            setFeedback(`Ура! Герой дошёл до финиша со звуком «${targetSound}»!`);
            stopAudio();
            return;
          }
        }
        if (!voiced && !waitingForBumpRef.current && bumpIndexRef.current >= BUMP_PROGRESS.length) {
          setFeedback('Пауза — произнеси выбранный звук, чтобы герой продолжил.');
        }
        lastFrameRef.current = timestamp;
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
      stopRecognitionRef.current = startSpeechRecognition(targetSound, {
        onError: (message) => {
          setError(message);
          stopMic();
        }
      }, { stream, continuous: true, onRecognitionUpdate: updateRecognition });
      startingRef.current = false;
      setIsListening(true);
      setFeedback(waitingForBumpRef.current
        ? `Микрофон включён. Коротко произнеси: ${targetSound}-${targetSound}-${targetSound}!`
        : `Микрофон включён. Произнеси звук «${targetSound}».`);
    } catch (cause) {
      startingRef.current = false;
      pointerActiveRef.current = false;
      stopAudio();
      setError(cause.message || 'Не удалось включить микрофон. Проверь разрешение и попробуй снова.');
      setFeedback('Микрофон выключен.');
    }
  };

  const stopMic = () => {
    if (!pointerActiveRef.current && !startingRef.current) return;
    stopAudio();
    lastFrameRef.current = 0;
    if (!completedRef.current) setFeedback(waitingForBumpRef.current
      ? 'Кочка впереди. Нажми и удерживай микрофон, чтобы попробовать короткий звук ещё раз.'
      : progressRef.current > 0
        ? 'Пауза. Удерживай микрофон и продолжай произносить звук.'
        : 'Микрофон остановлен. Нажми и удерживай, чтобы начать.');
  };

  const handleMicPointerDown = (event) => {
    event.preventDefault();
    startMic();
  };

  const toggleSound = () => {
    const nextEnabled = !soundEnabledRef.current;
    soundEnabledRef.current = nextEnabled;
    setSoundEnabled(nextEnabled);
    saveSoundEnabled(nextEnabled);
    if (!nextEnabled) {
      window.speechSynthesis?.cancel();
      if (waitingForBumpRef.current) finishBumpWarning(bumpIndexRef.current);
    }
  };

  const confirmExit = () => {
    stopAudio();
    navigate(`/sound/${soundId}/category/sounds/games`, { replace: true });
  };

  useEffect(() => {
    const release = () => stopMic();
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, [completed]);

  const restart = () => {
    completedRef.current = false;
    stopAudio();
    progressRef.current = 0;
    lastFrameRef.current = 0;
    bumpIndexRef.current = 0;
    bumpWarnedRef.current = [];
    waitingForBumpRef.current = false;
    bumpSpeechReadyRef.current = false;
    ttsSpeakingRef.current = false;
    bumpVoiceStartRef.current = 0;
    bumpSpeechMatchRef.current = false;
    bumpPulseRef.current = false;
    setProgress(0);
    setBumpsCleared([]);
    setCompleted(false);
    setError('');
    setFeedback('Удерживай микрофон и тяни выбранный звук.');
  };

  const pathString = PATH_POINTS.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const progressPoint = getPointAtProgress(progress);

  return (
    <main className="sound-path">
      <header className="sound-path__header">
        <div className="sound-path__brand" aria-label="LogoToti">
          <span className="sound-path__brand-name">LogoToti</span>
        </div>
        <div className="sound-path__heading"><p className="sound-path__eyebrow">ПРИКЛЮЧЕНИЕ В ЛЕСУ</p><h1>Дорожка-бродилка</h1></div>
        <nav className="sound-path__header-actions" aria-label="Управление игрой">
          <button type="button" className="sound-path__icon-button" onClick={() => setExitConfirmOpen(true)} aria-label="Назад" title="Назад">←</button>
          <button type="button" className="sound-path__icon-button" onClick={() => setSettingsOpen(true)} aria-label="Настройки" title="Настройки">⚙️</button>
          <button type="button" className="sound-path__icon-button" onClick={toggleSound} aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'} aria-pressed={soundEnabled} title={soundEnabled ? 'Выключить озвучивание' : 'Включить озвучивание'}>{soundEnabled ? '🔊' : '🔇'}</button>
          <button type="button" className="sound-path__restart-top" onClick={restart} aria-label="Начать сначала">↻</button>
        </nav>
      </header>

      <section className="sound-path__intro" aria-live="polite">
        <span className="sound-path__sound" style={{ '--sound-color': sound.color }}>{sound.sound}</span>
        <p>{completed ? 'Путь пройден!' : <>Удерживай микрофон и тяни звук <strong>«{targetSound}»</strong> — герой пойдёт сам.</>}</p>
      </section>

      <section className="sound-path__scene" aria-label="Игровая дорожка">
        <div className="sound-path__decor sound-path__decor--sun" aria-hidden="true">☀️</div>
        <div className="sound-path__decor sound-path__decor--tree-left" aria-hidden="true">🌳</div>
        <div className="sound-path__decor sound-path__decor--tree-right" aria-hidden="true">🌴</div>
        <div className="sound-path__decor sound-path__decor--flower-one" aria-hidden="true">🌼</div>
        <div className="sound-path__decor sound-path__decor--flower-two" aria-hidden="true">🌺</div>
        <svg className="sound-path__svg" viewBox="0 0 1000 560" role="img" aria-label={`Прогресс пути: ${Math.round(progress * 100)} процентов`}>
          <defs>
            <pattern id="sound-path-checker" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#fff8df" />
              <path d="M0 0h6v6H0zm6 6h6v6H6z" fill="#49351f" />
            </pattern>
          </defs>
          <path d={pathString} className="sound-path__trail-shadow" />
          <path d={pathString} className="sound-path__trail" />
          <path d={pathString} className="sound-path__trail-center" />
          <path d={pathString} className="sound-path__trail-progress" pathLength="1" style={{ strokeDasharray: `${progress} 1` }} />
          {BUMP_PROGRESS.map((position, index) => {
            const marker = getPointAtProgress(position);
            return <g key={position} className={`sound-path__bump${bumpsCleared.includes(index) ? ' is-cleared' : ''}${bumpIndexRef.current === index ? ' is-active' : ''}`} transform={`translate(${marker.x} ${marker.y})`}><circle r="29" /><text y="10" textAnchor="middle">{bumpsCleared.includes(index) ? '✓' : '●'}</text></g>;
          })}
          <g className="sound-path__start" transform={`translate(${PATH_POINTS[0].x} ${PATH_POINTS[0].y})`}><circle r="48" /><text textAnchor="middle" y="15">🐾</text><text className="sound-path__caption" textAnchor="middle" y="69">СТАРТ</text></g>
          <g className="sound-path__finish" transform={`translate(${PATH_POINTS[PATH_POINTS.length - 1].x} ${PATH_POINTS[PATH_POINTS.length - 1].y})`} aria-label="Финиш"><circle r="48" /><path className="sound-path__finish-pole" d="M-4 27V-27" /><path className="sound-path__finish-checker" d="M-1-25h30v25H-1z" /><text className="sound-path__caption" textAnchor="middle" y="69">ФИНИШ</text></g>
          {!completed && <g className={`sound-path__player${isJumping ? ' is-jumping' : ''}`} transform={`translate(${progressPoint.x} ${progressPoint.y})`} role="img" aria-label={`Персонаж ${character}`}><text className="sound-path__player-emoji" textAnchor="middle" dominantBaseline="central" y="1">{character}</text></g>}
        </svg>
        <div className="sound-path__meter" aria-label={`Прогресс ${Math.round(progress * 100)} процентов`}><span style={{ width: `${progress * 100}%` }} /></div>
      </section>

      <section className="sound-path__controls">
        <div className={`sound-path__status${isListening ? ' is-listening' : ''}`} role="status">{feedback}</div>
        {error && <p className="sound-path__error" role="alert">{error}</p>}
        {!recognitionSupported && <p className="sound-path__notice">В этом браузере нет распознавания речи. Попробуй Chrome или Edge.</p>}
        {recognitionSupported && !window.isSecureContext && <p className="sound-path__notice">Микрофон работает через HTTPS или localhost.</p>}
        <button type="button" className={`sound-path__mic${isListening ? ' is-listening' : ''}${voiceMatched ? ' is-verified' : ''}`} onPointerDown={handleMicPointerDown} onPointerUp={stopMic} onPointerCancel={stopMic} onLostPointerCapture={stopMic} onContextMenu={(event) => event.preventDefault()} aria-label={isListening ? (voiceMatched ? 'Микрофон активен, целевой звук распознан' : 'Микрофон активен, произнеси выбранный звук') : 'Нажми и удерживай микрофон'} aria-pressed={isListening} disabled={completed}>
          <span aria-hidden="true">🎙️</span><span>{isListening ? (voiceMatched ? 'ЗВУК УСЛЫШАН' : 'ДЕРЖИ И ПРОИЗНОСИ') : 'НАЖМИ И ДЕРЖИ'}</span>
        </button>
        <p className="sound-path__microcopy">Герой движется только при совпадении распознанного звука. На кочках скажи его коротко!</p>
      </section>

      <p className="sound-path__notice sound-path__accuracy">Распознавание работает приблизительно: браузер может не услышать отдельный звук без слога.</p>

      {completed && <div className="sound-path__win" role="dialog" aria-modal="true" aria-labelledby="sound-path-win-title"><div className="sound-path__win-card"><span aria-hidden="true">🏆</span><h2 id="sound-path-win-title">Ура, получилось!</h2><p>Герой дошёл до финиша со звуком «{targetSound}».</p><button type="button" onClick={restart}>🔄 Пройти ещё раз</button><button type="button" className="sound-path__win-secondary" onClick={() => setExitConfirmOpen(true)}>← К играм</button></div></div>}

      {settingsOpen && <div className="sound-path__modal" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}><section className="sound-path__modal-card" role="dialog" aria-modal="true" aria-labelledby="sound-path-settings-title"><button className="sound-path__modal-close" type="button" onClick={() => setSettingsOpen(false)} aria-label="Закрыть настройки">×</button><h2 id="sound-path-settings-title">Настройки</h2><button type="button" className="sound-path__setting-toggle" onClick={toggleSound} aria-pressed={soundEnabled}><span>{soundEnabled ? '🔊 Озвучивание включено' : '🔇 Озвучивание выключено'}</span><span>{soundEnabled ? 'Вкл.' : 'Выкл.'}</span></button><p>Управляет голосовыми подсказками игры.</p></section></div>}

      {exitConfirmOpen && <div className="sound-path__modal" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setExitConfirmOpen(false); }}><section className="sound-path__modal-card" role="dialog" aria-modal="true" aria-labelledby="sound-path-exit-title"><button className="sound-path__modal-close" type="button" onClick={() => setExitConfirmOpen(false)} aria-label="Закрыть окно">×</button><h2 id="sound-path-exit-title">Ты действительно хочешь выйти?</h2><div className="sound-path__modal-actions"><button type="button" className="sound-path__stay-button" onClick={() => setExitConfirmOpen(false)}>Остаться</button><button type="button" className="sound-path__exit-button" onClick={confirmExit}>Выйти</button></div></section></div>}
    </main>
  );
};

export default SoundPath;
