import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

const DOT_MS = 150;
const DASH_MS = DOT_MS * 3;
const SYMBOL_GAP = DOT_MS;
const LETTER_GAP = DOT_MS * 3;
const WORD_GAP = DOT_MS * 7;

const generateBeepData = (): string => {
  const sampleRate = 8000;
  const frequency = 800;
  const numSamples = Math.floor(sampleRate * 0.04);
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);
  const write = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  write(36, 'data');
  view.setUint32(40, numSamples, true);
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    view.setUint8(44 + i, Math.floor((sample * 0.4 + 0.5) * 255));
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
};

const BEEP_DATA = generateBeepData();

export function useMorsePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const soundRef = useRef<Audio.Sound | null>(null);
  const stopRef = useRef(false);

  const playBeep = async (duration: number) => {
    if (stopRef.current) return;

    setIsActive(true);
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: BEEP_DATA },
          { shouldPlay: false }
        );
        soundRef.current = sound;
      }
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
      await new Promise(resolve => setTimeout(resolve, duration));
      await soundRef.current.pauseAsync();
    } catch (e) {
      console.warn("Audio play failed", e);
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    setIsActive(false);
  };

  const playSequence = useCallback(async (morse: string) => {
    stopRef.current = false;
    setIsPlaying(true);
    
    const symbols = morse.split('');
    for (let i = 0; i < symbols.length; i++) {
      if (stopRef.current) break;
      
      setCurrentIndex(i);
      const s = symbols[i];
      
      if (s === '.') {
        await playBeep(DOT_MS);
        await new Promise(resolve => setTimeout(resolve, SYMBOL_GAP));
      } else if (s === '-') {
        await playBeep(DASH_MS);
        await new Promise(resolve => setTimeout(resolve, SYMBOL_GAP));
      } else if (s === ' ') {
        await new Promise(resolve => setTimeout(resolve, LETTER_GAP));
      } else if (s === '/') {
        await new Promise(resolve => setTimeout(resolve, WORD_GAP));
      }
    }
    
    setIsPlaying(false);
    setCurrentIndex(-1);
  }, []);

  const stopSequence = useCallback(() => {
    stopRef.current = true;
    setIsPlaying(false);
    setIsActive(false);
    setCurrentIndex(-1);
    if (soundRef.current) {
      soundRef.current.pauseAsync();
    }
  }, []);

  return { isPlaying, isActive, currentIndex, playSequence, stopSequence };
}
