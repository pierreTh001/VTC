import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PassengerStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { VEHICLE_CATEGORIES, DISPOSITION_DURATIONS } from '../../stub/data';
import { mockBookRide } from '../../stub/mockApi';

type Props = { navigation: NativeStackNavigationProp<PassengerStackParamList, 'Disposition'> };

export const DispositionScreen: React.FC<Props> = ({ navigation }) => {
  const [pickup, setPickup] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [booking, setBooking] = useState(false);

  const duration = DISPOSITION_DURATIONS[selectedDuration];
  const category = VEHICLE_CATEGORIES[selectedCategory];
  const hourlyRate = 55; // € / heure (stub)
  const basePrice = hourlyRate * duration.hours * (1 - duration.discount);

  const handleBook = async () => {
    if (!pickup) {
      Alert.alert('Erreur', 'Veuillez saisir un lieu de prise en charge');
      return;
    }
    setBooking(true);
    try {
      const ride = await mockBookRide({
        pickup,
        category: category.category,
        type: 'disposition',
        dispositionDuration: duration.hours,
      });
      navigation.replace('Tracking', { rideId: ride.id });
    } finally {
      setBooking(false);
    }
  };

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🕐 Mise à disposition</Text>
        <Text style={styles.subtitle}>
          Réservez un chauffeur pour une durée déterminée. Il reste disponible pour plusieurs trajets successifs.
        </Text>

        {/* Pickup */}
        <Text style={styles.label}>Lieu de prise en charge</Text>
        <TextInput
          style={styles.input}
          value={pickup}
          onChangeText={setPickup}
          placeholder="Ex: 8 Rue du Faubourg Saint-Honoré, Paris"
          placeholderTextColor={colors.gray}
        />

        {/* Start time */}
        <Text style={styles.label}>Heure de début</Text>
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="09:00"
          placeholderTextColor={colors.gray}
        />

        {/* Duration */}
        <Text style={styles.label}>Durée de la mise à disposition</Text>
        <View style={styles.durationGrid}>
          {DISPOSITION_DURATIONS.map((d, i) => (
            <TouchableOpacity
              key={d.label}
              style={[styles.durationChip, selectedDuration === i && styles.durationChipSelected]}
              onPress={() => setSelectedDuration(i)}
            >
              <Text style={[styles.durationLabel, selectedDuration === i && styles.durationLabelSelected]}>
                {d.label}
              </Text>
              {d.discount > 0 && (
                <Text style={styles.discount}>-{(d.discount * 100).toFixed(0)}%</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Vehicle category */}
        <Text style={styles.label}>Catégorie de véhicule</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {VEHICLE_CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat.category}
              style={[styles.catChip, selectedCategory === i && styles.catChipSelected]}
              onPress={() => setSelectedCategory(i)}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catName, selectedCategory === i && styles.catNameSelected]}>
                {cat.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price summary */}
        <Card style={styles.priceCard} elevated>
          <Text style={styles.priceSummaryTitle}>Récapitulatif</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Durée</Text>
            <Text style={styles.priceRowValue}>{duration.label}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Catégorie</Text>
            <Text style={styles.priceRowValue}>{category.category}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Tarif horaire</Text>
            <Text style={styles.priceRowValue}>{hourlyRate} €/h</Text>
          </View>
          {duration.discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceRowLabel, { color: colors.success }]}>Réduction</Text>
              <Text style={[styles.priceRowValue, { color: colors.success }]}>
                -{(duration.discount * 100).toFixed(0)}%
              </Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.priceTotalRow]}>
            <Text style={styles.priceTotalLabel}>Total estimé</Text>
            <Text style={styles.priceTotalAmount}>{basePrice.toFixed(2)} €</Text>
          </View>
          <Text style={styles.priceNote}>
            * Le montant peut varier en cas de prolongation de durée (accord chauffeur requis)
          </Text>
        </Card>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Comment ça marche ?</Text>
          <Text style={styles.infoText}>
            • Le chauffeur reste à votre disposition pendant toute la durée réservée{'\n'}
            • Plusieurs trajets successifs inclus{'\n'}
            • Extension possible en cours de prestation (accord chauffeur requis){'\n'}
            • Fin déclenchée par vous ou à l'échéance automatiquement
          </Text>
        </View>

        <Button
          title="Réserver la mise à disposition"
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
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { color: colors.accent, fontSize: fontSizes.md },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 20 },
  label: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  durationChip: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
  },
  durationChipSelected: { borderColor: colors.accent, backgroundColor: '#FFF5F5' },
  durationLabel: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  durationLabelSelected: { color: colors.accent },
  discount: { fontSize: fontSizes.xs, color: colors.success, fontWeight: '700' },
  catChip: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
    minWidth: 80,
  },
  catChipSelected: { borderColor: colors.accent, backgroundColor: '#FFF5F5' },
  catEmoji: { fontSize: 28 },
  catName: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.text, marginTop: 4 },
  catNameSelected: { color: colors.accent },
  priceCard: { marginTop: spacing.lg },
  priceSummaryTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  priceRowLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  priceRowValue: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  priceTotalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs },
  priceTotalLabel: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  priceTotalAmount: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.accent },
  priceNote: { fontSize: fontSizes.xs, color: colors.gray, marginTop: spacing.sm, fontStyle: 'italic' },
  infoBox: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg },
  infoTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: '#1565C0', marginBottom: spacing.xs },
  infoText: { fontSize: fontSizes.sm, color: '#1565C0', lineHeight: 20 },
  bookBtn: { marginTop: spacing.lg },
});
