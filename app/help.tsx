import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I invite a client?',
      answer: 'Go to your dashboard and tap "Invite Client". Enter their email address and they\'ll receive an invitation to join your workspace.',
      category: 'Getting Started',
    },
    {
      id: '2',
      question: 'How do I upload files for my client?',
      answer: 'Navigate to a project, go to the Files tab, and tap "Upload Files". You can upload multiple files at once and add comments.',
      category: 'File Management',
    },
    {
      id: '3',
      question: 'Can I create custom contracts?',
      answer: 'Yes! Professional and Studio plans include contract templates. You can create, customize, and send contracts for digital signing.',
      category: 'Contracts',
    },
    {
      id: '4',
      question: 'How do payments work?',
      answer: 'You can create invoices and send payment links to clients. Payments are processed securely through Stripe.',
      category: 'Payments',
    },
    {
      id: '5',
      question: 'What happens if I exceed my project limit?',
      answer: 'You\'ll be prompted to upgrade your plan. Alternatively, you can archive completed projects to free up space.',
      category: 'Subscription',
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@clientnest.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleLiveChat = () => {
    // In a real app, this would open a chat widget
    router.push('/(tabs)/chat');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Help Center" showBackButton />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Support</Text>
          
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={handleLiveChat}>
              <MessageCircle size={24} color={colors.primary} />
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactDescription}>Chat with our team</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactCard} onPress={handleContactSupport}>
              <Mail size={24} color={colors.primary} />
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactDescription}>Send us a message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactCard} onPress={handleCallSupport}>
              <Phone size={24} color={colors.primary} />
              <Text style={styles.contactTitle}>Phone</Text>
              <Text style={styles.contactDescription}>Call our support line</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {categories.map(category => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              
              {faqs
                .filter(faq => faq.category === category)
                .map(faq => (
                  <Card key={faq.id} style={styles.faqCard}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleFAQ(faq.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown size={20} color={colors.text.secondary} />
                      ) : (
                        <ChevronRight size={20} color={colors.text.secondary} />
                      )}
                    </TouchableOpacity>
                    
                    {expandedFAQ === faq.id && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </Card>
                ))}
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          
          <Card style={styles.linksCard}>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://clientnest.com/terms')}
            >
              <Text style={styles.linkText}>Terms of Service</Text>
              <ExternalLink size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
            
            <View style={styles.linkDivider} />
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://clientnest.com/privacy')}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
              <ExternalLink size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
            
            <View style={styles.linkDivider} />
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://clientnest.com/docs')}
            >
              <Text style={styles.linkText}>Documentation</Text>
              <ExternalLink size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Still Need Help */}
        <Card style={styles.helpCard}>
          <HelpCircle size={48} color={colors.primary} />
          <Text style={styles.helpTitle}>Still need help?</Text>
          <Text style={styles.helpDescription}>
            Can't find what you're looking for? Our support team is here to help.
          </Text>
          <Button
            title="Contact Support"
            variant="primary"
            onPress={handleContactSupport}
            style={styles.helpButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqCard: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginTop: 12,
  },
  linksCard: {
    overflow: 'hidden',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  linkDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  helpCard: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  helpButton: {
    minWidth: 200,
  },
});