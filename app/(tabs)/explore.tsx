import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MORSE_CODE, LETTERS_ONLY, NUMBERS_ONLY, SYMBOLS_ONLY } from '../../constants/MorseData';
import { useTheme } from '../../contexts/ThemeContext';

export default function ReferenceScreen() {
  const { theme } = useTheme();
  const sections = [
    { title: 'Alphabet', subtitle: 'A \u2013 Z', icon: 'alpha-a-box', data: LETTERS_ONLY.map(char => ({ char, code: MORSE_CODE[char] })) },
    { title: 'Numbers', subtitle: '0 \u2013 9', icon: 'numeric-1-box', data: NUMBERS_ONLY.map(char => ({ char, code: MORSE_CODE[char] })) },
    { title: 'Symbols', subtitle: 'Punctuation', icon: 'code-tags', data: SYMBOLS_ONLY.map(char => ({ char, code: MORSE_CODE[char] })) },
  ];

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    hero: {
      marginBottom: 20,
      paddingHorizontal: 20,
      paddingTop: 16,
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
    scrollContent: {
      padding: 20,
      paddingBottom: 48,
    },
    section: {
      marginBottom: 28,
    },
    sectionHead: {
      marginBottom: 14,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.3,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    sectionSubtitle: {
      color: theme.body,
      fontSize: 12,
      marginTop: 2,
      marginLeft: 24,
      fontWeight: '500',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    card: {
      width: '48%',
      backgroundColor: theme.canvasSoft,
      borderRadius: 14,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
    },
    char: {
      color: theme.ink,
      fontSize: 22,
      fontWeight: '700',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      minWidth: 28,
      textAlign: 'center',
    },
    divider: {
      width: 1,
      height: 28,
      backgroundColor: theme.canvasWarm,
    },
    code: {
      color: theme.primary,
      fontSize: 15,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      letterSpacing: 2.5,
      fontWeight: '600',
      flex: 1,
    },
    footerNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 16,
      paddingHorizontal: 4,
    },
    footerText: {
      color: theme.mute,
      fontSize: 12,
      fontWeight: '500',
      flex: 1,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Morse Code</Text>
        <Text style={styles.heroTitle}>Reference</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons name={section.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={16} color={theme.primary} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            </View>
            <View style={styles.grid}>
              {section.data.map((item) => (
                <View key={item.char} style={styles.card}>
                  <Text style={styles.char}>{item.char}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.code}>{item.code}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.footerNote}>
          <MaterialCommunityIcons name="information-outline" size={14} color={theme.mute} />
          <Text style={styles.footerText}>
            Dots and dashes separated by spaces. Words separated by /.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
