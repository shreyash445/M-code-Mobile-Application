import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.header, { backgroundColor: theme.canvas, borderBottomColor: theme.canvasWarm }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.ink} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.ink }]}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>Profile</Text>
          <View style={[styles.card, { backgroundColor: theme.canvasSoft, borderColor: theme.canvasWarm }]}>
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: theme.canvas, borderColor: theme.canvasWarm }]}>
                <MaterialCommunityIcons name="account" size={28} color={theme.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.ink }]}>Guest User</Text>
                <Text style={[styles.profileEmail, { color: theme.mute }]}>Sign in to sync progress</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.mute} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: theme.canvasSoft, borderColor: theme.canvasWarm }]}>
            <View style={styles.themeRow}>
              <View style={styles.themeLeft}>
                <MaterialCommunityIcons name={isDark ? 'weather-night' : 'weather-sunny'} size={20} color={theme.primary} />
                <Text style={[styles.themeLabel, { color: theme.ink }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
              </View>
              <Switch
                value={!isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.canvasWarm, true: theme.primary }}
                thumbColor={isDark ? theme.mute : theme.canvas}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>About</Text>
          <View style={[styles.card, { backgroundColor: theme.canvasSoft, borderColor: theme.canvasWarm }]}>
            <View style={styles.aboutSection}>
              <MaterialCommunityIcons name="radio-tower" size={24} color={theme.primary} />
              <Text style={[styles.aboutAppName, { color: theme.ink }]}>M-Code</Text>
              <Text style={[styles.aboutTagline, { color: theme.body }]}>Master Morse Code</Text>
              <Text style={[styles.aboutDesc, { color: theme.body }]}>
                M-Code is a complete Morse code learning and communication app. Encode text into Morse signals, 
                decode incoming Morse with the telegraph key, explore the full reference chart, and master 
                the art of telegraphy — all from your mobile device.
              </Text>
            </View>
            <View style={[styles.themeDivider, { backgroundColor: theme.canvasWarm }]} />
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutKey, { color: theme.body }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: theme.ink }]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  themeDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  aboutSection: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  aboutAppName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  aboutTagline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  aboutDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutKey: {
    fontSize: 14,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
