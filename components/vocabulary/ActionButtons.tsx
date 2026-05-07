// components/vocabulary/ActionButtons.tsx
import { COLORS } from '@/constants/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface ActionButtonsProps {
  isFavorited: boolean;
  isBookmarked: boolean;
  heartScale: SharedValue<number>;
  bookmarkScale: SharedValue<number>;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFavorited,
  isBookmarked,
  heartScale,
  bookmarkScale,
  onLike,
  onBookmark,
  onShare,
}) => {
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* <Animated.View style={heartAnimatedStyle}>
        <IconButton
          icon={isFavorited ? 'heart' : 'heart-outline'}
          iconColor={isFavorited ? COLORS.FAVORITE : COLORS.WHITE}
          size={28}
          onPress={onLike}
          style={styles.button}
        />
      </Animated.View> */}

      {/* <Animated.View style={bookmarkAnimatedStyle}>
        <IconButton
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          iconColor={isBookmarked ? COLORS.BOOKMARK : COLORS.WHITE}
          size={28}
          onPress={onBookmark}
          style={styles.button}
        />
      </Animated.View> */}

      <IconButton
        icon="share-variant"
        iconColor={COLORS.WHITE}
        size={28}
        onPress={onShare}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 40,
  },
  button: {
    margin: 0,
    backgroundColor: 'transparent',
  },
});
