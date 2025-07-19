import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save, Eye, Lock } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import UpgradePrompt from '@/components/UpgradePrompt';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { CONTRACT_VARIABLES } from '@/types/contract';
import { SubscriptionTier } from '@/types/subscription';

export default function NewTemplateScreen() {
  const router = useRouter();
  const { canUseFeature, getCurrentPlan, upgradeTier, subscription } = useSubscriptionStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
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

  const canUseContracts = canUseFeature('contracts');
  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid';
  const isStudioPlan = subscription.tier === 'top';
  
  // Check if user can create more templates (Professional plan limit: 5 custom templates)
  const canCreateMoreTemplates = !isProPlan || isStudioPlan; // Simplified for demo

  useEffect(() => {
    if (!canUseContracts) {
      Alert.alert(
        'Feature Unavailable',
        'Contract templates are available on Professional and Studio plans.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [canUseContracts, router]);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    try {
      await upgradeTier(tier);
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };

  const handleSave = () => {
    if (!canUseContracts) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!canCreateMoreTemplates) {
      Alert.alert(
        'Template Limit Reached',
        'Professional plan allows up to 5 custom templates. Upgrade to Studio for unlimited templates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => setShowUpgradePrompt(true) }
        ]
      );
      return;
    }
    
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
    if (!canUseContracts) {
      setShowUpgradePrompt(true);
      return;
    }
    
    if (!templateName.trim() || !templateContent.trim()) {
      Alert.alert('Error', 'Please fill in the template name and content before previewing.');
      return;
    }
    
    // For preview, we'll use a temporary ID
    router.push(`/template-preview?id=new&name=${encodeURIComponent(templateName)}&content=${encodeURIComponent(templateContent)}`);
  };

  if (!canUseContracts) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="New Template" showBackButton />
        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedContent}>
            <Lock size={64} color={colors.text.tertiary} />
            <Text style={styles.restrictedTitle}>Contract Templates Unavailable</Text>
            <Text style={styles.restrictedDescription}>
              Contract templates are available on Professional and Studio plans. Create reusable templates to streamline your workflow.
            </Text>
            <Button
              title="Upgrade to Professional"
              onPress={() => setShowUpgradePrompt(true)}
              variant="primary"
              style={styles.upgradeButton}
            />
            <Text style={styles.planInfo}>
              Current plan: {currentPlan.name}
            </Text>
          </View>
        </View>
        <UpgradePrompt
          visible={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={handleUpgrade}
          title="Unlock Contract Templates"
          description="Create reusable contract templates to streamline your workflow and maintain consistency."
          suggestedTier="mid"
        />
      </SafeAreaView>
    );
  }

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
              variant={canCreateMoreTemplates ? "primary" : "outline"}
              size="small"
              leftIcon={canCreateMoreTemplates ? <Save size={16} color={colors.text.inverse} /> : <Lock size={16} color={colors.text.secondary} />}
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
        
        {/* Template limit warning for Professional plan */}
        {isProPlan && !canCreateMoreTemplates && (
          <View style={styles.limitWarning}>
            <Text style={styles.limitWarningText}>
              Professional plan: Template limit reached (5/5)
              {' • Upgrade to Studio for unlimited templates'}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        title={!canUseContracts ? "Unlock Contract Templates" : "Upgrade for Unlimited Templates"}
        description={!canUseContracts ? "Create reusable contract templates to streamline your workflow and maintain consistency." : "Professional plan limits you to 5 custom templates. Upgrade to Studio for unlimited templates."}
        suggestedTier={!canUseContracts ? "mid" : "top"}
      />
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
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  restrictedContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  restrictedDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    width: '100%',
    marginBottom: 16,
  },
  planInfo: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  limitWarning: {
    backgroundColor: colors.warning + '10',
    borderWidth: 1,
    borderColor: colors.warning + '30',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  limitWarningText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
    textAlign: 'center',
  },
});