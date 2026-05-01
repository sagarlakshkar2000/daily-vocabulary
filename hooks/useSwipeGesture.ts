import { SCREEN_HEIGHT, SWIPE_CONFIG } from '@/constants/styles';
import * as Haptics from 'expo-haptics';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface UseSwipeGestureProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  isEnabled: boolean;
}

export const useSwipeGesture = ({
  onSwipeUp,
  onSwipeDown,
  isEnabled,
}: UseSwipeGestureProps) => {
  const translateY = useSharedValue<number>(0);
  const isAnimating = useSharedValue<boolean>(false);

  const gesture = Gesture.Pan()
    .enabled(isEnabled)
    .onUpdate((event) => {
      if (isAnimating.value) return;
      // Follow finger with slight resistance
      translateY.value = event.translationY * 0.3;
    })
    .onEnd((event) => {
      if (isAnimating.value) return;

      const { translationY, velocityY } = event;

      const shouldSwipeUp =
        translationY < -SWIPE_CONFIG.THRESHOLD || velocityY < -400;

      const shouldSwipeDown =
        translationY > SWIPE_CONFIG.THRESHOLD || velocityY > 400;

      if (shouldSwipeUp) {
        isAnimating.value = true;

        // Animate card completely out UP
        translateY.value = withTiming(-SCREEN_HEIGHT, {
          duration: 30,
        }, () => {
          runOnJS(onSwipeUp)();
          // Reset position for next card
          translateY.value = withSpring(0, { damping: 30, stiffness: 80 });
          isAnimating.value = false;
        });

        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

      } else if (shouldSwipeDown) {
        isAnimating.value = true;

        // Animate card completely out DOWN
        translateY.value = withTiming(SCREEN_HEIGHT, {
          duration: 30,
        }, () => {
          runOnJS(onSwipeDown)();
          // Reset position for next card
          translateY.value = withSpring(0, { damping: 30, stiffness: 80 });
          isAnimating.value = false;
        });

        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

      } else {
        // Return to center softly
        translateY.value = withSpring(0, {
          damping: 10,
          stiffness: 100,
        });
      }
    });

  return { gesture, translateY };
};
