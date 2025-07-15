import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function SplashScreen() {
  const router = useRouter();
  const { inviteToken } = useLocalSearchParams();
  const { isAuthenticated, checkAuthStatus, validateInviteToken } = useAuthStore();
  const { isOnboardingComplete, checkOnboardingStatus } = useOnboardingStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If there's an invite token, validate it first
        if (inviteToken) {
          const isValidInvite = await validateInviteToken(inviteToken as string);
          if (!isValidInvite) {
            router.replace('/invite-expired');
            return;
          }
        }

        // Check onboarding status
        await checkOnboardingStatus();
        
        // Check auth status
        await checkAuthStatus();
        
        // Route user based on status
        setTimeout(() => {
          if (!isOnboardingComplete) {
            router.replace('/onboarding');
          } else if (!isAuthenticated) {
            // Pass invite token to auth screen if present
            if (inviteToken) {
              router.replace(`/auth?inviteToken=${inviteToken}`);
            } else {
              router.replace('/auth');
            }
          } else {
            router.replace('/(tabs)');
          }
        }, 2000); // 2 second splash
      } catch (error) {
        console.error('App initialization error:', error);
        router.replace('/auth');
      }
    };

    initializeApp();
  }, [inviteToken]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder} />
          <Text style={[typography.h2, styles.logoText]}>Client Nest</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  logoText: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  loader: {
    marginTop: 20,
  },
});