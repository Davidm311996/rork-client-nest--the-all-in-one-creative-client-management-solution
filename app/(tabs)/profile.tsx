import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Crown,
  Settings,
  FileText,
  DollarSign
} from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { subscription, getCurrentPlan } = useSubscriptionStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid' || subscription.tier === 'top';
  
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

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Settings size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <Avatar name={user?.name || 'User'} size={80} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.profileRole}>
              {user?.businessName || 'Creative Professional'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <User size={22} color={colors.primary} />,
              "Personal Information",
              "Manage your profile details",
              undefined,
              () => router.push('/personal-info')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.subscriptionItem}
              onPress={() => router.push('/subscription')}
            >
              <View style={styles.subscriptionContent}>
                <View style={styles.subscriptionHeader}>
                  <Crown size={20} color={colors.secondary} />
                  <Text style={styles.subscriptionPlan}>{currentPlan.name} Plan</Text>
                  {currentPlan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.subscriptionPrice}>
                  {currentPlan.price === 0 ? 'Free' : `£${currentPlan.price}/month`}
                </Text>
                {/* Only show project usage for free plan */}
                {!isProPlan && (
                  <Text style={styles.subscriptionUsage}>
                    {subscription.projectsUsed} of {currentPlan.features.maxProjects === 'unlimited' ? '∞' : currentPlan.features.maxProjects} projects used
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <FileText size={22} color={colors.primary} />,
              "Contract Templates",
              "Manage your contract templates",
              undefined,
              () => router.push('/contract-templates')
            )}
            {renderSettingItem(
              <DollarSign size={22} color={colors.primary} />,
              "Invoices & Payments",
              "Manage invoices, payments and payout methods",
              undefined,
              () => router.push('/payments')
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
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
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

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: colors.error + '20',
  },
  logoutText: {
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  subscriptionContent: {
    flex: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  popularBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  popularBadgeText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },
  subscriptionPrice: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  subscriptionUsage: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  content: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
});