import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { STUB_PASSENGER, PAYMENT_METHODS, SAVED_ADDRESSES } from '../../stub/data';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StubBanner } from '../../components/StubBanner';
import { useAuth } from '../../context/AuthContext';

export const ProfileScreen = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: '💳', label: 'Moyens de paiement', badge: PAYMENT_METHODS.length },
    { icon: '📍', label: 'Adresses enregistrées', badge: SAVED_ADDRESSES.length },
    { icon: '🔔', label: 'Notifications', badge: null },
    { icon: '🔒', label: 'Sécurité & Biométrie', badge: null },
    { icon: '📄', label: 'Conditions générales', badge: null },
    { icon: '🛡️', label: 'Politique de confidentialité (RGPD)', badge: null },
    { icon: '📞', label: 'Support & Aide', badge: null },
  ];

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{STUB_PASSENGER.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{STUB_PASSENGER.name}</Text>
            <Text style={styles.email}>{STUB_PASSENGER.email}</Text>
            <Text style={styles.phone}>{STUB_PASSENGER.phone}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{STUB_PASSENGER.totalRides}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{STUB_PASSENGER.rating?.toFixed(1)} ⭐</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Chauffeurs favoris</Text>
          </View>
        </View>

        {/* Payment methods preview */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Moyens de paiement</Text>
          {PAYMENT_METHODS.map((pm) => (
            <View key={pm.id} style={styles.paymentRow}>
              <Text style={styles.paymentIcon}>{pm.type === 'apple_pay' ? '🍎' : '💳'}</Text>
              <Text style={styles.paymentLabel}>
                {pm.type === 'apple_pay' ? 'Apple Pay' : `${pm.brand} •••• ${pm.last4}`}
              </Text>
              {pm.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Par défaut</Text>
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Ajouter un moyen de paiement</Text>
          </TouchableOpacity>
        </Card>

        {/* Menu */}
        <Card style={styles.section}>
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge !== null && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              {i < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </Card>

        <Button
          title="Se déconnecter"
          onPress={() => Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: logout },
          ])}
          variant="outline"
          size="md"
          fullWidth
          style={styles.logoutBtn}
        />

        <Text style={styles.version}>VTC Premium v1.0.0-stub</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: fontSizes.xxxl, fontWeight: '800' },
  name: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  email: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  phone: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  stats: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  paymentIcon: { fontSize: 20 },
  paymentLabel: { flex: 1, fontSize: fontSizes.sm, color: colors.text },
  defaultBadge: { backgroundColor: colors.lightGray, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  defaultText: { fontSize: fontSizes.xs, color: colors.textSecondary },
  addBtn: { paddingVertical: spacing.sm },
  addBtnText: { color: colors.accent, fontSize: fontSizes.sm, fontWeight: '600' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  menuIcon: { fontSize: 20, width: 32 },
  menuLabel: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  badge: { backgroundColor: colors.lightGray, borderRadius: borderRadius.full, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: spacing.xs },
  badgeText: { fontSize: fontSizes.xs, color: colors.textSecondary, fontWeight: '700' },
  menuArrow: { fontSize: fontSizes.xl, color: colors.gray },
  menuDivider: { height: 1, backgroundColor: colors.border, marginLeft: 32 },
  logoutBtn: { marginBottom: spacing.md },
  version: { textAlign: 'center', fontSize: fontSizes.xs, color: colors.gray },
});
