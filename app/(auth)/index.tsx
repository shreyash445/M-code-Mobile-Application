import { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MORSE_CODE } from '../../constants/MorseData';
import { useTheme } from '../../contexts/ThemeContext';
import LavaLamp from '../../Animation/lava-lamp';

const WORD = 'MORSE';
const N = WORD.length;
const DELTA = 0.08;

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const phase = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, { toValue: 2, duration: 2000, useNativeDriver: false }),
        Animated.delay(400),
        Animated.timing(phase, { toValue: 0, duration: 0, useNativeDriver: false }),
        Animated.delay(400),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  const slotMorseAlpha = (i: number) => {
    const fwdThreshold = i / N;
    const revThreshold = (N - 1 - i) / N;

    const fwdValue = phase.interpolate({
      inputRange: [0, fwdThreshold - DELTA, fwdThreshold + DELTA, 2],
      outputRange: [0, 0, 1, 1],
      extrapolate: 'clamp',
    });

    const revValue = phase.interpolate({
      inputRange: [0, 1 + revThreshold - DELTA, 1 + revThreshold + DELTA, 2],
      outputRange: [1, 1, 0, 0],
      extrapolate: 'clamp',
    });

    return Animated.multiply(fwdValue, revValue);
  };

  const styles = useMemo(() => StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 28,
      justifyContent: 'space-between',
    },
    topSection: {
      alignItems: 'center',
      paddingTop: 80,
    },
    badgeContainer: {
      marginBottom: 24,
    },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.canvasSoft,
      borderWidth: 2,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },
    title: {
      color: theme.ink,
      fontSize: 48,
      fontWeight: '800',
      letterSpacing: -1,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: 4,
    },
    subtitle: {
      color: theme.body,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 3,
      textTransform: 'uppercase',
      marginBottom: 32,
    },
    morseAnimRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 52,
      gap: 4,
    },
    morseSlot: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 28,
    },
    morseAnimChar: {
      color: theme.primary,
      fontSize: 36,
      fontWeight: '800',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      position: 'absolute',
    },
    morseAnimCode: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 1,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      position: 'absolute',
    },
    featureList: {
      gap: 18,
      paddingVertical: 8,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.canvasSoft,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: {
      flex: 1,
    },
    featureTitle: {
      color: theme.ink,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 2,
    },
    featureDesc: {
      color: theme.body,
      fontSize: 12,
      fontWeight: '500',
    },
    bottomSection: {
      paddingBottom: 48,
      gap: 12,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    primaryButtonText: {
      color: theme.canvas,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    secondaryButton: {
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.primary,
      paddingVertical: 15,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    skipText: {
      color: theme.mute,
      fontSize: 13,
      fontWeight: '600',
    },
  }), [theme]);

  return (
    <View style={styles.root}>
      <LavaLamp primaryColor={theme.primary} primaryGlow={theme.primaryGlow} canvasWarm={theme.canvasWarm} />
      <View style={styles.container}>
      <View style={styles.topSection}>
        <Animated.View style={[styles.badgeContainer, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="radio-tower" size={32} color={theme.primary} />
          </View>
        </Animated.View>

        <Text style={styles.title}>M-Code</Text>
        <Text style={styles.subtitle}>Master Morse Code</Text>

        <View style={styles.morseAnimRow}>
          {WORD.split('').map((char, i) => {
            const morseAlpha = slotMorseAlpha(i);
            const letterAlpha = Animated.subtract(1, morseAlpha);
            return (
              <View key={i} style={styles.morseSlot}>
                <Animated.Text
                  style={[
                    styles.morseAnimChar,
                    { opacity: letterAlpha },
                  ]}
                >
                  {char}
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.morseAnimCode,
                    { opacity: morseAlpha },
                  ]}
                >
                  {MORSE_CODE[char]}
                </Animated.Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.featureList}>
        <View style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="swap-horizontal-bold" size={18} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Encode & Decode</Text>
            <Text style={styles.featureDesc}>Convert text to Morse and back instantly</Text>
          </View>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Telegraph Key</Text>
            <Text style={styles.featureDesc}>Tap Morse code with a realistic telegraph key</Text>
          </View>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="book-open-variant" size={18} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Reference Chart</Text>
            <Text style={styles.featureDesc}>Complete Morse code alphabet at your fingertips</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/sign-in')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color={theme.canvas} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/sign-up')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.6}
        >
          <Text style={styles.skipText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}
