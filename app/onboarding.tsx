import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { useOnboardingStore } from '@/store/onboardingStore';

const { width } = Dimensions.get('window');

// Design tokens from specification
const designTokens = {
  radii: { card: 28, chip: 16, button: 28, image_mask: 24 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
  shadow: { elev1: '0 8 24 rgba(0,0,0,0.08)', elev2: '0 12 32 rgba(0,0,0,0.12)' },
  pastels: {
    peach: '#FEE5D3',
    mint: '#DFF5EA',
    sky: '#E5F2FF',
    lilac: '#EEE8FF',
    sand: '#F5EFE6',
    stone: '#ECECEC'
  },
  brand: { primary: '#3C2A86', accent: '#7DF0FF', text: '#151515', muted: '#676E76' }
};

const onboardingSlides = [
  {
    id: 'welcome_01',
    title: 'Organise your creative work',
    subtitle: 'Projects clients files and payments in one place',
    badge: 'All in one',
    bgColor: designTokens.pastels.peach,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 'welcome_02',
    title: 'Share files with no chaos',
    subtitle: 'Send galleries contracts and invoices with ease',
    badge: 'Faster delivery',
    bgColor: designTokens.pastels.sky,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 'welcome_03',
    title: 'Keep clients aligned',
    subtitle: 'Simple updates clear approvals faster payments',
    badge: 'Client friendly',
    bgColor: designTokens.pastels.mint,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
  },
  {
    id: 'role_select',
    title: 'Who are you',
    subtitle: 'Choose your role to get started',
    badge: 'Almost there',
    bgColor: designTokens.pastels.lilac,
    isRoleSelect: true,
  },
];

const roleOptions = [
  {
    id: 'creative_professional',
    title: 'Creative professional',
    caption: 'Run projects and get paid',
    bgColor: designTokens.pastels.lilac,
    route: '/auth'
  },
  {
    id: 'client',
    title: 'Client',
    caption: 'I was invited by a creative professional',
    bgColor: designTokens.pastels.sand,
    route: '/auth'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingComplete } = useOnboardingStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    markOnboardingComplete();
    router.replace('/auth');
  };

  const handleRoleSelect = (role: string) => {
    markOnboardingComplete();
    router.replace('/auth');
  };

  const renderSlide = (slide: typeof onboardingSlides[0], index: number) => {
    if (slide.isRoleSelect) {
      return (
        <View key={slide.id} style={[styles.slide, { width, backgroundColor: slide.bgColor }]}>
          <View style={styles.roleSelectContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{slide.badge}</Text>
            </View>
            <Text style={styles.roleTitle}>{slide.title}</Text>
            <Text style={styles.roleSubtitle}>{slide.subtitle}</Text>
            
            <View style={styles.roleOptionsContainer}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.roleCard, { backgroundColor: option.bgColor }]}
                  onPress={() => handleRoleSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleCardTitle}>{option.title}</Text>
                  <Text style={styles.roleCardCaption}>{option.caption}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={slide.id} style={[styles.slide, { width, backgroundColor: slide.bgColor }]}>
        <View style={styles.shopCard}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{slide.badge}</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: slide.imageUrl }} 
              style={styles.slideImage}
              resizeMode="cover"
            />
          </View>
          
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingSlides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSlide ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  const currentSlideData = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;
  const isRoleSelectSlide = currentSlideData?.isRoleSelect;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
    },
    skipButton: {
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    skipText: {
      fontSize: 16,
      color: designTokens.brand.muted,
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: designTokens.spacing.lg,
    },
    shopCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: designTokens.radii.card,
      padding: designTokens.spacing.lg,
      alignItems: 'center',
      width: width - (designTokens.spacing.xl * 2),
      maxWidth: 340,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 32,
        },
        android: {
          elevation: 12,
        },
        web: {
          boxShadow: designTokens.shadow.elev2,
        },
      }),
    },
    badgeContainer: {
      backgroundColor: designTokens.brand.primary,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.xs,
      borderRadius: designTokens.radii.chip,
      marginBottom: designTokens.spacing.lg,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    imageContainer: {
      width: 120,
      height: 120,
      borderRadius: designTokens.radii.image_mask,
      overflow: 'hidden',
      marginBottom: designTokens.spacing.lg,
      backgroundColor: '#F0F0F0',
    },
    slideImage: {
      width: '100%',
      height: '100%',
    },
    slideTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: designTokens.brand.text,
      textAlign: 'center',
      marginBottom: designTokens.spacing.sm,
      lineHeight: 28,
    },
    slideSubtitle: {
      fontSize: 15,
      color: designTokens.brand.muted,
      textAlign: 'center',
      lineHeight: 22,
    },
    roleSelectContainer: {
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: designTokens.spacing.lg,
    },
    roleTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: designTokens.brand.text,
      textAlign: 'center',
      marginBottom: designTokens.spacing.sm,
      letterSpacing: -0.5,
    },
    roleSubtitle: {
      fontSize: 17,
      color: designTokens.brand.muted,
      textAlign: 'center',
      marginBottom: designTokens.spacing.xl,
      lineHeight: 24,
    },
    roleOptionsContainer: {
      width: '100%',
      gap: designTokens.spacing.md,
    },
    roleCard: {
      borderRadius: designTokens.radii.card,
      padding: designTokens.spacing.lg,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: designTokens.shadow.elev1,
        },
      }),
    },
    roleCardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: designTokens.brand.text,
      marginBottom: designTokens.spacing.xs,
      textAlign: 'center',
    },
    roleCardCaption: {
      fontSize: 14,
      color: designTokens.brand.muted,
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.lg,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: designTokens.brand.accent,
    },
    inactiveDot: {
      backgroundColor: designTokens.brand.muted,
    },
    nextButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: designTokens.radii.button,
      paddingHorizontal: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: designTokens.spacing.sm,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: '0 4 12 rgba(0,0,0,0.1)',
        },
      }),
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: designTokens.brand.text,
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: currentSlideData?.bgColor || designTokens.pastels.peach }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {!isRoleSelectSlide && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentSlide(slideIndex);
          }}
          contentOffset={{ x: currentSlide * width, y: 0 }}
          style={styles.scrollView}
        >
          {onboardingSlides.map(renderSlide)}
        </ScrollView>

        {!isRoleSelectSlide && (
          <View style={styles.footer}>
            {renderDots()}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {isLastSlide ? "Get started" : "Next"}
              </Text>
              <ArrowRight size={20} color={designTokens.brand.text} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}