import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Card } from '../../components/Card';
import { StubBanner } from '../../components/StubBanner';
import { colors, spacing, fontSizes, borderRadius } from '../../theme';
import { type FinancialSummary } from '../../stub/data';
import { mockGetDriverFinancials, mockGetDriverHistory } from '../../stub/mockApi';

const statusLabel: Record<string, { label: string; color: string }> = {
  paid: { label: 'Versé', color: colors.success },
  pending: { label: 'En attente (séquestre)', color: colors.warning },
  dispute: { label: 'En litige', color: colors.error },
};

export const DashboardScreen = () => {
  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    Promise.all([mockGetDriverFinancials(), mockGetDriverHistory()]).then(([f, h]) => {
      setFinancials(f);
      setHistory(h);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const f = financials!;
  const earnings = tab === 'week' ? f.weeklyEarnings : tab === 'month' ? f.monthlyEarnings : f.totalEarnings;

  return (
    <View style={styles.root}>
      <StubBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Tableau de bord financier</Text>

        {/* Balance cards */}
        <View style={styles.balanceRow}>
          <Card style={styles.balanceCardPending} elevated>
            <Text style={styles.balanceIcon}>🔒</Text>
            <Text style={styles.balanceAmount}>{f.pendingBalance.toFixed(2)} €</Text>
            <Text style={styles.balanceLabel}>En séquestre</Text>
            <Text style={styles.balanceSub}>Libération dans 24h</Text>
          </Card>
          <Card style={styles.balanceCardAvailable} elevated>
            <Text style={styles.balanceIcon}>✅</Text>
            <Text style={styles.balanceAmount}>{f.availableBalance.toFixed(2)} €</Text>
            <Text style={styles.balanceLabel}>Disponible</Text>
            <Text style={styles.balanceSub}>Versement automatique</Text>
          </Card>
        </View>

        {/* Period tabs */}
        <View style={styles.tabs}>
          {([['week', 'Semaine'], ['month', 'Mois'], ['all', 'Total']] as const).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, tab === key && styles.tabActive]}
              onPress={() => setTab(key)}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings breakdown */}
        <Card style={styles.earningsCard} elevated>
          <Text style={styles.earningsTitle}>Gains — {tab === 'week' ? 'Cette semaine' : tab === 'month' ? 'Ce mois' : 'Total'}</Text>
          <Text style={styles.earningsAmount}>{earnings.toFixed(2)} €</Text>
          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsRowLabel}>Montant brut</Text>
              <Text style={styles.earningsRowValue}>{(earnings / 0.9).toFixed(2)} €</Text>
            </View>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsRowLabel}>Commission plateforme (10%)</Text>
              <Text style={[styles.earningsRowValue, { color: colors.error }]}>- {(earnings / 0.9 * 0.1).toFixed(2)} €</Text>
            </View>
            <View style={[styles.earningsRow, styles.earningsTotalRow]}>
              <Text style={styles.earningsTotalLabel}>Montant net</Text>
              <Text style={styles.earningsTotalValue}>{earnings.toFixed(2)} €</Text>
            </View>
          </View>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsStatValue}>{f.totalRides}</Text>
            <Text style={styles.earningsStatLabel}>Courses au total</Text>
          </View>
        </Card>

        {/* Flow explanation */}
        <Card style={styles.flowCard}>
          <Text style={styles.flowTitle}>💡 Cycle de versement</Text>
          {[
            { step: '1', label: 'Fin de course', desc: 'Montant capturé par Stripe' },
            { step: '2', label: 'Séquestre 24h', desc: 'Période de réclamation passager' },
            { step: '3', label: 'Libération', desc: 'Versement net après commission' },
          ].map((s) => (
            <View key={s.step} style={styles.flowStep}>
              <View style={styles.flowStepNum}>
                <Text style={styles.flowStepNumText}>{s.step}</Text>
              </View>
              <View>
                <Text style={styles.flowStepLabel}>{s.label}</Text>
                <Text style={styles.flowStepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* History */}
        <Text style={styles.sectionTitle}>Historique des courses</Text>
        {history.map((ride) => {
          const s = statusLabel[ride.status] ?? { label: ride.status, color: colors.gray };
          return (
            <Card key={ride.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyPassenger}>{ride.passengerName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: s.color + '20' }]}>
                  <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                </View>
              </View>
              <Text style={styles.historyRoute}>{ride.pickup} → {ride.dropoff}</Text>
              <Text style={styles.historyDate}>{ride.date}</Text>
              <View style={styles.historyAmounts}>
                <Text style={styles.historyGross}>Brut: {ride.gross.toFixed(2)} €</Text>
                <Text style={styles.historyComm}>Comm: -{ride.commission.toFixed(2)} €</Text>
                <Text style={styles.historyNet}>Net: {ride.net.toFixed(2)} €</Text>
              </View>
            </Card>
          );
        })}

        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>📥 Télécharger le relevé (PDF)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  balanceRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  balanceCardPending: { flex: 1, alignItems: 'center', padding: spacing.md, borderColor: colors.warning + '80', backgroundColor: '#FFF8F0' },
  balanceCardAvailable: { flex: 1, alignItems: 'center', padding: spacing.md, borderColor: colors.success + '80', backgroundColor: '#F0FFF4' },
  balanceIcon: { fontSize: 24, marginBottom: spacing.xs },
  balanceAmount: { fontSize: fontSizes.xl, fontWeight: '900', color: colors.text },
  balanceLabel: { fontSize: fontSizes.xs, fontWeight: '700', color: colors.textSecondary, marginTop: 2 },
  balanceSub: { fontSize: fontSizes.xs, color: colors.gray, marginTop: 2, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: colors.lightGray, borderRadius: borderRadius.lg, padding: spacing.xs, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.white },
  tabText: { fontSize: fontSizes.sm, color: colors.gray, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  earningsCard: { marginBottom: spacing.md },
  earningsTitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  earningsAmount: { fontSize: fontSizes.hero, fontWeight: '900', color: colors.text, marginBottom: spacing.md },
  earningsBreakdown: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  earningsRowLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  earningsRowValue: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text },
  earningsTotalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  earningsTotalLabel: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
  earningsTotalValue: { fontSize: fontSizes.lg, fontWeight: '900', color: colors.success },
  earningsStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  earningsStatValue: { fontSize: fontSizes.xxl, fontWeight: '900', color: colors.text },
  earningsStatLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  flowCard: { marginBottom: spacing.lg },
  flowTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  flowStep: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
  flowStepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  flowStepNumText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.sm },
  flowStepLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text },
  flowStepDesc: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  historyCard: { marginBottom: spacing.xs },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  historyPassenger: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  statusText: { fontSize: fontSizes.xs, fontWeight: '700' },
  historyRoute: { fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: 2 },
  historyDate: { fontSize: fontSizes.xs, color: colors.gray, marginBottom: spacing.xs },
  historyAmounts: { flexDirection: 'row', gap: spacing.md },
  historyGross: { fontSize: fontSizes.xs, color: colors.textSecondary },
  historyComm: { fontSize: fontSizes.xs, color: colors.error },
  historyNet: { fontSize: fontSizes.xs, color: colors.success, fontWeight: '700' },
  exportBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  exportBtnText: { color: colors.white, fontWeight: '700', fontSize: fontSizes.md },
});
