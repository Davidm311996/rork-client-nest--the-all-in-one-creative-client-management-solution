import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, Star } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionTier, getSubscriptionPlans } from '@/types/subscription';
import { useCurrencyStore } from '@/store/currencyStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, upgradeTier, cancelSubscription, getCurrentPlan } = useSubscriptionStore();
  const { getCurrencySymbol, selectedCurrency, exchangeRates } = useCurrencyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  
  const currentPlan = getCurrentPlan();
  const isProPlan = subscription.tier === 'mid' || subscription.tier === 'top';
  
  // Get plans in current currency
  const plansInCurrency = getSubscriptionPlans(selectedCurrency.code, exchangeRates);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === subscription.tier) return;
    
    setIsLoading(true);
    setSelectedTier(tier);
    
    try {
      await upgradeTier(tier);
      router.back();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFeatureValue = (value: number | string | boolean) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === 'unlimited') return 'Unlimited';
    return value.toString();
  };

  const renderPlanCard = (plan: typeof plansInCurrency[0]) => {
    const isCurrentPlan = plan.id === subscription.tier;
    const isUpgrading = isLoading && selectedTier === plan.id;
    
    return (
      <Card key={plan.id} style={[
        styles.planCard,
        isCurrentPlan && styles.currentPlanCard,
        plan.popular && styles.popularPlanCard,
      ]}>
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Star size={12} color={colors.text.inverse} />
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={[typography.h3, styles.planName]}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>{getCurrencySymbol()}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.interval}>/month</Text>
          </View>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Check size={16} color={colors.success} />
            <Text style={styles.featureText}>
              {formatFeatureValue(plan.features.maxProjects)} active projects
            </Text>
          </View>
          
          {plan.features.contracts && (
            <View style={styles.featureItem}>
              <Check size={16} color={colors.success} />
              <Text style={styles.featureText}>
                Digital contracts
              </Text>
            </View>
          )}
          
          {plan.features.customBranding && (
            <View style={styles.featureItem}>
              <Check size={16} color={colors.success} />
              <Text style={styles.featureText}>
                Custom branding
              </Text>
            </View>
          )}
          
          {plan.features.teamMembers && (
            <View style={styles.featureItem}>
              <Check size={16} color={colors.success} />
              <Text style={styles.featureText}>
                Team collaboration
              </Text>
            </View>
          )}
          
          {plan.features.analytics && (
            <View style={styles.featureItem}>
              <Check size={16} color={colors.success} />
              <Text style={styles.featureText}>
                Advanced analytics
              </Text>
            </View>
          )}
          
          <View style={styles.featureItem}>
            <Check size={16} color={colors.success} />
            <Text style={styles.featureText}>
              {plan.features.support === 'email' ? 'Email' : 
               plan.features.support === 'priority' ? 'Priority' : 'Dedicated'} support
            </Text>
          </View>
        </View>
        
        {isCurrentPlan ? (
          <View style={styles.currentPlanButton}>
            <Text style={styles.currentPlanText}>Current Plan</Text>
          </View>
        ) : (
          <Button
            title={isUpgrading ? "Upgrading..." : plan.price === 0 ? "Downgrade" : "Upgrade"}
            variant={plan.popular ? "primary" : "outline"}
            onPress={() => handleUpgrade(plan.id)}
            disabled={isLoading}
            loading={isUpgrading}
            style={styles.planButton}
          />
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Subscription" showBackButton />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Crown size={48} color={colors.secondary} />
          <Text style={[typography.h2, styles.headerTitle]}>Choose Your Plan</Text>
          <Text style={[typography.body, styles.headerDescription]}>
            Upgrade to unlock more projects and professional features
          </Text>
        </View>
        
        <View style={styles.currentStatus}>
          <Text style={typography.h4}>Current Plan: {currentPlan.name}</Text>
          {/* Only show project usage for free plan */}
          {!isProPlan && (
            <Text style={typography.bodySmall}>
              Projects used: {subscription.projectsUsed} of {formatFeatureValue(currentPlan.features.maxProjects)}
            </Text>
          )}
          {subscription.cancelAtPeriodEnd && (
            <Text style={[typography.bodySmall, styles.cancelText]}>
              Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        <View style={styles.plansContainer}>
          {plansInCurrency.map(renderPlanCard)}
        </View>
        
        {subscription.tier !== 'free' && !subscription.cancelAtPeriodEnd && (
          <Button
            title="Cancel Subscription"
            variant="outline"
            onPress={handleCancel}
            disabled={isLoading}
            style={[styles.cancelButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
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
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  headerDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  currentStatus: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  cancelText: {
    color: colors.warning,
    marginTop: 4,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    position: 'relative',
  },
  currentPlanCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularPlanCard: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    right: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  popularText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  planName: {
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  freePrice: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text.primary,
  },
  interval: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  planButton: {
    width: '100%',
  },
  currentPlanButton: {
    backgroundColor: colors.success + '20',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  currentPlanText: {
    color: colors.success,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
  },
});