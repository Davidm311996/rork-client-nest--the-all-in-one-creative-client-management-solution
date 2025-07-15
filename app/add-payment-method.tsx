import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Building, Save, X } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [methodType, setMethodType] = useState<'bank' | 'card'>('bank');
  const [methodName, setMethodName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  
  // Card specific fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handleSave = () => {
    if (methodType === 'bank') {
      if (!methodName.trim() || !accountNumber.trim() || !sortCode.trim() || !bankName.trim() || !accountHolderName.trim()) {
        Alert.alert('Error', 'Please fill in all bank account fields');
        return;
      }
    } else {
      if (!methodName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardHolderName.trim()) {
        Alert.alert('Error', 'Please fill in all card fields');
        return;
      }
    }

    Alert.alert(
      'Success', 
      `${methodType === 'bank' ? 'Bank account' : 'Card'} added successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderBankForm = () => (
    <>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Account Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={methodName}
          onChangeText={setMethodName}
          placeholder="e.g. Primary Business Account"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Account Holder Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={accountHolderName}
          onChangeText={setAccountHolderName}
          placeholder="Full name on account"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Bank Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={bankName}
          onChangeText={setBankName}
          placeholder="e.g. Barclays, HSBC, Lloyds"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formField, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.fieldLabel}>Sort Code</Text>
          <TextInput
            style={styles.fieldInput}
            value={sortCode}
            onChangeText={setSortCode}
            placeholder="12-34-56"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>

        <View style={[styles.formField, { flex: 2, marginLeft: 8 }]}>
          <Text style={styles.fieldLabel}>Account Number</Text>
          <TextInput
            style={styles.fieldInput}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="12345678"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
      </View>
    </>
  );

  const renderCardForm = () => (
    <>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Card Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={methodName}
          onChangeText={setMethodName}
          placeholder="e.g. Business Debit Card"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={cardHolderName}
          onChangeText={setCardHolderName}
          placeholder="Name on card"
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Card Number</Text>
        <TextInput
          style={styles.fieldInput}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formField, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.fieldLabel}>Expiry Date</Text>
          <TextInput
            style={styles.fieldInput}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/YY"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.formField, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.fieldLabel}>CVV</Text>
          <TextInput
            style={styles.fieldInput}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Add Payment Method" 
        showBackButton 
        rightElement={
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {user?.role === 'creative' ? 'How would you like to receive payments?' : 'How would you like to pay?'}
          </Text>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                methodType === 'bank' && styles.selectedTypeButton
              ]}
              onPress={() => setMethodType('bank')}
            >
              <Building size={24} color={methodType === 'bank' ? colors.text.inverse : colors.text.secondary} />
              <Text style={[
                styles.typeButtonText,
                methodType === 'bank' && styles.selectedTypeButtonText
              ]}>
                Bank Account
              </Text>
              <Text style={[
                styles.typeButtonSubtext,
                methodType === 'bank' && styles.selectedTypeButtonSubtext
              ]}>
                {user?.role === 'creative' ? 'Direct bank transfer' : 'Pay via bank transfer'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                methodType === 'card' && styles.selectedTypeButton
              ]}
              onPress={() => setMethodType('card')}
            >
              <CreditCard size={24} color={methodType === 'card' ? colors.text.inverse : colors.text.secondary} />
              <Text style={[
                styles.typeButtonText,
                methodType === 'card' && styles.selectedTypeButtonText
              ]}>
                Debit Card
              </Text>
              <Text style={[
                styles.typeButtonSubtext,
                methodType === 'card' && styles.selectedTypeButtonSubtext
              ]}>
                {user?.role === 'creative' ? 'Instant payouts' : 'Quick payments'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {methodType === 'bank' ? 'Bank Account Details' : 'Card Details'}
          </Text>
          
          {methodType === 'bank' ? renderBankForm() : renderCardForm()}
        </Card>

        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Your payment information is encrypted and secure. We never store your full card or account details.
          </Text>
        </View>

        <Button
          title={`Add ${methodType === 'bank' ? 'Bank Account' : 'Card'}`}
          variant="primary"
          onPress={handleSave}
          leftIcon={<Save size={20} color={colors.text.inverse} />}
          style={styles.saveButton}
        />
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  typeSelector: {
    gap: 12,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  selectedTypeButtonText: {
    color: colors.text.inverse,
  },
  typeButtonSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 12,
    flex: 1,
  },
  selectedTypeButtonSubtext: {
    color: colors.text.inverse + '80',
  },
  formField: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  securityNote: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 10,
  },
});