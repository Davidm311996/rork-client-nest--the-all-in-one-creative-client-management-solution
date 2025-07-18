import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Palette,
  Shield, 
  HelpCircle, 
  Mail,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Lock,
  Download,
  Trash2,
  Coins,
  Building,
  FileText
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';

import typography from '@/constants/typography';
import { useThemeStore } from '@/store/themeStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const { theme, toggleTheme, colors } = useThemeStore();
  const { selectedCurrency } = useCurrencyStore();
  const { subscription } = useSubscriptionStore();
  
  const handleCurrencyChange = () => {
    router.push('/currency-settings');
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIconContainer}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (
        onPress && <ChevronRight size={20} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached files and data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will be emailed to you within 24 hours.');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 100, // Extra padding for floating tab bar
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.secondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingsCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingIconContainer: {
      width: 40,
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
      marginLeft: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text.primary,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginTop: 2,
    },
    versionContainer: {
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 16,
    },
    versionText: {
      color: colors.text.tertiary,
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Settings" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              theme === 'dark' ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.primary} />,
              "Theme",
              `Currently using ${theme} mode`,
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
            {renderSettingItem(
              <Globe size={22} color={colors.primary} />,
              "Language",
              "English (US)",
              undefined,
              () => Alert.alert('Language', 'Language settings coming soon')
            )}
            {renderSettingItem(
              <Coins size={22} color={colors.primary} />,
              "Currency",
              selectedCurrency.name,
              undefined,
              handleCurrencyChange
            )}
          </View>
        </View>

        {/* Business Section - Only for Studio plan */}
        {subscription.tier === 'top' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business</Text>
            <View style={styles.settingsCard}>
              {renderSettingItem(
                <Palette size={22} color={colors.primary} />,
                "Branding",
                "Customize invoice and contract branding",
                undefined,
                () => router.push('/branding-settings')
              )}
              {renderSettingItem(
                <Building size={22} color={colors.primary} />,
                "Company Information",
                "Update business details",
                undefined,
                () => router.push('/company-settings')
              )}
              {renderSettingItem(
                <FileText size={22} color={colors.primary} />,
                "Invoice Templates",
                "Customize invoice appearance",
                undefined,
                () => router.push('/invoice-templates')
              )}
              {renderSettingItem(
                <FileText size={22} color={colors.primary} />,
                "Contract Templates",
                "Manage contract branding",
                undefined,
                () => router.push('/contract-templates')
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Bell size={22} color={colors.primary} />,
              "Push Notifications",
              "Get alerts about client activity",
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
            {renderSettingItem(
              <Mail size={22} color={colors.primary} />,
              "Email Notifications",
              "Receive updates via email",
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
            {renderSettingItem(
              <Smartphone size={22} color={colors.primary} />,
              "In-App Notifications",
              "Show notifications within the app",
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Lock size={22} color={colors.primary} />,
              "Biometric Authentication",
              "Use Face ID or fingerprint to unlock",
              <Switch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
            {renderSettingItem(
              <Shield size={22} color={colors.primary} />,
              "Privacy Policy",
              "Review our privacy practices",
              undefined,
              () => router.push('/privacy-policy')
            )}
            {renderSettingItem(
              <Shield size={22} color={colors.primary} />,
              "Terms of Service",
              "Read our terms and conditions",
              undefined,
              () => router.push('/terms-of-service')
            )}
            {renderSettingItem(
              <Download size={22} color={colors.primary} />,
              "Export Data",
              "Download a copy of your data",
              undefined,
              handleExportData
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Download size={22} color={colors.primary} />,
              "Auto-Download Files",
              "Automatically download new files",
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
                trackColor={{ false: colors.inactive, true: colors.primary }}
                thumbColor={colors.text.primary}
              />
            )}
            {renderSettingItem(
              <Trash2 size={22} color={colors.primary} />,
              "Clear Cache",
              "Free up storage space",
              undefined,
              handleClearCache
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <HelpCircle size={22} color={colors.primary} />,
              "Help Center",
              "Get answers to common questions",
              undefined,
              () => router.push('/help')
            )}
            {renderSettingItem(
              <Mail size={22} color={colors.primary} />,
              "Contact Support",
              "Get help from our team",
              undefined,
              () => Alert.alert('Contact Support', 'Opening support chat...')
            )}
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Client Nest v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

