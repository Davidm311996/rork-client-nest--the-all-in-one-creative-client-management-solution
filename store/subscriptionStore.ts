import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier, UserSubscription, SUBSCRIPTION_PLANS, getSubscriptionPlans } from '@/types/subscription';

interface SubscriptionState {
  subscription: UserSubscription;
  
  // Actions
  updateSubscription: (subscription: Partial<UserSubscription>) => void;
  upgradeTier: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  canCreateProject: () => boolean;
  canUseFeature: (feature: keyof typeof SUBSCRIPTION_PLANS[0]['features']) => boolean;
  getCurrentPlan: () => typeof SUBSCRIPTION_PLANS[0];
  getPlansInCurrency: (currency: string, exchangeRates: Record<string, number>) => typeof SUBSCRIPTION_PLANS;
  incrementProjectUsage: () => void;
  decrementProjectUsage: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: {
        tier: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        projectsUsed: 0,
      },

      updateSubscription: (updates) => {
        set(state => ({
          subscription: { ...state.subscription, ...updates }
        }));
      },

      upgradeTier: async (tier: SubscriptionTier) => {
        // In a real app, this would handle payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          subscription: {
            ...state.subscription,
            tier,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
          }
        }));
      },

      cancelSubscription: async () => {
        // In a real app, this would cancel the subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          subscription: {
            ...state.subscription,
            cancelAtPeriodEnd: true,
          }
        }));
      },

      canCreateProject: () => {
        const { subscription } = get();
        const plan = get().getCurrentPlan();
        
        if (subscription.status !== 'active') return false;
        if (plan.features.maxProjects === 'unlimited') return true;
        return subscription.projectsUsed < plan.features.maxProjects;
      },

      canUseFeature: (feature) => {
        const { subscription } = get();
        const plan = get().getCurrentPlan();
        
        if (subscription.status !== 'active' && subscription.tier !== 'free') return false;
        return plan.features[feature] as boolean;
      },

      getCurrentPlan: () => {
        const { subscription } = get();
        return SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.tier) || SUBSCRIPTION_PLANS[0];
      },

      getPlansInCurrency: (currency: string, exchangeRates: Record<string, number>) => {
        return getSubscriptionPlans(currency, exchangeRates);
      },

      incrementProjectUsage: () => {
        set(state => ({
          subscription: {
            ...state.subscription,
            projectsUsed: state.subscription.projectsUsed + 1,
          }
        }));
      },

      decrementProjectUsage: () => {
        set(state => ({
          subscription: {
            ...state.subscription,
            projectsUsed: Math.max(0, state.subscription.projectsUsed - 1),
          }
        }));
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);