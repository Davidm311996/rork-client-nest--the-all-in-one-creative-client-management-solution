import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, Dimensions, View, Text } from "react-native";
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useProjectStore } from '@/store/projectStore';
import CustomSplashScreen from '@/components/SplashScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';
import colors from '@/constants/colors';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    ...FontAwesome.font,
  });
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
      // Don't throw the error to prevent app crash
      // The app can still function without custom fonts
    }
  }, [fontError]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Initialize stores with error handling - don't block on these
        setTimeout(() => {
          try {
            const { initializeRates } = useCurrencyStore.getState();
            initializeRates();
          } catch (error) {
            console.error('Currency initialization error:', error);
          }
        }, 100);
        
        setTimeout(() => {
          try {
            const { fetchProjects } = useProjectStore.getState();
            fetchProjects();
          } catch (error) {
            console.error('Projects initialization error:', error);
          }
        }, 200);
        
        // Mark app as ready immediately to prevent blocking
        setAppReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Always mark as ready to prevent infinite loading
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (loaded && appReady) {
      SplashScreen.hideAsync().catch(error => {
        console.error('Failed to hide splash screen:', error);
      });
    }
  }, [loaded, appReady]);

  // Show error state if there's a critical error
  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 }}>
        <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600', marginBottom: 10 }}>App Initialization Error</Text>
        <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>{initError}</Text>
      </View>
    );
  }

  if (!loaded || !appReady) {
    return <CustomSplashScreen />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { colors, theme } = useThemeStore();
  
  return (
    <>
      <StatusBar 
        style={theme === 'light' ? 'dark' : 'light'} 
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: colors.background,
            flex: 1,
          },
          animation: Platform.OS === 'web' ? 'none' : "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="project/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="client/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="new-project" options={{ headerShown: false }} />
        <Stack.Screen name="new-client" options={{ headerShown: false }} />
        <Stack.Screen name="notes" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="invite-client" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="files" options={{ headerShown: false }} />
        <Stack.Screen name="contracts" options={{ headerShown: false }} />
        <Stack.Screen name="payments" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="contract-templates" options={{ headerShown: false }} />
        <Stack.Screen name="edit-template/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="new-template" options={{ headerShown: false }} />
        <Stack.Screen name="template-preview" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}