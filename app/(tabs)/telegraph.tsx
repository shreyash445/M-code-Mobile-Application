import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME, REVERSE_MORSE_CODE } from '../../constants/MorseData';
import MorseTree from '../../components/MorseTree';
import SignalLamp from '../../components/SignalLamp';

const DOT_THRESHOLD = 200;
const LETTER_SILENCE = 800;
const WORD_SILENCE = 2000;

const genBeep = (): string => {
  const sr = 8000, freq = 800, n = Math.floor(sr * 0.08);
  const buf = new ArrayBuffer(44 + n), v = new DataView(buf);
  const w = (off: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  w(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, Math.floor((Math.sin(2 * Math.PI * freq * i / sr) * 0.5 + 0.5) * 255));
  const b = new Uint8Array(buf), c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let b64 = '';
  for (let i = 0; i < b.length; i += 3) {
    const b1 = b[i], b2 = i + 1 < b.length ? b[i + 1] : 0, b3 = i + 2 < b.length ? b[i + 2] : 0;
    const t = (b1 << 16) | (b2 << 8) | b3;
    b64 += c[(t >> 18) & 63] + c[(t >> 12) & 63] + (i + 1 < b.length ? c[(t >> 6) & 63] : '=') + (i + 2 < b.length ? c[t & 63] : '=');
  }
  return 'data:audio/wav;base64,' + b64;
};
const BEEP_DATA = genBeep();

export default function TelegraphScreen() {
  const [currentPath, setCurrentPath] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [currentMorse, setCurrentMorse] = useState('');

  const pressStartTime = useRef<number>(0);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const keyScale = useRef(new Animated.Value(1)).current;
  const keyGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: BEEP_DATA },
          { shouldPlay: false }
        );
        if (mounted) soundRef.current = sound;
      } catch {
        // silent
      }
    };
    loadSound();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      if (wordTimer.current) clearTimeout(wordTimer.current);
    };
  }, []);

  const animateKeyPress = useCallback((pressing: boolean) => {
    Animated.spring(keyScale, {
      toValue: pressing ? 0.92 : 1,
      friction: 8,
      tension: 120,
      useNativeDriver: false,
    }).start();
    Animated.timing(keyGlow, {
      toValue: pressing ? 1 : 0,
      duration: pressing ? 30 : 200,
      useNativeDriver: false,
    }).start();
  }, [keyScale, keyGlow]);

  const clearTimers = useCallback(() => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (wordTimer.current) clearTimeout(wordTimer.current);
  }, []);

  const commitLetter = useCallback(() => {
    if (currentPath) {
      const char = REVERSE_MORSE_CODE[currentPath] || '?';
      setDecodedMessage(prev => prev + char);
      setCurrentPath('');
      setCurrentMorse(prev => prev + ' ');
    }
  }, [currentPath]);

  const commitWord = useCallback(() => {
    setDecodedMessage(prev => prev + ' ');
    setCurrentMorse(prev => prev + '/ ');
  }, []);

  const startSilenceTimers = useCallback(() => {
    clearTimers();
    silenceTimer.current = setTimeout(() => {
      commitLetter();
      wordTimer.current = setTimeout(() => {
        commitWord();
      }, WORD_SILENCE - LETTER_SILENCE);
    }, LETTER_SILENCE);
  }, [commitLetter, commitWord, clearTimers]);

  const handlePressIn = async () => {
    clearTimers();
    pressStartTime.current = Date.now();
    setIsPressing(true);
    animateKeyPress(true);
    Vibration.vibrate(10);
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch {
      // silent
    }
  };

  const handlePressOut = async () => {
    const duration = Date.now() - pressStartTime.current;
    setIsPressing(false);
    animateKeyPress(false);
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
    } catch {
      // silent
    }

    const symbol = duration < DOT_THRESHOLD ? '.' : '-';
    setCurrentPath(prev => prev + symbol);
    setCurrentMorse(prev => prev + symbol);
    startSilenceTimers();
  };

  const handleDelete = () => {
    clearTimers();
    if (currentPath.length > 0) {
      setCurrentPath(prev => prev.slice(0, -1));
      setCurrentMorse(prev => prev.slice(0, -1));
    } else if (decodedMessage.length > 0) {
      setDecodedMessage(prev => prev.slice(0, -1));
    }
  };

  const handleSpace = () => {
    clearTimers();
    if (currentPath) {
      commitLetter();
    }
    setDecodedMessage(prev => prev + ' ');
    setCurrentMorse(prev => prev + '/ ');
  };

  const handleClear = () => {
    clearTimers();
    setDecodedMessage('');
    setCurrentMorse('');
    setCurrentPath('');
  };

  const guessedLetter = currentPath ? REVERSE_MORSE_CODE[currentPath] : null;

  const glowInterpolate = keyGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.primaryGlow, 'rgba(212, 160, 64, 0.3)'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Telegraph Key</Text>
          <Text style={styles.heroTitle}>Tap the Key</Text>
        </View>
        <View style={styles.lampBox}>
          <SignalLamp active={isPressing} size={24} />
          <Text style={[styles.lampStatus, isPressing && { color: THEME.primary }]}>
            {isPressing ? 'TX' : 'RX'}
          </Text>
        </View>
      </View>

      <View style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <MaterialCommunityIcons name="message-text-outline" size={11} color={THEME.mute} />
          <Text style={styles.messageLabel}>Output</Text>
          {currentPath.length > 0 && (
            <View style={styles.pathPills}>
              {currentPath.split('').map((s, i) => (
                <View key={i} style={styles.pathPill}>
                  <Text style={styles.pathPillText}>{s === '.' ? '\u25CF' : '\u2014'}</Text>
                </View>
              ))}
            </View>
          )}
          {guessedLetter && (
            <View style={styles.guessPill}>
              <Text style={styles.guessPillText}>{guessedLetter}</Text>
            </View>
          )}
        </View>
        <Text style={styles.decodedText} numberOfLines={1}>
          {decodedMessage || 'Tap the key to begin...'}
        </Text>
        <Text style={styles.morseHistory} numberOfLines={1}>
          {currentMorse || '\u2014'}
        </Text>
      </View>

      <View style={styles.midArea}>
        <MorseTree currentPath={currentPath} />
      </View>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.keyOuterGlow,
            {
              shadowOpacity: keyGlow,
              shadowRadius: keyGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 14],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.keyOuterRing,
              {
                transform: [{ scale: keyScale }],
                backgroundColor: glowInterpolate,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.keyButton, isPressing && styles.keyButtonPressed]}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={28}
                color={isPressing ? THEME.canvas : THEME.primary}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleDelete} activeOpacity={0.6}>
            <MaterialCommunityIcons name="backspace-outline" size={14} color={THEME.body} />
            <Text style={styles.ctrlBtnText}>Del</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleSpace} activeOpacity={0.6}>
            <MaterialCommunityIcons name="arrow-right-bold" size={14} color={THEME.body} />
            <Text style={styles.ctrlBtnText}>Spc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, styles.clearBtn]} onPress={handleClear} activeOpacity={0.6}>
            <MaterialCommunityIcons name="trash-can-outline" size={14} color={THEME.negative} />
            <Text style={[styles.ctrlBtnText, { color: THEME.negative }]}>Clr</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instrRow}>
          <View style={styles.instrItem}>
            <View style={styles.instrDot} />
            <Text style={styles.instrText}>Tap = Dot</Text>
          </View>
          <View style={styles.instrItem}>
            <View style={styles.instrDash} />
            <Text style={styles.instrText}>Hold = Dash</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.canvas,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  hero: {
    flex: 1,
  },
  heroEyebrow: {
    color: THEME.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  heroTitle: {
    color: THEME.ink,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  lampBox: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
  },
  lampStatus: {
    color: THEME.body,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  messageCard: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  messageLabel: {
    color: THEME.mute,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pathPills: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 6,
  },
  pathPill: {
    backgroundColor: THEME.canvas,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  pathPillText: {
    color: THEME.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  guessPill: {
    backgroundColor: THEME.primaryPale,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.primary,
    marginLeft: 4,
  },
  guessPillText: {
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  decodedText: {
    color: THEME.ink,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 2,
  },
  morseHistory: {
    color: THEME.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    letterSpacing: 3,
  },
  midArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    alignItems: 'center',
    backgroundColor: THEME.canvasSoft,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: THEME.canvasWarm,
  },
  keyOuterGlow: {
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 9999,
  },
  keyOuterRing: {
    borderRadius: 9999,
    padding: 3,
  },
  keyButton: {
    width: 76,
    height: 76,
    borderRadius: 9999,
    backgroundColor: THEME.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  keyButtonPressed: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primaryActive,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    marginTop: 6,
  },
  ctrlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
    backgroundColor: THEME.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  clearBtn: {
    borderColor: THEME.negativeBg,
    backgroundColor: THEME.negativeBg,
  },
  ctrlBtnText: {
    color: THEME.body,
    fontSize: 10,
    fontWeight: '700',
  },
  instrRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  instrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instrDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.body,
  },
  instrDash: {
    width: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: THEME.body,
  },
  instrText: {
    color: THEME.body,
    fontSize: 9,
    fontWeight: '600',
  },
});