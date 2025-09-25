
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#0052FF',      // Base blue - vibrant and modern
  secondary: '#00D4FF',    // Cyan accent
  accent: '#7C3AED',       // Purple for highlights
  success: '#10B981',      // Green for success states
  background: '#FFFFFF',   // Clean white background
  backgroundAlt: '#F8FAFC', // Light gray background
  surface: '#FFFFFF',      // Card surfaces
  text: '#1F2937',         // Dark gray text
  textSecondary: '#6B7280', // Medium gray text
  textLight: '#9CA3AF',    // Light gray text
  border: '#E5E7EB',       // Light border
  borderLight: '#F3F4F6',  // Very light border
  error: '#EF4444',        // Red for errors
  warning: '#F59E0B',      // Orange for warnings
  overlay: 'rgba(0, 0, 0, 0.5)', // Dark overlay
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  md: {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
    elevation: 3,
  },
  lg: {
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  xl: {
    boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.background,
    ...typography.bodyMedium,
  },
  secondaryText: {
    color: colors.text,
    ...typography.bodyMedium,
  },
  ghostText: {
    color: colors.primary,
    ...typography.bodyMedium,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardLarge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heading: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textSecondary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  textLight: {
    ...typography.body,
    color: colors.textLight,
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  small: {
    ...typography.small,
    color: colors.textLight,
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '600',
  },
  mb_xs: { marginBottom: spacing.xs },
  mb_sm: { marginBottom: spacing.sm },
  mb_md: { marginBottom: spacing.md },
  mb_lg: { marginBottom: spacing.lg },
  mb_xl: { marginBottom: spacing.xl },
  mt_xs: { marginTop: spacing.xs },
  mt_sm: { marginTop: spacing.sm },
  mt_md: { marginTop: spacing.md },
  mt_lg: { marginTop: spacing.lg },
  mt_xl: { marginTop: spacing.xl },
  mx_sm: { marginHorizontal: spacing.sm },
  mx_md: { marginHorizontal: spacing.md },
  mx_lg: { marginHorizontal: spacing.lg },
  my_sm: { marginVertical: spacing.sm },
  my_md: { marginVertical: spacing.md },
  my_lg: { marginVertical: spacing.lg },
  p_sm: { padding: spacing.sm },
  p_md: { padding: spacing.md },
  p_lg: { padding: spacing.lg },
  px_sm: { paddingHorizontal: spacing.sm },
  px_md: { paddingHorizontal: spacing.md },
  px_lg: { paddingHorizontal: spacing.lg },
  py_sm: { paddingVertical: spacing.sm },
  py_md: { paddingVertical: spacing.md },
  py_lg: { paddingVertical: spacing.lg },
});
