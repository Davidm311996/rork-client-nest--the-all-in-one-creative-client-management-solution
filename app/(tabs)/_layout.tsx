import React from "react";
import { Tabs } from "expo-router";
import { Platform, Dimensions, TouchableOpacity } from "react-native";
import * as Haptics from 'expo-haptics';
import { Home, FolderOpen, MessageCircle, User } from "lucide-react-native";
import { useThemeStore } from '@/store/themeStore';

const { height: screenHeight } = Dimensions.get('window');

export default function TabLayout() {
  const { colors } = useThemeStore();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarButton: (props) => {
          const { 
            delayLongPress, 
            disabled, 
            onBlur,
            onFocus,
            onLayout,
            onLongPress,
            onPress,
            onPressIn,
            onPressOut,
            ...restProps 
          } = props;
          
          return (
            <TouchableOpacity
              {...restProps}
              delayLongPress={delayLongPress || undefined}
              disabled={disabled || undefined}
              onBlur={onBlur || undefined}
              onFocus={onFocus || undefined}
              onLayout={onLayout || undefined}
              onLongPress={onLongPress || undefined}
              onPressIn={onPressIn || undefined}
              onPressOut={onPressOut || undefined}
              onPress={(e) => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                onPress?.(e);
              }}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? (screenHeight > 800 ? 90 : 84) : 80,
          paddingBottom: Platform.OS === 'ios' ? (screenHeight > 800 ? 34 : 20) : 20,
          paddingTop: Platform.OS === 'android' ? 12 : 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: Platform.OS === 'android' ? 8 : 0,
          shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
          shadowOffset: Platform.OS === 'ios' ? { width: 0, height: -2 } : undefined,
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
          shadowRadius: Platform.OS === 'ios' ? 8 : undefined,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <FolderOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}