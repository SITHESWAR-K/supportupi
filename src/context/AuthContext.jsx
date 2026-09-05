import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToAuth,
  signInWithGoogle as fbSignInWithGoogle,
  signInWithEmail as fbSignInWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  signInGuest as fbSignInGuest,
  logOut as fbLogOut,
  isFirebaseConfigured,
  getActiveFirebaseConfig,
  initFirebase,
} from '../firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  isConfigured: false,
  firebaseConfig: null,
  updateFirebaseConfig: () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  signInGuest: async () => {},
  logOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(isFirebaseConfigured());
  const [firebaseConfig, setFirebaseConfig] = useState(getActiveFirebaseConfig());

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setIsConfigured(isFirebaseConfigured());
      setFirebaseConfig(getActiveFirebaseConfig());
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const updateFirebaseConfig = (newConfig) => {
    initFirebase(newConfig);
    setIsConfigured(isFirebaseConfigured());
    setFirebaseConfig(getActiveFirebaseConfig());
  };

  const signInWithGoogle = async () => {
    return await fbSignInWithGoogle();
  };

  const signInWithEmail = async (email, password) => {
    return await fbSignInWithEmail(email, password);
  };

  const registerWithEmail = async (email, password, displayName) => {
    return await fbRegisterWithEmail(email, password, displayName);
  };

  const signInGuest = async () => {
    return await fbSignInGuest();
  };

  const logOut = async () => {
    return await fbLogOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        firebaseConfig,
        updateFirebaseConfig,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        signInGuest,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
