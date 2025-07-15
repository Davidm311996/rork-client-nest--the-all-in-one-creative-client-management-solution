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
import { UserPlus } from 'lucide-react-native';
import { useClientStore } from '@/store/clientStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function NewClientScreen() {
  const router = useRouter();
  const { createClient } = useClientStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateClient = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a client email');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const newClient = await createClient({
        name,
        email,
        phone,
        company,
      });
      
      router.replace(`/client/${newClient.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create client. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="New Client" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <UserPlus size={48} color={colors.primary} />
        </View>
        
        <Card style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={typography.label}>Client Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter client name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter client email"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter client phone"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Enter company name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>
        
        <Text style={styles.infoText}>
          Your client will receive an email invitation to access their Client Nest portal.
        </Text>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.footerButton}
        />
        <Button
          title={isCreating ? "Creating..." : "Create Client"}
          variant="primary"
          onPress={handleCreateClient}
          disabled={isCreating}
          loading={isCreating}
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
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formCard: {
    width: '100%',
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  infoText: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 24,
    marginHorizontal: 16,
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