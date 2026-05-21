import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '../constants/MorseData';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account" size={28} color={THEME.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>Sign in to sync progress</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.mute} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Appearance</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.themeRow} activeOpacity={0.7}>
              <View style={styles.themeLeft}>
                <MaterialCommunityIcons name="weather-night" size={20} color={THEME.primary} />
                <Text style={styles.themeLabel}>Dark Mode</Text>
              </View>
              <View style={styles.radioOuter}>
                <View style={[styles.radioInner, { backgroundColor: THEME.primary }]} />
              </View>
            </TouchableOpacity>
            <View style={styles.themeDivider} />
            <TouchableOpacity style={styles.themeRow} activeOpacity={0.7}>
              <View style={styles.themeLeft}>
                <MaterialCommunityIcons name="weather-sunny" size={20} color={THEME.mute} />
                <Text style={[styles.themeLabel, { color: THEME.mute }]}>Light Mode</Text>
              </View>
              <View style={styles.radioOuter}>
                <View style={styles.radioInnerEmpty} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutKey}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.themeDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutKey}>Made with</Text>
              <Text style={styles.aboutValue}>Expo + React Native</Text>
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
    backgroundColor: THEME.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 12,
    backgroundColor: THEME.canvas,
    borderBottomWidth: 1,
    borderBottomColor: THEME.canvasWarm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: THEME.ink,
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
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: THEME.canvasSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
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
    backgroundColor: THEME.canvas,
    borderWidth: 2,
    borderColor: THEME.canvasWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: THEME.ink,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    color: THEME.mute,
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
    color: THEME.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioInnerEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  themeDivider: {
    height: 1,
    backgroundColor: THEME.canvasWarm,
    marginHorizontal: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutKey: {
    color: THEME.body,
    fontSize: 14,
    fontWeight: '500',
  },
  aboutValue: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '600',
  },
});
