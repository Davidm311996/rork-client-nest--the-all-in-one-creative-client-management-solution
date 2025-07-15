import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XCircle, Mail } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function InviteExpiredScreen() {
  const router = useRouter();

  const handleContactCreative = () => {
    // In a real app, this would get the creative's email from the invite token
    const creativeEmail = 'creative@example.com';
    Linking.openURL(`mailto:${creativeEmail}?subject=New Invite Request&body=Hi, my invite link has expired. Could you please send me a new one?`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <XCircle size={80} color={colors.error} />
        </View>
        
        <Text style={[typography.h1, styles.title]}>This invite link has expired</Text>
        <Text style={[typography.body, styles.description]}>
          For security, invite links expire after 7 days. Please ask your creative to send you a new one.
        </Text>
        
        <Button
          title="Contact Creative"
          variant="primary"
          onPress={handleContactCreative}
          leftIcon={<Mail size={18} color={colors.text.inverse} />}
          style={styles.contactButton}
        />
        
        <TouchableOpacity onPress={() => router.replace('/auth')}>
          <Text style={styles.backToLogin}>Back to Login</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 40,
    lineHeight: 24,
  },
  contactButton: {
    marginBottom: 24,
  },
  backToLogin: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});