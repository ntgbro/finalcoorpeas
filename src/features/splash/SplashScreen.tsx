import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';

const KEYWORDS = ['FRESH SERVE', 'FMCG', 'GIFTING', 'SUPPLIES', 'LIVE CHEF'];

function SplashScreen() {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const inDuration = 250;
    const holdDuration = 200;
    const outDuration = 250;
    const cycleMs = inDuration + holdDuration + outDuration; // 700ms

    const animate = () => {
      fade.setValue(0);
      translateY.setValue(8);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: inDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: inDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(holdDuration),
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 0,
            duration: outDuration,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -8,
            duration: outDuration,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    animate();
    const intervalId = setInterval(() => {
      setIndex(prev => (prev + 1) % KEYWORDS.length);
      animate();
    }, cycleMs);

    return () => clearInterval(intervalId);
  }, [fade, translateY]);

  return (
    <View style={styles.container}>
      {/* Subtle background shapes */}
      <View style={styles.bgBubbleTop} />
      <View style={styles.bgBubbleBottom} />

      <View style={styles.centerContent}>
        <Text style={styles.brand}>CORPEAS</Text>
        <Animated.Text
          style={[
            styles.keyword,
            {
              opacity: fade,
              transform: [{ translateY }],
            },
          ]}
        >
          {KEYWORDS[index]}
        </Animated.Text>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#16a34a" size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  bgBubbleTop: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#d1fae5', // light green
    opacity: 0.6,
  },
  bgBubbleBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#bbf7d0', // mint green
    opacity: 0.5,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#166534', // deep green
  },
  keyword: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#065f46',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});

export default SplashScreen;


