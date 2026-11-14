export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
}

export const ELEVENLABS_DEFAULT_VOICES = [
  { voice_id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Calm & Clear)' },
  { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Dynamic & Engaging)' },
  { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Warm Academic)' },
  { voice_id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Thoughtful Expert)' },
  { voice_id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Friendly & Articulate)' },
  { voice_id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Resonant Narrator)' }
];

export async function generateSpeechElevenLabs(
  text: string,
  voiceId: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('ElevenLabs API key is missing');
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || `ElevenLabs API error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

// Web Speech API Native Synthesizer Fallback
export function speakWithWebSpeech(
  text: string, 
  speaker: 'Alex' | 'Taylor',
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Pick suitable voices based on speaker identity
  if (speaker === 'Alex') {
    utterance.pitch = 1.05;
    utterance.rate = 1.0;
    const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English')));
    if (femaleVoice) utterance.voice = femaleVoice;
  } else {
    utterance.pitch = 0.92;
    utterance.rate = 0.98;
    const maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Guy')));
    if (maleVoice) utterance.voice = maleVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopWebSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
