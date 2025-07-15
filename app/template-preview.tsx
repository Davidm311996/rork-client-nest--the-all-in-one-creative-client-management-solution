import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Download, Send, Edit } from 'lucide-react-native';
import Header from '@/components/Header';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { ContractTemplate } from '@/types/contract';
import { useProjectStore } from '@/store/projectStore';
import { useClientStore } from '@/store/clientStore';

// Mock templates data - in a real app this would come from a store
const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Photography Contract',
    description: 'Standard photography services contract',
    content: `PHOTOGRAPHY SERVICES AGREEMENT

This agreement is between [CLIENT_NAME] and [BUSINESS_NAME] for photography services.

Project: [PROJECT_TITLE]
Description: [PROJECT_DESCRIPTION]
Total Fee: [PROJECT_PRICE]
Deposit Required: [PROJECT_DEPOSIT]
Start Date: [PROJECT_START_DATE]
Completion Date: [PROJECT_END_DATE]

Terms and Conditions:
1. Payment terms and schedule
2. Usage rights and licensing
3. Cancellation policy
4. Delivery timeline

Client: [CLIENT_NAME]
Date: [CURRENT_DATE]`,
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    isDefault: true,
    category: 'photography',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '2',
    name: 'Design Services Contract',
    description: 'Graphic design and branding services',
    content: `DESIGN SERVICES AGREEMENT

This design services agreement is between [CLIENT_NAME] and [BUSINESS_NAME].

Project Details:
- Project: [PROJECT_TITLE]
- Description: [PROJECT_DESCRIPTION]
- Total Investment: [PROJECT_PRICE]
- Deposit: [PROJECT_DEPOSIT]

Scope of Work:
1. Brand identity design
2. Logo creation
3. Brand guidelines
4. Marketing materials

Timeline:
Start: [PROJECT_START_DATE]
Completion: [PROJECT_END_DATE]

Client Signature: ________________
Date: [CURRENT_DATE]`,
    createdAt: '2024-01-10',
    lastModified: '2024-01-18',
    isDefault: false,
    category: 'design',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
  {
    id: '3',
    name: 'Video Production Contract',
    description: 'Video production and editing services',
    content: `VIDEO PRODUCTION AGREEMENT

Agreement between [CLIENT_NAME] and [BUSINESS_NAME] for video production services.

Project Information:
- Title: [PROJECT_TITLE]
- Description: [PROJECT_DESCRIPTION]
- Budget: [PROJECT_PRICE]
- Deposit: [PROJECT_DEPOSIT]

Production Schedule:
Pre-production: [PROJECT_START_DATE]
Production: TBD
Post-production: TBD
Delivery: [PROJECT_END_DATE]

Deliverables:
1. Raw footage
2. Edited video
3. Color correction
4. Audio mixing

Signed: ________________
Date: [CURRENT_DATE]`,
    createdAt: '2024-01-05',
    lastModified: '2024-01-15',
    isDefault: false,
    category: 'video',
    variables: ['[CLIENT_NAME]', '[BUSINESS_NAME]', '[PROJECT_TITLE]', '[PROJECT_DESCRIPTION]', '[PROJECT_PRICE]', '[PROJECT_DEPOSIT]', '[PROJECT_START_DATE]', '[PROJECT_END_DATE]', '[CURRENT_DATE]'],
  },
];

export default function TemplatePreviewScreen() {
  const { id, name, content, projectId, clientId, contractId, signed } = useLocalSearchParams();
  const router = useRouter();
  const { getProjectById } = useProjectStore();
  const { getClientById } = useClientStore();
  
  let template: ContractTemplate | null = null;
  let project = null;
  let client = null;
  let isActualContract = false;
  
  // Check if this is an actual contract for a specific project
  if (projectId) {
    project = getProjectById(projectId as string);
    if (project) {
      client = getClientById(project.clientId);
    }
    isActualContract = true;
  }
  
  if (id === 'new') {
    // Handle new template preview
    template = {
      id: 'new',
      name: (name as string) || 'New Template',
      description: 'Preview of new template',
      content: (content as string) || '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isDefault: false,
      category: 'other',
      variables: [],
    };
  } else {
    // Find existing template by ID
    template = mockTemplates.find(t => t.id === id) || null;
  }
  
  if (!template) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Contract Not Found" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={typography.body}>Contract not found.</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Sample data for preview or actual project data
  const previewData = project ? {
    '[CLIENT_NAME]': project.clientName,
    '[CLIENT_EMAIL]': client?.email || 'client@example.com',
    '[CLIENT_ADDRESS]': project.eventLocation?.address || '123 Main St, City, State 12345',
    '[BUSINESS_NAME]': 'Creative Studio Pro',
    '[BUSINESS_EMAIL]': 'hello@creativestudiopro.com',
    '[BUSINESS_ADDRESS]': '456 Business Ave, City, State 67890',
    '[PROJECT_TITLE]': project.title,
    '[PROJECT_DESCRIPTION]': project.description,
    '[PROJECT_PRICE]': `$${project.budget || '2,500'}`,
    '[PROJECT_DEPOSIT]': `$${Math.round((project.budget || 2500) * 0.3)}`,
    '[PROJECT_START_DATE]': new Date(project.createdAt).toLocaleDateString(),
    '[PROJECT_END_DATE]': new Date(project.dueDate).toLocaleDateString(),
    '[CURRENT_DATE]': new Date().toLocaleDateString(),
    '[SERVICE_TYPE]': project.eventType || 'Creative Services',
    '[EVENT_TYPE]': project.eventType || 'Event',
    '[EVENT_DATE]': project.eventDate ? new Date(project.eventDate).toLocaleDateString() : 'TBD',
    '[EVENT_LOCATION]': project.eventLocation?.address || 'TBD',
    '[DURATION]': '6 hours',
    '[BALANCE_DUE_DATE]': new Date(project.dueDate).toLocaleDateString(),
    '[CANCELLATION_POLICY]': '30 days advance notice required',
    '[WEATHER_POLICY]': 'Indoor backup location available',
  } : {
    '[CLIENT_NAME]': 'Sarah Johnson',
    '[CLIENT_EMAIL]': 'sarah@example.com',
    '[CLIENT_ADDRESS]': '123 Main St, City, State 12345',
    '[BUSINESS_NAME]': 'Creative Studio Pro',
    '[BUSINESS_EMAIL]': 'hello@creativestudiopro.com',
    '[BUSINESS_ADDRESS]': '456 Business Ave, City, State 67890',
    '[PROJECT_TITLE]': 'Wedding Photography Package',
    '[PROJECT_DESCRIPTION]': 'Complete wedding day photography coverage including ceremony, reception, and portraits',
    '[PROJECT_PRICE]': '$2,500',
    '[PROJECT_DEPOSIT]': '$750',
    '[PROJECT_START_DATE]': 'June 15, 2024',
    '[PROJECT_END_DATE]': 'June 15, 2024',
    '[CURRENT_DATE]': new Date().toLocaleDateString(),
    '[SERVICE_TYPE]': 'Photography',
    '[PROJECT_NAME]': 'Wedding Photography Package',
    '[START_DATE]': 'June 15, 2024',
    '[END_DATE]': 'June 15, 2024',
    '[LOCATION]': 'Riverside Gardens, Downtown',
    '[TOTAL_AMOUNT]': '$2,500',
    '[DEPOSIT_AMOUNT]': '$750',
    '[BALANCE_AMOUNT]': '$1,750',
    '[SCOPE_ITEM_1]': '6 hours of wedding photography coverage',
    '[SCOPE_ITEM_2]': '300+ edited high-resolution images',
    '[SCOPE_ITEM_3]': 'Online gallery for sharing with family and friends',
    '[TERM_1]': 'All images remain property of the photographer',
    '[TERM_2]': 'Client receives full usage rights for personal use',
    '[TERM_3]': 'Cancellation must be made 30 days in advance',
    '[EVENT_TYPE]': 'Wedding',
    '[EVENT_DATE]': 'June 15, 2024',
    '[EVENT_LOCATION]': 'Riverside Gardens',
    '[DURATION]': '6 hours',
    '[BALANCE_DUE_DATE]': 'June 1, 2024',
    '[CANCELLATION_POLICY]': '30 days advance notice required',
    '[WEATHER_POLICY]': 'Indoor backup location available',
  };

  // Replace placeholders with sample data
  let previewContent = template.content;
  Object.entries(previewData).forEach(([placeholder, value]) => {
    previewContent = previewContent.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  });

  const getHeaderTitle = () => {
    if (isActualContract) {
      return signed === 'true' ? 'Signed Contract' : 'Contract';
    }
    return 'Contract Preview';
  };

  const getHeaderActions = () => {
    if (isActualContract) {
      return (
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              // Download contract
              console.log('Download contract');
            }}
          >
            <Download size={20} color={colors.primary} />
          </TouchableOpacity>
          {signed !== 'true' && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                // Send for signature
                console.log('Send for signature');
              }}
            >
              <Send size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={getHeaderTitle()} 
        showBackButton 
        rightElement={getHeaderActions()}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewHeader}>
          <FileText size={24} color={colors.primary} />
          <Text style={styles.templateName}>{template.name}</Text>
          {!isActualContract && (
            <Text style={styles.previewNote}>
              This is a preview with sample data. Placeholders will be replaced with actual client information when creating contracts.
            </Text>
          )}
          {isActualContract && signed === 'true' && (
            <View style={styles.signedBadge}>
              <Text style={styles.signedText}>✓ Digitally Signed</Text>
            </View>
          )}
        </View>

        <View style={styles.documentContainer}>
          <Text style={styles.documentContent}>{previewContent}</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Client Signature</Text>
            <View style={styles.signatureBox}>
              {isActualContract && signed === 'true' && (
                <Text style={styles.signatureText}>Digitally Signed</Text>
              )}
            </View>
            <Text style={styles.dateLabel}>Date</Text>
            <View style={styles.dateBox}>
              {isActualContract && signed === 'true' && project?.contractSignedDate && (
                <Text style={styles.dateText}>
                  {new Date(project.contractSignedDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>Service Provider Signature</Text>
            <View style={styles.signatureBox}>
              {isActualContract && (
                <Text style={styles.signatureText}>Creative Studio Pro</Text>
              )}
            </View>
            <Text style={styles.dateLabel}>Date</Text>
            <View style={styles.dateBox}>
              {isActualContract && (
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>

        {isActualContract && signed !== 'true' && (
          <View style={styles.actionButtons}>
            <Button
              title="Edit Contract"
              variant="outline"
              onPress={() => router.push(`/edit-template/${template.id}?projectId=${projectId}`)}
              leftIcon={<Edit size={18} color={colors.primary} />}
              style={styles.actionButton}
            />
            <Button
              title="Send for Signature"
              variant="primary"
              onPress={() => {
                // Send for signature logic
                console.log('Send for signature');
              }}
              leftIcon={<Send size={18} color={colors.text.inverse} />}
              style={styles.actionButton}
            />
          </View>
        )}
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
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  templateName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  previewNote: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  signedBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  signedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  documentContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentContent: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  signatureSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  signatureLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  signatureLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    width: 80,
  },
  signatureBox: {
    flex: 1,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  signatureText: {
    fontSize: 14,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  dateLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    width: 30,
  },
  dateBox: {
    width: 80,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});