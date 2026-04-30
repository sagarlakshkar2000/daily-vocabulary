// hooks/useSwipeGesture.ts
import { SCREEN_HEIGHT, SWIPE_CONFIG } from '@/constants/styles';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface UseSwipeGestureProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  isEnabled: boolean;
}

export const useSwipeGesture = ({ onSwipeUp, onSwipeDown, isEnabled }: UseSwipeGestureProps) => {
  const translateY = useSharedValue(0);

  const resetPosition = useCallback(() => {
    translateY.value = withSpring(0, {
      damping: SWIPE_CONFIG.DAMPING,
      stiffness: SWIPE_CONFIG.STIFFNESS,
    });
  }, [translateY]);

  const handleSwipe = useCallback((translationY: number) => {
    if (!isEnabled) return;

    if (translationY < -SWIPE_CONFIG.THRESHOLD) {
      translateY.value = withTiming(-SCREEN_HEIGHT, { duration: SWIPE_CONFIG.DURATION }, () => {
        runOnJS(onSwipeUp)();
        translateY.value = 0;
      });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    }
    else if (translationY > SWIPE_CONFIG.THRESHOLD) {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: SWIPE_CONFIG.DURATION }, () => {
        runOnJS(onSwipeDown)();
        translateY.value = 0;
      });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    }
    else {
      resetPosition();
    }
  }, [isEnabled, onSwipeUp, onSwipeDown, translateY, resetPosition]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isEnabled) return;
      translateY.value = event.translationY * 0.5;
    })
    .onEnd((event) => {
      handleSwipe(event.translationY);
    });

  return { gesture, translateY };
};
