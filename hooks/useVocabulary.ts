import { fetchFromFirebase, syncWords } from '@/src/config/sync.service';
import { getWords } from '@/src/config/vocabulary.service';
import { VocabItem } from '@/types/vocabulary.types';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useVocabulary = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [vocabularyList, setVocabularyList] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch vocabulary from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const localData = getWords(1, 0);

        if (localData.length > 0) {
          // ✅ Local data exists
          fetchLocalVocabulary();

          // optional background sync
          syncWords().then(fetchLocalVocabulary);

        } else {
          // ❌ No local data → fetch Firebase
          console.log('No local data → fetching from Firebase');

          const success = await fetchFromFirebase();

          if (success) {
            fetchLocalVocabulary();
          } else {
            setError('No data available (offline)');
          }
        }

      } catch (err) {
        console.log(err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (index >= vocabularyList.length) {
      setIndex(0);
    }
  }, [vocabularyList]);

  const fetchLocalVocabulary = () => {
    try {
      setLoading(true);

      const items = getWords(200, 0);
      setVocabularyList(items as VocabItem[]);

    } catch (err) {
      console.error('Local DB error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const current = vocabularyList.length > 0 ? vocabularyList[index] : null;

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || vocabularyList.length === 0) return false;

    setIsAnimating(true);

    setIndex(prev => {
      if (direction === 'next') return (prev + 1) % vocabularyList.length;
      return prev === 0 ? vocabularyList.length - 1 : prev - 1;
    });

    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    animationTimer.current = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return true;
  }, [isAnimating, vocabularyList.length]);

  const nextWord = useCallback(() => navigate('next'), [navigate]);
  const prevWord = useCallback(() => navigate('prev'), [navigate]);

  const progress = vocabularyList.length > 0
    ? ((index + 1) / vocabularyList.length) * 100
    : 0;

  // Refresh vocabulary list
  const refreshVocabulary = useCallback(() => {
    fetchLocalVocabulary();
  }, []);

  return {
    current,
    index,
    isAnimating,
    loading,
    error,
    nextWord,
    prevWord,
    progress,
    total: vocabularyList.length,
    refreshVocabulary,
  };
};
