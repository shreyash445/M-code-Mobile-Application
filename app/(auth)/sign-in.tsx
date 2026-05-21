import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { THEME } from '../../constants/MorseData';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.6}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={THEME.ink} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Continue your Morse journey</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="email-outline" size={18} color={THEME.mute} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={THEME.mute}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="lock-outline" size={18} color={THEME.mute} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={THEME.mute}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={THEME.mute}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.6}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn} activeOpacity={0.8}>
            <Text style={styles.submitText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don\u2019t have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')} activeOpacity={0.6}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.canvas,
  },
  backBtn: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  headerSection: {
    marginBottom: 40,
  },
  eyebrow: {
    color: THEME.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: THEME.ink,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subtitle: {
    color: THEME.body,
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    flex: 1,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: THEME.ink,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.canvasSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.canvasWarm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: THEME.ink,
    fontSize: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: THEME.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitText: {
    color: THEME.canvas,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 20,
  },
  footerText: {
    color: THEME.body,
    fontSize: 13,
    fontWeight: '500',
  },
  footerLink: {
    color: THEME.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
