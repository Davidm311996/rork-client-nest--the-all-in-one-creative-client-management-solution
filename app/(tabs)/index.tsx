import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  UserPlus, 
  Users, 
  StickyNote,
  CheckCircle,
  Info,
  Clock,
  Coins,
  MessageCircle,
  Upload,
  Calendar,
  TrendingUp,
  FileText,
  CreditCard
} from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { SubscriptionTier } from '@/types/subscription';
import { useThemeStore } from '@/store/themeStore';
import { createTypography } from '@/constants/typography';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

interface Activity {
  id: string;
  title: string;
  time: string;
  icon: React.ReactElement;
  route: string;
  timestamp: number;
  type: 'payment' | 'file' | 'message' | 'contract' | 'project';
  projectId?: string;
  clientId?: string;
  paymentType?: 'deposit' | 'final';
  contractId?: string;
  invoiceId?: string;
  fileId?: string;
  messageId?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const typography = createTypography(colors);
  const { projects, fetchProjects } = useProjectStore();
  const { canCreateProject, getCurrentPlan, subscription } = useSubscriptionStore();
  const { user } = useAuthStore();
  const { formatAmount } = useCurrencyStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Calculate metrics
  const activeProjects = projects.filter(project => project.status !== 'Completed');
  const pendingPayments = projects.filter(project => 
    project.paymentStatus === 'Not Started' || project.paymentStatus === 'Deposit Paid'
  ).length;
  const unreadMessages = projects.reduce((total, project) => 
    total + project.messages.filter(msg => !msg.read && msg.senderId !== 'user').length, 0
  );

  const handleNewClient = () => {
    if (!canCreateProject()) {
      setShowUpgradePrompt(true);
      return;
    }
    router.push('/new-client');
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    const { upgradeTier } = useSubscriptionStore.getState();
    try {
      await upgradeTier(tier);
      router.push('/new-client');
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };

  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid' || subscription.tier === 'top';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 24,
      paddingBottom: 120,
      flexGrow: 1,
    },
    emptyContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      paddingBottom: 120,
      minHeight: '100%',
    },
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    emptyTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    emptyDescription: {
      fontSize: 17,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    emptyActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 16,
      gap: 8,
    },
    emptyActionText: {
      color: colors.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    welcomeBanner: {
      marginBottom: 24,
      paddingHorizontal: 4,
    },
    projectSlotsWarning: {
      backgroundColor: colors.warning + '10',
      borderWidth: 1,
      borderColor: colors.warning + '30',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    warningContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    warningText: {
      fontSize: 14,
      color: colors.warning,
      fontWeight: '600',
      flex: 1,
    },
    upgradeButton: {
      backgroundColor: colors.warning,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    upgradeButtonText: {
      color: colors.text.inverse,
      fontSize: 14,
      fontWeight: '600',
    },
    welcomeText: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 8,
      letterSpacing: -0.8,
      lineHeight: 38,
    },
    welcomeSubtext: {
      fontSize: 17,
      color: colors.text.secondary,
      lineHeight: 24,
    },
    metricsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
      gap: 12,
    },
    metricCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    metricValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    metricLabel: {
      fontSize: 13,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text.primary,
      letterSpacing: -0.6,
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    sectionContent: {
      // Container for section content with proper spacing
    },
    seeAllText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    actionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    actionButton: {
      width: (width - 80) / 4, // Fit 4 on one line
      height: (width - 80) / 4, // Perfect squares
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      opacity: 0.8, // Muted colors
    },
    actionButtonText: {
      color: colors.text.inverse,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 14,
    },
    projectCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    projectClientName: {
      fontSize: 19,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 6,
      letterSpacing: -0.3,
    },
    projectDescription: {
      fontSize: 15,
      color: colors.text.secondary,
      marginBottom: 16,
      lineHeight: 22,
    },
    projectFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    projectDate: {
      fontSize: 13,
      color: colors.text.tertiary,
      fontWeight: '500',
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    activityIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
      lineHeight: 20,
    },
    activityTime: {
      fontSize: 13,
      color: colors.text.tertiary,
      fontWeight: '500',
    },
    earningsCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    earningsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    earningsAmount: {
      fontSize: 36,
      fontWeight: '700',
      color: colors.text.primary,
      marginLeft: 16,
      letterSpacing: -1,
    },
    earningsLabel: {
      fontSize: 15,
      color: colors.text.secondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    earningsGrowth: {
      fontSize: 13,
      color: colors.success,
      fontWeight: '600',
    },
  });

  // Different quick actions for Creative vs Client
  const creativeQuickActions = [
    {
      title: 'Invite\nClient',
      icon: <UserPlus size={18} color={colors.text.inverse} />,
      backgroundColor: colors.invite,
      onPress: () => router.push('/invite-client'),
    },
    {
      title: 'New\nBooking',
      icon: <Calendar size={18} color={colors.text.inverse} />,
      backgroundColor: colors.clients,
      onPress: () => router.push('/booking'),
    },
    {
      title: 'Upload\nFiles',
      icon: <Upload size={18} color={colors.text.inverse} />,
      backgroundColor: colors.contracts,
      onPress: () => router.push('/files'),
    },
    {
      title: 'Notes',
      icon: <StickyNote size={18} color={colors.text.inverse} />,
      backgroundColor: colors.notes,
      onPress: () => router.push('/notes'),
    },
  ];

  const clientQuickActions = [
    {
      title: 'Message\nCreative',
      icon: <MessageCircle size={18} color={colors.text.inverse} />,
      backgroundColor: colors.invite,
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      title: 'Download\nFiles',
      icon: <Upload size={18} color={colors.text.inverse} />,
      backgroundColor: colors.clients,
      onPress: () => router.push('/files'),
    },
    {
      title: 'Sign\nContract',
      icon: <StickyNote size={18} color={colors.text.inverse} />,
      backgroundColor: colors.contracts,
      onPress: () => router.push('/contracts'),
    },
    {
      title: 'Make\nPayment',
      icon: <Coins size={18} color={colors.text.inverse} />,
      backgroundColor: colors.notes,
      onPress: () => router.push('/payments'),
    },
  ];

  const quickActions = user?.role === 'creative' ? creativeQuickActions : clientQuickActions;
  
  // Generate realistic recent activity based on actual project data - limit to 3 most recent
  // Only show client activity, not user activity
  const generateRecentActivity = (): Activity[] => {
    const activities: Activity[] = [];
    
    // Get recent file approvals (client activity only)
    projects.forEach(project => {
      project.files.forEach(file => {
        const uploadDate = new Date(file.uploadedAt);
        const daysSinceUpload = (Date.now() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpload <= 7 && file.approved) {
          const hoursAgo = Math.floor((Date.now() - uploadDate.getTime()) / (1000 * 60 * 60));
          const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;
          
          activities.push({
            id: `file_approved_${file.id}`,
            title: `${project.clientName} approved files`,
            time: timeText,
            icon: <CheckCircle size={20} color={colors.success} />,
            route: `/project/${project.id}?tab=files`,
            timestamp: uploadDate.getTime() + 3600000, // 1 hour after upload
            type: 'file',
            projectId: project.id,
            clientId: project.clientId,
            fileId: file.id,
          });
        }
      });
    });

    // Get recent payments based on project payment status
    projects.forEach(project => {
      if (project.paymentStatus === 'Final Paid' && project.finalInvoiceId) {
        // Map project invoice IDs to payment system IDs
        const invoiceId = getInvoiceIdFromProject(project.finalInvoiceId, 'final');
        activities.push({
          id: `payment_final_${project.id}`,
          title: `Invoice paid by ${project.clientName}`,
          time: '1 day ago',
          icon: <Coins size={20} color={colors.success} />,
          route: `/invoice/${invoiceId}`,
          timestamp: Date.now() - (24 * 60 * 60 * 1000),
          type: 'payment',
          projectId: project.id,
          clientId: project.clientId,
          paymentType: 'final',
          invoiceId: invoiceId,
        });
      } else if (project.paymentStatus === 'Deposit Paid' && project.depositInvoiceId) {
        // Map project invoice IDs to payment system IDs
        const invoiceId = getInvoiceIdFromProject(project.depositInvoiceId, 'deposit');
        activities.push({
          id: `payment_deposit_${project.id}`,
          title: `Deposit paid by ${project.clientName}`,
          time: '2 days ago',
          icon: <Coins size={20} color={colors.success} />,
          route: `/invoice/${invoiceId}`,
          timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000),
          type: 'payment',
          projectId: project.id,
          clientId: project.clientId,
          paymentType: 'deposit',
          invoiceId: invoiceId,
        });
      }
    });

    // Get recent messages from clients only (not from user)
    projects.forEach(project => {
      if (project.messages.length > 0) {
        const lastMessage = project.messages[project.messages.length - 1];
        const messageDate = new Date(lastMessage.timestamp);
        const daysSinceMessage = (Date.now() - messageDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Only show messages from clients, not from user
        if (daysSinceMessage <= 3 && lastMessage.senderId !== 'user') {
          const hoursAgo = Math.floor((Date.now() - messageDate.getTime()) / (1000 * 60 * 60));
          const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;
          
          activities.push({
            id: `message_${lastMessage.id}`,
            title: `New message from ${lastMessage.senderName}`,
            time: timeText,
            icon: <MessageCircle size={20} color={colors.accent} />,
            route: `/project/${project.id}?tab=messages`,
            timestamp: messageDate.getTime(),
            type: 'message',
            projectId: project.id,
            clientId: project.clientId,
            messageId: lastMessage.id,
          });
        }
      }
    });

    // Get contract activities
    projects.forEach(project => {
      if (project.contractSigned && project.contractSignedDate) {
        const signedDate = new Date(project.contractSignedDate);
        const daysSinceSigned = (Date.now() - signedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceSigned <= 7) {
          const hoursAgo = Math.floor((Date.now() - signedDate.getTime()) / (1000 * 60 * 60));
          const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;
          
          activities.push({
            id: `contract_signed_${project.id}`,
            title: `${project.clientName} signed contract`,
            time: timeText,
            icon: <FileText size={20} color={colors.success} />,
            route: `/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${project.contractId}&signed=true`,
            timestamp: signedDate.getTime(),
            type: 'contract',
            projectId: project.id,
            clientId: project.clientId,
            contractId: project.contractId,
          });
        }
      } else if (project.contractId && !project.contractSigned) {
        // Contract viewed activity
        const viewedDate = new Date(project.createdAt);
        const daysSinceViewed = (Date.now() - viewedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceViewed <= 5) {
          const hoursAgo = Math.floor((Date.now() - viewedDate.getTime()) / (1000 * 60 * 60));
          const timeText = hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`;
          
          activities.push({
            id: `contract_viewed_${project.id}`,
            title: `${project.clientName} viewed contract`,
            time: timeText,
            icon: <FileText size={20} color={colors.accent} />,
            route: `/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${project.contractId}`,
            timestamp: viewedDate.getTime() + 7200000, // 2 hours after creation
            type: 'contract',
            projectId: project.id,
            clientId: project.clientId,
            contractId: project.contractId,
          });
        }
      }
    });

    // Sort by timestamp (most recent first) and return top 3
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  };
  
  // Helper function to map project invoice IDs to payment system IDs
  const getInvoiceIdFromProject = (projectInvoiceId: string, type: 'deposit' | 'final'): string => {
    // Map project invoice IDs to actual payment IDs from the payments system
    const invoiceMapping: Record<string, string> = {
      'invoice_1': '1', // Sarah Johnson - Wedding Photography deposit
      'invoice_3': '3', // Bloom Boutique - Product Photography deposit  
      'invoice_4': '1', // Apex Fitness - Website Redesign deposit (same client as Sarah)
      'invoice_5': '4', // Apex Fitness - Website Redesign final
    };
    
    return invoiceMapping[projectInvoiceId] || '1'; // Default to first invoice if not found
  };
  
  const recentActivity: Activity[] = generateRecentActivity();

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { backgroundColor: colors.success + '20', borderWidth: 1, borderColor: colors.success + '40' };
      case 'in progress':
        return { backgroundColor: colors.warning + '20', borderWidth: 1, borderColor: colors.warning + '40' };
      case 'contract sent':
        return { backgroundColor: colors.accent + '20', borderWidth: 1, borderColor: colors.accent + '40' };
      case 'pending':
        return { backgroundColor: colors.inactive + '20', borderWidth: 1, borderColor: colors.inactive + '40' };
      default:
        return { backgroundColor: colors.primary + '20', borderWidth: 1, borderColor: colors.primary + '40' };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { color: colors.success, fontWeight: '700' as const };
      case 'in progress':
        return { color: colors.warning, fontWeight: '700' as const };
      case 'contract sent':
        return { color: colors.accent, fontWeight: '700' as const };
      case 'pending':
        return { color: colors.inactive, fontWeight: '700' as const };
      default:
        return { color: colors.primary, fontWeight: '700' as const };
    }
  };

  // Empty state for new users
  if (user?.role === 'creative' && activeProjects.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconContainer}>
              <Users size={64} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Ready to get started?</Text>
            <Text style={styles.emptyDescription}>
              Invite your first client and start working together.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => router.push('/invite-client')}
              activeOpacity={0.8}
            >
              <UserPlus size={20} color={colors.text.inverse} />
              <Text style={styles.emptyActionText}>Invite Client</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Empty state for clients with no projects
  if (user?.role === 'client' && activeProjects.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconContainer}>
              <StickyNote size={64} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>You're all set up!</Text>
            <Text style={styles.emptyDescription}>
              Once your creative creates your first project, it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionButton}
              onPress={() => router.push('/(tabs)/chat')}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color={colors.text.inverse} />
              <Text style={styles.emptyActionText}>Message Creative</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.name?.split(' ')[0] || (user?.role === 'creative' ? 'Creative' : 'Client')}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            {user?.role === 'creative' 
              ? "Here's what's happening with your business"
              : "Here's your project updates"
            }
          </Text>
        </View>
        
        {/* Project Slots Warning for Free Plan */}
        {!isProPlan && (
          <View style={styles.projectSlotsWarning}>
            <View style={styles.warningContent}>
              <Info size={20} color={colors.warning} />
              <Text style={styles.warningText}>
                {(typeof currentPlan.features.maxProjects === 'number' && subscription.projectsUsed >= currentPlan.features.maxProjects)
                  ? 'Project limit reached on Free plan'
                  : (typeof currentPlan.features.maxProjects === 'number' 
                      ? `${Number(currentPlan.features.maxProjects) - subscription.projectsUsed} project slot${Number(currentPlan.features.maxProjects) - subscription.projectsUsed === 1 ? '' : 's'} remaining on Free plan`
                      : 'Unlimited projects available'
                    )
                }
              </Text>
            </View>
            {(typeof currentPlan.features.maxProjects === 'number' && subscription.projectsUsed >= Number(currentPlan.features.maxProjects)) && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => router.push('/subscription')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          
          {user?.role === 'creative' && (
            <>
              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/payments')}
                activeOpacity={0.7}
              >
                <View style={styles.metricIconContainer}>
                  <Coins size={24} color={colors.warning} />
                </View>
                <Text style={styles.metricValue}>{pendingPayments}</Text>
                <Text style={styles.metricLabel}>Pending Payments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/(tabs)/chat')}
                activeOpacity={0.7}
              >
                <View style={styles.metricIconContainer}>
                  <MessageCircle size={24} color={colors.accent} />
                </View>
                <Text style={styles.metricValue}>{unreadMessages}</Text>
                <Text style={styles.metricLabel}>Unread Messages</Text>
              </TouchableOpacity>
            </>
          )}
          
          {user?.role === 'client' && (
            <>
              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/files')}
                activeOpacity={0.7}
              >
                <View style={styles.metricIconContainer}>
                  <Upload size={24} color={colors.success} />
                </View>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>Files Ready</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.metricCard}
                onPress={() => router.push('/contracts')}
                activeOpacity={0.7}
              >
                <View style={styles.metricIconContainer}>
                  <StickyNote size={24} color={colors.warning} />
                </View>
                <Text style={styles.metricValue}>1</Text>
                <Text style={styles.metricLabel}>Pending Actions</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  action.onPress();
                }}
                activeOpacity={0.8}
              >
                {action.icon}
                <Text style={styles.actionButtonText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Projects Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Active Projects</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionContent}>
            {activeProjects.slice(0, 2).map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.push(`/project/${project.id}`);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.projectClientName}>{project.clientName}</Text>
                <Text style={styles.projectDescription}>{project.title}</Text>
                
                <View style={styles.projectFooter}>
                  <View style={[styles.statusBadge, getStatusBadgeStyle(project.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(project.status)]}>{project.status}</Text>
                  </View>
                  <Text style={styles.projectDate}>
                    Due {new Date(project.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity - Only show if there are activities */}
        {recentActivity.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            <View style={styles.sectionContent}>
              {recentActivity.map((activity) => (
                <TouchableOpacity 
                  key={activity.id} 
                  style={styles.activityItem}
                  onPress={() => router.push(activity.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityIcon}>
                    {activity.icon}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Monthly Earnings Graph Placeholder - Creative only */}
        {user?.role === 'creative' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Month</Text>
            <View style={styles.sectionContent}>
              <View style={styles.earningsCard}>
                <View style={styles.earningsHeader}>
                  <TrendingUp size={24} color={colors.success} />
                  <Text style={styles.earningsAmount}>{formatAmount(2450)}</Text>
                </View>
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsGrowth}>+12% from last month</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

