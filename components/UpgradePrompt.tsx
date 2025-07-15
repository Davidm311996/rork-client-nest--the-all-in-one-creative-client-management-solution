import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Crown, X, Check } from 'lucide-react-native';
import Button from './Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { SubscriptionTier } from '@/types/subscription';
import { useSubscriptionStore } from '@/store/subscriptionStore';

type UpgradePromptProps = {
  visible: boolean;
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier) => void;
  title: string;
  description: string;
  suggestedTier?: SubscriptionTier;
};

export default function UpgradePrompt({
  visible,
  onClose,
  onUpgrade,
  title,
  description,
  suggestedTier = 'mid',
}: UpgradePromptProps) {
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  
  const getUpgradeButtonText = () => {
    if (suggestedTier === 'mid') return 'Upgrade to Professional';
    if (suggestedTier === 'top') return 'Upgrade to Studio';
    return 'Upgrade Now';
  };

  const getPlanFeatures = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'mid':
        return [
          'Unlimited projects',
          'Digital contracts & e-signatures',
          'Advanced payment tracking',
          'Priority support',
          'Custom branding'
        ];
      case 'top':
        return [
          'Everything in Professional',
          'Team collaboration',
          'Advanced analytics',
          'White-label solution',
          'Dedicated account manager'
        ];
      default:
        return [];
    }
  };

  const getPlanPrice = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'mid':
        return '$19/month';
      case 'top':
        return '$49/month';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Crown size={48} color={colors.secondary} />
          </View>
          
          <Text style={[typography.h3, styles.title]}>{title}</Text>
          <Text style={[typography.body, styles.description]}>{description}</Text>
          
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>
                {suggestedTier === 'mid' ? 'Professional' : 'Studio'} Plan
              </Text>
              <Text style={styles.planPrice}>{getPlanPrice(suggestedTier)}</Text>
            </View>
            
            <View style={styles.featuresContainer}>
              {getPlanFeatures(suggestedTier).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={16} color={colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.actions}>
            <Button
              title="Maybe Later"
              variant="outline"
              onPress={onClose}
              style={styles.actionButton}
            />
            <Button
              title={getUpgradeButtonText()}
              variant="primary"
              onPress={() => onUpgrade(suggestedTier)}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },

});