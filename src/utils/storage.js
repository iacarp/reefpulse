// Universal storage wrapper for web + React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const WebStorage = {
  getItem: async (key) => {
    try {
      return Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: async (key) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }
};

// Use localStorage on web (detect by typeof window), AsyncStorage on native
const storage = (typeof window !== 'undefined' && typeof document !== 'undefined') ? WebStorage : AsyncStorage;

export default storage;
