import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import UpgradePrompt from '@/components/UpgradePrompt';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { ProjectStatus } from '@/types/project';
import { SubscriptionTier } from '@/types/subscription';

export default function NewProjectScreen() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const { clients, fetchClients, isLoading: isLoadingClients } = useClientStore();
  const { canCreateProject, incrementProjectUsage, getCurrentPlan } = useSubscriptionStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Contract Sent');
  const [isCreating, setIsCreating] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const handleCreateProject = async () => {
    // Check subscription limits first
    if (!canCreateProject()) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a project title');
      return;
    }
    
    if (!selectedClientId) {
      Alert.alert('Error', 'Please select a client');
      return;
    }
    
    if (!dueDate) {
      Alert.alert('Error', 'Please enter a due date');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const selectedClient = clients.find(client => client.id === selectedClientId);
      
      const newProject = await createProject({
        title,
        description,
        clientId: selectedClientId,
        clientName: selectedClient?.name || '',
        status,
        dueDate: new Date(dueDate).toISOString(),
        budget: parseFloat(budget) || 0,
        contractSigned: false,
        paymentStatus: 'Not Started',
        files: [],
        messages: [],
      });
      
      // Increment project usage count
      incrementProjectUsage();
      
      router.replace(`/project/${newProject.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    const { upgradeTier } = useSubscriptionStore.getState();
    try {
      await upgradeTier(tier);
      // After successful upgrade, try creating the project again
      handleCreateProject();
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };
  
  const currentPlan = getCurrentPlan();
  const selectedClient = clients.find(client => client.id === selectedClientId);
  
  return (
    <KeyboardAwareView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="New Project" showBackButton />
        
        {/* Show subscription warning if close to limit */}
        {currentPlan.features.maxProjects !== 'unlimited' && (
          <View style={styles.subscriptionWarning}>
            <Text style={styles.warningText}>
              {currentPlan.features.maxProjects - useSubscriptionStore.getState().subscription.projectsUsed} project slots remaining on {currentPlan.name} plan
            </Text>
          </View>
        )}
        
        <View style={styles.content}>
        <Card style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={typography.label}>Project Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter project title"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter project description"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Client</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowClientDropdown(!showClientDropdown)}
            >
              <Text style={selectedClientId ? typography.body : styles.placeholderText}>
                {selectedClientId ? selectedClient?.name : 'Select a client'}
              </Text>
              <ChevronDown size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
            
            {showClientDropdown && (
              <Card style={styles.dropdownMenu}>
                {isLoadingClients ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : clients.length > 0 ? (
                  clients.map(client => (
                    <TouchableOpacity
                      key={client.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedClientId(client.id);
                        setShowClientDropdown(false);
                      }}
                    >
                      <Text style={typography.body}>{client.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyDropdown}>
                    <Text style={typography.bodySmall}>No clients found</Text>
                    <Button
                      title="Add Client"
                      variant="text"
                      size="small"
                      onPress={() => router.push('/new-client')}
                    />
                  </View>
                )}
              </Card>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Due Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.input, styles.dateInput]}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.text.tertiary}
              />
              <Calendar size={20} color={colors.text.tertiary} />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Budget</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              placeholder="Enter project budget"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Initial Status</Text>
            <View style={styles.statusOptions}>
              {(['Contract Sent', 'In Progress'] as ProjectStatus[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusOption,
                    status === option && styles.selectedStatusOption,
                  ]}
                  onPress={() => setStatus(option)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === option && styles.selectedStatusOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>
        
        <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.footerButton}
        />
        <Button
          title={isCreating ? "Creating..." : "Create Project"}
          variant="primary"
          onPress={handleCreateProject}
          disabled={isCreating}
          loading={isCreating}
          style={styles.footerButton}
        />
        </View>
        </View>

        <UpgradePrompt
          visible={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={handleUpgrade}
          title="Project Limit Reached"
          description={`You've reached your project limit of ${currentPlan.features.maxProjects}. Upgrade to Professional for 5 projects or Studio for unlimited projects.`}
          suggestedTier="mid"
        />
      </SafeAreaView>
    </KeyboardAwareView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  placeholderText: {
    color: colors.text.tertiary,
    fontSize: 16,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emptyDropdown: {
    padding: 16,
    alignItems: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  dateInput: {
    flex: 1,
    borderWidth: 0,
    paddingVertical: 10,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedStatusOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  selectedStatusOptionText: {
    color: colors.text.inverse,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  subscriptionWarning: {
    backgroundColor: colors.warning + '20',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: '500',
  },
});