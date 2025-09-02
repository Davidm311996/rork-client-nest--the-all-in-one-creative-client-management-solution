import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, MessageCircle, CreditCard, LogOut } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function ClientDashboardScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };

  const quickActions = [
    { id: 'projects', title: 'View Projects', icon: FileText, color: colors.primary },
    { id: 'messages', title: 'Messages', icon: MessageCircle, color: colors.secondary },
    { id: 'invoices', title: 'Pay Invoices', icon: CreditCard, color: colors.accent },
    { id: 'files', title: 'View Files', icon: FileText, color: colors.primary },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    section: {
      marginVertical: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickActionCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text.primary,
      textAlign: 'center',
    },
    emptyState: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
    },
    logoutText: {
      fontSize: 16,
      color: colors.error,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.subtitle}>Here&apos;s what&apos;s happening with your projects</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => {
                    // Navigate to respective screens when implemented
                    console.log(`Navigate to ${action.id}`);
                  }}
                  activeOpacity={0.7}
                >
                  <action.icon 
                    size={24} 
                    color={action.color} 
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Your creative will add your first project.{'\n'}
                You will see it here.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}