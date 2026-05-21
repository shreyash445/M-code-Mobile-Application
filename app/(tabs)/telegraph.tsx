import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { REVERSE_MORSE_CODE } from '../../constants/MorseData';
import { useTheme } from '../../contexts/ThemeContext';
import MorseTree from '../../components/MorseTree';
import SignalLamp from '../../components/SignalLamp';

const DOT_THRESHOLD = 200;
const LETTER_SILENCE = 800;
const WORD_SILENCE = 2000;

export default function TelegraphScreen() {
  const { theme } = useTheme();
  const [currentPath, setCurrentPath] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [currentMorse, setCurrentMorse] = useState('');

  const pressStartTime = useRef<number>(0);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyScale = useRef(new Animated.Value(1)).current;
  const keyGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
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

  const handlePressIn = () => {
    clearTimers();
    pressStartTime.current = Date.now();
    setIsPressing(true);
    animateKeyPress(true);
    Vibration.vibrate(10);
  };

  const handlePressOut = () => {
    const duration = Date.now() - pressStartTime.current;
    setIsPressing(false);
    animateKeyPress(false);

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
    outputRange: [theme.primaryGlow, 'rgba(212, 160, 64, 0.3)'],
  });

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.canvas,
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
      color: theme.primary,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    heroTitle: {
      color: theme.ink,
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
      color: theme.body,
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 1,
    },
    messageCard: {
      backgroundColor: theme.canvasSoft,
      borderRadius: 12,
      padding: 10,
      marginHorizontal: 16,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 4,
      flexWrap: 'wrap',
    },
    messageLabel: {
      color: theme.mute,
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
      backgroundColor: theme.canvas,
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    pathPillText: {
      color: theme.primary,
      fontSize: 10,
      fontWeight: '700',
    },
    guessPill: {
      backgroundColor: theme.primaryPale,
      paddingHorizontal: 8,
      paddingVertical: 1,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.primary,
      marginLeft: 4,
    },
    guessPillText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '800',
    },
    decodedText: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 20,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: 2,
    },
    morseHistory: {
      color: theme.primary,
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
      backgroundColor: theme.canvasSoft,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.canvasWarm,
    },
    keyOuterGlow: {
      shadowColor: theme.primary,
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
      backgroundColor: theme.canvas,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 4,
    },
    keyButtonPressed: {
      backgroundColor: theme.primary,
      borderColor: theme.primaryActive,
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
      backgroundColor: theme.canvas,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    clearBtn: {
      borderColor: theme.negativeBg,
      backgroundColor: theme.negativeBg,
    },
    ctrlBtnText: {
      color: theme.body,
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
      backgroundColor: theme.body,
    },
    instrDash: {
      width: 12,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.body,
    },
    instrText: {
      color: theme.body,
      fontSize: 9,
      fontWeight: '600',
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Telegraph Key</Text>
          <Text style={styles.heroTitle}>Tap the Key</Text>
        </View>
        <View style={styles.lampBox}>
          <SignalLamp active={isPressing} size={24} />
          <Text style={[styles.lampStatus, isPressing && { color: theme.primary }]}>
            {isPressing ? 'TX' : 'RX'}
          </Text>
        </View>
      </View>

      <View style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <MaterialCommunityIcons name="message-text-outline" size={11} color={theme.mute} />
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
                color={isPressing ? theme.canvas : theme.primary}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleDelete} activeOpacity={0.6}>
            <MaterialCommunityIcons name="backspace-outline" size={14} color={theme.body} />
            <Text style={styles.ctrlBtnText}>Del</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleSpace} activeOpacity={0.6}>
            <MaterialCommunityIcons name="arrow-right-bold" size={14} color={theme.body} />
            <Text style={styles.ctrlBtnText}>Spc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, styles.clearBtn]} onPress={handleClear} activeOpacity={0.6}>
            <MaterialCommunityIcons name="trash-can-outline" size={14} color={theme.negative} />
            <Text style={[styles.ctrlBtnText, { color: theme.negative }]}>Clr</Text>
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