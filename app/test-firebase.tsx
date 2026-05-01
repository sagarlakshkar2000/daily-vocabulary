import { db } from '@/src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function TestFirebase() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Try to read from firestore
      const querySnapshot = await getDocs(collection(db, 'test'));
      setConnected(true);
      console.log('Firebase connected successfully!');
    } catch (error) {
      console.error('Firebase connection error:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase Status: {connected ? '✅ Connected' : '❌ Not Connected'}</Text>
    </View>
  );
}
