import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import Button from '@/components/Button';

export default function ClientEmailScreen() {
  const router = useRouter();
  const { isLoading } = useAuthStore();
  const { colors } = useThemeStore();
  const [email, setEmail] = useState('');

  const handleContinue = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      // Allow all emails for now - no invite validation
      // Send verification code and navigate to verification
      router.push({ pathname: '/client-verify', params: { email } });
    } catch {
      Alert.alert('Error', 'Failed to process request. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      gap: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text.primary,
    },
    submitButton: {
      marginTop: 8,
    },
    footer: {
      alignItems: 'center',
      marginTop: 32,
    },
    footerText: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Client access</Text>
              <Text style={styles.subtitle}>
                Enter your email address to continue
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
              </View>

              <Button
                title="Continue"
                onPress={handleContinue}
                loading={isLoading}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                We&apos;ll send you a verification code to confirm your email.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}