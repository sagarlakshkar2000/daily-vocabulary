import Animated from "react-native-reanimated";

export interface VocabItem {
  word: string;
  meaning: string;
  example?: string;
  phonetic?: string;
}

export interface AnimationValues {
  translateY: Animated.SharedValue<number>;
  heartScale: Animated.SharedValue<number>;
  bookmarkScale: Animated.SharedValue<number>;
}
