import { SCREEN_HEIGHT } from '@/constants/styles';
import { useBackgroundColor } from '@/contexts/BackgroundColorContext';
import { useSpeech } from '@/hooks/useSpeech';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useUserActions } from '@/hooks/useUserActions';
import { useVocabulary } from '@/hooks/useVocabulary';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { ActionButtons } from '../components/vocabulary/ActionButtons';
import { ProgressIndicator } from '../components/vocabulary/ProgressIndicator';
import { SwipeHint } from '../components/vocabulary/SwipeHint';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';

export default function Index() {
  const { backgroundColor } = useBackgroundColor();
  const { current, index, isAnimating, nextWord, prevWord, progress, total } = useVocabulary();

  const { speakWord, speakMeaning, speakFull } = useSpeech();

  const {
    isFavorited,
    isBookmarked,
    heartScale,
    bookmarkScale,
    toggleFavorite,
    toggleBookmark,
    shareWord,
  } = useUserActions();

  // ✅ Prevent multiple fast swipes
  const isTransitioning = React.useRef(false);

  const handleNext = React.useCallback(() => {
    if (isTransitioning.current || isAnimating) return;

    isTransitioning.current = true;
    nextWord();

    requestAnimationFrame(() => {
      isTransitioning.current = false;
    });
  }, [nextWord, isAnimating]);

  const handlePrev = React.useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    prevWord();

    setTimeout(() => {
      isTransitioning.current = false;
    }, 350);
  }, [prevWord, isAnimating]);

  const { gesture, translateY } = useSwipeGesture({
    onSwipeUp: handleNext,
    onSwipeDown: handlePrev,
    isEnabled: !isAnimating && !!current
  });

  // ✅ Safe animation
  const animatedStyle = useAnimatedStyle(() => {
    const clampedY = Math.max(
      -SCREEN_HEIGHT / 3,
      Math.min(translateY.value, SCREEN_HEIGHT / 3)
    );

    const scale = interpolate(
      Math.abs(clampedY),
      [0, SCREEN_HEIGHT / 3],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(clampedY),
      [0, SCREEN_HEIGHT / 3],
      [1, 0.7],
      Extrapolate.CLAMP
    );

    const rotateX = interpolate(
      clampedY,
      [-SCREEN_HEIGHT / 3, 0, SCREEN_HEIGHT / 3],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: clampedY },
        { scale },
        { rotateX: `${rotateX}deg` },
      ],
      opacity,
    };
  });

  // ✅ Safe guard
  if (!current?.word || !current?.meaning) return null;

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={[styles.container, { backgroundColor: backgroundColor.color }]}>
          <StatusBar style="light" />

          <Animated.View style={animatedStyle}>
            <VocabularyCard
              item={current}
              selectedTheme={backgroundColor}
              onSpeakWord={() => speakWord(current.word)}
              onSpeakMeaning={() => speakMeaning(current.meaning)}
              onSpeakFull={() => speakFull(current.word, current.meaning)}
            />
          </Animated.View>

          <View style={styles.bottomControls}>
            <ActionButtons
              isFavorited={isFavorited}
              isBookmarked={isBookmarked}
              heartScale={heartScale}
              bookmarkScale={bookmarkScale}
              onLike={toggleFavorite}
              onBookmark={toggleBookmark}
              onShare={() => shareWord(current.word, current.meaning)}
            />

            <ProgressIndicator
              current={index}
              total={total}
              progress={progress}
            />
          </View>

          <SwipeHint />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
