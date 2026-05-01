import Animated from "react-native-reanimated";

export interface VocabItem {
  id?: string;
  word: string;
  meaning: string;
  example?: string;
  phonetic?: string;
  level?: string;
  createdAt: Date;
  userId?: string;
}

export interface AnimationValues {
  translateY: Animated.SharedValue<number>;
  heartScale: Animated.SharedValue<number>;
  bookmarkScale: Animated.SharedValue<number>;
}
