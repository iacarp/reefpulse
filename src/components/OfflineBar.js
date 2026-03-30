import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';

export default function OfflineBar() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);
      setOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (online) return null;

  return (
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: '#f59e0b', paddingVertical: 4, paddingHorizontal: 16,
      alignItems: 'center',
    }}>
      <Text style={{ color: '#000', fontSize: 12, fontWeight: '600' }}>📡 Offline — data is saved locally</Text>
    </View>
  );
}
