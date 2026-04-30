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

const { width } = Dimensions.get('window');

interface VocabularyCardProps {
  selectedThemeColor: { name: string, color: string, gradient: [string, string], text: string };
  item: VocabItem;
  animatedStyle: any;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  selectedThemeColor,
  item,
  animatedStyle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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

    // Ripple animation
    rippleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    rippleOpacity.value = withTiming(0.3, { duration: 300 });
    setTimeout(() => {
      rippleScale.value = 0;
      rippleOpacity.value = 0;
    }, 400);

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
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Card style={{ ...styles.card, borderColor: selectedThemeColor.color }} elevation={0}>
        <LinearGradient
          colors={[selectedThemeColor.color, '#F8F9FA']}
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
                  <Ionicons name="quote" size={16} color="#C6C6C8" />
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
};

const styles = {
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
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
    fontWeight: '600',
    letterSpacing: 1,
    color: '#8E8E93',
  },
  word: {
    fontSize: 44,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  phonetic: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  audioSection: {
    alignItems: 'center',
    gap: 12,
  },
  audioButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  audioGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1A1A1A',
  },
  audioHint: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
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
    fontWeight: '600',
    letterSpacing: 1,
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  meaning: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  exampleSection: {
    gap: 12,
    paddingTop: 8,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3A3A3C',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
};
