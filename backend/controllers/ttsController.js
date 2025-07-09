import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './google-tts-key.json',
});

export const synthesizeSpeech = async (req, res) => {
  const { text, langCode } = req.body;
  try {
    const request = {
      input: { text },
      voice: { languageCode: langCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ message: 'TTS failed', error: err });
  }
};