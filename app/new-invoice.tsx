import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Coins, FileText, User, Building } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { useCurrencyStore } from '@/store/currencyStore';

type InvoiceType = 'deposit' | 'milestone' | 'final' | 'custom';

export default function NewInvoiceScreen() {
  const router = useRouter();
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { getCurrencySymbol } = useCurrencyStore();
  
  // Get URL parameters for pre-filling
  const { clientId: urlClientId, projectId: urlProjectId } = useLocalSearchParams();
  
  // Auto-select client and project from URL params
  const preSelectedClient = urlClientId ? clients.find(c => c.id === urlClientId) || null : null;
  const preSelectedProject = urlProjectId ? projects.find(p => p.id === urlProjectId) || null : null;
  
  const [selectedClient, setSelectedClient] = useState<string>(urlClientId as string || '');
  const [selectedProject, setSelectedProject] = useState<string>(urlProjectId as string || '');
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clientId = preSelectedClient ? preSelectedClient.id : selectedClient;
  const filteredProjects = clientId 
    ? projects.filter(p => p.clientId === clientId)
    : [];

  const handleCreateInvoice = async () => {
    const clientId = preSelectedClient?.id || selectedClient;
    const projectId = preSelectedProject?.id || selectedProject;
    
    if (!clientId || !projectId || !amount || !dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Invoice created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoiceTypeAmount = (type: InvoiceType) => {
    const projectId = preSelectedProject?.id || selectedProject;
    if (!projectId) return '';
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return '';

    switch (type) {
      case 'deposit':
        return '1250'; // Default 50% deposit
      case 'final':
        return '1250'; // Default remaining 50%
      case 'milestone':
        return '625'; // Default 25% milestone
      default:
        return '';
    }
  };

  const handleInvoiceTypeChange = (type: InvoiceType) => {
    setInvoiceType(type);
    if (type !== 'custom') {
      setAmount(getInvoiceTypeAmount(type));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Create Invoice" showBackButton />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Only show Client & Project section if not coming from project overview */}
        {!urlProjectId && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Client & Project</Text>
            
            {/* Only show client selector if not pre-selected from project */}
            {!urlClientId ? (
              <View style={styles.field}>
                <Text style={styles.label}>Client *</Text>
                <View style={styles.selectContainer}>
                  <User size={20} color={colors.text.tertiary} />
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => {
                      Alert.alert(
                        'Select Client',
                        'Choose a client',
                        clients.map(client => ({
                          text: client.name,
                          onPress: () => {
                            setSelectedClient(client.id);
                            setSelectedProject(''); // Reset project when client changes
                          }
                        })).concat([{ text: 'Cancel', onPress: () => {} }])
                      );
                    }}
                  >
                    <Text style={[styles.selectText, !selectedClient && styles.placeholder]}>
                      {selectedClient ? clients.find(c => c.id === selectedClient)?.name : 'Select a client'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.field}>
                <Text style={styles.label}>Client</Text>
                <View style={styles.selectedClientContainer}>
                  <User size={20} color={colors.primary} />
                  <Text style={styles.selectedClientText}>{preSelectedClient?.name || 'Unknown Client'}</Text>
                </View>
              </View>
            )}

            {/* Only show project selector if not pre-selected */}
            {!urlProjectId ? (
              <View style={styles.field}>
                <Text style={styles.label}>Project *</Text>
                <View style={styles.selectContainer}>
                  <Building size={20} color={colors.text.tertiary} />
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => {
                      if (!clientId) {
                        Alert.alert('Error', 'Please select a client first');
                        return;
                      }
                      if (filteredProjects.length === 0) {
                        Alert.alert('No Projects', 'No projects found for this client');
                        return;
                      }
                      Alert.alert(
                        'Select Project',
                        'Choose a project',
                        filteredProjects.map(project => ({
                          text: project.title,
                          onPress: () => {
                            setSelectedProject(project.id);
                            // Auto-set amount based on invoice type
                            if (invoiceType !== 'custom') {
                              setAmount(getInvoiceTypeAmount(invoiceType));
                            }
                          }
                        })).concat([{ text: 'Cancel', onPress: () => {} }])
                      );
                    }}
                    disabled={!clientId}
                  >
                    <Text style={[styles.selectText, !selectedProject && styles.placeholder]}>
                      {selectedProject ? projects.find(p => p.id === selectedProject)?.title : 'Select a project'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.field}>
                <Text style={styles.label}>Project</Text>
                <View style={styles.selectedClientContainer}>
                  <Building size={20} color={colors.primary} />
                  <Text style={styles.selectedClientText}>{preSelectedProject?.title || 'Unknown Project'}</Text>
                </View>
              </View>
            )}
          </Card>
        )}

        {/* Show selected client and project info when coming from project overview */}
        {urlProjectId && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Invoice For</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Client</Text>
              <View style={styles.selectedClientContainer}>
                <User size={20} color={colors.primary} />
                <Text style={styles.selectedClientText}>{preSelectedClient?.name || 'Unknown Client'}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Project</Text>
              <View style={styles.selectedClientContainer}>
                <Building size={20} color={colors.primary} />
                <Text style={styles.selectedClientText}>{preSelectedProject?.title || 'Unknown Project'}</Text>
              </View>
            </View>
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Type</Text>
          
          <View style={styles.typeGrid}>
            {(['deposit', 'milestone', 'final', 'custom'] as InvoiceType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  invoiceType === type && styles.selectedTypeButton
                ]}
                onPress={() => handleInvoiceTypeChange(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  invoiceType === type && styles.selectedTypeButtonText
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Amount *</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color={colors.text.tertiary} />
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Invoice description"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Due Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={colors.text.tertiary} />
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  // Set default due date to 30 days from now
                  const defaultDate = new Date();
                  defaultDate.setDate(defaultDate.getDate() + 30);
                  const formattedDate = defaultDate.toISOString().split('T')[0];
                  setDueDate(formattedDate);
                }}
              >
                <Text style={[styles.dateText, !dueDate && styles.placeholder]}>
                  {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select due date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes for the client"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Save as Draft"
            variant="outline"
            onPress={() => {
              Alert.alert('Draft Saved', 'Invoice saved as draft');
            }}
            style={styles.actionButton}
          />
          <Button
            title="Create & Send"
            variant="primary"
            onPress={handleCreateInvoice}
            loading={isLoading}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.surface,
    minHeight: 80,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    gap: 12,
  },
  selectButton: {
    flex: 1,
  },
  selectText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholder: {
    color: colors.text.tertiary,
  },
  dateButton: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectedTypeButtonText: {
    color: colors.text.inverse,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    minWidth: 20,
  },
  selectedClientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    gap: 12,
  },
  selectedClientText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});