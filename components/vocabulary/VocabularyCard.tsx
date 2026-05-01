// components/vocabulary/VocabularyCard.tsx
import { VocabItem } from '@/types/vocabulary.types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import type { AnimatedStyle } from 'react-native-reanimated';


interface VocabularyCardProps {
  selectedTheme: { name: string, color: string, gradient: [string, string], text: string };
  item: VocabItem;
  animatedStyle: AnimatedStyle;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.85, 400);
const CARD_HEIGHT = Math.min(height * 0.65, 600);


export const VocabularyCard = React.memo<VocabularyCardProps>(({
  selectedTheme,
  item,
  animatedStyle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    Speech.stop();
    setIsPlaying(false);
  }, [item]);

  const playHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const speakFull = async () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      playHaptic();
      return;
    }

    if (!item?.word || !item?.meaning) return; // safety

    setIsPlaying(true);

    // Ripple animation
    rippleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    rippleOpacity.value = withTiming(0.3, { duration: 300 }, () => {
      rippleScale.value = 0;
      rippleOpacity.value = 0;
    });

    const textToSpeak = `${item.word}. ${item.meaning}`;
    playHaptic();

    await Speech.speak(textToSpeak, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => {
        setIsPlaying(true);
      },
      onDone: () => {
        setIsPlaying(false);
      },
      onError: () => {
        setIsPlaying(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      },
    });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle] as any}>
      <Card
        elevation={0}
        style={{
          ...styles.card,
          borderColor: selectedTheme.color,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <LinearGradient
          colors={[selectedTheme.color, '#F8F9FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Card.Content style={styles.content}>
            {/* Word Header */}
            <View style={styles.header}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>VOCABULARY</Text>
              </View>

              <Text style={styles.word}>{item.word}</Text>

              {item.phonetic && (
                <View style={styles.phoneticRow}>
                  <Ionicons name="mic" size={14} color="#8E8E93" />
                  <Text style={styles.phonetic}>{item.phonetic}</Text>
                </View>
              )}
            </View>

            {/* Pronunciation Button */}
            <View style={styles.audioSection}>
              <Pressable
                onPress={speakFull}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.audioButtonWrapper}
              >
                <Animated.View style={[styles.audioButton, buttonAnimatedStyle]}>
                  <LinearGradient
                    colors={isPlaying ? ['#E8E8ED', '#F2F2F7'] : ['#1A1A1A', '#2C2C2E']}
                    style={styles.audioGradient}
                  >
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={28}
                      color={isPlaying ? '#1A1A1A' : '#FFFFFF'}
                    />
                  </LinearGradient>
                </Animated.View>
                <Animated.View style={[styles.ripple, rippleAnimatedStyle]} />
              </Pressable>
              <Text style={styles.audioHint}>
                {isPlaying ? 'Tap to stop' : 'Tap to pronounce'}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Meaning Section */}
            <View style={styles.meaningSection}>
              <Text style={styles.meaningLabel}>Definition</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
            </View>

            {/* Example Section */}
            {item.example && (
              <View style={styles.exampleSection}>
                <View style={styles.exampleHeader}>
                  <Ionicons name="chatbubble" size={16} color="#C6C6C8" />
                  <Text style={styles.exampleLabel}>Example</Text>
                </View>
                <Text style={styles.exampleText}>{item.example}</Text>
              </View>
            )}
          </Card.Content>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
});

const styles = {
  wrapper: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    borderRadius: 32,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFFFFF',
  },
  gradient: {
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  content: {
    gap: 32,
  },
  header: {
    alignItems: 'center' as const,
    gap: 16,
  },
  badge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: '#8E8E93',
  },
  word: {
    fontSize: 44,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    color: '#000000',
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  phoneticRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  phonetic: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500' as const,
  },
  audioSection: {
    alignItems: 'center' as const,
    gap: 12,
  },
  audioButtonWrapper: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  audioButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  audioGradient: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  ripple: {
    position: 'absolute' as const,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1A1A1A',
    pointerEvents: 'none' as const,
  },
  audioHint: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 4,
  },
  meaningSection: {
    gap: 12,
  },
  meaningLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: '#8E8E93',
    textTransform: 'uppercase' as const,
  },
  meaning: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1C1C1E',
    fontWeight: '500' as const,
  },
  exampleSection: {
    gap: 12,
    paddingTop: 8,
  },
  exampleHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: '#8E8E93',
    textTransform: 'uppercase' as const,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3A3A3C',
    fontStyle: 'italic' as const,
    letterSpacing: 0.2,
  },
};
