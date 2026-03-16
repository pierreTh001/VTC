import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';

export const StubBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.text}>🔧 MODE STUB — Backend en cours de développement</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
