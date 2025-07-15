import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckCircle, Sparkles } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Person with checkmark icon */}
        <View style={styles.personIcon}>
          <CheckCircle size={80} color="#1E90FF" fill="#1E90FF" />
        </View>
        
        {/* Sparkle icon */}
        <View style={styles.sparkleIcon}>
          <Sparkles size={32} color="#1E90FF" fill="#1E90FF" />
        </View>
      </View>
      
      <Text style={styles.appName}>Client Nest</Text>
      <Text style={styles.tagline}>Professional Creative Services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  personIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleIcon: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});