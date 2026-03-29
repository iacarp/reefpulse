import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const hashPassword = async (password) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

const verifyPassword = async (password, hash) => {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
};

export const register = async (email, password) => {
  try {
    const existing = await AsyncStorage.getItem(`user_${email}`);
    if (existing) {
      return { success: false, error: 'User already exists' };
    }

    const passwordHash = await hashPassword(password);
    const userData = {
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      method: 'local'
    };

    await AsyncStorage.setItem(`user_${email}`, JSON.stringify(userData));
    await AsyncStorage.setItem('currentUser', email);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const loginLocal = async (email, password) => {
  try {
    const userData = await AsyncStorage.getItem(`user_${email}`);
    if (!userData) {
      return { success: false, error: 'User not found' };
    }

    const user = JSON.parse(userData);
    const passwordMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordMatch) {
      return { success: false, error: 'Invalid password' };
    }

    await AsyncStorage.setItem('currentUser', email);
    return { success: true, user: { email } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const email = await AsyncStorage.getItem('currentUser');
    if (!email) return null;

    const userData = await AsyncStorage.getItem(`user_${email}`);
    return userData ? JSON.parse(userData) : null;
  } catch (err) {
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('currentUser');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const hasAcceptedTerms = async (email) => {
  try {
    const accepted = await AsyncStorage.getItem(`terms_accepted_${email}`);
    return accepted === 'true';
  } catch {
    return false;
  }
};

export const acceptTerms = async (email) => {
  try {
    await AsyncStorage.setItem(`terms_accepted_${email}`, 'true');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
