import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { PassengerStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { VEHICLE_CATEGORIES, type VehicleCategory, PAYMENT_METHODS } from '../../stub/data';
import { mockEstimatePrice, mockBookRide } from '../../stub/mockApi';

type Props = {
  navigation: NativeStackNavigationProp<PassengerStackParamList, 'Booking'>;
  route: RouteProp<PassengerStackParamList, 'Booking'>;
};

export const BookingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { pickup, dropoff } = route.params;
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('Berline');
  const [estimates, setEstimates] = useState<Record<string, { price: number; duration: number; distance: number }>>({});
  const [estimating, setEstimating] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    setEstimating(true);
    const results: typeof estimates = {};
    for (const cat of VEHICLE_CATEGORIES) {
      const est = await mockEstimatePrice(pickup, dropoff || 'Destination', cat.category);
      results[cat.category] = est;
    }
    setEstimates(results);
    setEstimating(false);
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      const ride = await mockBookRide({
        pickup,
        dropoff: dropoff || 'Destination',
        category: selectedCategory,
        type: 'classic',
      });
      navigation.replace('Tracking', { rideId: ride.id });
    } finally {
      setBooking(false);
    }
  };

  const selectedEst = estimates[selectedCategory];

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Choisir un véhicule</Text>

        {/* Route summary */}
        <Card style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.routeDot} />
            <View style={styles.routeLine} />
            <View style={styles.routeSquare} />
          </View>
          <View style={styles.routeAddresses}>
            <Text style={styles.routeAddress}>{pickup}</Text>
            <Text style={styles.routeAddress} numberOfLines={1}>{dropoff || 'Destination non définie'}</Text>
          </View>
        </Card>

        {/* Category selection */}
        <Text style={styles.sectionTitle}>Catégorie de véhicule</Text>
        {estimating ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.loadingText}>Calcul des tarifs...</Text>
          </View>
        ) : (
          VEHICLE_CATEGORIES.map((cat) => {
            const est = estimates[cat.category];
            const isSelected = selectedCategory === cat.category;
            return (
              <TouchableOpacity
                key={cat.category}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => setSelectedCategory(cat.category)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                    {cat.category}
                  </Text>
                  <Text style={styles.categoryDesc}>{cat.description}</Text>
                  <Text style={styles.categoryWait}>⏱ ~{cat.waitTime} min d'attente</Text>
                </View>
                <View style={styles.categoryPrice}>
                  {est ? (
                    <>
                      <Text style={[styles.priceAmount, isSelected && styles.priceAmountSelected]}>
                        {est.price.toFixed(2)} €
                      </Text>
                      <Text style={styles.priceDuration}>{est.duration} min · {est.distance} km</Text>
                    </>
                  ) : (
                    <ActivityIndicator size="small" color={colors.gray} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Moyen de paiement</Text>
        {PAYMENT_METHODS.map((pm) => (
          <TouchableOpacity
            key={pm.id}
            style={[styles.paymentCard, selectedPayment === pm.id && styles.paymentCardSelected]}
            onPress={() => setSelectedPayment(pm.id)}
          >
            <Text style={styles.paymentIcon}>
              {pm.type === 'apple_pay' ? '🍎' : pm.brand === 'Visa' ? '💳' : '💳'}
            </Text>
            <Text style={styles.paymentLabel}>
              {pm.type === 'apple_pay' ? 'Apple Pay' : `${pm.brand} •••• ${pm.last4}`}
            </Text>
            {pm.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>Par défaut</Text></View>}
            <View style={[styles.radioOuter, selectedPayment === pm.id && styles.radioOuterSelected]}>
              {selectedPayment === pm.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.paymentNote}>
          <Text style={styles.paymentNoteText}>
            🔒 Pré-autorisation du montant estimé. Le débit réel s'effectue en fin de course.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {selectedEst && (
          <View style={styles.priceSummary}>
            <Text style={styles.priceSummaryLabel}>{selectedCategory}</Text>
            <Text style={styles.priceSummaryAmount}>{selectedEst.price.toFixed(2)} €</Text>
          </View>
        )}
        <Button
          title="Commander maintenant"
          onPress={handleBook}
          loading={booking}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 120 },
  back: { marginBottom: spacing.md },
  backText: { color: colors.accent, fontSize: fontSizes.md },
  title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  routeCard: { marginBottom: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  routeRow: { alignItems: 'center', gap: spacing.xs },
  routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  routeLine: { width: 2, height: 24, backgroundColor: colors.border },
  routeSquare: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.accent },
  routeAddresses: { flex: 1, gap: spacing.sm },
  routeAddress: { fontSize: fontSizes.sm, color: colors.text, fontWeight: '500' },
  sectionTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md, marginTop: spacing.md },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  loadingText: { color: colors.textSecondary },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryCardSelected: { borderColor: colors.accent, backgroundColor: '#FFF5F5' },
  categoryEmoji: { fontSize: 32, marginRight: spacing.md },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  categoryNameSelected: { color: colors.accent },
  categoryDesc: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  categoryWait: { fontSize: fontSizes.xs, color: colors.gray, marginTop: 2 },
  categoryPrice: { alignItems: 'flex-end' },
  priceAmount: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  priceAmountSelected: { color: colors.accent },
  priceDuration: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  paymentCardSelected: { borderColor: colors.accent },
  paymentIcon: { fontSize: 24 },
  paymentLabel: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  defaultBadge: { backgroundColor: colors.lightGray, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  defaultText: { fontSize: fontSizes.xs, color: colors.textSecondary },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: colors.accent },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  paymentNote: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.md, padding: spacing.sm, marginTop: spacing.sm },
  paymentNoteText: { fontSize: fontSizes.xs, color: '#1565C0' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  priceSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceSummaryLabel: { fontSize: fontSizes.md, color: colors.textSecondary },
  priceSummaryAmount: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
});
