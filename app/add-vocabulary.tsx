import { useBackgroundColor } from '@/contexts/BackgroundColorContext';
import { db } from '@/src/config/firebase';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Divider,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput
} from 'react-native-paper';

type VocabularyLevel = 'easy' | 'medium' | 'hard';
type AddMethod = 'manual' | 'json';

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
  level: VocabularyLevel;
  createdAt: Date;
}

const AddVocabulary = () => {
  const { backgroundColor } = useBackgroundColor();
  const [addMethod, setAddMethod] = useState<AddMethod>('manual');

  // Manual form state
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [level, setLevel] = useState<VocabularyLevel>('easy');
  const [loading, setLoading] = useState(false);

  // JSON upload state
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validateManualForm = () => {
    if (!word.trim()) {
      showMessage('Please enter a word');
      return false;
    }
    if (!meaning.trim()) {
      showMessage('Please enter the meaning');
      return false;
    }
    if (!example.trim()) {
      showMessage('Please enter an example');
      return false;
    }
    return true;
  };

  const saveToFirebase = async (data: VocabularyItem[]) => {
    try {
      const batch = data.map(async (item) => {
        const docRef = await addDoc(collection(db, 'vocabulary'), {
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return docRef;
      });

      await Promise.all(batch);
      return true;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  };

  const handleManualSubmit = async () => {
    if (!validateManualForm()) return;

    setLoading(true);
    try {
      const vocabularyItem: VocabularyItem = {
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        level,
        createdAt: new Date(),
      };

      await saveToFirebase([vocabularyItem]);

      // Reset form
      setWord('');
      setMeaning('');
      setExample('');
      setLevel('easy');

      showMessage('Vocabulary added successfully!');
    } catch (error) {
      showMessage('Error adding vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJsonUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      const parsedData = JSON.parse(fileContent);

      // Validate JSON structure
      let vocabularyArray = Array.isArray(parsedData) ? parsedData : [parsedData];

      // Validate each item has required fields
      const validItems = vocabularyArray.filter(item =>
        item.word && item.meaning && item.example
      );

      if (validItems.length === 0) {
        showMessage('Invalid JSON format. Each item must have word, meaning, and example.');
        return;
      }

      setJsonData(validItems);
      showMessage(`${validItems.length} vocabulary items loaded. Review and confirm to upload.`);

    } catch (error) {
      showMessage('Error reading JSON file. Please check the format.');
      console.error(error);
    }
  };

  const handleBulkUpload = async () => {
    if (jsonData.length === 0) return;

    setLoading(true);
    try {
      const vocabularyItems: VocabularyItem[] = jsonData.map(item => ({
        word: item.word,
        meaning: item.meaning,
        example: item.example || `${item.word} is used in context.`,
        level: item.level || 'medium',
        createdAt: new Date(),
      }));

      await saveToFirebase(vocabularyItems);

      setJsonData([]);
      showMessage(`${vocabularyItems.length} vocabulary items uploaded successfully!`);
    } catch (error) {
      showMessage('Error uploading vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        "word": "example",
        "meaning": "a representative form or pattern",
        "example": "This is an example sentence.",
        "level": "medium"
      }
    ];

    const jsonString = JSON.stringify(template, null, 2);
    // In a real app, you'd use expo-sharing to share this file
    Alert.alert('JSON Template', jsonString, [
      { text: 'Copy', onPress: () => console.log('Template copied') },
      { text: 'OK' }
    ]);
  };

  const renderManualForm = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Add Single Vocabulary
        </Text>

        <TextInput
          label="Word *"
          value={word}
          onChangeText={setWord}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="format-letter-case" />}
        />

        <TextInput
          label="Meaning *"
          value={meaning}
          onChangeText={setMeaning}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
          left={<TextInput.Icon icon="book-open-variant" />}
        />

        <TextInput
          label="Example Sentence *"
          value={example}
          onChangeText={setExample}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
          left={<TextInput.Icon icon="text-box" />}
        />

        <View style={styles.levelContainer}>
          <Text variant="bodyMedium" style={styles.levelLabel}>
            Difficulty Level:
          </Text>
          <SegmentedButtons
            value={level}
            onValueChange={(value) => setLevel(value as VocabularyLevel)}
            buttons={[
              { value: 'easy', label: 'Easy', icon: 'emoticon-happy' },
              { value: 'medium', label: 'Medium', icon: 'emoticon-neutral' },
              { value: 'hard', label: 'Hard', icon: 'emoticon-sad' },
            ]}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleManualSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          icon="plus"
        >
          Add Vocabulary
        </Button>
      </Card.Content>
    </Card>
  );

  const renderJsonUpload = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Bulk Upload JSON
        </Text>

        <View style={styles.jsonInfo}>
          <Text variant="bodyMedium" style={styles.infoText}>
            Upload a JSON file with vocabulary items.
          </Text>
          <Button
            mode="outlined"
            onPress={downloadTemplate}
            icon="download"
            style={styles.templateButton}
          >
            Download Template
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={handleJsonUpload}
          icon="file-upload"
          style={styles.uploadButton}
        >
          Select JSON File
        </Button>

        {jsonData.length > 0 && (
          <View style={styles.previewContainer}>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.previewTitle}>
              Preview ({jsonData.length} items)
            </Text>

            <ScrollView style={styles.previewScroll}>
              {jsonData.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.previewItem}>
                  <Text variant="bodyMedium" style={styles.previewWord}>
                    {item.word}
                  </Text>
                  <Text variant="bodySmall" style={styles.previewMeaning}>
                    {item.meaning}
                  </Text>
                </View>
              ))}
              {jsonData.length > 3 && (
                <Text variant="bodySmall" style={styles.moreText}>
                  and {jsonData.length - 3} more...
                </Text>
              )}
            </ScrollView>

            <Button
              mode="contained"
              onPress={handleBulkUpload}
              loading={loading}
              disabled={loading}
              icon="cloud-upload"
              style={styles.bulkButton}
            >
              Upload All ({jsonData.length}) Items
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: backgroundColor.color + '10' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Add New Vocabulary
          </Text>
        </View>

        <SegmentedButtons
          value={addMethod}
          onValueChange={(value) => setAddMethod(value as AddMethod)}
          buttons={[
            { value: 'manual', label: 'Manual Entry', icon: 'pencil' },
            { value: 'json', label: 'Upload JSON', icon: 'file-code' },
          ]}
          style={styles.segmentedButton}
        />

        {addMethod === 'manual' ? renderManualForm() : renderJsonUpload()}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  segmentedButton: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  levelContainer: {
    marginVertical: 8,
  },
  levelLabel: {
    marginBottom: 8,
    color: '#666',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  jsonInfo: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginBottom: 12,
    color: '#666',
  },
  templateButton: {
    borderRadius: 8,
  },
  uploadButton: {
    borderRadius: 12,
    paddingVertical: 6,
  },
  previewContainer: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 16,
  },
  previewTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  previewScroll: {
    maxHeight: 200,
    marginBottom: 16,
  },
  previewItem: {
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 8,
  },
  previewWord: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  previewMeaning: {
    color: '#666',
    marginTop: 4,
  },
  moreText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  bulkButton: {
    borderRadius: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
});

export default AddVocabulary;
