import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PassengerTabParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { type RideRequest } from '../../stub/data';
import { mockGetPassengerHistory } from '../../stub/mockApi';

type Props = { navigation: NativeStackNavigationProp<PassengerTabParamList, 'History'> };

const statusLabel: Record<string, { label: string; color: string }> = {
  completed: { label: 'Terminée', color: colors.success },
  cancelled: { label: 'Annulée', color: colors.error },
  in_progress: { label: 'En cours', color: colors.info },
};

const typeLabel: Record<string, string> = {
  classic: 'Course',
  disposition: 'Mise à dispo',
};

export const HistoryScreen: React.FC<Props> = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockGetPassengerHistory().then((data) => {
      setRides(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Chargement de l'historique...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Mes courses</Text>
      <FlatList
        data={rides}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: ride }) => {
          const status = statusLabel[ride.status] ?? { label: ride.status, color: colors.gray };
          return (
            <Card style={styles.card} elevated>
              <View style={styles.cardHeader}>
                <View style={styles.typeRow}>
                  <Text style={styles.typeEmoji}>{ride.type === 'classic' ? '🚗' : '🕐'}</Text>
                  <Text style={styles.typeName}>{typeLabel[ride.type]}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>

              <View style={styles.route}>
                <View style={styles.routeRow}>
                  <View style={styles.dotGreen} />
                  <Text style={styles.routeText} numberOfLines={1}>{ride.pickup}</Text>
                </View>
                {ride.type === 'classic' && (
                  <View style={styles.routeRow}>
                    <View style={styles.dotRed} />
                    <Text style={styles.routeText} numberOfLines={1}>{ride.dropoff}</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(ride.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </Text>
                <Text style={styles.price}>{ride.estimatedPrice.toFixed(2)} €</Text>
              </View>

              {ride.type === 'disposition' && ride.dispositionDuration && (
                <Text style={styles.dispositionInfo}>⏱ {ride.dispositionDuration}h · Mise à disposition</Text>
              )}
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🚗</Text>
            <Text style={styles.emptyText}>Aucune course pour l'instant</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, padding: spacing.lg, paddingBottom: spacing.sm },
  list: { padding: spacing.md, paddingTop: 0 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textSecondary },
  card: { marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  typeEmoji: { fontSize: 18 },
  typeName: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  statusText: { fontSize: fontSizes.xs, fontWeight: '700' },
  route: { gap: spacing.xs, marginBottom: spacing.sm },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  dotRed: { width: 8, height: 8, borderRadius: 2, backgroundColor: colors.accent },
  routeText: { fontSize: fontSizes.sm, color: colors.text, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: fontSizes.xs, color: colors.textSecondary },
  price: { fontSize: fontSizes.lg, fontWeight: '800', color: colors.text },
  dispositionInfo: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: spacing.xs },
  empty: { alignItems: 'center', paddingTop: spacing.xxl, gap: spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: fontSizes.lg, color: colors.textSecondary },
});
