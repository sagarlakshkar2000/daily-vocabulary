import { ANIMATION_CONFIG } from '@/constants/styles';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Share } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export const useUserActions = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const heartScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  const animateIcon = useCallback((scaleValue: Animated.SharedValue<number>) => {
    scaleValue.value = withSpring(
      ANIMATION_CONFIG.SCALE_FACTOR,
      {
        damping: ANIMATION_CONFIG.SPRING_DAMPING,
        stiffness: ANIMATION_CONFIG.SPRING_STIFFNESS,
      },
      () => {
        scaleValue.value = withSpring(1);
      }
    );
  }, []);

  const toggleFavorite = useCallback(() => {
    animateIcon(heartScale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFavorited(prev => !prev);
  }, [animateIcon]);

  const toggleBookmark = useCallback(() => {
    animateIcon(bookmarkScale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBookmarked(prev => !prev);
  }, [animateIcon]);

  const shareWord = useCallback(async (word: string, meaning: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `📚 Check out this word: "${word}" - ${meaning}\n\nLearn more with Daily Vocab!`,
        title: word,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, []);

  return {
    isFavorited,
    isBookmarked,
    heartScale,
    bookmarkScale,
    toggleFavorite,
    toggleBookmark,
    shareWord,
  };
};
