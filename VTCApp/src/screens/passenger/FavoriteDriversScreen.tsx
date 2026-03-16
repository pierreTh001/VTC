import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PassengerStackParamList } from '../../navigation/types';
import { DriverCard } from '../../components/DriverCard';
import { Button } from '../../components/Button';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { STUB_FAVORITE_DRIVERS, STUB_NEARBY_DRIVERS } from '../../stub/data';

type Props = { navigation: NativeStackNavigationProp<PassengerStackParamList, 'FavoriteDrivers'> };

export const FavoriteDriversScreen: React.FC<Props> = ({ navigation }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(STUB_FAVORITE_DRIVERS.map((d) => d.id));

  const toggleFavorite = (id: string) => {
    setFavoriteIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  const bookWithFavorite = (driverId: string, driverName: string) => {
    Alert.alert(
      `Commander avec ${driverName}`,
      'Ce chauffeur est disponible. Souhaitez-vous le demander en priorité pour votre prochaine course ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Demander ce chauffeur',
          onPress: () => navigation.navigate('Booking', { pickup: 'Ma position', dropoff: '', favoriteDriverId: driverId }),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>⭐ Chauffeurs favoris</Text>
        <Text style={styles.subtitle}>
          Commandez directement avec vos chauffeurs préférés. Vous pouvez les demander en priorité pour votre prochaine course.
        </Text>

        <Text style={styles.sectionTitle}>Mes favoris ({favoriteIds.length})</Text>
        {STUB_NEARBY_DRIVERS.map((driver) => (
          <View key={driver.id}>
            <DriverCard
              driver={driver}
              showFavorite
              isFavorite={favoriteIds.includes(driver.id)}
              onFavoriteToggle={() => toggleFavorite(driver.id)}
              onPress={() => bookWithFavorite(driver.id, driver.name)}
            />
            {favoriteIds.includes(driver.id) && (
              <View style={styles.availabilityRow}>
                <View style={[styles.dot, driver.isOnline && styles.dotOnline]} />
                <Text style={styles.availabilityText}>
                  {driver.isOnline ? '✅ Disponible maintenant' : '⏸ Hors ligne'}
                </Text>
                {driver.isOnline && (
                  <TouchableOpacity
                    onPress={() => bookWithFavorite(driver.id, driver.name)}
                    style={styles.bookNowBtn}
                  >
                    <Text style={styles.bookNowText}>Commander →</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Comment fonctionnent les favoris ?</Text>
          <Text style={styles.infoText}>
            • Disponible après au moins 1 course effectuée avec le chauffeur{'\n'}
            • Le chauffeur reçoit une notification en priorité{'\n'}
            • Si indisponible : attendre ou basculer vers le premier chauffeur disponible{'\n'}
            • Le délai d'attente supplémentaire estimé est affiché clairement
          </Text>
        </View>
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
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray },
  dotOnline: { backgroundColor: colors.success },
  availabilityText: { fontSize: fontSizes.sm, color: colors.textSecondary, flex: 1 },
  bookNowBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  bookNowText: { fontSize: fontSizes.sm, color: colors.white, fontWeight: '700' },
  infoBox: { backgroundColor: '#E3F2FD', borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.lg },
  infoTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: '#1565C0', marginBottom: spacing.xs },
  infoText: { fontSize: fontSizes.sm, color: '#1565C0', lineHeight: 22 },
});
