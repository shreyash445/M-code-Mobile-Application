import { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SignalLampProps {
  active: boolean;
  size?: number;
}

export default function SignalLamp({ active, size = 48 }: SignalLampProps) {
  const { theme } = useTheme();
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: active ? 1 : 0,
      duration: active ? 40 : 120,
      useNativeDriver: false,
    }).start();
  }, [active, glowAnim]);

  useEffect(() => {
    if (active) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 250, useNativeDriver: false }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [active, pulseAnim]);

  const interpolated = useMemo(() => {
    const glowColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.canvasWarm, theme.signalGlow],
    });
    const innerGlow = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.canvasWarm, '#f0d080'],
    });
    const shadowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.6],
    });
    return { glowColor, innerGlow, shadowOpacity };
  }, [theme, glowAnim]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
    },
    housing: {
      padding: 5,
      borderRadius: 9999,
      backgroundColor: theme.canvas,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
      shadowColor: theme.ink,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    lampGlass: {
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reflection: {
      position: 'absolute',
      top: '18%',
      left: '22%',
      borderRadius: 10,
      backgroundColor: 'rgba(255, 245, 210, 0.6)',
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.housing}>
        <Animated.View
          style={[
            styles.lampGlass,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: interpolated.innerGlow,
              borderColor: interpolated.glowColor,
              shadowColor: theme.signalGlow,
              shadowOpacity: interpolated.shadowOpacity,
              shadowRadius: active ? 18 : 2,
              shadowOffset: { width: 0, height: 0 },
              elevation: active ? 8 : 1,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {active && (
            <View style={[styles.reflection, { width: size * 0.22, height: size * 0.22 }]} />
          )}
        </Animated.View>
      </View>
    </View>
  );
}
