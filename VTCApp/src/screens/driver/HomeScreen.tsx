import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Dimensions,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DriverTabParamList, DriverStackParamList } from '../../navigation/types';
import { StubBanner } from '../../components/StubBanner';
import { Card } from '../../components/Card';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../../theme';
import { STUB_DRIVER, STUB_INCOMING_RIDE } from '../../stub/data';
import { mockToggleOnline } from '../../stub/mockApi';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<DriverTabParamList, 'DriverHome'>,
    NativeStackNavigationProp<DriverStackParamList>
  >;
};

const { height } = Dimensions.get('window');

export const DriverHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(STUB_DRIVER.isOnline);
  const [showIncomingRide, setShowIncomingRide] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const toggleOnline = async (val: boolean) => {
    await mockToggleOnline(val);
    setIsOnline(val);
    if (val) {
      // Simulate incoming ride after 3s
      setTimeout(() => {
        setShowIncomingRide(true);
        setCountdown(30);
      }, 3000);
    } else {
      setShowIncomingRide(false);
    }
  };

  useEffect(() => {
    if (!showIncomingRide) return;
    if (countdown <= 0) {
      setShowIncomingRide(false);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showIncomingRide, countdown]);

  return (
    <View style={styles.root}>
      <StubBanner />

      {/* Map placeholder */}
      <View style={styles.mapArea}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapLabel}>{isOnline ? 'En ligne — visible des passagers' : 'Hors ligne'}</Text>
        {isOnline && (
          <View style={styles.onlineDot} />
        )}
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        {/* Driver status */}
        <View style={styles.statusBar}>
          <View>
            <Text style={styles.driverName}>{STUB_DRIVER.name}</Text>
            <Text style={styles.driverVehicle}>
              {STUB_DRIVER.vehicle.make} {STUB_DRIVER.vehicle.model} · {STUB_DRIVER.vehicle.plate}
            </Text>
          </View>
          <View style={styles.onlineRow}>
            <Text style={[styles.onlineLabel, isOnline && styles.onlineLabelActive]}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Today stats */}
        <View style={styles.todayStats}>
          {[
            { label: 'Courses aujourd\'hui', value: '4' },
            { label: 'Gains aujourd\'hui', value: '€ 187.40' },
            { label: 'Évaluation', value: `${STUB_DRIVER.rating} ⭐` },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {!isOnline ? (
          <View style={styles.offlineMsg}>
            <Text style={styles.offlineMsgEmoji}>😴</Text>
            <Text style={styles.offlineMsgText}>
              Activez votre disponibilité pour recevoir des courses
            </Text>
          </View>
        ) : !showIncomingRide ? (
          <View style={styles.waitingMsg}>
            <Text style={styles.waitingMsgEmoji}>🟢</Text>
            <Text style={styles.waitingMsgText}>En attente d'une course...</Text>
            <Text style={styles.waitingMsgSub}>Une simulation de course arrive dans 3 secondes</Text>
          </View>
        ) : null}
      </View>

      {/* Incoming ride modal */}
      {showIncomingRide && (
        <View style={styles.incomingOverlay}>
          <View style={styles.incomingCard}>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
            <Text style={styles.incomingTitle}>Nouvelle course !</Text>

            <View style={styles.incomingRoute}>
              <View style={styles.routeRow}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeText}>{STUB_INCOMING_RIDE.pickup}</Text>
              </View>
              <View style={styles.routeRow}>
                <View style={styles.dotRed} />
                <Text style={styles.routeText}>{STUB_INCOMING_RIDE.dropoff}</Text>
              </View>
            </View>

            <View style={styles.incomingMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{STUB_INCOMING_RIDE.estimatedPrice.toFixed(2)} €</Text>
                <Text style={styles.metaLabel}>Estimation</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{STUB_INCOMING_RIDE.estimatedDuration} min</Text>
                <Text style={styles.metaLabel}>Durée</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{STUB_INCOMING_RIDE.estimatedDistance} km</Text>
                <Text style={styles.metaLabel}>Distance</Text>
              </View>
            </View>

            <View style={styles.incomingActions}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => setShowIncomingRide(false)}
              >
                <Text style={styles.declineBtnText}>Refuser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => {
                  setShowIncomingRide(false);
                  (navigation as any).navigate('ActiveRide', { rideId: STUB_INCOMING_RIDE.id });
                }}
              >
                <Text style={styles.acceptBtnText}>Accepter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapArea: {
    height: height * 0.45,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapEmoji: { fontSize: 64, opacity: 0.3 },
  mapLabel: { fontSize: fontSizes.md, fontWeight: '600', color: colors.darkGray, marginTop: spacing.sm },
  onlineDot: { position: 'absolute', top: 20, right: 20, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: spacing.lg,
    ...shadows.lg,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
  statusBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  driverName: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  driverVehicle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  onlineRow: { alignItems: 'center', gap: spacing.xs },
  onlineLabel: { fontSize: fontSizes.xs, color: colors.gray, fontWeight: '600' },
  onlineLabelActive: { color: colors.success },
  todayStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.lightGray, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: fontSizes.md, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  offlineMsg: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  offlineMsgEmoji: { fontSize: 40 },
  offlineMsgText: { fontSize: fontSizes.md, color: colors.textSecondary, textAlign: 'center' },
  waitingMsg: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs },
  waitingMsgEmoji: { fontSize: 32 },
  waitingMsgText: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
  waitingMsgSub: { fontSize: fontSizes.sm, color: colors.textSecondary, textAlign: 'center' },
  incomingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  incomingCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    margin: spacing.lg,
    width: '90%',
    alignItems: 'center',
    ...shadows.lg,
  },
  countdownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  countdownText: { fontSize: fontSizes.xxl, fontWeight: '900', color: colors.white },
  incomingTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  incomingRoute: { width: '100%', gap: spacing.sm, marginBottom: spacing.lg },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  dotRed: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.accent },
  routeText: { fontSize: fontSizes.sm, color: colors.text, flex: 1 },
  incomingMeta: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: spacing.lg },
  metaItem: { alignItems: 'center' },
  metaValue: { fontSize: fontSizes.lg, fontWeight: '800', color: colors.text },
  metaLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  incomingActions: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  declineBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  declineBtnText: { color: colors.error, fontWeight: '700', fontSize: fontSizes.md },
  acceptBtn: {
    flex: 2,
    backgroundColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  acceptBtnText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.md },
});
