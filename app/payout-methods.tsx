import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Building, Plus, Trash2, Check } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useAuthStore } from '@/store/authStore';

type PaymentMethod = {
  id: string;
  type: 'bank' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
};

export default function PayoutMethodsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank',
      name: 'Primary Bank Account',
      details: '****1234',
      isDefault: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'bank' | 'card'>('bank');
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodDetails, setNewMethodDetails] = useState('');

  const handleAddMethod = () => {
    if (!newMethodName.trim() || !newMethodDetails.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethodType,
      name: newMethodName.trim(),
      details: newMethodDetails.trim(),
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setNewMethodName('');
    setNewMethodDetails('');
    setNewMethodType('bank');
    setShowAddForm(false);
    Alert.alert('Success', 'Payment method added successfully');
  };

  const handleDeleteMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id));
          }
        }
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <Card key={method.id} style={styles.methodCard}>
      <View style={styles.methodHeader}>
        <View style={styles.methodIcon}>
          {method.type === 'bank' ? (
            <Building size={24} color={colors.primary} />
          ) : (
            <CreditCard size={24} color={colors.primary} />
          )}
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodName}>{method.name}</Text>
          <Text style={styles.methodDetails}>{method.details}</Text>
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Check size={12} color={colors.success} />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.methodActions}>
          {!method.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(method.id)}
            >
              <Text style={styles.actionButtonText}>Set Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteMethod(method.id)}
          >
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderAddForm = () => (
    <Card style={styles.addForm}>
      <Text style={styles.formTitle}>Add Payment Method</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            newMethodType === 'bank' && styles.selectedTypeButton
          ]}
          onPress={() => setNewMethodType('bank')}
        >
          <Building size={20} color={newMethodType === 'bank' ? colors.text.inverse : colors.text.secondary} />
          <Text style={[
            styles.typeButtonText,
            newMethodType === 'bank' && styles.selectedTypeButtonText
          ]}>
            Bank Account
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeButton,
            newMethodType === 'card' && styles.selectedTypeButton
          ]}
          onPress={() => setNewMethodType('card')}
        >
          <CreditCard size={20} color={newMethodType === 'card' ? colors.text.inverse : colors.text.secondary} />
          <Text style={[
            styles.typeButtonText,
            newMethodType === 'card' && styles.selectedTypeButtonText
          ]}>
            Debit Card
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={newMethodName}
          onChangeText={setNewMethodName}
          placeholder={newMethodType === 'bank' ? 'e.g. Primary Business Account' : 'e.g. Business Debit Card'}
          placeholderTextColor={colors.text.tertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>
          {newMethodType === 'bank' ? 'Account Number' : 'Card Number'}
        </Text>
        <TextInput
          style={styles.fieldInput}
          value={newMethodDetails}
          onChangeText={setNewMethodDetails}
          placeholder={newMethodType === 'bank' ? 'Last 4 digits' : 'Last 4 digits'}
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <View style={styles.formActions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => {
            setShowAddForm(false);
            setNewMethodName('');
            setNewMethodDetails('');
            setNewMethodType('bank');
          }}
          style={styles.formButton}
        />
        <Button
          title="Add Method"
          variant="primary"
          onPress={handleAddMethod}
          style={styles.formButton}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Payout Methods" showBackButton />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            {user?.role === 'creative' ? 'Receive Payments' : 'Payment Methods'}
          </Text>
          <Text style={styles.headerDescription}>
            {user?.role === 'creative' 
              ? 'Manage how you receive payments from clients'
              : 'Manage your payment methods for invoices'
            }
          </Text>
        </View>

        <View style={styles.methodsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            {!showAddForm && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Plus size={20} color={colors.primary} />
                <Text style={styles.addButtonText}>Add Method</Text>
              </TouchableOpacity>
            )}
          </View>

          {paymentMethods.map(renderPaymentMethod)}
          
          {showAddForm && renderAddForm()}
          
          {paymentMethods.length === 0 && !showAddForm && (
            <View style={styles.emptyState}>
              <CreditCard size={48} color={colors.primary} />
              <Text style={styles.emptyTitle}>No payment methods</Text>
              <Text style={styles.emptyDescription}>
                Add a payment method to {user?.role === 'creative' ? 'receive payments' : 'pay invoices'}
              </Text>
              <Button
                title="Add Payment Method"
                variant="primary"
                onPress={() => setShowAddForm(true)}
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>

        {user?.role === 'creative' && (
          <Card style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Payout Settings</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Automatic Payouts</Text>
              <Text style={styles.settingValue}>Weekly</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Minimum Payout</Text>
              <Text style={styles.settingValue}>£50.00</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Processing Time</Text>
              <Text style={styles.settingValue}>1-3 business days</Text>
            </View>
          </Card>
        )}
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
  headerSection: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  methodsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  methodCard: {
    marginBottom: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  methodActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },
  addForm: {
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  selectedTypeButtonText: {
    color: colors.text.inverse,
  },
  formField: {
    marginBottom: 16,
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
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  settingsCard: {
    marginTop: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});