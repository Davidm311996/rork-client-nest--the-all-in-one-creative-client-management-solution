import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Users, FileText, MessageCircle, CreditCard, Shield } from 'lucide-react-native';
import { useOnboardingStore } from '@/store/onboardingStore';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

const { width } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: 1,
    title: 'Welcome to Client Nest',
    description: 'Manage your projects in one place. Perfect for creatives and their clients.',
    icon: <Users size={80} color={colors.primary} />,
  },
  {
    id: 2,
    title: 'Invite Clients Easily',
    description: 'Send invites and link your clients in seconds. Keep everything organized.',
    icon: <MessageCircle size={80} color={colors.primary} />,
  },
  {
    id: 3,
    title: 'Deliver Files Securely',
    description: 'Share deliverables, manage versions, and get confirmations from clients.',
    icon: <Shield size={80} color={colors.primary} />,
  },
  {
    id: 4,
    title: 'Get Paid Faster',
    description: 'Request payments, track invoices, and stay organized with your finances.',
    icon: <CreditCard size={80} color={colors.primary} />,
  },
  {
    id: 5,
    title: 'Sign Contracts Quickly',
    description: 'Send, sign, and store contracts in one place. Keep your business professional.',
    icon: <FileText size={80} color={colors.primary} />,
  },
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

  const renderSlide = (slide: typeof onboardingSlides[0], index: number) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <View style={styles.iconContainer}>
        {slide.icon}
      </View>
      <Text style={[typography.h1, styles.title]}>{slide.title}</Text>
      <Text style={[typography.body, styles.description]}>{slide.description}</Text>
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        contentOffset={{ x: currentSlide * width, y: 0 }}
      >
        {onboardingSlides.map(renderSlide)}
      </ScrollView>

      <View style={styles.footer}>
        {renderDots()}
        <Button
          title={currentSlide === onboardingSlides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="primary"
          rightIcon={<ChevronRight size={18} color={colors.text.inverse} />}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    backgroundColor: colors.inactive,
  },
  nextButton: {
    width: '100%',
  },
});