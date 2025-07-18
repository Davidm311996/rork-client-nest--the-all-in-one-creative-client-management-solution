import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { createTypography } from '@/constants/typography';
import { useThemeStore } from '@/store/themeStore';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
};

export default function Header({
  title,
  showBackButton = false,
  rightElement,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  const typography = createTypography(colors);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: 8,
    },
    title: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        <Text style={[typography.h3, styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
}

