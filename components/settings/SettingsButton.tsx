// components/settings/SettingsButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

interface SettingsButtonProps {
  onPress: () => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <IconButton
        icon="palette-swatch"
        iconColor="#fcf9f9ff"
        size={24}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: '10%',
    right: 16,
    zIndex: 1,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    margin: 0,
  },
});
