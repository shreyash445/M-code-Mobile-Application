import { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VESSEL_W = SCREEN_WIDTH * 0.7;
const VESSEL_H = SCREEN_HEIGHT * 0.5;

interface BlobConfig {
  size: number;
  speed: number;
  delay: number;
  drift: number;
  xOffset: number;
}

const BLOBS: BlobConfig[] = [
  { size: 52, speed: 1.0, delay: 0, drift: 6, xOffset: 0 },
  { size: 38, speed: 0.7, delay: 0.3, drift: 10, xOffset: -20 },
  { size: 44, speed: 1.2, delay: 0.6, drift: 8, xOffset: 18 },
  { size: 30, speed: 0.5, delay: 0.9, drift: 12, xOffset: -10 },
  { size: 48, speed: 0.9, delay: 0.15, drift: 5, xOffset: 8 },
];

interface LavaLampProps {
  primaryColor: string;
  primaryGlow: string;
  canvasWarm: string;
}

export default function LavaLamp({ primaryColor, primaryGlow, canvasWarm }: LavaLampProps) {
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={[styles.vessel, { borderColor: canvasWarm, backgroundColor: `${canvasWarm}40` }]}>
        <View style={[styles.glassTop, { backgroundColor: `${canvasWarm}20` }]} />
        {BLOBS.map((blob, i) => (
          <LavaBlob
            key={i}
            config={blob}
            primaryColor={primaryColor}
            primaryGlow={primaryGlow}
          />
        ))}
        <View style={[styles.glassBottom, { backgroundColor: `${canvasWarm}20` }]} />
      </View>
    </View>
  );
}

function LavaBlob({
  config,
  primaryColor,
  primaryGlow,
}: {
  config: BlobConfig;
  primaryColor: string;
  primaryGlow: string;
}) {
  const yAnim = useRef(new Animated.Value(0)).current;
  const xAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const yLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(yAnim, {
            toValue: 1,
            duration: 3000 / config.speed,
            useNativeDriver: true,
          }),
          Animated.timing(yAnim, {
            toValue: 0,
            duration: 3000 / config.speed,
            useNativeDriver: true,
          }),
        ])
      );

      const xLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(xAnim, {
            toValue: 1,
            duration: 2000 / config.speed,
            useNativeDriver: true,
          }),
          Animated.timing(xAnim, {
            toValue: 0,
            duration: 2000 / config.speed,
            useNativeDriver: true,
          }),
        ])
      );

      const scaleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 1800 / config.speed,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 1800 / config.speed,
            useNativeDriver: true,
          }),
        ])
      );

      yLoop.start();
      xLoop.start();
      scaleLoop.start();
    }, config.delay * 1000);

    return () => clearTimeout(timeout);
  }, [config, yAnim, xAnim, scaleAnim]);

  const y = yAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [VESSEL_H * 0.15, VESSEL_H * 0.7],
  });

  const x = xAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-config.drift, config.drift],
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: primaryColor,
          left: VESSEL_W / 2 - config.size / 2 + config.xOffset,
          opacity: 0.6,
          transform: [
            { translateY: y },
            { translateX: x },
            { scale: scaleAnim },
          ],
          shadowColor: primaryGlow,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  vessel: {
    width: VESSEL_W,
    height: VESSEL_H,
    borderRadius: VESSEL_W * 0.3,
    borderWidth: 1.5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  glassTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: VESSEL_H * 0.15,
    borderTopLeftRadius: VESSEL_W * 0.3,
    borderTopRightRadius: VESSEL_W * 0.3,
  },
  glassBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: VESSEL_H * 0.15,
    borderBottomLeftRadius: VESSEL_W * 0.3,
    borderBottomRightRadius: VESSEL_W * 0.3,
  },
  blob: {
    position: 'absolute',
    bottom: 0,
  },
});
