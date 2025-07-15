import React, { useEffect, useRef, ReactNode } from 'react';
import { 
  View, 
  Keyboard, 
  Animated, 
  Platform, 
  KeyboardEvent,
  StyleSheet,
  ViewStyle,
  ScrollView,
  Dimensions
} from 'react-native';

interface KeyboardAwareViewProps {
  children: ReactNode;
  style?: ViewStyle;
  offset?: number;
  enabled?: boolean;
  isChatScreen?: boolean;
  enableScrolling?: boolean;
}

export default function KeyboardAwareView({ 
  children, 
  style, 
  offset = 0,
  enabled = true,
  isChatScreen = false,
  enableScrolling = true
}: KeyboardAwareViewProps) {
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        const height = event.endCoordinates.height;
        
        // For chat screens, move the chat bar up above the keyboard
        if (isChatScreen) {
          Animated.timing(keyboardOffset, {
            toValue: -height + 34, // Account for safe area bottom padding
            duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
            useNativeDriver: false,
          }).start();
          return;
        }
        
        // 5cm ≈ 189 pixels (assuming ~96 DPI)
        const maxOffset = Math.min(height, 189);
        Animated.timing(keyboardOffset, {
          toValue: -(maxOffset - offset),
          duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event: KeyboardEvent) => {
        if (isChatScreen) {
          Animated.timing(keyboardOffset, {
            toValue: 0,
            duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
            useNativeDriver: false,
          }).start();
          return;
        }
        
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [enabled, offset, isChatScreen]);

  if (enableScrolling) {
    return (
      <Animated.View 
        style={[
          styles.container,
          style,
          { transform: [{ translateY: keyboardOffset }] }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        style,
        { transform: [{ translateY: keyboardOffset }] }
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});