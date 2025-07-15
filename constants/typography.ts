import { StyleSheet } from 'react-native';
import { lightTheme } from './colors';

// Use static colors to avoid circular dependencies
const staticColors = lightTheme;

export default StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: staticColors.text.primary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: staticColors.text.primary,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: staticColors.text.primary,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: staticColors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: staticColors.text.primary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: staticColors.text.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: staticColors.text.tertiary,
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
    color: staticColors.text.secondary,
    marginBottom: 6,
  },
});