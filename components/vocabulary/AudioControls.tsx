import { COLORS } from '@/constants/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

interface AudioControlsProps {
  onSpeakWord: () => void;
  onSpeakMeaning: () => void;
  onSpeakFull: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onSpeakWord,
  onSpeakMeaning,
  onSpeakFull,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <IconButton
          icon="volume-high"
          iconColor={COLORS.PRIMARY}
          size={24}
          onPress={onSpeakWord}
          style={styles.button}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <IconButton
          icon="record-voice-over"
          iconColor={COLORS.PRIMARY}
          size={24}
          onPress={onSpeakMeaning}
          style={styles.button}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <IconButton
          icon="playlist-play"
          iconColor={COLORS.PRIMARY}
          size={24}
          onPress={onSpeakFull}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  buttonWrapper: {
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    margin: 0,
    backgroundColor: 'transparent',
  },
});

