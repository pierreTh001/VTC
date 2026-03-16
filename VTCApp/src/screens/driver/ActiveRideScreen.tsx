import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { DriverStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../../theme';
import { STUB_INCOMING_RIDE } from '../../stub/data';
import { mockUpdateRideStatus } from '../../stub/mockApi';

type Props = {
  navigation: NativeStackNavigationProp<DriverStackParamList, 'ActiveRide'>;
  route: RouteProp<DriverStackParamList, 'ActiveRide'>;
};

type Step = 'approaching' | 'arrived' | 'in_progress' | 'completed';

const STEPS: { step: Step; btnLabel: string; btnIcon: string; statusLabel: string }[] = [
  { step: 'approaching', btnLabel: 'Arrivé au point de prise en charge', btnIcon: '📍', statusLabel: '🚗 En approche' },
  { step: 'arrived', btnLabel: 'Démarrer la course', btnIcon: '▶️', statusLabel: '📍 Arrivé — En attente passager' },
  { step: 'in_progress', btnLabel: 'Terminer la course', btnIcon: '🏁', statusLabel: '🛣️ Course en cours' },
  { step: 'completed', btnLabel: '', btnIcon: '', statusLabel: '✅ Course terminée' },
];

const { height } = Dimensions.get('window');

export const ActiveRideScreen: React.FC<Props> = ({ navigation }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const current = STEPS[stepIdx];
  const ride = STUB_INCOMING_RIDE;

  const handleNext = async () => {
    setLoading(true);
    try {
      await mockUpdateRideStatus(ride.id, current.step);
      if (stepIdx < STEPS.length - 1) {
        setStepIdx((i) => i + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Signaler un incident',
      'Sélectionnez le type d\'incident',
      [
        { text: 'Passager absent', onPress: () => {} },
        { text: 'Problème de sécurité', onPress: () => {} },
        { text: 'Autre', onPress: () => {} },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  if (current.step === 'completed' && stepIdx === STEPS.length - 1) {
    const net = ride.estimatedPrice * 0.9;
    return (
      <View style={styles.completedRoot}>
        <Text style={styles.completedEmoji}>✅</Text>
        <Text style={styles.completedTitle}>Course terminée !</Text>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Montant brut</Text>
          <Text style={styles.earningsGross}>{ride.estimatedPrice.toFixed(2)} €</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsRowLabel}>Commission plateforme (10%)</Text>
            <Text style={styles.earningsRowNeg}>- {(ride.estimatedPrice * 0.1).toFixed(2)} €</Text>
          </View>
          <View style={[styles.earningsRow, styles.earningsTotal]}>
            <Text style={styles.earningsTotalLabel}>Montant net</Text>
            <Text style={styles.earningsTotalValue}>{net.toFixed(2)} €</Text>
          </View>
          <Text style={styles.sequesterNote}>
            🔒 Versement dans 24h après la fin de course (délai de séquestre)
          </Text>
        </View>
        <Button
          title="Retour au tableau de bord"
          onPress={() => navigation.popToTop()}
          size="lg"
          fullWidth
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Navigation map placeholder */}
      <View style={styles.mapArea}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapLabel}>Navigation — Google Maps / Waze</Text>
        <View style={styles.navBadge}>
          <Text style={styles.navBadgeText}>Navigation intégrée (backend)</Text>
        </View>
        {/* Destination indicator */}
        <View style={styles.destBubble}>
          <Text style={styles.destText}>📍 {ride.pickup}</Text>
        </View>
      </View>

      {/* Ride info sheet */}
      <View style={styles.sheet}>
        {/* Status */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{current.statusLabel}</Text>
          {/* Step indicators */}
          <View style={styles.steps}>
            {STEPS.slice(0, -1).map((_, i) => (
              <View key={i} style={[styles.stepDot, i <= stepIdx && styles.stepDotActive]} />
            ))}
          </View>
        </View>

        {/* Passenger info */}
        <View style={styles.passengerCard}>
          <View style={styles.passengerAvatar}>
            <Text style={styles.passengerAvatarText}>{ride.passengerName.charAt(0)}</Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.passengerName}</Text>
            <Text style={styles.rideCategory}>{ride.category} · {ride.type === 'classic' ? 'Course classique' : 'Mise à disposition'}</Text>
          </View>
          <View style={styles.passengerActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnIcon}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route */}
        <View style={styles.route}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.routeText}>{ride.pickup}</Text>
          </View>
          <View style={styles.routeRow}>
            <View style={styles.dotRed} />
            <Text style={styles.routeText}>{ride.dropoff}</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Montant estimé</Text>
          <Text style={styles.priceValue}>{ride.estimatedPrice.toFixed(2)} €</Text>
        </View>

        {/* CTA */}
        {stepIdx < STEPS.length - 1 && (
          <Button
            title={`${current.btnIcon} ${current.btnLabel}`}
            onPress={handleNext}
            loading={loading}
            size="lg"
            fullWidth
            style={styles.ctaBtn}
          />
        )}

        <TouchableOpacity onPress={handleReport} style={styles.reportBtn}>
          <Text style={styles.reportBtnText}>⚠️ Signaler un incident</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapArea: {
    height: height * 0.5,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapEmoji: { fontSize: 64, opacity: 0.3 },
  mapLabel: { fontSize: fontSizes.md, fontWeight: '600', color: colors.darkGray, marginTop: spacing.sm },
  navBadge: { backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.sm },
  navBadgeText: { color: colors.white, fontSize: fontSizes.xs },
  destBubble: { position: 'absolute', bottom: spacing.lg, left: spacing.md, right: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.sm, ...shadows.sm },
  destText: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text, textAlign: 'center' },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: spacing.lg,
    ...shadows.lg,
    gap: spacing.md,
  },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLabel: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  steps: { flexDirection: 'row', gap: spacing.xs },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.accent },
  passengerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lightGray, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.md },
  passengerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  passengerAvatarText: { color: colors.white, fontWeight: '700', fontSize: fontSizes.xl },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  rideCategory: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  passengerActions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  actionBtnIcon: { fontSize: 16 },
  route: { gap: spacing.xs },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  dotRed: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.accent },
  routeText: { fontSize: fontSizes.sm, color: colors.text, flex: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  priceValue: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  ctaBtn: {},
  reportBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  reportBtnText: { color: colors.warning, fontSize: fontSizes.sm, fontWeight: '600' },
  completedRoot: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  completedEmoji: { fontSize: 80 },
  completedTitle: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.text },
  earningsCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  earningsLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  earningsGross: { fontSize: fontSizes.xxxl, fontWeight: '900', color: colors.text, marginBottom: spacing.md },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  earningsRowLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  earningsRowNeg: { fontSize: fontSizes.sm, color: colors.error, fontWeight: '600' },
  earningsTotal: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs },
  earningsTotalLabel: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  earningsTotalValue: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.success },
  sequesterNote: { fontSize: fontSizes.xs, color: colors.gray, marginTop: spacing.md, textAlign: 'center', lineHeight: 18 },
});
