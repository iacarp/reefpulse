import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, Animated, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;
const SKIP_AFTER = 5;        // seconds before X appears
const MIN_INTERVAL = 10 * 60 * 1000; // 10 min between ads
const AD_FREE_KEY  = 'ad_free_purchased';

// ── Ad content pool (replace with AdMob on native, AdSense on web) ──
const ADS = [
  {
    brand: 'Red Sea',
    headline: 'Coral Pro Salt Mix',
    body: 'Formulated for thriving SPS reefs. NSW-level ionic balance.',
    cta: 'Learn More',
    emoji: '🌊',
    color: '#0ea5e9',
    url: 'https://www.redseafish.com',
  },
  {
    brand: 'Tropic Marin',
    headline: 'Pro-Reef Salt',
    body: 'The salt of choice for serious reef keepers worldwide.',
    cta: 'Discover',
    emoji: '🧂',
    color: '#06b6d4',
    url: 'https://www.tropic-marin.com',
  },
  {
    brand: 'Hanna Instruments',
    headline: 'Reef Checkers',
    body: 'Accurate phosphate & alkalinity testing. No color guessing.',
    cta: 'Shop Now',
    emoji: '🔬',
    color: '#8b5cf6',
    url: 'https://www.hannainst.com',
  },
  {
    brand: 'Salifert',
    headline: 'Pro Test Kits',
    body: 'Precision testing for Ca, Alk, Mg, NO3, PO4 and more.',
    cta: 'View Kits',
    emoji: '🧪',
    color: '#10b981',
    url: 'https://www.salifert.com',
  },
];

let lastAdTime = 0;
let adIndex    = 0;

export async function isAdFree() {
  try { return (await AsyncStorage.getItem(AD_FREE_KEY)) === 'true'; } catch { return false; }
}

export async function purchaseAdFree() {
  await AsyncStorage.setItem(AD_FREE_KEY, 'true');
}

// Call this after key user actions (save test, mark maintenance done, etc.)
export async function maybeShowAd(showFn) {
  if (await isAdFree()) return;
  const now = Date.now();
  if (now - lastAdTime < MIN_INTERVAL) return;
  lastAdTime = now;
  showFn();
}

export default function AdModal({ visible, onClose }) {
  const [countdown, setCountdown] = useState(SKIP_AFTER);
  const [canClose, setCanClose]   = useState(false);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const ad = ADS[adIndex % ADS.length];

  useEffect(() => {
    if (!visible) {
      setCountdown(SKIP_AFTER);
      setCanClose(false);
      return;
    }
    adIndex++;
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();

    // Countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); setCanClose(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  const handleClose = () => {
    if (!canClose) return;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 40, duration: 200, useNativeDriver: true }),
    ]).start(() => { fadeAnim.setValue(0); slideAnim.setValue(40); onClose(); });
  };

  const handleCta = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(ad.url, '_blank');
    }
    // On native: Linking.openURL(ad.url)
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.72)',
        alignItems: 'center', justifyContent: 'center',
        opacity: fadeAnim,
      }}>
        <TouchableOpacity style={{ position: 'absolute', inset: 0 }} activeOpacity={1} onPress={canClose ? handleClose : undefined} />

        {/* Ad card — half screen height, centered */}
        <Animated.View style={{
          width: Math.min(W - 40, 400),
          height: H * 0.48,
          backgroundColor: '#0f172a',
          borderRadius: 24,
          borderWidth: 1,
          borderColor: `${ad.color}40`,
          overflow: 'hidden',
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }}>

          {/* Colored top stripe */}
          <View style={{ height: 4, backgroundColor: ad.color }} />

          {/* Close button / countdown */}
          <View style={{ position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
            {canClose ? (
              <TouchableOpacity onPress={handleClose}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16, lineHeight: 18, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '700' }}>{countdown}</Text>
              </View>
            )}
          </View>

          {/* Ad label */}
          <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6 }}>
            <Text style={{ color: '#475569', fontSize: 9, letterSpacing: 2, fontWeight: '600' }}>ADVERTISEMENT</Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 48 }}>{ad.emoji}</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: ad.color, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase' }}>{ad.brand}</Text>
              <Text style={{ color: '#f1f5f9', fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 28 }}>{ad.headline}</Text>
            </View>
            <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 }}>{ad.body}</Text>

            {/* CTA button */}
            <TouchableOpacity onPress={handleCta}
              style={{ marginTop: 8, backgroundColor: ad.color, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12 }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{ad.cta} →</Text>
            </TouchableOpacity>
          </View>

          {/* Remove ads footer */}
          <TouchableOpacity style={{ paddingVertical: 14, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b' }}>
            <Text style={{ color: '#334155', fontSize: 11 }}>Remove ads — €1.99 one-time</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
