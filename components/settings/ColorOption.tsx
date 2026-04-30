// components/settings/ColorOption.tsx
import { COLOR_OPTION_SIZE, COLOR_OPTION_WIDTH } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ColorOptionProps {
  name: string;
  color: string;
  isSelected: boolean;
  onSelect: ({ name, color }: { name: string, color: string }) => void;
}

export const ColorOption: React.FC<ColorOptionProps> = ({
  name,
  color,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect({ name, color })}>
      <View
        style={[
          styles.colorCircle,
          { backgroundColor: color },
          isSelected && styles.selectedColorCircle,
        ]}
      />
      <Text style={styles.colorName}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: COLOR_OPTION_WIDTH,
    alignItems: 'center',
    marginBottom: 20,
  },
  colorCircle: {
    width: COLOR_OPTION_SIZE,
    height: COLOR_OPTION_SIZE,
    borderRadius: COLOR_OPTION_SIZE / 2,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  colorName: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
