import React, { useEffect, useRef, ReactNode } from 'react';
import { 
  View, 
  Keyboard, 
  Animated, 
  Platform, 
  KeyboardEvent,
  StyleSheet,
  ViewStyle
} from 'react-native';

interface ChatContainerProps {
  children?: ReactNode;
  style?: ViewStyle;
  messagesList: ReactNode;
  inputContainer: ReactNode;
}

export default function ChatContainer({ 
  style,
  messagesList,
  inputContainer
}: ChatContainerProps) {
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        const height = event.endCoordinates.height;
        // Only move the messages list up, not the entire container
        Animated.timing(keyboardOffset, {
          toValue: -height + 100, // Leave some space for the input
          duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event: KeyboardEvent) => {
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
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.messagesContainer,
          { transform: [{ translateY: keyboardOffset }] }
        ]}
      >
        {messagesList}
      </Animated.View>
      
      <View style={styles.inputContainer}>
        {inputContainer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    // Use flex layout instead of absolute positioning
  },
});