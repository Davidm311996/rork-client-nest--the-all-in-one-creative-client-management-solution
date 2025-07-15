import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, UserPlus } from 'lucide-react-native';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import Header from '@/components/Header';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { Client } from '@/types/client';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import UpgradePrompt from '@/components/UpgradePrompt';
import { SubscriptionTier } from '@/types/subscription';

export default function ClientsScreen() {
  const router = useRouter();
  const { clients, isLoading, fetchClients } = useClientStore();
  const { projects } = useProjectStore();
  const { canCreateProject } = useSubscriptionStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  // Separate active and completed clients
  const getClientStatus = (clientId: string) => {
    const clientProjects = projects.filter(project => project.clientId === clientId);
    const hasActiveProjects = clientProjects.some(project => project.status !== 'Completed');
    return hasActiveProjects ? 'active' : 'completed';
  };

  const activeClients = clients.filter(client => getClientStatus(client.id) === 'active');
  const completedClients = clients.filter(client => getClientStatus(client.id) === 'completed');

  // Sort: active clients first, then completed clients (faded)
  const sortedClients = [...activeClients, ...completedClients];

  const renderClientCard = ({ item }: { item: Client }) => {
    const isCompleted = getClientStatus(item.id) === 'completed';
    const clientProjects = projects.filter(project => project.clientId === item.id);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/client/${item.id}`)}
        style={[
          styles.clientCard,
          isCompleted && styles.completedClientCard
        ]}
      >
        <View style={styles.clientInfo}>
          <Avatar 
            name={item.name} 
            imageUrl={item.avatar} 
            size={50} 
          />
          <View style={styles.clientDetails}>
            <Text 
              style={[
                styles.clientName, 
                isCompleted && styles.completedText
              ]} 
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text 
              style={[
                styles.clientCompany,
                isCompleted && styles.completedText
              ]}
            >
              {item.company || 'Individual Client'}
            </Text>
            <Text 
              style={[
                styles.projectCount,
                isCompleted && styles.completedText
              ]}
            >
              {clientProjects.length} {clientProjects.length === 1 ? 'Project' : 'Projects'}
              {isCompleted && ' • Completed'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Clients" 
        showBackButton 
        rightElement={
          <Button
            title="New"
            onPress={handleNewClient}
            variant="primary"
            size="small"
            leftIcon={<Plus size={16} color={colors.text.inverse} />}
          />
        }
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : sortedClients.length > 0 ? (
        <FlatList
          data={sortedClients}
          keyExtractor={(item) => item.id}
          renderItem={renderClientCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No clients yet"
          description="You haven't added any clients yet. Get started by adding your first client."
          actionLabel="Add Client"
          onAction={() => router.push('/new-client')}
          icon={<UserPlus size={32} color={colors.primary} />}
        />
      )}

      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        title="Project Limit Reached"
        description="You've reached your project limit. Upgrade to add more clients and projects."
        suggestedTier="mid"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  clientCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedClientCard: {
    opacity: 0.6,
    backgroundColor: colors.surface + '80',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientDetails: {
    marginLeft: 16,
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  clientCompany: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  projectCount: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  completedText: {
    color: colors.text.tertiary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});