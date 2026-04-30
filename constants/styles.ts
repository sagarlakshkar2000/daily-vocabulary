import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SWIPE_CONFIG = {
  THRESHOLD: SCREEN_HEIGHT * 0.15,
  DURATION: 250,
  DAMPING: 15,
  STIFFNESS: 150,
};

export const ANIMATION_CONFIG = {
  SPRING_DAMPING: 3,
  SPRING_STIFFNESS: 200,
  SCALE_FACTOR: 1.3,
};

export const COLORS = {
  PRIMARY: '#4A90E2',
  FAVORITE: '#FF6B6B',
  BOOKMARK: '#FFD93D',
  TEXT_PRIMARY: '#1A1A2E',
  TEXT_SECONDARY: '#333',
  TEXT_MUTED: '#666',
  BORDER: '#E0E0E0',
  WHITE: '#FFFFFF',
};

export const TYPOGRAPHY = {
  WORD_SIZE: 42,
  MEANING_SIZE: 20,
  EXAMPLE_SIZE: 16,
  PHONETIC_SIZE: 16,
};
