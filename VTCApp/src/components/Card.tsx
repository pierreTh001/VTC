import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = false }) => (
  <View style={[styles.card, elevated && shadows.md, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
