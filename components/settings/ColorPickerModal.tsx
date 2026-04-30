// components/settings/ColorPickerModal.tsx
import { BG_COLORS } from '@/constants/colors';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { ColorOption } from './ColorOption';

interface ColorPickerModalProps {
  visible: boolean;
  selectedColor: string;
  onClose: () => void;
  onSelectColor: (item: { name: string, color: string }) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  selectedColor,
  onClose,
  onSelectColor,
}) => {
  const handleSelect = (item: { name: string, color: string }) => {
    onSelectColor(item);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Background Color</Text>
            <TouchableOpacity onPress={onClose}>
              <IconButton icon="close" size={24} iconColor="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {BG_COLORS.map((item, index) => (
              <ColorOption
                key={index}
                name={item.name}
                color={item.color}
                isSelected={selectedColor === item.color}
                onSelect={() => handleSelect(item)}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
});
