// components/vocabulary/SwipeHint.tsx
import { COLORS } from '@/constants/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export const SwipeHint: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>↑ Swipe up for next ↓</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
});
