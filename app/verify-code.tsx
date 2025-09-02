import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import Button from '@/components/Button';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email, type } = useLocalSearchParams();
  const { verifyEmail, isLoading } = useAuthStore();
  const { colors } = useThemeStore();
  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const isPasswordReset = type === 'reset';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    try {
      if (isPasswordReset) {
        // Mock password reset verification
        if (code === '123456') {
          Alert.alert(
            'Code Verified',
            'Please enter your new password.',
            [
              {
                text: 'Continue',
                onPress: () => router.push({ pathname: '/reset-password', params: { email: email as string } })
              }
            ]
          );
        } else {
          Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
        }
      } else {
        // Email verification for account creation
        await verifyEmail(code);
        router.replace('/(tabs)');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
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
    iconContainer: {
      marginBottom: 16,
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
    emailText: {
      fontWeight: '600',
      color: colors.text.primary,
    },
    form: {
      gap: 24,
    },
    codeInputContainer: {
      alignItems: 'center',
    },
    codeInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 20,
      paddingHorizontal: 16,
      fontSize: 24,
      color: colors.text.primary,
      backgroundColor: colors.surface,
      letterSpacing: 8,
      textAlign: 'center',
      width: '100%',
      maxWidth: 200,
    },
    submitButton: {
      marginTop: 8,
    },
    footer: {
      alignItems: 'center',
      marginTop: 32,
      gap: 16,
    },
    resendContainer: {
      alignItems: 'center',
    },
    resendButton: {
      padding: 8,
    },
    resendText: {
      fontSize: 14,
      color: canResend ? colors.primary : colors.text.tertiary,
      fontWeight: '500',
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
              <View style={styles.iconContainer}>
                <CheckCircle size={48} color={colors.primary} />
              </View>
              <Text style={styles.title}>
                {isPasswordReset ? 'Enter verification code' : 'Verify your email'}
              </Text>
              <Text style={styles.subtitle}>
                We have sent a 6-digit code to{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="000000"
                  placeholderTextColor={colors.text.tertiary}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              <Button
                title={isPasswordReset ? 'Verify Code' : 'Verify Email'}
                onPress={handleVerify}
                loading={isLoading}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <View style={styles.resendContainer}>
                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={handleResendCode}
                  disabled={!canResend}
                >
                  <Text style={styles.resendText}>
                    {canResend ? 'Resend code' : `Resend code in ${resendTimer}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}