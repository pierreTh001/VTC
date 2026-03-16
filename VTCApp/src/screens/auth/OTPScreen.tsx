import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { mockVerifyOTP } from '../../stub/mockApi';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'OTP'>;
  route: RouteProp<AuthStackParamList, 'OTP'>;
};

export const OTPScreen: React.FC<Props> = ({ route }) => {
  const { phone, role } = route.params;
  const { login } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (val: string, idx: number) => {
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleVerify = async () => {
    const full = code.join('');
    if (full.length < 6) {
      Alert.alert('Erreur', 'Saisissez le code à 6 chiffres');
      return;
    }
    setLoading(true);
    try {
      await mockVerifyOTP(full);
      await login('stub@vtc.fr', 'stub', role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>Vérification</Text>
      <Text style={styles.subtitle}>
        Un code à 6 chiffres a été envoyé par SMS au{'\n'}
        <Text style={styles.phone}>{phone}</Text>
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
            value={digit}
            onChangeText={(v) => handleChange(v.slice(-1), i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <Button
        title="Vérifier le code"
        onPress={handleVerify}
        loading={loading}
        size="lg"
        fullWidth
        style={styles.btn}
      />

      <TouchableOpacity disabled={countdown > 0} style={styles.resendBtn}>
        <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
          {countdown > 0 ? `Renvoyer le code dans ${countdown}s` : 'Renvoyer le code'}
        </Text>
      </TouchableOpacity>

      <View style={styles.stubHint}>
        <Text style={styles.stubHintText}>💡 Stub : entrez n'importe quel code à 6 chiffres</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
    paddingTop: 80,
  },
  emoji: { fontSize: 64, marginBottom: spacing.lg },
  title: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSizes.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  phone: { fontWeight: '700', color: colors.text },
  codeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.white,
  },
  codeInputFilled: { borderColor: colors.accent, backgroundColor: '#FFF5F5' },
  btn: { width: '100%' },
  resendBtn: { marginTop: spacing.lg },
  resendText: { color: colors.accent, fontSize: fontSizes.md, fontWeight: '600' },
  resendDisabled: { color: colors.gray },
  stubHint: { backgroundColor: '#FFF3CD', borderRadius: borderRadius.md, padding: spacing.sm, marginTop: spacing.xl, width: '100%' },
  stubHintText: { color: '#856404', fontSize: fontSizes.sm, textAlign: 'center' },
});
