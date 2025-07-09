import React, { useState } from 'react';
import { useTTS } from '../hooks/useTTS';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en-US');
  const { speak, getAudioUrl } = useTTS();

  const handleDownload = async () => {
    const url = await getAudioUrl(text, lang);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tts-audio.mp3';
      a.click();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <textarea
        rows={4}
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%' }}
      />
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en-US">English</option>
        <option value="ne-NP">Nepali</option>
      </select>
      <br /><br />
      <button onClick={() => speak(text, lang)}>🔊 Speak</button>
      <button onClick={handleDownload}>⬇️ Download</button>
    </div>
  );
};

export default TextToSpeech;