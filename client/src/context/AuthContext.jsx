// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the ID token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          
          // Get user profile from your backend
          const response = await axios.get('http://localhost:3000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser({
            ...firebaseUser,
            ...response.data.data,
            name: response.data.data?.name || firebaseUser.displayName,
            email: response.data.data?.email || firebaseUser.email
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
