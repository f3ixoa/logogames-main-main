const getRecognitionConstructor = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const isSpeechRecognitionSupported = () => Boolean(getRecognitionConstructor());

const normalizeSpeech = (value) => (value || '')
  .toLocaleLowerCase('ru-RU')
  .replace(/ё/g, 'е')
  .replace(/[^а-я\s]/gi, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const normalizeSyllable = (value) => normalizeSpeech(value).replace(/\s/g, '');

const matchesSyllable = (transcript, target) => {
  const cleanTarget = normalizeSyllable(target);
  const cleanTranscript = normalizeSpeech(transcript);
  if (!cleanTarget || !cleanTranscript) return false;

  return cleanTranscript.split(' ').some((word) => {
    const cleanWord = normalizeSyllable(word);
    return cleanWord === cleanTarget || cleanWord.includes(cleanTarget);
  });
};

const matchesExactWord = (transcript, target) => {
  const cleanTarget = normalizeSpeech(target);
  const cleanTranscript = normalizeSpeech(transcript);
  if (!cleanTarget || !cleanTranscript) return false;
  return cleanTranscript === cleanTarget;
};

export const startSpeechRecognition = (target, callbacks = {}, options = {}) => {
  const Recognition = getRecognitionConstructor();
  if (!Recognition) {
    callbacks.onError?.('Распознавание речи не поддерживается в этом браузере.');
    return () => {};
  }

  if (!options.stream && !navigator.mediaDevices?.getUserMedia) {
    callbacks.onError?.('Браузер не предоставляет доступ к микрофону. Открой страницу через HTTPS или localhost.');
    return () => {};
  }

  const recognition = new Recognition();
  let stopped = false;
  let finalResultHandled = false;
  let microphoneStream = options.stream || null;
  const ownsMicrophoneStream = !options.stream;
  recognition.lang = 'ru-RU';
  recognition.continuous = Boolean(options.continuous);
  recognition.interimResults = true;
  recognition.maxAlternatives = 5;

  recognition.onstart = () => callbacks.onListeningChange?.(true);
  recognition.onend = () => {
    if (ownsMicrophoneStream) microphoneStream?.getTracks().forEach((track) => track.stop());
    microphoneStream = null;
    callbacks.onListeningChange?.(false);
  };
  recognition.onerror = (event) => {
    const messages = {
      'not-allowed': 'Нет доступа к микрофону. Разреши его в настройках браузера.',
      'service-not-allowed': 'Браузер запретил распознавание речи.',
      'audio-capture': 'Микрофон не найден или недоступен.',
      'no-speech': 'Речь не услышана. Попробуй ещё раз.',
      network: 'Не удалось распознать речь. Проверь подключение к интернету.',
      aborted: 'Прослушивание остановлено.'
    };
    if (event.error !== 'aborted') callbacks.onError?.(messages[event.error] || 'Не удалось запустить микрофон.');
  };
  recognition.onresult = (event) => {
    let transcript = '';
    let isFinal = false;
    const alternatives = [];
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      transcript += `${transcript ? ' ' : ''}${result[0].transcript}`;
      isFinal = isFinal || result.isFinal;
      if (result.isFinal) {
        for (let alternative = 0; alternative < result.length; alternative += 1) {
          alternatives.push(result[alternative].transcript);
        }
      }
    }

    const resultPayload = { transcript: transcript.trim(), isFinal, matched: false, alternatives };
    if (transcript.trim()) {
      const cleanTarget = normalizeSyllable(target);
      resultPayload.matched = options.matchMode === 'exact-word'
        ? (isFinal ? alternatives : [transcript.trim()]).some((hypothesis) => matchesExactWord(hypothesis, target))
        : (isFinal ? [...alternatives, transcript.trim()] : [transcript.trim()]).some((hypothesis) => matchesSyllable(hypothesis, target))
          || (cleanTarget === 'лэ' && normalizeSyllable(transcript.trim()) === 'л');
      options.onRecognitionUpdate?.(resultPayload);
    }
    callbacks.onTranscript?.(transcript.trim());
    if (!isFinal || stopped || (finalResultHandled && !options.continuous)) return;
    finalResultHandled = true;

    const hypotheses = [...alternatives, transcript.trim()];
    const cleanTarget = normalizeSyllable(target);
    const matched = options.matchMode === 'exact-word'
      ? alternatives.some((hypothesis) => matchesExactWord(hypothesis, target))
      : hypotheses.some((hypothesis) => matchesSyllable(hypothesis, target))
        || (cleanTarget === 'лэ' && hypotheses.some((hypothesis) => normalizeSyllable(hypothesis) === 'л'));
    callbacks.onResult?.({ transcript: transcript.trim(), matched, alternatives });
  };

  const startRecognition = (stream) => {
    if (stopped) {
      if (ownsMicrophoneStream) stream?.getTracks().forEach((track) => track.stop());
      return;
    }
    microphoneStream = stream || null;
    try {
      recognition.start();
    } catch {
      callbacks.onListeningChange?.(false);
      callbacks.onError?.('Не удалось включить распознавание речи. Попробуй ещё раз.');
    }
  };

  if (options.stream) {
    startRecognition(options.stream);
  } else {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(startRecognition).catch((error) => {
        callbacks.onListeningChange?.(false);
        const message = error.name === 'NotAllowedError'
          ? 'Нет доступа к микрофону. Разреши его в настройках браузера.'
          : error.name === 'NotFoundError'
            ? 'Микрофон не найден или недоступен.'
            : 'Не удалось включить микрофон. Проверь разрешение браузера и попробуй ещё раз.';
        callbacks.onError?.(message);
      });
    } catch {
      callbacks.onListeningChange?.(false);
      callbacks.onError?.('Не удалось включить микрофон. Попробуй ещё раз.');
    }
  }

  return () => {
    stopped = true;
    if (ownsMicrophoneStream) microphoneStream?.getTracks().forEach((track) => track.stop());
    microphoneStream = null;
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    recognition.onstart = null;
    try {
      recognition.abort();
    } catch {
      // Recognition may already have stopped.
    }
  };
};
