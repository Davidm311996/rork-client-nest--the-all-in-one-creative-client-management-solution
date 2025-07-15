import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, FolderPlus } from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { Project } from '@/types/project';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import UpgradePrompt from '@/components/UpgradePrompt';
import { SubscriptionTier } from '@/types/subscription';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const { canCreateProject, getCurrentPlan } = useSubscriptionStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    return project.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const renderFilterButton = (label: string, filter: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === filter && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <Text style={typography.h1}>Projects</Text>
        <TouchableOpacity 
          style={styles.newProjectButton}
          onPress={handleNewProject}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('All', 'all')}
        {renderFilterButton('In Progress', 'in progress')}
        {renderFilterButton('Review', 'review')}
        {renderFilterButton('Completed', 'completed')}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Project }) => <ProjectCard project={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No projects yet"
          description={
            activeFilter === 'all'
              ? "You haven't created any projects yet. Get started by creating your first project."
              : `You don't have any ${activeFilter} projects.`
          }
          actionLabel={activeFilter === 'all' ? "Create Project" : "View All Projects"}
          onAction={() => activeFilter === 'all' ? router.push('/new-project') : setActiveFilter('all')}
          icon={<FolderPlus size={32} color={colors.primary} />}
        />
      )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeFilterButtonText: {
    color: colors.text.inverse,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newProjectButton: {
    padding: 8,
  },
});