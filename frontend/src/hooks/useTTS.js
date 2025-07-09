import axios from "axios";

export const useTTS = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Play text as speech audio
  const speak = async (text, lang = "en-US") => {
    if (!text) return;
    try {
      const response = await axios.post(
        `${API_URL}/api/tts/speak`,
        { text, langCode: lang },
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = window.URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();

      audio.onended = () => {
        window.URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  // Get audio URL (blob URL) for download or other uses
  const getAudioUrl = async (text, lang = "en-US") => {
    if (!text) return null;
    try {
      const response = await axios.post(
        `${API_URL}/api/tts/speak`,
        { text, langCode: lang },
        { responseType: "arraybuffer" }
      );
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      return window.URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      return null;
    }
  };

  return { speak, getAudioUrl };
};
