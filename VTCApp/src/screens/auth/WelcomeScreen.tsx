import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, spacing, fontSizes } from '../../theme';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'> };

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <View style={styles.hero}>
      <Text style={styles.logo}>🚗</Text>
      <Text style={styles.title}>VTC Premium</Text>
      <Text style={styles.subtitle}>
        Votre chauffeur privé,{'\n'}où que vous soyez en France
      </Text>
    </View>

    <View style={styles.features}>
      {[
        { icon: '⭐', text: 'Choisissez votre chauffeur favori' },
        { icon: '🕐', text: 'Mise à disposition à l\'heure' },
        { icon: '👤', text: 'Commandez pour une tierce personne' },
        { icon: '🔒', text: 'Paiement 100% sécurisé via Stripe' },
      ].map((f) => (
        <View key={f.text} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureText}>{f.text}</Text>
        </View>
      ))}
    </View>

    <View style={styles.actions}>
      <Button
        title="Je suis passager"
        onPress={() => navigation.navigate('Login', { role: 'passenger' })}
        variant="primary"
        size="lg"
        fullWidth
        style={styles.btn}
      />
      <Button
        title="Je suis chauffeur"
        onPress={() => navigation.navigate('Login', { role: 'driver' })}
        variant="secondary"
        size="lg"
        fullWidth
        style={styles.btn}
      />
      <Button
        title="Créer un compte"
        onPress={() => navigation.navigate('Register', { role: 'passenger' })}
        variant="ghost"
        size="md"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 72, marginBottom: spacing.md },
  title: { fontSize: fontSizes.hero, fontWeight: '800', color: colors.white, letterSpacing: 1 },
  subtitle: { fontSize: fontSizes.lg, color: colors.gray, textAlign: 'center', marginTop: spacing.sm, lineHeight: 24 },
  features: { marginBottom: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xs },
  featureIcon: { fontSize: 20, marginRight: spacing.md, width: 32 },
  featureText: { fontSize: fontSizes.md, color: colors.white, flex: 1 },
  actions: { gap: spacing.md, alignItems: 'center' },
  btn: { marginBottom: spacing.xs },
});
