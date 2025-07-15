import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MoreVertical,
  FolderPlus,
  Edit,
  Trash2
} from 'lucide-react-native';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import Header from '@/components/Header';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProjectCard from '@/components/ProjectCard';
import UpgradePrompt from '@/components/UpgradePrompt';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getClientById, isLoading } = useClientStore();
  const { projects } = useProjectStore();
  const { canCreateProject, getCurrentPlan } = useSubscriptionStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  const client = getClientById(id as string);
  
  // Filter projects for this client
  const clientProjects = projects.filter(project => project.clientId === id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Client Not Found" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={typography.body}>This client could not be found.</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleNewProject = () => {
    if (!canCreateProject()) {
      setShowUpgradePrompt(true);
      return;
    }
    router.push('/new-project');
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    const { upgradeTier } = useSubscriptionStore.getState();
    try {
      await upgradeTier(tier);
      router.push('/new-project');
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };

  const currentPlan = getCurrentPlan();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Client Details" 
        showBackButton 
        rightElement={
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar name={client.name} imageUrl={client.avatar} size={80} />
          <Text style={[typography.h2, styles.clientName]}>{client.name}</Text>
          {client.company && (
            <Text style={typography.bodySmall}>{client.company}</Text>
          )}
        </View>
        
        <Card style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Mail size={20} color={colors.primary} />
            <Text style={[typography.body, styles.contactText]}>{client.email}</Text>
          </View>
          
          {client.phone && (
            <View style={styles.contactItem}>
              <Phone size={20} color={colors.primary} />
              <Text style={[typography.body, styles.contactText]}>{client.phone}</Text>
            </View>
          )}
          
          {client.company && (
            <View style={styles.contactItem}>
              <Building size={20} color={colors.primary} />
              <Text style={[typography.body, styles.contactText]}>{client.company}</Text>
            </View>
          )}
          
          <View style={styles.contactItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[typography.body, styles.contactText]}>
              Client since {new Date(client.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Edit"
            variant="outline"
            leftIcon={<Edit size={18} color={colors.primary} />}
            style={styles.actionButton}
            onPress={() => {}}
          />
          <Button
            title="Delete"
            variant="outline"
            leftIcon={<Trash2 size={18} color={colors.error} />}
            style={[styles.actionButton, styles.deleteButton]}
            textStyle={styles.deleteButtonText}
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.projectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={typography.h3}>Projects</Text>
            <Button
              title="New Project"
              variant="primary"
              size="small"
              leftIcon={<FolderPlus size={16} color={colors.text.inverse} />}
              onPress={handleNewProject}
            />
          </View>
          
          {clientProjects.length > 0 ? (
            clientProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <Card style={styles.emptyProjectsCard}>
              <Text style={[typography.body, styles.emptyText]}>
                No projects yet for this client.
              </Text>
              <Button
                title="Create First Project"
                variant="primary"
                onPress={() => router.push('/new-project')}
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
      </ScrollView>
      
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        title="Project Limit Reached"
        description={`You've reached your project limit of ${currentPlan.features.maxProjects}. Upgrade to create more projects.`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorButton: {
    marginTop: 16,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  clientName: {
    marginTop: 16,
    marginBottom: 4,
  },
  contactCard: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  contactText: {
    marginLeft: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
  },
  projectsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyProjectsCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
});