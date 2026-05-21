import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

const DOT_MS = 150;
const DASH_MS = DOT_MS * 3;
const SYMBOL_GAP = DOT_MS;
const LETTER_GAP = DOT_MS * 3;
const WORD_GAP = DOT_MS * 7;

const BEEP_URL = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';

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
        const { sound } = await Audio.Sound.createAsync({ uri: BEEP_URL });
        soundRef.current = sound;
      }
      await soundRef.current.replayAsync();
      await new Promise(resolve => setTimeout(resolve, duration));
      await soundRef.current.stopAsync();
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
      soundRef.current.stopAsync();
    }
  }, []);

  return { isPlaying, isActive, currentIndex, playSequence, stopSequence };
}
