
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD83gI-eADNt8Sj9LY4qD5xDNlxJQQWktI",
  authDomain: "daily-vocabulary-7254b.firebaseapp.com",
  projectId: "daily-vocabulary-7254b",
  storageBucket: "daily-vocabulary-7254b.firebasestorage.app",
  messagingSenderId: "579403877491",
  appId: "1:579403877491:web:2158a430354ea3ddf82e06",
  measurementId: "G-ZP1D0B9WVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
