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
  DollarSign,
  Users,
  FolderOpen,
  Mail,
  Phone,
  Camera
} from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import { useThemeStore } from '@/store/themeStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors } = useThemeStore();
  const { subscription, getCurrentPlan } = useSubscriptionStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid' || subscription.tier === 'top';
  
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text.primary,
      letterSpacing: -0.8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.text.secondary,
      marginTop: 4,
    },
    settingsButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingBottom: 120,
    },
    profileSection: {
      backgroundColor: colors.surface,
      marginHorizontal: 24,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.surface,
    },
    profileName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 4,
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      width: '100%',
    },
    profileInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      width: '100%',
    },
    profileInfoIcon: {
      width: 40,
      alignItems: 'center',
    },
    profileInfoContent: {
      flex: 1,
      marginLeft: 12,
    },
    profileInfoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 2,
    },
    profileInfoValue: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text.primary,
      marginHorizontal: 24,
      marginBottom: 16,
    },
    managementCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 24,
      borderRadius: 20,
      marginBottom: 24,
    },
    managementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    managementIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    managementContent: {
      flex: 1,
    },
    managementTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    managementDescription: {
      fontSize: 14,
      color: colors.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Settings size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar name={user?.name || 'User'} size={80} />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>User</Text>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.profileInfoRow} onPress={() => router.push('/personal-info')}>
            <View style={styles.profileInfoIcon}>
              <User size={20} color={colors.primary} />
            </View>
            <View style={styles.profileInfoContent}>
              <Text style={styles.profileInfoLabel}>Name</Text>
              <Text style={styles.profileInfoValue}>No name set</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileInfoRow} onPress={() => router.push('/personal-info')}>
            <View style={styles.profileInfoIcon}>
              <Mail size={20} color={colors.primary} />
            </View>
            <View style={styles.profileInfoContent}>
              <Text style={styles.profileInfoLabel}>Email</Text>
              <Text style={styles.profileInfoValue}>No email</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileInfoRow} onPress={() => router.push('/personal-info')}>
            <View style={styles.profileInfoIcon}>
              <Phone size={20} color={colors.primary} />
            </View>
            <View style={styles.profileInfoContent}>
              <Text style={styles.profileInfoLabel}>Phone</Text>
              <Text style={styles.profileInfoValue}>No phone</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.managementCard}>
          <TouchableOpacity 
            style={styles.managementItem}
            onPress={() => router.push('/clients')}
          >
            <View style={[styles.managementIcon, { backgroundColor: colors.invite + '20' }]}>
              <Users size={24} color={colors.invite} />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Clients</Text>
              <Text style={styles.managementDescription}>Manage your client relationships</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.managementItem}
            onPress={() => router.push('/files')}
          >
            <View style={[styles.managementIcon, { backgroundColor: colors.clients + '20' }]}>
              <FolderOpen size={24} color={colors.clients} />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Files</Text>
              <Text style={styles.managementDescription}>Manage your project files</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.managementItem}
            onPress={() => router.push('/contracts')}
          >
            <View style={[styles.managementIcon, { backgroundColor: colors.contracts + '20' }]}>
              <FileText size={24} color={colors.contracts} />
            </View>
            <View style={styles.managementContent}>
              <Text style={styles.managementTitle}>Contracts</Text>
              <Text style={styles.managementDescription}>Create and manage contracts</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}