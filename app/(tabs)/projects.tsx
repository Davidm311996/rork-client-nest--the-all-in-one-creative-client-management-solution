import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, FolderPlus, Search, FolderOpen } from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { useThemeStore } from '@/store/themeStore';
import { Project } from '@/types/project';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import UpgradePrompt from '@/components/UpgradePrompt';
import { SubscriptionTier } from '@/types/subscription';

export default function ProjectsScreen() {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const { canCreateProject, getCurrentPlan } = useSubscriptionStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'All' || project.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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
    newProjectButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchContainer: {
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text.primary,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      marginBottom: 16,
      gap: 8,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
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
      padding: 24,
      paddingBottom: 120,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 32,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSubtitle}>Manage your projects</Text>
        </View>
        <TouchableOpacity 
          style={styles.newProjectButton}
          onPress={handleNewProject}
        >
          <Plus size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search projects..."
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('All', 'All')}
        {renderFilterButton('In Progress', 'In Progress')}
        {renderFilterButton('Completed', 'Completed')}
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
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <FolderOpen size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptyDescription}>
            {activeFilter === 'All' && searchQuery === ''
              ? "Create your first project to get started"
              : searchQuery !== ''
              ? "No projects match your search"
              : `No ${activeFilter.toLowerCase()} projects found`
            }
          </Text>
        </View>
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

