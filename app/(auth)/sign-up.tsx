import { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

const SOCIALS = (primary: string) => [
  { provider: 'Google', icon: 'google' as const, color: '#4285F4' },
  { provider: 'GitHub', icon: 'github' as const, color: '#888' },
  { provider: 'Apple', icon: 'apple' as const, color: '#aaa' },
  { provider: 'Phone', icon: 'cellphone' as const, color: primary },
];

export default function SignUpScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    router.replace('/(tabs)');
  };

  const styles = useMemo(() => StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    container: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    backBtn: {
      padding: 16,
      paddingTop: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 28,
      justifyContent: 'space-between',
      paddingBottom: 24,
    },
    headerSection: {
      marginBottom: 24,
    },
    eyebrow: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2.5,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    title: {
      color: theme.ink,
      fontSize: 36,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 38,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: 4,
    },
    subtitle: {
      color: theme.body,
      fontSize: 14,
      fontWeight: '500',
    },
    form: {
      gap: 16,
    },
    inputGroup: {
      gap: 6,
    },
    inputLabel: {
      color: theme.ink,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: theme.canvasSoft,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    input: {
      flex: 1,
      color: theme.ink,
      fontSize: 15,
    },
    submitBtn: {
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    submitText: {
      color: theme.canvas,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.canvasWarm,
    },
    dividerText: {
      color: theme.mute,
      fontSize: 11,
      fontWeight: '600',
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    socialBtn: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.canvasSoft,
      borderWidth: 1,
      borderColor: theme.canvasWarm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 4,
      paddingTop: 16,
      paddingBottom: 8,
    },
    footerText: {
      color: theme.body,
      fontSize: 13,
      fontWeight: '500',
    },
    footerLink: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
  }), [theme]);

  const socials = SOCIALS(theme.primary);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.6}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.ink} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.eyebrow}>Get started</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the world of Morse code</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="account-outline" size={18} color={theme.mute} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={theme.mute}
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="email-outline" size={18} color={theme.mute} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.mute}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="lock-outline" size={18} color={theme.mute} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor={theme.mute}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.mute}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp} activeOpacity={0.8}>
              <Text style={styles.submitText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              {socials.map(s => (
                <TouchableOpacity key={s.provider} style={styles.socialBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
                  <MaterialCommunityIcons name={s.icon} size={22} color={s.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')} activeOpacity={0.6}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
