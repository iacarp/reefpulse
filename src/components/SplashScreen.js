import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet, Image, Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

// Import images
const coralBg = require('../../assets/images/coral-bg-sm.jpg');
const clownfish = require('../../assets/images/clownfish-sm.jpg');

export default function SplashScreen({ onFinish }) {
  // Animation values
  const bgScale = useRef(new Animated.Value(1.15)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const fishX = useRef(new Animated.Value(W * 0.6)).current;
  const fishY = useRef(new Animated.Value(H * 0.15)).current;
  const fishOpacity = useRef(new Animated.Value(0)).current;
  const fishScale = useRef(new Animated.Value(0.8)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  // Bubble positions
  const bubbles = Array.from({length: 6}, (_, i) => ({
    y: useRef(new Animated.Value(H + 20)).current,
    x: W * (0.1 + i * 0.15),
    size: 4 + i * 2,
    opacity: 0.15 + i * 0.03,
    duration: 2500 + i * 300,
    delay: i * 200,
  }));

  useEffect(() => {
    // Start bubble animations
    bubbles.forEach(b => {
      Animated.loop(
        Animated.timing(b.y, {
          toValue: -50,
          duration: b.duration,
          delay: b.delay,
          useNativeDriver: true,
        })
      ).start();
    });

    // Shimmer loop for glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Main animation sequence
    Animated.sequence([
      // Phase 1: Background fades in + slow zoom
      Animated.parallel([
        Animated.timing(bgOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(bgScale, { toValue: 1.0, duration: 4000, useNativeDriver: true }),
      ]),

      // Phase 2: Clownfish swims in from right (overlapping with bg zoom)
      Animated.delay(0), // starts right after bg visible
    ]).start();

    // Fish animation (parallel with bg, slight delay)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fishOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(fishScale, { toValue: 1, friction: 5, tension: 30, useNativeDriver: true }),
        // Gentle floating motion
        Animated.sequence([
          Animated.timing(fishY, { toValue: H * 0.12, duration: 1500, useNativeDriver: true }),
          Animated.timing(fishY, { toValue: H * 0.18, duration: 1500, useNativeDriver: true }),
        ]),
      ]).start();
    }, 400);

    // Phase 3: Dark overlay + Logo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0.7, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1200);

    // Phase 4: Title slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1800);

    // Phase 5: Tagline fades in
    setTimeout(() => {
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 2300);

    // Phase 6: Fade out and finish
    setTimeout(() => {
      Animated.timing(fadeOut, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
        if (onFinish) onFinish();
      });
    }, 3500);
  }, []);

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Coral Background with slow zoom */}
      <Animated.View style={[StyleSheet.absoluteFill, {
        opacity: bgOpacity,
        transform: [{ scale: bgScale }],
      }]}>
        <Image source={coralBg} style={styles.bgImage} resizeMode="cover" />
      </Animated.View>

      {/* Clownfish overlay */}
      <Animated.View style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: H * 0.5,
        opacity: fishOpacity,
        transform: [
          { scale: fishScale },
          { translateY: fishY },
        ],
      }}>
        <Image source={clownfish} style={styles.fishImage} resizeMode="cover" />
        {/* Gradient fade at bottom of fish image */}
        <View style={styles.fishGradient} />
      </Animated.View>

      {/* Dark overlay for text readability */}
      <Animated.View style={[StyleSheet.absoluteFill, {
        backgroundColor: '#020617',
        opacity: overlayOpacity,
      }]} />

      {/* Bubbles */}
      {bubbles.map((b, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          left: b.x,
          width: b.size,
          height: b.size,
          borderRadius: b.size / 2,
          backgroundColor: `rgba(6, 182, 212, ${b.opacity})`,
          transform: [{ translateY: b.y }],
        }} />
      ))}

      {/* Center content */}
      <View style={styles.center}>
        {/* Coral icon with glow */}
        <Animated.View style={[styles.iconWrap, {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }]}>
          <Animated.View style={[styles.iconGlow, { opacity: shimmerOpacity }]} />
          <Text style={styles.icon}>🪸</Text>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleY }],
        }}>
          <Text style={styles.title}>ReefPulse</Text>
        </Animated.View>

        {/* Subtitle + tagline */}
        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.subtitle}>REEF INTELLIGENCE</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Track • Diagnose • Thrive</Text>
        </Animated.View>
      </View>

      {/* Version at bottom */}
      <Animated.View style={[styles.bottom, { opacity: taglineOpacity }]}>
        <Text style={styles.version}>v2.0</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#020617',
  },
  bgImage: {
    width: W,
    height: H,
  },
  fishImage: {
    width: W,
    height: H * 0.45,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  fishGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    // Gradient effect via multiple semi-transparent views
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // On web, use linear-gradient. On native, this is just a fade area
    ...(Platform.OS === 'web' ? {
      backgroundImage: 'linear-gradient(transparent, #020617)',
    } : {
      backgroundColor: 'rgba(2, 6, 23, 0.6)',
    }),
  },
  center: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    // Glass effect
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    } : {}),
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  icon: {
    fontSize: 46,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#06b6d4',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(6, 182, 212, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(148, 163, 184, 0.9)',
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: '#06b6d4',
    borderRadius: 1,
    alignSelf: 'center',
    marginVertical: 12,
    opacity: 0.6,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(226, 232, 240, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  version: {
    fontSize: 11,
    color: '#334155',
    letterSpacing: 2,
  },
});
