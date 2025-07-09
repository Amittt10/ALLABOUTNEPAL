import { useRef, useState } from "react";

export const useNativeTTS = () => {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = (text, lang = "en-US") => {
    if (!window.speechSynthesis) return;
    stop(); // stop any ongoing speech to restart fresh
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const toggle = (text, lang = "en-US") => {
    if (!isSpeaking) {
      speak(text, lang);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return { speak, stop, pause, resume, toggle, isSpeaking, isPaused };
};
