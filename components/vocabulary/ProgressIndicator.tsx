// components/vocabulary/ProgressIndicator.tsx
import { COLORS } from '@/constants/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  progress: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  progress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.text}>
        {current + 1} / {total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  barBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 2,
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});
