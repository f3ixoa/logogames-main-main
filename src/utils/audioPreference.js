const STORAGE_KEY = 'logototi-sound-enabled';
const EVENT_NAME = 'logototi-sound-change';

export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Boolean(enabled)));
  } catch {
    // Continue with the in-memory preference when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: Boolean(enabled) }));
};

export const subscribeToSoundPreference = (listener) => {
  if (typeof window === 'undefined') return () => {};
  const onChange = (event) => listener(Boolean(event.detail));
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) listener(event.newValue !== 'false');
  };
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener('storage', onStorage);
  };
};
