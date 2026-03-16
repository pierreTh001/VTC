import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PassengerStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { mockBookRide } from '../../stub/mockApi';

type Props = { navigation: NativeStackNavigationProp<PassengerStackParamList, 'BookForOther'> };

export const BookForOtherScreen: React.FC<Props> = ({ navigation }) => {
  const [beneficiary, setBeneficiary] = useState({ name: '', phone: '' });
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!beneficiary.name || !beneficiary.phone || !pickup || !dropoff) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setBooking(true);
    try {
      const ride = await mockBookRide({
        pickup,
        dropoff,
        type: 'classic',
        forThirdParty: { name: beneficiary.name, phone: beneficiary.phone },
      });
      navigation.replace('Tracking', { rideId: ride.id });
    } finally {
      setBooking(false);
    }
  };

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>👤 Commander pour autrui</Text>
        <Text style={styles.subtitle}>
          Commandez un VTC pour une autre personne. Elle n'a pas besoin d'avoir l'application.
        </Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Informations du bénéficiaire</Text>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            value={beneficiary.name}
            onChangeText={(v) => setBeneficiary((b) => ({ ...b, name: v }))}
            placeholder="Prénom Nom"
            placeholderTextColor={colors.gray}
          />
          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            value={beneficiary.phone}
            onChangeText={(v) => setBeneficiary((b) => ({ ...b, phone: v }))}
            placeholder="+33 6 XX XX XX XX"
            keyboardType="phone-pad"
            placeholderTextColor={colors.gray}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Trajet</Text>
          <Text style={styles.label}>Adresse de départ</Text>
          <TextInput
            style={styles.input}
            value={pickup}
            onChangeText={setPickup}
            placeholder="Ex: 15 Rue de Rivoli, Paris"
            placeholderTextColor={colors.gray}
          />
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            value={dropoff}
            onChangeText={setDropoff}
            placeholder="Ex: Aéroport CDG Terminal 2E"
            placeholderTextColor={colors.gray}
          />
        </Card>

        <View style={styles.smsInfo}>
          <Text style={styles.smsInfoTitle}>📱 SMS automatique au bénéficiaire</Text>
          <Text style={styles.smsInfoText}>
            Une fois le chauffeur assigné, {beneficiary.name || 'le bénéficiaire'} recevra automatiquement un SMS avec :{'\n'}
            • Nom et photo du chauffeur{'\n'}
            • Immatriculation du véhicule{'\n'}
            • Heure d'arrivée estimée{'\n'}
            • Lien de suivi en temps réel (sans installation d'app)
          </Text>
        </View>

        <View style={styles.paymentNote}>
          <Text style={styles.paymentNoteText}>
            💳 Le paiement est effectué par vous (le commanditaire). Vous recevrez toutes les notifications habituelles.
          </Text>
        </View>

        <Button
          title="Commander pour autrui"
          onPress={handleBook}
          loading={booking}
          size="lg"
          fullWidth
          style={styles.bookBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { color: colors.accent, fontSize: fontSizes.md },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 20 },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  label: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smsInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  smsInfoTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: '#2E7D32', marginBottom: spacing.xs },
  smsInfoText: { fontSize: fontSizes.sm, color: '#2E7D32', lineHeight: 22 },
  paymentNote: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg },
  paymentNoteText: { fontSize: fontSizes.sm, color: '#1565C0' },
  bookBtn: {},
});
