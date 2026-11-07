export const isSpeechSynthesisSupported = () => (
  typeof window !== 'undefined'
  && 'speechSynthesis' in window
  && typeof window.SpeechSynthesisUtterance === 'function'
);

import { isSoundEnabled } from './audioPreference';

export const speakText = (text, callbacks = {}) => {
  if (!isSoundEnabled()) {
    callbacks.onEnd?.();
    return true;
  }

  if (!isSpeechSynthesisSupported()) {
    callbacks.onError?.();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.8;
  utterance.onend = () => callbacks.onEnd?.();
  utterance.onerror = () => callbacks.onError?.();
  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    callbacks.onError?.();
    return false;
  }
};
