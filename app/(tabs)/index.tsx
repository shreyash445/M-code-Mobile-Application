import { useState, useEffect } from 'react';
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
import { MORSE_CODE, REVERSE_MORSE_CODE, THEME } from '../../constants/MorseData';
import SignalLamp from '../../components/SignalLamp';
import { useMorsePlayer } from '../../hooks/useMorsePlayer';

type Mode = 'encode' | 'decode';

export default function EncoderScreen() {
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
              color={mode === 'encode' ? THEME.canvas : THEME.mute}
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
              color={mode === 'decode' ? THEME.canvas : THEME.mute}
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
            placeholderTextColor={THEME.mute}
            multiline
          />
        </View>

        <View style={styles.outputCard}>
          <Text style={styles.inputLabel}>
            {mode === 'encode' ? 'Morse Output' : 'Text Output'}
          </Text>
          <View style={styles.outputBox}>
            <Text
              style={[
                styles.outputText,
                mode === 'encode' && styles.morseOutput,
                !outputText && styles.placeholderText,
              ]}
            >
              {outputText || (mode === 'encode' ? 'Morse signal appears here' : 'Decoded message appears here')}
            </Text>
          </View>
        </View>

        <View style={styles.visualizerCard}>
          <View style={styles.visualizerLabel}>
            <MaterialCommunityIcons name="waveform" size={14} color={THEME.mute} />
            <Text style={styles.visualizerLabelText}>Signal View</Text>
          </View>
          <ScrollView horizontal contentContainerStyle={styles.morseDisplay} showsHorizontalScrollIndicator={false}>
            {morseForDisplay === '' ? (
              <Text style={styles.visualizerPlaceholder}>—</Text>
            ) : (
              morseForDisplay.split('').map((char, i) => (
                <View key={i} style={styles.morseCharWrap}>
                  <View style={[styles.morseCharBg, currentIndex === i && styles.activeMorseCharBg]}>
                    <Text
                      style={[
                        styles.morseChar,
                        currentIndex === i && styles.activeMorseChar,
                        currentIndex !== -1 && currentIndex !== i && styles.dimmedChar,
                      ]}
                    >
                      {char === ' ' ? '\u00B7' : char}
                    </Text>
                  </View>
                </View>
              ))
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
            color={isPlaying ? THEME.canvas : THEME.canvas}
          />
          <Text style={[styles.playButtonText, isPlaying && styles.playButtonTextStop]}>
            {isPlaying ? 'Stop' : 'Transmit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.canvas,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  hero: {
    marginBottom: 24,
  },
  heroEyebrow: {
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    color: THEME.ink,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.canvasSoft,
    borderRadius: 14,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
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
    backgroundColor: THEME.primary,
  },
  modeBtnText: {
    color: THEME.mute,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modeBtnTextActive: {
    color: THEME.canvas,
  },
  lampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
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
    color: THEME.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.primary,
  },
  statusSub: {
    color: THEME.body,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  inputLabel: {
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: THEME.canvas,
    color: THEME.ink,
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 88,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  morseInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 17,
    letterSpacing: 4,
  },
  outputCard: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  outputBox: {
    minHeight: 88,
    justifyContent: 'center',
    backgroundColor: THEME.canvas,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
  },
  outputText: {
    fontSize: 15,
    lineHeight: 24,
    color: THEME.ink,
  },
  morseOutput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 17,
    letterSpacing: 4,
    color: THEME.primary,
  },
  placeholderText: {
    color: THEME.mute,
  },
  visualizerCard: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
    padding: 14,
  },
  visualizerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  visualizerLabelText: {
    color: THEME.mute,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  morseDisplay: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  morseCharWrap: {
    marginHorizontal: 1,
  },
  morseCharBg: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeMorseCharBg: {
    backgroundColor: THEME.primaryGlow,
  },
  visualizerPlaceholder: {
    color: THEME.mute,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
  },
  morseChar: {
    color: THEME.body,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  activeMorseChar: {
    color: THEME.primary,
    fontWeight: '700',
    fontSize: 24,
  },
  dimmedChar: {
    opacity: 0.3,
  },
  playButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  stopButton: {
    backgroundColor: THEME.negative,
  },
  playButtonText: {
    color: THEME.canvas,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playButtonTextStop: {
    color: THEME.canvas,
  },
});