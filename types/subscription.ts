export type SubscriptionTier = 'free' | 'mid' | 'top';

export type SubscriptionPlan = {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  interval: 'month';
  features: {
    maxProjects: number | 'unlimited';
    contracts: boolean;
    customBranding: boolean;
    teamMembers: boolean;
    analytics: boolean;
    activityLogs: boolean;
    support: 'email' | 'priority' | 'dedicated';
  };
  popular?: boolean;
};

export type UserSubscription = {
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  projectsUsed: number;
};

// Base prices in GBP
const BASE_PRICES = {
  free: 0,
  mid: 12.99,
  top: 24.99,
};

export const getSubscriptionPlans = (currency: string = 'GBP', exchangeRates: Record<string, number> = {}): SubscriptionPlan[] => {
  const convertPrice = (gbpPrice: number) => {
    if (currency === 'GBP') return gbpPrice;
    const rate = exchangeRates[currency] || 1;
    return Math.round((gbpPrice * rate) * 100) / 100;
  };

  return [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency,
      interval: 'month',
      features: {
        maxProjects: 1,
        contracts: false,
        customBranding: false,
        teamMembers: false,
        analytics: false,
        activityLogs: false,
        support: 'email',
      },
    },
    {
      id: 'mid',
      name: 'Professional',
      price: convertPrice(BASE_PRICES.mid),
      currency,
      interval: 'month',
      popular: true,
      features: {
        maxProjects: 5,
        contracts: true,
        customBranding: false,
        teamMembers: false,
        analytics: false,
        activityLogs: false,
        support: 'priority',
      },
    },
    {
      id: 'top',
      name: 'Studio',
      price: convertPrice(BASE_PRICES.top),
      currency,
      interval: 'month',
      features: {
        maxProjects: 'unlimited',
        contracts: true,
        customBranding: true,
        teamMembers: true,
        analytics: true,
        activityLogs: true,
        support: 'dedicated',
      },
    },
  ];
};

// Default plans for backward compatibility
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = getSubscriptionPlans();