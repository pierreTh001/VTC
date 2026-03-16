import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const btnStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const txtStyle = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle];

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} size="small" />
      ) : (
        <Text style={txtStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
  disabled: { opacity: 0.5 },
  fullWidth: { width: '100%' },
  size_sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  size_md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
  size_lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  text: { fontWeight: '600' },
  text_primary: { color: colors.white },
  text_secondary: { color: colors.white },
  text_outline: { color: colors.primary },
  text_ghost: { color: colors.primary },
  text_danger: { color: colors.white },
  textSize_sm: { fontSize: fontSizes.sm },
  textSize_md: { fontSize: fontSizes.md },
  textSize_lg: { fontSize: fontSizes.lg },
});
