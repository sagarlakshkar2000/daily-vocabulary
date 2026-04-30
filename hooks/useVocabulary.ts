// hooks/useVocabulary.ts
import { DAILY_VOCABS } from '@/local-data/data.json';
import { VocabItem } from '@/types/vocabulary.types';
import { useCallback, useRef, useState } from 'react';

export const useVocabulary = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimer = useRef<NodeJS.Timeout>();

  const current = (DAILY_VOCABS as VocabItem[])[index];

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return false;

    setIsAnimating(true);
    setIndex(prev => {
      if (direction === 'next') return (prev + 1) % DAILY_VOCABS.length;
      return prev === 0 ? DAILY_VOCABS.length - 1 : prev - 1;
    });

    if (animationTimer.current) clearTimeout(animationTimer.current);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    animationTimer.current = setTimeout(() => setIsAnimating(false), 300);

    return true;
  }, [isAnimating]);

  const nextWord = useCallback(() => navigate('next'), [navigate]);
  const prevWord = useCallback(() => navigate('prev'), [navigate]);

  const progress = ((index + 1) / DAILY_VOCABS.length) * 100;

  return {
    current,
    index,
    isAnimating,
    nextWord,
    prevWord,
    progress,
    total: DAILY_VOCABS.length,
  };
};
