import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from './colors';

export const createTypography = (colors: typeof lightTheme | typeof darkTheme) => StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 6,
  },
});

// Default export for backward compatibility
export default createTypography(lightTheme);