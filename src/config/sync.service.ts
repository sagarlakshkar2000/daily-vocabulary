import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import { importJSON } from './vocabulary.service';

const API_URL = 'https://your-api.com/vocab';

export const syncWords = async () => {
  try {
    const localVersion = await AsyncStorage.getItem('vocab_version');

    const res = await fetch(API_URL);
    const remote = await res.json();

    if (remote.version !== localVersion) {
      importJSON(remote.data);

      await AsyncStorage.setItem('vocab_version', remote.version);
    }
  } catch (e) {
    console.log('Sync error:', e);
  }
};

export const fetchFromFirebase = async () => {
  try {
    const vocabRef = collection(db, 'vocabulary');
    const q = query(vocabRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const items: any[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      items.push({
        word: data.word,
        meaning: data.meaning,
        phonetic: data.phonetic || '',
        example: data.example || '',
      });
    });

    // save into SQLite
    importJSON(items);

    return true;
  } catch (e) {
    console.log('Firebase fetch error:', e);
    return false;
  }
};
