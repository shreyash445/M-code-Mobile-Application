import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MORSE_CODE, REVERSE_MORSE_CODE } from '../../constants/MorseData';
import { useTheme } from '../../contexts/ThemeContext';
import SignalLamp from '../../components/SignalLamp';
import { useMorsePlayer } from '../../hooks/useMorsePlayer';

type Mode = 'encode' | 'decode';

export default function EncoderScreen() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<Mode>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { isPlaying, isActive, currentIndex, playSequence, stopSequence } = useMorsePlayer();

  useEffect(() => {
    if (mode === 'encode') {
      const encoded = inputText
        .toUpperCase()
        .split('')
        .map((char) => MORSE_CODE[char] || '')
        .join(' ');
      setOutputText(encoded);
    } else {
      const decoded = inputText
        .trim()
        .split(/\s+/)
        .map((code) => REVERSE_MORSE_CODE[code] || '')
        .join('');
      setOutputText(decoded);
    }
  }, [inputText, mode]);

  const togglePlayback = () => {
    if (isPlaying) {
      stopSequence();
    } else {
      const morseToPlay = mode === 'encode' ? outputText : inputText;
      playSequence(morseToPlay);
    }
  };

  const morseForDisplay = mode === 'encode' ? outputText : inputText;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 48,
    },
    hero: {
      marginBottom: 24,
    },
    heroEyebrow: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2.5,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    heroTitle: {
      color: theme.ink,
      fontSize: 36,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 38,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    modeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.canvasSoft,
      borderRadius: 14,
      padding: 3,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    modeBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 11,
      borderRadius: 11,
    },
    modeBtnActive: {
      backgroundColor: theme.primary,
    },
    modeBtnText: {
      color: theme.mute,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    modeBtnTextActive: {
      color: theme.canvas,
    },
    lampCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.canvasSoft,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    statusBlock: {
      marginLeft: 14,
      flex: 1,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusLabel: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    pulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    statusSub: {
      color: theme.body,
      fontSize: 12,
      marginTop: 3,
      fontWeight: '500',
    },
    inputCard: {
      backgroundColor: theme.canvasSoft,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    inputLabel: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    textInput: {
      backgroundColor: theme.canvas,
      color: theme.ink,
      padding: 16,
      borderRadius: 12,
      fontSize: 15,
      minHeight: 88,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    morseInput: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontSize: 17,
      letterSpacing: 4,
    },
    outputCard: {
      backgroundColor: theme.canvasSoft,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    outputHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    liveBadge: {
      backgroundColor: theme.negative,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    liveBadgeText: {
      color: theme.canvas,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1,
    },
    outputScroll: {
      minHeight: 80,
    },
    outputScrollContent: {
      alignItems: 'center',
      paddingVertical: 4,
    },
    outputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    outputCharWrap: {
      marginHorizontal: 1,
    },
    outputCharBg: {
      paddingHorizontal: 4,
      paddingVertical: 6,
      borderRadius: 6,
    },
    activeOutputCharBg: {
      backgroundColor: theme.primaryGlow,
    },
    placeholderText: {
      color: theme.mute,
      fontSize: 15,
      fontWeight: '500',
    },
    outputChar: {
      color: theme.body,
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 1,
    },
    morseOutputChar: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: theme.primary,
    },
    activeOutputChar: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 24,
    },
    dimmedChar: {
      opacity: 0.3,
    },
    playButton: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 10,
    },
    stopButton: {
      backgroundColor: theme.negative,
    },
    playButtonText: {
      color: theme.canvas,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    playButtonTextStop: {
      color: theme.canvas,
    },
  }), [theme]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Morse Translator</Text>
          <Text style={styles.heroTitle}>
            {mode === 'encode' ? 'Text → Signal' : 'Signal → Text'}
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'encode' && styles.modeBtnActive]}
            onPress={() => setMode('encode')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="alpha-t-box-outline"
              size={16}
              color={mode === 'encode' ? theme.canvas : theme.mute}
            />
            <Text style={[styles.modeBtnText, mode === 'encode' && styles.modeBtnTextActive]}>
              Encode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'decode' && styles.modeBtnActive]}
            onPress={() => setMode('decode')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="code-braces"
              size={16}
              color={mode === 'decode' ? theme.canvas : theme.mute}
            />
            <Text style={[styles.modeBtnText, mode === 'decode' && styles.modeBtnTextActive]}>
              Decode
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lampCard}>
          <SignalLamp active={isActive} size={48} />
          <View style={styles.statusBlock}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>
                {isPlaying ? 'Transmitting' : 'Ready'}
              </Text>
              {isPlaying && <View style={styles.pulseDot} />}
            </View>
            <Text style={styles.statusSub}>
              {isPlaying ? 'Signal in progress' : 'Compose a message below'}
            </Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>
            {mode === 'encode' ? 'Plain Text' : 'Morse Code'}
          </Text>
          <TextInput
            style={[styles.textInput, mode === 'decode' && styles.morseInput]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={mode === 'encode' ? 'Enter your message...' : '.- -... -.-. -..'}
            placeholderTextColor={theme.mute}
            multiline
          />
        </View>

        <View style={styles.outputCard}>
          <View style={styles.outputHeader}>
            <Text style={styles.inputLabel}>
              {mode === 'encode' ? 'Morse Output' : 'Text Output'}
            </Text>
            {isPlaying && <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>LIVE</Text></View>}
          </View>
          <ScrollView
            horizontal
            style={styles.outputScroll}
            contentContainerStyle={styles.outputScrollContent}
            showsHorizontalScrollIndicator={false}
          >
            {!outputText ? (
              <Text style={styles.placeholderText}>
                {mode === 'encode' ? 'Morse signal appears here' : 'Decoded message appears here'}
              </Text>
            ) : (
              <View style={styles.outputRow}>
                {(mode === 'encode' ? outputText : outputText).split('').map((char, i) => (
                  <View key={i} style={styles.outputCharWrap}>
                    <View style={[styles.outputCharBg, currentIndex === i && styles.activeOutputCharBg]}>
                      <Text
                        style={[
                          styles.outputChar,
                          mode === 'encode' && styles.morseOutputChar,
                          currentIndex === i && styles.activeOutputChar,
                          currentIndex !== -1 && currentIndex !== i && styles.dimmedChar,
                        ]}
                      >
                        {char === ' ' ? '\u00B7' : char}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.stopButton]}
          onPress={togglePlayback}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'stop-circle' : 'play-circle'}
            size={20}
            color={isPlaying ? theme.canvas : theme.canvas}
          />
          <Text style={[styles.playButtonText, isPlaying && styles.playButtonTextStop]}>
            {isPlaying ? 'Stop' : 'Transmit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
