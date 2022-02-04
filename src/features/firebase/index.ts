// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDc8FZtEdMwxGvOgIUlojwAqabDM9bsrh8',
  authDomain: 'lazenext.firebaseapp.com',
  projectId: 'lazenext',
  storageBucket: 'lazenext.appspot.com',
  messagingSenderId: '593797660997',
  appId: '1:593797660997:web:fde2ee6d04066566ad3e2c',
  measurementId: 'G-84QJ5HDRTL',
  databaseURL: 'gs://lazenext.appspot.com',
};

export const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((supported) => {
  return supported ? getAnalytics(app) : null;
});
export const auth = getAuth(app);
export const storage = getStorage(app);
