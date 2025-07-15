import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot';

export default function AuthScreen() {
  const router = useRouter();
  const { inviteToken } = useLocalSearchParams();
  const { login, register, verifyEmail, sendPasswordReset, isLoading, pendingVerification } = useAuthStore();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });

  // Check if this is an invite signup
  const isInviteSignup = !!inviteToken;

  useEffect(() => {
    if (isInviteSignup) {
      setMode('signup');
    }
  }, [isInviteSignup]);

  useEffect(() => {
    if (pendingVerification) {
      setMode('verify');
    }
  }, [pendingVerification]);

  const handleSubmit = async () => {
    if (mode === 'verify') {
      if (!verificationCode || verificationCode.length !== 6) {
        Alert.alert('Error', 'Please enter a valid 6-digit code');
        return;
      }
      
      try {
        await verifyEmail(verificationCode);
        router.replace('/(tabs)');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        Alert.alert('Error', errorMessage);
      }
      return;
    }

    if (mode === 'forgot') {
      if (!formData.email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }
      
      try {
        await sendPasswordReset(formData.email);
        Alert.alert('Success', 'Password reset email sent. Check your inbox.');
        setMode('login');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
        Alert.alert('Error', errorMessage);
      }
      return;
    }

    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (mode === 'signup') {
      if (!formData.name) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        router.replace('/(tabs)');
      } else {
        // Determine role based on invite token
        const role = isInviteSignup ? 'client' : 'creative';
        await register(
          formData.name, 
          formData.email, 
          formData.password, 
          role,
          formData.businessName,
          inviteToken as string
        );
        // Will automatically go to verify mode due to pendingVerification state
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      Alert.alert('Error', errorMessage);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderVerificationScreen = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.verifyIconContainer}>
          <CheckCircle size={48} color={colors.primary} />
        </View>
        <Text style={[typography.h1, styles.title]}>Check Your Email</Text>
        <Text style={[typography.body, styles.subtitle]}>
          We sent a 6-digit code to {formData.email}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter 6-digit code"
            placeholderTextColor={colors.text.tertiary}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
        </View>

        <Button
          title="Verify Email"
          onPress={handleSubmit}
          variant="primary"
          loading={isLoading}
          style={styles.submitButton}
        />

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForgotPasswordScreen = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={[typography.h1, styles.title]}>Reset Password</Text>
        <Text style={[typography.body, styles.subtitle]}>
          Enter your email and we'll send you a reset link
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.text.tertiary}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Button
          title="Send Reset Link"
          onPress={handleSubmit}
          variant="primary"
          loading={isLoading}
          style={styles.submitButton}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setMode('login')}>
          <Text style={styles.switchButton}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (mode === 'verify') {
    return (
      <KeyboardAwareView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {renderVerificationScreen()}
        </SafeAreaView>
      </KeyboardAwareView>
    );
  }

  if (mode === 'forgot') {
    return (
      <KeyboardAwareView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {renderForgotPasswordScreen()}
        </SafeAreaView>
      </KeyboardAwareView>
    );
  }

  return (
    <KeyboardAwareView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[typography.h1, styles.title]}>
            {isInviteSignup 
              ? 'Join Client Nest' 
              : mode === 'login' 
                ? 'Welcome Back' 
                : 'Create Account'
            }
          </Text>
          <Text style={[typography.body, styles.subtitle]}>
            {isInviteSignup 
              ? 'You have been invited to collaborate'
              : mode === 'login' 
                ? 'Sign in to your Client Nest account' 
                : 'Join thousands of creative professionals'
            }
          </Text>
        </View>

        <View style={styles.form}>
          {/* Apple Sign In Button */}
          <Button
            title="Continue with Apple"
            onPress={() => Alert.alert('Apple Sign In', 'Apple Sign In would be implemented here')}
            variant="outline"
            style={styles.socialButton}
            leftIcon={<User size={20} color={colors.text.primary} />}
          />
          
          {/* Google Sign In Button */}
          <Button
            title="Continue with Google"
            onPress={() => Alert.alert('Google Sign In', 'Google Sign In would be implemented here')}
            variant="outline"
            style={styles.socialButton}
            leftIcon={<User size={20} color={colors.text.primary} />}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {mode === 'signup' && (
            <View style={styles.inputContainer}>
              <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.text.tertiary}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.text.tertiary}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isInviteSignup} // Lock email if from invite
            />
          </View>

          {mode === 'signup' && !isInviteSignup && (
            <View style={styles.inputContainer}>
              <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Business Name (Optional)"
                placeholderTextColor={colors.text.tertiary}
                value={formData.businessName}
                onChangeText={(value) => updateFormData('businessName', value)}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.text.tertiary}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.text.tertiary} />
              ) : (
                <Eye size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>

          {mode === 'signup' && (
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.text.tertiary}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showPassword}
              />
            </View>
          )}

          <Button
            title={
              isInviteSignup 
                ? 'Join Client Nest' 
                : mode === 'login' 
                  ? 'Sign In' 
                  : 'Create Account'
            }
            onPress={handleSubmit}
            variant="primary"
            loading={isLoading}
            style={styles.submitButton}
          />

          {mode === 'login' && (
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => setMode('forgot')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isInviteSignup && (
          <View style={styles.footer}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              <Text style={styles.switchButton}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      </SafeAreaView>
    </KeyboardAwareView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyIconContainer: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
  },
  codeInputContainer: {
    marginBottom: 24,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 20,
    fontSize: 24,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    letterSpacing: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  switchButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  socialButton: {
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.tertiary,
    fontSize: 14,
  },
});