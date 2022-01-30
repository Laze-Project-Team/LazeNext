// Import the functions you need from the SDKs you need
import type { Analytics } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

type initializedFirebase = {
  app: FirebaseApp;
  analytics: Analytics;
};

// Initialize Firebase
export const initialize = (): initializedFirebase => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return { app, analytics };
};
