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
const BEEP_URL = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';

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
        const { sound } = await Audio.Sound.createAsync({ uri: BEEP_URL });
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
        await soundRef.current.replayAsync();
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
        await soundRef.current.stopAsync();
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SignalLamp active={isPressing} size={36} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerEyebrow}>Telegraph Key</Text>
            <Text style={styles.headerStatus}>
              {isPressing ? 'Transmitting' : 'Ready'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.clearHeaderBtn} onPress={handleClear} activeOpacity={0.6}>
          <MaterialCommunityIcons name="delete-sweep" size={18} color={THEME.negative} />
        </TouchableOpacity>
      </View>

      <View style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <MaterialCommunityIcons name="message-text-outline" size={14} color={THEME.mute} />
          <Text style={styles.messageLabel}>Output</Text>
        </View>
        <Text style={styles.morseHistory} numberOfLines={1}>
          {currentMorse || '\u2014'}
        </Text>
        <Text style={styles.decodedText} numberOfLines={2}>
          {decodedMessage || 'Tap the key to begin...'}
        </Text>
      </View>

      <View style={styles.treeSection}>
        <View style={styles.treeLabel}>
          <MaterialCommunityIcons name="graph" size={12} color={THEME.mute} />
          <Text style={styles.treeLabelText}>Navigation Tree</Text>
        </View>
        <MorseTree currentPath={currentPath} />
      </View>

      <View style={styles.footer}>
        <View style={styles.hintBar}>
          <View style={styles.pathDisplay}>
            {currentPath.split('').map((s, i) => (
              <View key={i} style={styles.pathSymbolWrap}>
                <Text style={styles.pathSymbol}>{s === '.' ? '\u25CF' : '\u2014'}</Text>
              </View>
            ))}
            {currentPath.length === 0 && (
              <Text style={styles.pathPlaceholder}>Awaiting input</Text>
            )}
          </View>
          {guessedLetter && (
            <View style={styles.guessBadge}>
              <Text style={styles.guessText}>{guessedLetter}</Text>
            </View>
          )}
        </View>

        <Animated.View
          style={[
            styles.keyOuterGlow,
            {
              shadowOpacity: keyGlow,
              shadowRadius: keyGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 24],
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
              <View style={styles.keyInner}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={32}
                  color={isPressing ? THEME.canvas : THEME.primary}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <View style={styles.instructionRow}>
          <View style={styles.instructionItem}>
            <View style={[styles.instrDot, { width: 8, height: 8, borderRadius: 4 }]} />
            <Text style={styles.instructionText}>Short tap</Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={[styles.instrDash]} />
            <Text style={styles.instructionText}>Long press</Text>
          </View>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleDelete} activeOpacity={0.6}>
            <MaterialCommunityIcons name="backspace-outline" size={16} color={THEME.body} />
            <Text style={styles.ctrlBtnText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn} onPress={handleSpace} activeOpacity={0.6}>
            <MaterialCommunityIcons name="arrow-right-bold" size={16} color={THEME.body} />
            <Text style={styles.ctrlBtnText}>Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, styles.clearBtn]} onPress={handleClear} activeOpacity={0.6}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={THEME.negative} />
            <Text style={[styles.ctrlBtnText, { color: THEME.negative }]}>Clear</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: THEME.canvas,
    borderBottomWidth: 1,
    borderBottomColor: THEME.canvasWarm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 10,
  },
  headerEyebrow: {
    color: THEME.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerStatus: {
    color: THEME.body,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  clearHeaderBtn: {
    padding: 8,
    opacity: 0.7,
  },
  messageCard: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  messageLabel: {
    color: THEME.mute,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  morseHistory: {
    color: THEME.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    letterSpacing: 5,
    marginBottom: 6,
  },
  decodedText: {
    color: THEME.ink,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  treeSection: {
    height: 150,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  treeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    paddingLeft: 4,
  },
  treeLabelText: {
    color: THEME.mute,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: THEME.canvasSoft,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: THEME.canvasWarm,
  },
  hintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  pathDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pathSymbolWrap: {
    backgroundColor: THEME.canvas,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  pathSymbol: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  pathPlaceholder: {
    color: THEME.mute,
    fontSize: 12,
    fontWeight: '600',
  },
  guessBadge: {
    backgroundColor: THEME.primaryPale,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: THEME.primary,
  },
  guessText: {
    color: THEME.primary,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  keyOuterGlow: {
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 9999,
  },
  keyOuterRing: {
    borderRadius: 9999,
    padding: 4,
  },
  keyButton: {
    width: 88,
    height: 88,
    borderRadius: 9999,
    backgroundColor: THEME.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  keyButtonPressed: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primaryActive,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  keyInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
    marginBottom: 14,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instrDot: {
    backgroundColor: THEME.body,
  },
  instrDash: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: THEME.body,
  },
  instructionText: {
    color: THEME.body,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  ctrlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    backgroundColor: THEME.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  clearBtn: {
    borderColor: THEME.negativeBg,
    backgroundColor: THEME.negativeBg,
  },
  ctrlBtnText: {
    color: THEME.body,
    fontSize: 12,
    fontWeight: '700',
  },
});