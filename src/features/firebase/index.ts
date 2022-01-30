// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDc8FZtEdMwxGvOgIUlojwAqabDM9bsrh8',
  authDomain: 'lazenext.firebaseapp.com',
  projectId: 'lazenext',
  storageBucket: 'lazenext.appspot.com',
  messagingSenderId: '593797660997',
  appId: '1:593797660997:web:fde2ee6d04066566ad3e2c',
  measurementId: 'G-84QJ5HDRTL',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
