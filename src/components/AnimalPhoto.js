import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback emojis per animal type
const FALLBACK = {
  fish:   '🐟',
  invert: '🦐',
  coral:  '🪸',
};

async function getAnimalPhoto(animalId, type) {
  try {
    const key = `animal_photo_${type}_${animalId}`;
    return await AsyncStorage.getItem(key);
  } catch { return null; }
}

async function saveAnimalPhoto(animalId, type, uri) {
  try {
    const key = `animal_photo_${type}_${animalId}`;
    await AsyncStorage.setItem(key, uri);
  } catch {}
}

// Pick photo — web or native
async function pickPhoto() {
  if (Platform.OS === 'web') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  } else {
    try {
      const IP = require('expo-image-picker');
      const { status } = await IP.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access.');
        return null;
      }
      const result = await IP.launchImageLibraryAsync({
        mediaTypes: IP.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });
      if (!result.canceled && result.assets[0]) return result.assets[0].uri;
      return null;
    } catch { return null; }
  }
}

/**
 * AnimalPhoto — shows animal photo or emoji fallback
 * 
 * Props:
 *   animalId: string — unique id of animal
 *   type: 'fish' | 'invert' | 'coral'
 *   emoji: string — fallback emoji from database
 *   size: number — width/height of the photo box (default 48)
 *   editable: bool — show camera icon to change photo (default true)
 */
export default function AnimalPhoto({ animalId, type, emoji, size = 48, editable = true }) {
  const [photoUri, setPhotoUri] = useState(null);
  const radius = Math.round(size * 0.28);

  useEffect(() => {
    getAnimalPhoto(animalId, type).then(setPhotoUri);
  }, [animalId, type]);

  const handlePress = async () => {
    if (!editable) return;
    const uri = await pickPhoto();
    if (uri) {
      await saveAnimalPhoto(animalId, type, uri);
      setPhotoUri(uri);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={editable ? 0.7 : 1}
      style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', position: 'relative' }}
    >
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: size, height: size, borderRadius: radius }}
          resizeMode="cover"
        />
      ) : (
        <View style={{
          width: size, height: size, borderRadius: radius,
          backgroundColor: '#1e293b',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: size * 0.45 }}>{emoji || FALLBACK[type] || '🐠'}</Text>
        </View>
      )}

      {/* Camera overlay hint — only when editable and no photo yet */}
      {editable && !photoUri && (
        <View style={{
          position: 'absolute', bottom: 0, right: 0,
          backgroundColor: 'rgba(6,182,212,0.85)',
          borderRadius: 99, width: size * 0.32, height: size * 0.32,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: size * 0.16, color: 'white' }}>📷</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
