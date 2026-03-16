import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { PassengerStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../../theme';
import { STUB_NEARBY_DRIVERS } from '../../stub/data';
import { mockUpdateRideStatus } from '../../stub/mockApi';

type Props = {
  navigation: NativeStackNavigationProp<PassengerStackParamList, 'Tracking'>;
  route: RouteProp<PassengerStackParamList, 'Tracking'>;
};

type Phase = 'searching' | 'accepted' | 'approaching' | 'arrived' | 'in_progress' | 'completed';

const PHASES: { phase: Phase; label: string; icon: string; duration: number }[] = [
  { phase: 'searching', label: 'Recherche d\'un chauffeur...', icon: '🔍', duration: 3000 },
  { phase: 'accepted', label: 'Chauffeur trouvé !', icon: '✅', duration: 2000 },
  { phase: 'approaching', label: 'Chauffeur en approche', icon: '🚗', duration: 5000 },
  { phase: 'arrived', label: 'Chauffeur arrivé', icon: '📍', duration: 3000 },
  { phase: 'in_progress', label: 'Course en cours', icon: '🛣️', duration: 8000 },
  { phase: 'completed', label: 'Course terminée !', icon: '🎉', duration: 0 },
];

const { height } = Dimensions.get('window');

export const TrackingScreen: React.FC<Props> = ({ navigation }) => {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [eta, setEta] = useState(8);
  const driver = STUB_NEARBY_DRIVERS[0];

  useEffect(() => {
    if (phaseIdx >= PHASES.length - 1) return;
    const { duration } = PHASES[phaseIdx];
    const timer = setTimeout(() => setPhaseIdx((i) => i + 1), duration);
    return () => clearTimeout(timer);
  }, [phaseIdx]);

  useEffect(() => {
    if (phaseIdx === 2) {
      const interval = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
      return () => clearInterval(interval);
    }
  }, [phaseIdx]);

  const current = PHASES[phaseIdx];
  const isCompleted = current.phase === 'completed';

  if (isCompleted) {
    return (
      <View style={styles.completedRoot}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Course terminée !</Text>
        <Text style={styles.completedSubtitle}>Merci d'avoir utilisé VTC Premium</Text>
        <View style={styles.completedPrice}>
          <Text style={styles.priceLabel}>Montant débité</Text>
          <Text style={styles.priceAmount}>32.50 €</Text>
        </View>
        <Button
          title="Noter le chauffeur"
          onPress={() => navigation.replace('Rating', { rideId: 'r-completed', driverId: driver.id, driverName: driver.name })}
          size="lg"
          fullWidth
          style={styles.rateBtn}
        />
        <Button
          title="Retour à l'accueil"
          onPress={() => navigation.popToTop()}
          variant="outline"
          size="lg"
          fullWidth
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Map placeholder */}
      <View style={styles.mapArea}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapLabel}>Suivi en temps réel</Text>
        {phaseIdx >= 1 && (
          <View style={styles.driverMarker}>
            <Text style={styles.driverMarkerEmoji}>🚗</Text>
          </View>
        )}
        <View style={styles.userMarker}>
          <View style={styles.userMarkerDot} />
        </View>
        {phaseIdx >= 2 && (
          <View style={styles.etaBubble}>
            <Text style={styles.etaText}>{eta} min</Text>
          </View>
        )}
      </View>

      {/* Status sheet */}
      <View style={styles.sheet}>
        <View style={styles.statusRow}>
          <Text style={styles.statusIcon}>{current.icon}</Text>
          <Text style={styles.statusLabel}>{current.label}</Text>
        </View>

        {phaseIdx >= 1 && (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>{driver.name.charAt(0)}</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverVehicle}>
                {driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.color}
              </Text>
              <View style={styles.driverMeta}>
                <Text style={styles.driverPlate}>{driver.vehicle.plate}</Text>
                <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {phaseIdx >= 2 && phaseIdx < 4 && (
          <View style={styles.etaCard}>
            <Text style={styles.etaCardText}>
              Arrivée estimée dans <Text style={styles.etaHighlight}>{eta} min</Text>
            </Text>
          </View>
        )}

        {current.phase === 'in_progress' && (
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>🛣️ Course en cours · destination : 22 min</Text>
          </View>
        )}

        <Button
          title="Annuler la course"
          onPress={() => navigation.popToTop()}
          variant="outline"
          size="md"
          fullWidth
          style={styles.cancelBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapArea: {
    height: height * 0.55,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapEmoji: { fontSize: 64, opacity: 0.3 },
  mapLabel: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.darkGray, marginTop: spacing.sm },
  driverMarker: { position: 'absolute', top: '35%', left: '45%' },
  driverMarkerEmoji: { fontSize: 32 },
  userMarker: {
    position: 'absolute',
    bottom: '30%',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(233,69,96,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  etaBubble: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  etaText: { color: colors.white, fontWeight: '700', fontSize: fontSizes.md },
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
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statusIcon: { fontSize: 28 },
  statusLabel: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  driverAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  driverAvatarText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.xl },
  driverInfo: { flex: 1 },
  driverName: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  driverVehicle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  driverMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  driverPlate: { fontSize: fontSizes.xs, backgroundColor: colors.white, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, color: colors.gray },
  driverRating: { fontSize: fontSizes.xs, color: colors.text },
  driverActions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  actionBtnIcon: { fontSize: 18 },
  etaCard: { backgroundColor: '#E8F5E9', borderRadius: borderRadius.md, padding: spacing.md },
  etaCardText: { fontSize: fontSizes.md, color: colors.text },
  etaHighlight: { fontWeight: '800', color: colors.success },
  progressInfo: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.md, padding: spacing.md },
  progressText: { fontSize: fontSizes.sm, color: '#1565C0' },
  cancelBtn: {},
  completedRoot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  completedEmoji: { fontSize: 80 },
  completedTitle: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.text },
  completedSubtitle: { fontSize: fontSizes.lg, color: colors.textSecondary, textAlign: 'center' },
  completedPrice: { backgroundColor: colors.lightGray, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', width: '100%', marginVertical: spacing.md },
  priceLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  priceAmount: { fontSize: fontSizes.hero, fontWeight: '900', color: colors.text, marginTop: spacing.xs },
  rateBtn: {},
});
