import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '@/constants/colors';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  colors: typeof lightTheme;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

const getEffectiveColors = (theme: Theme) => {
  if (theme === 'system') {
    return getSystemTheme() === 'dark' ? darkTheme : lightTheme;
  }
  return theme === 'dark' ? darkTheme : lightTheme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      colors: getEffectiveColors('system'),

      setTheme: (theme: Theme) => {
        const newColors = getEffectiveColors(theme);
        set({
          theme,
          colors: newColors,
        });
      },

      toggleTheme: () => {
        const effectiveTheme = get().getEffectiveTheme();
        const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return getSystemTheme();
        }
        return theme;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          // Update colors based on current system theme when app loads
          state.colors = getEffectiveColors(state.theme);
          
          // Listen for system theme changes
          const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (state.theme === 'system') {
              state.setTheme('system'); // Use the state's setTheme method
            }
          });
          
          // Store subscription for cleanup (optional)
          (state as any)._subscription = subscription;
        }
      },
    }
  )
);