import { SCREEN_HEIGHT } from '@/constants/styles';
import { useBackgroundColor } from '@/contexts/BackgroundColorContext';
import { useSpeech } from '@/hooks/useSpeech';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useUserActions } from '@/hooks/useUserActions';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ActionButtons } from '../components/vocabulary/ActionButtons';
import { ProgressIndicator } from '../components/vocabulary/ProgressIndicator';
import { SwipeHint } from '../components/vocabulary/SwipeHint';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';

export default function Index() {
  const { backgroundColor } = useBackgroundColor();
  const { current, index, isAnimating, nextWord, prevWord, progress, total } = useVocabulary();
  const { speakWord, speakMeaning, speakFull } = useSpeech();
  const { isFavorited, isBookmarked, heartScale, bookmarkScale, toggleFavorite, toggleBookmark, shareWord } = useUserActions();

  const isTransitioning = useRef(false);
  const [currentItem, setCurrentItem] = useState(current);
  const cardOpacity = useSharedValue(1);
  const navigation = useNavigation();


  // Update current item when vocabulary changes
  useEffect(() => {
    if (current) {
      // Small delay to allow exit animation to complete
      setTimeout(() => {
        setCurrentItem(current);
        cardOpacity.value = withTiming(1, { duration: 300 });
      }, 250);
    }
  }, [current]);

  const handleNext = () => {
    if (isTransitioning.current || isAnimating) return;
    isTransitioning.current = true;
    cardOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      nextWord();
      isTransitioning.current = false;
    }, 200);
  };

  const handlePrev = () => {
    if (isTransitioning.current || isAnimating) return;
    isTransitioning.current = true;
    cardOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      prevWord();
      isTransitioning.current = false;
    }, 200);
  };

  const { gesture, translateY } = useSwipeGesture({
    onSwipeUp: handleNext,
    onSwipeDown: handlePrev,
    isEnabled: !isAnimating && !!currentItem
  });

  const animatedStyle = useAnimatedStyle(() => {
    // Card follows finger with 3D effect
    const rotateX = interpolate(
      translateY.value,
      [-SCREEN_HEIGHT, 0, SCREEN_HEIGHT],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      Math.abs(translateY.value),
      [0, SCREEN_HEIGHT / 2],
      [1, 0.85],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateY.value),
      [0, SCREEN_HEIGHT / 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value },
        { scale },
        { rotateX: `${rotateX}deg` },
      ],
      opacity: opacity * cardOpacity.value,
    };
  });

  if (!currentItem?.word || !currentItem?.meaning) return null;

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={[styles.container, { backgroundColor: backgroundColor.color }]}>
          <StatusBar style="light" />

          <Animated.View style={animatedStyle}>
            <VocabularyCard
              key={currentItem.id}
              item={currentItem}
              selectedTheme={backgroundColor}
              onSpeakWord={() => speakWord(currentItem.word)}
              onSpeakMeaning={() => speakMeaning(currentItem.meaning)}
              onSpeakFull={() => speakFull(currentItem.word, currentItem.meaning)}
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
              onShare={() => shareWord(currentItem.word, currentItem.meaning)}
            />
            <ProgressIndicator current={index} total={total} progress={progress} />
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
