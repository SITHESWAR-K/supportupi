import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Default config for project 'supportupi'
const defaultFirebaseConfig = {
  projectId: 'supportupi',
  authDomain: 'supportupi.firebaseapp.com',
  storageBucket: 'supportupi.firebasestorage.app',
  messagingSenderId: '768765535383',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:768765535383:web:4202696d86996bf92eb5d2',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCOldlIT2S3BrZtGvPfa-SKrPehC5nyS_A',
  measurementId: 'G-PB066M461X',
};

// Check if localStorage has stored custom config
function getStoredConfig() {
  try {
    const raw = localStorage.getItem('supportupi_firebase_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored Firebase config', e);
  }
  return null;
}

// Active config calculation
let activeConfig = getStoredConfig() || defaultFirebaseConfig;

let app;
let auth;
let db;

// Function to initialize or re-initialize with config
export function initFirebase(customConfig = null) {
  if (customConfig) {
    activeConfig = { ...activeConfig, ...customConfig };
    try {
      localStorage.setItem('supportupi_firebase_config', JSON.stringify(activeConfig));
    } catch (e) {
      console.warn('Could not save config to localStorage', e);
    }
  }

  try {
    if (!getApps().length) {
      app = initializeApp(activeConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }

  return { app, auth, db };
}

// Initial setup attempt
initFirebase();

// Attempt to fetch /__/firebase/init.json if running on Firebase Hosting
if (typeof window !== 'undefined' && !activeConfig.apiKey) {
  fetch('/__/firebase/init.json')
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Not hosted on Firebase hosting init endpoint');
    })
    .then((hostingConfig) => {
      if (hostingConfig && hostingConfig.apiKey) {
        initFirebase(hostingConfig);
      }
    })
    .catch(() => {
      // Ignored in standard local dev unless proxy is set
    });
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth helpers
export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase Auth not initialized. Check API configuration.');
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase Auth not initialized.');
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password, displayName = '') => {
  if (!auth) throw new Error('Firebase Auth not initialized.');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const signInGuest = async () => {
  if (!auth) throw new Error('Firebase Auth not initialized.');
  return await signInAnonymously(auth);
};

export const logOut = async () => {
  if (!auth) return;
  return await fbSignOut(auth);
};

export const subscribeToAuth = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export function getActiveFirebaseConfig() {
  return activeConfig;
}

export function isFirebaseConfigured() {
  return Boolean(activeConfig.apiKey && activeConfig.projectId);
}

export {
  app,
  auth,
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};
