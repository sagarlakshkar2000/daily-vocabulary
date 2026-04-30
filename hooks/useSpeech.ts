import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { useCallback } from 'react';

interface SpeechConfig {
  language?: string;
  pitch?: number;
  rate?: number;
}

const DEFAULT_CONFIG: SpeechConfig = {
  language: 'en-US',
  pitch: 1.0,
  rate: 0.9,
};

export const useSpeech = () => {
  const speak = useCallback((text: string, config: SpeechConfig = {}) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.speak(text, { ...DEFAULT_CONFIG, ...config });
  }, []);

  const speakWord = useCallback((word: string) => {
    speak(word, { rate: 0.9 });
  }, [speak]);

  const speakMeaning = useCallback((meaning: string) => {
    speak(meaning, { rate: 0.8 });
  }, [speak]);

  const speakFull = useCallback((word: string, meaning: string) => {
    speak(`${word}. ${meaning}`, { rate: 0.9 });
  }, [speak]);

  return { speakWord, speakMeaning, speakFull };
};
