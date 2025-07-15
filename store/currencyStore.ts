import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  flag: string;
};

export const CURRENCIES: Currency[] = [
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰' },
];

interface CurrencyState {
  selectedCurrency: Currency;
  exchangeRates: Record<string, number>;
  lastUpdated: string | null;
  
  // Actions
  setCurrency: (currency: Currency) => void;
  getCurrencySymbol: () => string;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: string, toCurrency?: string) => number;
  updateExchangeRates: () => Promise<void>;
  initializeRates: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: CURRENCIES[0], // Default to GBP
      exchangeRates: {
        'GBP': 1.0,
        'USD': 1.27,
        'EUR': 1.17,
        'CAD': 1.71,
        'AUD': 1.95,
        'JPY': 188.5,
        'CHF': 1.12,
        'SEK': 13.8,
        'NOK': 14.2,
        'DKK': 8.7,
      },
      lastUpdated: null,

      setCurrency: (currency) => {
        set({ selectedCurrency: currency });
        // Update exchange rates when currency changes
        get().updateExchangeRates();
      },

      getCurrencySymbol: () => {
        return get().selectedCurrency.symbol;
      },

      formatAmount: (amount) => {
        const { selectedCurrency } = get();
        return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
      },

      convertAmount: (amount, fromCurrency, toCurrency) => {
        const { selectedCurrency, exchangeRates } = get();
        const targetCurrency = toCurrency || selectedCurrency.code;
        
        if (fromCurrency === targetCurrency) return amount;
        
        // Convert to GBP first (base currency)
        const gbpAmount = amount / (exchangeRates[fromCurrency] || 1);
        // Then convert to target currency
        return gbpAmount * (exchangeRates[targetCurrency] || 1);
      },

      updateExchangeRates: async () => {
        try {
          // Fetch real exchange rates from a free API
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
          const data = await response.json();
          
          if (data && data.rates) {
            const rates: Record<string, number> = {
              'GBP': 1.0, // Base currency
            };
            
            // Map the rates we support
            CURRENCIES.forEach(currency => {
              if (currency.code !== 'GBP' && data.rates[currency.code]) {
                rates[currency.code] = data.rates[currency.code];
              }
            });
            
            set({ 
              exchangeRates: rates,
              lastUpdated: new Date().toISOString()
            });
          } else {
            // Fallback to mock rates if API fails
            const mockRates = {
              'GBP': 1.0,
              'USD': 1.27,
              'EUR': 1.17,
              'CAD': 1.71,
              'AUD': 1.95,
              'JPY': 188.5,
              'CHF': 1.12,
              'SEK': 13.8,
              'NOK': 14.2,
              'DKK': 8.7,
            };
            
            set({ 
              exchangeRates: mockRates,
              lastUpdated: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to update exchange rates:', error);
          // Use existing rates or fallback rates
        }
      },

      initializeRates: () => {
        const { lastUpdated } = get();
        // Update rates if they haven't been updated in the last hour
        // Don't block initialization - do this in background
        if (!lastUpdated || Date.now() - new Date(lastUpdated).getTime() > 60 * 60 * 1000) {
          // Use setTimeout to avoid blocking initialization
          setTimeout(() => {
            get().updateExchangeRates().catch(error => {
              console.error('Failed to update exchange rates:', error);
            });
          }, 1000);
        }
      },
    }),
    {
      name: 'currency-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);