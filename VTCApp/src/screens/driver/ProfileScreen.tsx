import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { STUB_DRIVER } from '../../stub/data';
import { useAuth } from '../../context/AuthContext';

const DOCUMENTS = [
  { name: 'Carte professionnelle VTC', expiry: '2026-12-31', status: 'valid' },
  { name: 'Assurance RC Pro', expiry: '2026-06-30', status: 'valid' },
  { name: 'Carte grise', expiry: '—', status: 'valid' },
  { name: 'Permis de conduire B', expiry: '2028-03-15', status: 'valid' },
  { name: 'KBIS', expiry: '—', status: 'valid' },
];

const docStatusStyle: Record<string, { label: string; color: string; icon: string }> = {
  valid: { label: 'Valide', color: colors.success, icon: '✅' },
  expiring_soon: { label: 'Expire bientôt', color: colors.warning, icon: '⚠️' },
  expired: { label: 'Expiré', color: colors.error, icon: '❌' },
};

export const DriverProfileScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{STUB_DRIVER.name.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{STUB_DRIVER.name}</Text>
            <Text style={styles.email}>{STUB_DRIVER.email}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {STUB_DRIVER.rating?.toFixed(1)}</Text>
              <Text style={styles.rides}>{STUB_DRIVER.totalRides} courses effectuées</Text>
            </View>
          </View>
        </View>

        {/* Vehicle */}
        <Card style={styles.section} elevated>
          <Text style={styles.sectionTitle}>🚗 Mon véhicule</Text>
          <View style={styles.vehicleGrid}>
            {[
              { label: 'Marque', value: STUB_DRIVER.vehicle.make },
              { label: 'Modèle', value: STUB_DRIVER.vehicle.model },
              { label: 'Immatriculation', value: STUB_DRIVER.vehicle.plate },
              { label: 'Couleur', value: STUB_DRIVER.vehicle.color },
              { label: 'Catégorie', value: STUB_DRIVER.vehicle.category },
            ].map((v) => (
              <View key={v.label} style={styles.vehicleItem}>
                <Text style={styles.vehicleLabel}>{v.label}</Text>
                <Text style={styles.vehicleValue}>{v.value}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Modifier les informations</Text>
          </TouchableOpacity>
        </Card>

        {/* Documents */}
        <Card style={styles.section} elevated>
          <Text style={styles.sectionTitle}>📋 Documents</Text>
          <Text style={styles.docNote}>
            Vos documents sont vérifiés par notre équipe. Des alertes vous seront envoyées 30 jours, 7 jours et 1 jour avant l'expiration.
          </Text>
          {DOCUMENTS.map((doc) => {
            const s = docStatusStyle[doc.status];
            return (
              <View key={doc.name} style={styles.docRow}>
                <Text style={styles.docIcon}>{s.icon}</Text>
                <View style={styles.docInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  {doc.expiry !== '—' && (
                    <Text style={styles.docExpiry}>Expire le {doc.expiry}</Text>
                  )}
                </View>
                <View style={[styles.docBadge, { backgroundColor: s.color + '20' }]}>
                  <Text style={[styles.docBadgeText, { color: s.color }]}>{s.label}</Text>
                </View>
              </View>
            );
          })}
          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadBtnText}>📤 Mettre à jour un document</Text>
          </TouchableOpacity>
        </Card>

        {/* Account status */}
        <Card style={styles.statusCard} elevated>
          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>✅</Text>
            <View>
              <Text style={styles.statusLabel}>Compte actif</Text>
              <Text style={styles.statusDesc}>Votre compte a été validé par l'équipe</Text>
            </View>
          </View>
        </Card>

        {/* Menu */}
        <Card style={styles.section}>
          {[
            { icon: '🔔', label: 'Notifications' },
            { icon: '🏦', label: 'IBAN & Versements' },
            { icon: '📊', label: 'Statistiques détaillées' },
            { icon: '⚠️', label: 'Litige en cours (0)' },
            { icon: '🛡️', label: 'RGPD — Mes données' },
            { icon: '📞', label: 'Support chauffeur' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.menuDivider} />}
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
        <Text style={styles.version}>VTC Premium Chauffeur v1.0.0-stub</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: fontSizes.xxxl, fontWeight: '800' },
  headerInfo: { flex: 1 },
  name: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text },
  email: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', gap: spacing.md, marginTop: 4 },
  rating: { fontSize: fontSizes.sm, color: colors.text, fontWeight: '600' },
  rides: { fontSize: fontSizes.sm, color: colors.textSecondary },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  vehicleItem: { minWidth: '45%' },
  vehicleLabel: { fontSize: fontSizes.xs, color: colors.textSecondary },
  vehicleValue: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text, marginTop: 2 },
  editBtn: { paddingVertical: spacing.xs },
  editBtnText: { color: colors.accent, fontSize: fontSizes.sm, fontWeight: '600' },
  docNote: { fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 18 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  docIcon: { fontSize: 18, width: 28 },
  docInfo: { flex: 1 },
  docName: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  docExpiry: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  docBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  docBadgeText: { fontSize: fontSizes.xs, fontWeight: '700' },
  uploadBtn: { paddingVertical: spacing.sm },
  uploadBtnText: { color: colors.accent, fontSize: fontSizes.sm, fontWeight: '600' },
  statusCard: { marginBottom: spacing.md, borderColor: colors.success + '80', backgroundColor: '#F0FFF4' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statusIcon: { fontSize: 24 },
  statusLabel: { fontSize: fontSizes.md, fontWeight: '700', color: colors.success },
  statusDesc: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  menuIcon: { fontSize: 20, width: 32 },
  menuLabel: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  menuArrow: { fontSize: fontSizes.xl, color: colors.gray },
  menuDivider: { height: 1, backgroundColor: colors.border, marginLeft: 32 },
  logoutBtn: { marginBottom: spacing.md },
  version: { textAlign: 'center', fontSize: fontSizes.xs, color: colors.gray },
});
