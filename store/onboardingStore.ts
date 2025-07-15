import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  isOnboardingComplete: boolean;
  
  // Actions
  markOnboardingComplete: () => void;
  checkOnboardingStatus: () => Promise<void>;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isOnboardingComplete: false,

      markOnboardingComplete: () => {
        set({ isOnboardingComplete: true });
      },

      checkOnboardingStatus: async () => {
        // This would check local storage or API
        // For now, just return the current state
        return Promise.resolve();
      },

      resetOnboarding: () => {
        set({ isOnboardingComplete: false });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);