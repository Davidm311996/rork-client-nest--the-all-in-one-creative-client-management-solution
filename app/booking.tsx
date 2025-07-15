import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Coins, FileText, User } from 'lucide-react-native';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';

export default function BookingScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
    depositAmount: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateBooking = async () => {
    if (!formData.clientName || !formData.projectTitle || !formData.totalAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Booking Created!',
        'Project has been created and contract sent to client.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="New Booking" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Calendar size={48} color={colors.secondary} />
          </View>
          
          <Text style={[typography.h2, styles.title]}>Create New Booking</Text>
          <Text style={[typography.body, styles.description]}>
            Set up a new project with contract and payment details
          </Text>
        </View>
        
        {/* Client Information */}
        <Card style={styles.sectionCard}>
          <Text style={[typography.h4, styles.sectionTitle]}>Client Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.clientName}
              onChangeText={(value) => updateFormData('clientName', value)}
              placeholder="Enter client name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.clientEmail}
              onChangeText={(value) => updateFormData('clientEmail', value)}
              placeholder="Enter client email"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </Card>

        {/* Project Details */}
        <Card style={styles.sectionCard}>
          <Text style={[typography.h4, styles.sectionTitle]}>Project Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Project Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.projectTitle}
              onChangeText={(value) => updateFormData('projectTitle', value)}
              placeholder="Enter project title"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.projectDescription}
              onChangeText={(value) => updateFormData('projectDescription', value)}
              placeholder="Describe the project scope and deliverables"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={typography.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={formData.startDate}
                onChangeText={(value) => updateFormData('startDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
            
            <View style={styles.dateField}>
              <Text style={typography.label}>End Date</Text>
              <TextInput
                style={styles.input}
                value={formData.endDate}
                onChangeText={(value) => updateFormData('endDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>
        </Card>

        {/* Payment Details */}
        <Card style={styles.sectionCard}>
          <Text style={[typography.h4, styles.sectionTitle]}>Payment Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Total Amount (£) *</Text>
            <TextInput
              style={styles.input}
              value={formData.totalAmount}
              onChangeText={(value) => updateFormData('totalAmount', value)}
              placeholder="0.00"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Deposit Amount (£)</Text>
            <TextInput
              style={styles.input}
              value={formData.depositAmount}
              onChangeText={(value) => updateFormData('depositAmount', value)}
              placeholder="0.00"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            After creating this booking, a contract will be automatically generated and sent to your client for signature.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.footerButton}
        />
        <Button
          title={isLoading ? "Creating..." : "Create Booking"}
          variant="primary"
          onPress={handleCreateBooking}
          disabled={isLoading}
          loading={isLoading}
          style={styles.footerButton}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.secondary + '30',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionCard: {
    width: '100%',
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text.primary,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});