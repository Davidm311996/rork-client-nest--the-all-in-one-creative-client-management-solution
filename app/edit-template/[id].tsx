import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save, Eye } from 'lucide-react-native';
import Header from '@/components/Header';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { ContractTemplate, CONTRACT_VARIABLES } from '@/types/contract';

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

export default function EditTemplateScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Find the template by ID
  const template = mockTemplates.find(t => t.id === id);
  
  if (!template) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Template Not Found" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={typography.body}>Template not found.</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description);
  const [templateContent, setTemplateContent] = useState(template.content);

  const handleSave = () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name.');
      return;
    }
    
    if (!templateContent.trim()) {
      Alert.alert('Error', 'Please enter template content.');
      return;
    }

    // In real app, save to store/API
    Alert.alert('Success', 'Template saved successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handlePreview = () => {
    router.push(`/template-preview?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Edit Template" 
        showBackButton 
        rightElement={
          <View style={styles.headerActions}>
            <Button
              title="Preview"
              onPress={handlePreview}
              variant="outline"
              size="small"
              leftIcon={<Eye size={16} color={colors.primary} />}
              style={styles.previewButton}
            />
            <Button
              title="Save"
              onPress={handleSave}
              variant="primary"
              size="small"
              leftIcon={<Save size={16} color={colors.text.inverse} />}
            />
          </View>
        }
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Template Name</Text>
          <TextInput
            style={styles.input}
            value={templateName}
            onChangeText={setTemplateName}
            placeholder="Enter template name"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={templateDescription}
            onChangeText={setTemplateDescription}
            placeholder="Brief description of this template"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Template Content</Text>
          <Text style={styles.helpText}>
            Use placeholders like [CLIENT_NAME], [BUSINESS_NAME], [PROJECT_PRICE] that will be replaced when creating contracts.
          </Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={templateContent}
            onChangeText={setTemplateContent}
            placeholder="Enter your contract template content..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderTitle}>Available Placeholders:</Text>
          <View style={styles.placeholderGrid}>
            {CONTRACT_VARIABLES.map((placeholder, index) => (
              <View key={index} style={styles.placeholderTag}>
                <Text style={styles.placeholderText}>{placeholder}</Text>
              </View>
            ))}
          </View>
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
  previewButton: {
    minWidth: 80,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInput: {
    height: 300,
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  placeholderSection: {
    marginTop: 8,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});