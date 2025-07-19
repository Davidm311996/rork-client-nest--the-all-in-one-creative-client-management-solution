import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: boolean;
};

export default function Card({ children, style, elevation = true }: CardProps) {
  const { colors } = useThemeStore();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    elevation: {
      // Removed shadows for flat design
    },
  });
  
  if (!children) {
    return null;
  }
  
  return (
    <View style={[styles.card, elevation && styles.elevation, style]}>
      {children}
    </View>
  );
}