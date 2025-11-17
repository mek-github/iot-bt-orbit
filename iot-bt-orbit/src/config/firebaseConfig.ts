import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration for Orbit Mobile App
const firebaseConfig = {
  apiKey: "AIzaSyBpqdPdImY13-Cfd0lCB8SUzi7mzq0pbiQ",
  authDomain: "orbit-mobile-app-f0cda.firebaseapp.com",
  projectId: "orbit-mobile-app-f0cda",
  storageBucket: "orbit-mobile-app-f0cda.firebasestorage.app",
  messagingSenderId: "870744785158",
  appId: "1:870744785158:web:54122e3e959deb7c2b5e87",
  measurementId: "G-9PHCWQ13FE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// Note: Using web SDK with Expo - persistence warning is expected and can be ignored
// Auth state is managed in-memory, users will need to re-login after app restarts
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
