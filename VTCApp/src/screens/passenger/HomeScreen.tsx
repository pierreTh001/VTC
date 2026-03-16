import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, StatusBar, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PassengerStackParamList } from '../../navigation/types';
import { StubBanner } from '../../components/StubBanner';
import { Card } from '../../components/Card';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../../theme';
import { SAVED_ADDRESSES, STUB_PASSENGER, VEHICLE_CATEGORIES } from '../../stub/data';

type Props = { navigation: NativeStackNavigationProp<PassengerStackParamList, 'Booking'> };

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (destination.length > 2) {
      setSuggestions([
        `${destination} — Gare du Nord, Paris 75010`,
        `${destination} — Champs-Élysées, Paris 75008`,
        `${destination} — Opéra, Paris 75009`,
      ]);
    } else {
      setSuggestions([]);
    }
  }, [destination]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <StubBanner />

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>🗺️</Text>
        <Text style={styles.mapLabel}>Carte en temps réel</Text>
        <Text style={styles.mapSublabel}>Google Maps SDK (intégration backend)</Text>

        {/* Driver dots */}
        {[
          { top: '30%', left: '20%' },
          { top: '45%', left: '60%' },
          { top: '60%', left: '35%' },
          { top: '25%', left: '70%' },
        ].map((pos, i) => (
          <View key={i} style={[styles.driverDot, pos as any]}>
            <Text style={styles.driverDotIcon}>🚗</Text>
          </View>
        ))}

        {/* User location */}
        <View style={styles.userDot}>
          <View style={styles.userDotInner} />
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetingName}>Bonjour, {STUB_PASSENGER.name.split(' ')[0]} 👋</Text>
            <Text style={styles.greetingSubtitle}>Où souhaitez-vous aller ?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
            <Text style={styles.avatarText}>{STUB_PASSENGER.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationCurrent}>Ma position actuelle</Text>
          </View>
          <View style={styles.searchDivider} />
          <View style={styles.destinationRow}>
            <View style={styles.destinationDot} />
            <TextInput
              style={styles.destinationInput}
              value={destination}
              onChangeText={setDestination}
              placeholder="Saisir une destination..."
              placeholderTextColor={colors.gray}
            />
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDestination(s);
                    setSuggestions([]);
                    navigation.navigate('Booking', { pickup: 'Ma position', dropoff: s });
                  }}
                >
                  <Text style={styles.suggestionIcon}>📍</Text>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Booking', { pickup: 'Ma position', dropoff: '' })}
          >
            <Text style={styles.quickActionIcon}>🚗</Text>
            <Text style={styles.quickActionLabel}>Course</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('Disposition')}
          >
            <Text style={styles.quickActionIcon}>🕐</Text>
            <Text style={styles.quickActionLabel}>Mise à dispo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('BookForOther')}
          >
            <Text style={styles.quickActionIcon}>👤</Text>
            <Text style={styles.quickActionLabel}>Pour autrui</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('FavoriteDrivers')}
          >
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionLabel}>Favoris</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Saved addresses */}
        <Text style={styles.sectionTitle}>Adresses enregistrées</Text>
        {SAVED_ADDRESSES.map((addr) => (
          <TouchableOpacity
            key={addr.id}
            style={styles.savedAddr}
            onPress={() => navigation.navigate('Booking', { pickup: 'Ma position', dropoff: addr.address })}
          >
            <Text style={styles.savedAddrIcon}>{addr.icon}</Text>
            <View>
              <Text style={styles.savedAddrLabel}>{addr.label}</Text>
              <Text style={styles.savedAddrText} numberOfLines={1}>{addr.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapPlaceholder: {
    height: height * 0.45,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPlaceholderText: { fontSize: 64, opacity: 0.3 },
  mapLabel: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.darkGray, marginTop: spacing.sm },
  mapSublabel: { fontSize: fontSizes.sm, color: colors.gray },
  driverDot: { position: 'absolute' },
  driverDotIcon: { fontSize: 24 },
  userDot: {
    position: 'absolute',
    bottom: '40%',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
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
  greeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greetingName: { fontSize: fontSizes.xl, fontWeight: '700', color: colors.text },
  greetingSubtitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: fontSizes.lg },
  searchContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  locationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, marginRight: spacing.sm },
  locationCurrent: { fontSize: fontSizes.md, color: colors.text },
  searchDivider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg, marginVertical: spacing.xs },
  destinationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  destinationDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.accent, marginRight: spacing.sm },
  destinationInput: { flex: 1, fontSize: fontSizes.md, color: colors.text },
  suggestions: { backgroundColor: colors.white, borderRadius: borderRadius.md, marginTop: spacing.xs, ...shadows.sm },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  suggestionIcon: { marginRight: spacing.sm },
  suggestionText: { fontSize: fontSizes.sm, color: colors.text, flex: 1 },
  quickActions: { flexDirection: 'row', marginBottom: spacing.md },
  quickAction: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  quickActionIcon: { fontSize: 24 },
  quickActionLabel: { fontSize: fontSizes.xs, color: colors.text, fontWeight: '600', marginTop: 4 },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  savedAddr: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  savedAddrIcon: { fontSize: 20, marginRight: spacing.md },
  savedAddrLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text },
  savedAddrText: { fontSize: fontSizes.xs, color: colors.textSecondary, maxWidth: 260 },
});
