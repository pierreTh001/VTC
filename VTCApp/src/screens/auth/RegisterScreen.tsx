import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { mockRegister } from '../../stub/mockApi';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  route: RouteProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (form.password !== form.confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await mockRegister(form);
      navigation.navigate('OTP', { phone: form.phone, role });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>
            {role === 'passenger' ? '👤 Inscription Passager' : '🚗 Inscription Chauffeur'}
          </Text>
          {role === 'driver' && (
            <View style={styles.driverNote}>
              <Text style={styles.driverNoteText}>
                📋 Votre compte sera vérifié par notre équipe avant activation.{'\n'}
                Documents requis : carte VTC, carte grise, assurance RC Pro, permis B.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          {([
            { key: 'name', label: 'Nom complet', placeholder: 'Jean Dupont', keyboard: 'default', secure: false },
            { key: 'email', label: 'Email', placeholder: 'jean@email.com', keyboard: 'email-address', secure: false },
            { key: 'phone', label: 'Téléphone', placeholder: '+33 6 XX XX XX XX', keyboard: 'phone-pad', secure: false },
            { key: 'password', label: 'Mot de passe', placeholder: '••••••••', keyboard: 'default', secure: true },
            { key: 'confirm', label: 'Confirmer le mot de passe', placeholder: '••••••••', keyboard: 'default', secure: true },
          ] as const).map(({ key, label, placeholder, keyboard, secure }) => (
            <View key={key}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={form[key as keyof typeof form]}
                onChangeText={set(key as keyof typeof form)}
                placeholder={placeholder}
                keyboardType={keyboard as any}
                autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
                secureTextEntry={secure}
                placeholderTextColor={colors.gray}
              />
            </View>
          ))}

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            fullWidth
            style={styles.btn}
          />
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions Générales d'Utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.termsLink}>Politique de Confidentialité (RGPD)</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.accent, fontSize: fontSizes.md },
  header: { marginBottom: spacing.xl },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
  driverNote: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.md },
  driverNoteText: { fontSize: fontSizes.sm, color: '#1565C0', lineHeight: 20 },
  form: { gap: spacing.xs },
  label: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  btn: { marginTop: spacing.lg },
  terms: { marginTop: spacing.lg },
  termsText: { fontSize: fontSizes.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  termsLink: { color: colors.accent, fontWeight: '600' },
});
