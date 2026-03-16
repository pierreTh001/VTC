import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { type Driver } from '../stub/data';

interface DriverCardProps {
  driver: Driver;
  onPress?: () => void;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onPress,
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{driver.name}</Text>
      <Text style={styles.vehicle}>
        {driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.color}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.plate}>{driver.vehicle.plate}</Text>
        <Text style={styles.rating}>⭐ {driver.rating?.toFixed(1)}</Text>
        <Text style={styles.rides}>{driver.totalRides} courses</Text>
      </View>
    </View>
    <View style={styles.right}>
      <View style={[styles.categoryBadge]}>
        <Text style={styles.categoryText}>{driver.vehicle.category}</Text>
      </View>
      {showFavorite && (
        <TouchableOpacity onPress={onFavoriteToggle} style={styles.favBtn}>
          <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: fontSizes.xl, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  vehicle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  meta: { flexDirection: 'row', marginTop: 4, gap: spacing.sm },
  plate: { fontSize: fontSizes.xs, color: colors.gray, backgroundColor: colors.lightGray, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  rating: { fontSize: fontSizes.xs, color: colors.text },
  rides: { fontSize: fontSizes.xs, color: colors.textSecondary },
  right: { alignItems: 'flex-end', gap: spacing.xs },
  categoryBadge: { backgroundColor: colors.lightGray, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  categoryText: { fontSize: fontSizes.xs, color: colors.primary, fontWeight: '600' },
  favBtn: { padding: spacing.xs },
  favIcon: { fontSize: 18 },
});
