import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save, Eye } from 'lucide-react-native';
import Header from '@/components/Header';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { CONTRACT_VARIABLES } from '@/types/contract';

export default function NewTemplateScreen() {
  const router = useRouter();
  
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateContent, setTemplateContent] = useState(`SERVICE AGREEMENT

This agreement is between [CLIENT_NAME] and [BUSINESS_NAME] for professional services.

PROJECT DETAILS:
- Project: [PROJECT_TITLE]
- Description: [PROJECT_DESCRIPTION]
- Start Date: [PROJECT_START_DATE]
- Completion Date: [PROJECT_END_DATE]

PAYMENT TERMS:
- Total Fee: [PROJECT_PRICE]
- Deposit: [PROJECT_DEPOSIT] (due upon signing)
- Balance: Due upon completion

TERMS AND CONDITIONS:
1. Payment terms and schedule
2. Scope of work and deliverables
3. Cancellation and refund policy
4. Intellectual property rights

By signing below, both parties agree to the terms outlined in this contract.

Client Signature: _________________ Date: [CURRENT_DATE]
[CLIENT_NAME]

Service Provider Signature: _________________ Date: [CURRENT_DATE]
[BUSINESS_NAME]`);

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
    Alert.alert('Success', 'Template created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handlePreview = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      Alert.alert('Error', 'Please fill in the template name and content before previewing.');
      return;
    }
    
    // For preview, we'll use a temporary ID
    router.push(`/template-preview?id=new&name=${encodeURIComponent(templateName)}&content=${encodeURIComponent(templateContent)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="New Template" 
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
          <Text style={styles.label}>Template Name *</Text>
          <TextInput
            style={styles.input}
            value={templateName}
            onChangeText={setTemplateName}
            placeholder="e.g., Photography Contract, Design Services Agreement"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={templateDescription}
            onChangeText={setTemplateDescription}
            placeholder="Brief description of when to use this template"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Template Content *</Text>
          <Text style={styles.helpText}>
            Create your contract template using placeholders like [CLIENT_NAME], [BUSINESS_NAME], [PROJECT_PRICE] that will be automatically replaced when creating contracts.
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
          <Text style={styles.placeholderSubtitle}>
            Tap any placeholder to copy it to your clipboard
          </Text>
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
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
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
});