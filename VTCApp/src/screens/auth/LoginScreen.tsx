import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  route: RouteProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role } = route.params;
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      await login(email, password, role);
    } catch {
      Alert.alert('Erreur', 'Identifiants incorrects');
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
            {role === 'passenger' ? '👤 Connexion Passager' : '🚗 Connexion Chauffeur'}
          </Text>
          <Text style={styles.subtitle}>Bienvenue sur VTC Premium</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.gray}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            placeholderTextColor={colors.gray}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            fullWidth
            style={styles.loginBtn}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialBtns}>
          <Button title="Continuer avec Google" onPress={() => {}} variant="outline" fullWidth style={styles.socialBtn} />
          {Platform.OS === 'ios' && (
            <Button title="Continuer avec Apple" onPress={() => {}} variant="outline" fullWidth style={styles.socialBtn} />
          )}
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
            <Text style={styles.registerLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stubHint}>
          <Text style={styles.stubHintText}>
            💡 Stub : entrez n'importe quel email/mot de passe
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
  subtitle: { fontSize: fontSizes.md, color: colors.textSecondary, marginTop: spacing.xs },
  form: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.accent, fontSize: fontSizes.sm },
  loginBtn: { marginTop: spacing.xs },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.gray, paddingHorizontal: spacing.md, fontSize: fontSizes.sm },
  socialBtns: { gap: spacing.sm },
  socialBtn: { marginBottom: spacing.xs },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  registerText: { color: colors.textSecondary, fontSize: fontSizes.md },
  registerLink: { color: colors.accent, fontWeight: '700', fontSize: fontSizes.md },
  stubHint: { backgroundColor: '#FFF3CD', borderRadius: borderRadius.md, padding: spacing.sm, marginTop: spacing.xl },
  stubHintText: { color: '#856404', fontSize: fontSizes.sm, textAlign: 'center' },
});
