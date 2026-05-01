// // hooks/useVocabulary.ts
// import { DAILY_VOCABS } from '@/local-data/data.json';
// import { VocabItem } from '@/types/vocabulary.types';
// import { useCallback, useRef, useState } from 'react';

// export const useVocabulary = () => {
//   const [index, setIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const animationTimer = useRef<NodeJS.Timeout>();

//   const current = (DAILY_VOCABS as VocabItem[])[index];

//   const navigate = useCallback((direction: 'next' | 'prev') => {
//     if (isAnimating) return false;

//     setIsAnimating(true);
//     setIndex(prev => {
//       if (direction === 'next') return (prev + 1) % DAILY_VOCABS.length;
//       return prev === 0 ? DAILY_VOCABS.length - 1 : prev - 1;
//     });

//     if (animationTimer.current) clearTimeout(animationTimer.current);
//     // eslint-disable-next-line @typescript-eslint/no-misused-promises
//     animationTimer.current = setTimeout(() => setIsAnimating(false), 300);

//     return true;
//   }, [isAnimating]);

//   const nextWord = useCallback(() => navigate('next'), [navigate]);
//   const prevWord = useCallback(() => navigate('prev'), [navigate]);

//   const progress = ((index + 1) / DAILY_VOCABS.length) * 100;

//   return {
//     current,
//     index,
//     isAnimating,
//     nextWord,
//     prevWord,
//     progress,
//     total: DAILY_VOCABS.length,
//   };
// };



// hooks/useVocabulary.ts
import { db } from '@/src/config/firebase';
import { VocabItem } from '@/types/vocabulary.types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useVocabulary = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [vocabularyList, setVocabularyList] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationTimer = useRef<NodeJS.Timeout>();

  // Fetch vocabulary from Firebase
  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    setLoading(true);
    setError(null);
    try {
      const vocabRef = collection(db, 'vocabulary');
      const q = query(vocabRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const items: VocabItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);

        items.push({
          id: doc.id,
          word: data.word,
          meaning: data.meaning,
          example: data.example || '',
          phonetic: data.phonetic || '',
          level: data.level,
          createdAt: data.createdAt?.toDate() || new Date(),
          userId: data.userId,
        });
      });

      setVocabularyList(items);
    } catch (err) {
      console.error('Error fetching vocabulary:', err);
      setError('Failed to load vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const current = vocabularyList[index] || null;

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || vocabularyList.length === 0) return false;

    setIsAnimating(true);
    setIndex(prev => {
      if (direction === 'next') return (prev + 1) % vocabularyList.length;
      return prev === 0 ? vocabularyList.length - 1 : prev - 1;
    });

    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setIsAnimating(false), 300);

    return true;
  }, [isAnimating, vocabularyList.length]);

  const nextWord = useCallback(() => navigate('next'), [navigate]);
  const prevWord = useCallback(() => navigate('prev'), [navigate]);

  const progress = vocabularyList.length > 0
    ? ((index + 1) / vocabularyList.length) * 100
    : 0;

  // Refresh vocabulary list
  const refreshVocabulary = useCallback(() => {
    fetchVocabulary();
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
