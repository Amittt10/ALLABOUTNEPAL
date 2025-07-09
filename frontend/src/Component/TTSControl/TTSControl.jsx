// src/Component/TTSControl/TTSControl.jsx
import React, { useEffect, useState } from "react";
import { useNativeTTS } from "../../hooks/useNativeTTS";
import { PauseCircle, PlayCircle } from "lucide-react"; // Better suited for play/pause
import "./TTSControl.css";

const TTSControl = ({ text, lang = "en-US" }) => {
  const { toggle, isSpeaking, isPaused } = useNativeTTS(); // Include isPaused
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!text) return null;

  return showButton ? (
    <button
      className="tts-floating-btn"
      onClick={() => toggle(text, lang)}
      title={
        isPaused ? "Resume Narration" :
        isSpeaking ? "Pause Narration" :
        "Play Narration"
      }
    >
      {isPaused || !isSpeaking ? (
        <PlayCircle size={24} />
      ) : (
        <PauseCircle size={24} />
      )}
    </button>
  ) : null;
};

export default TTSControl;
