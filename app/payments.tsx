import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  Coins, 
  Clock, 
  CheckCircle, 
  Plus,
  Download,
  Send,
  AlertCircle,
  Building,
  RotateCcw,
  X as XIcon
} from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useAuthStore } from '@/store/authStore';

const { width: screenWidth } = Dimensions.get('window');

interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  projectTitle: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  type: 'deposit' | 'final' | 'milestone';
  invoiceNumber: string;
  canMarkAsPaid?: boolean;
  canCancel?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

export default function PaymentsScreen() {
  const router = useRouter();
  const { clientId, type, projectId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'methods'>('invoices');
  const [payoutFrequency, setPayoutFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const scrollViewRef = useRef<ScrollView>(null);
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'Sarah Johnson',
      projectTitle: 'Wedding Photography',
      amount: 1200,
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      type: 'deposit',
      invoiceNumber: 'INV-001',
      canMarkAsPaid: false,
      canCancel: false,
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Emma Chen',
      projectTitle: 'Product Photography',
      amount: 800,
      status: 'pending',
      dueDate: '2024-02-01',
      type: 'final',
      invoiceNumber: 'INV-002',
      canMarkAsPaid: true,
      canCancel: true,
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Jason Miller',
      projectTitle: 'Website Redesign',
      amount: 500,
      status: 'paid',
      dueDate: '2024-01-20',
      paidDate: '2024-01-19',
      type: 'milestone',
      invoiceNumber: 'INV-003',
      canMarkAsPaid: false,
      canCancel: false,
    },
    {
      id: '4',
      clientId: '1',
      clientName: 'Sarah Johnson',
      projectTitle: 'Wedding Photography',
      amount: 2000,
      status: 'paid',
      dueDate: '2024-08-20',
      paidDate: '2024-08-18',
      type: 'final',
      invoiceNumber: 'INV-004',
      canMarkAsPaid: false,
      canCancel: false,
    },
  ]);
  
  const isCreative = user?.role === 'creative';
  const isFiltered = !!clientId; // Hide payouts tab when filtering by client
  
  // Handle tab changes and scroll to correct page with smooth animation
  React.useEffect(() => {
    if (!isFiltered) {
      const tabIndex = activeTab === 'invoices' ? 0 : 1;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ 
          x: tabIndex * screenWidth, 
          animated: true 
        });
      }
    }
  }, [activeTab, isFiltered]);
  
  const handleScroll = (event: any) => {
    if (isFiltered) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenWidth);
    const tabs = ['invoices', 'methods'] as const;
    if (pageIndex >= 0 && pageIndex < tabs.length) {
      setActiveTab(tabs[pageIndex]);
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      last4: '1234',
      isDefault: false,
    },
  ];

  // Filter payments by client and/or type if provided
  let filteredPayments = payments;
  
  if (clientId) {
    filteredPayments = filteredPayments.filter(payment => payment.clientId === clientId);
  }
  
  if (type) {
    const typeString = Array.isArray(type) ? type[0] : type;
    filteredPayments = filteredPayments.filter(payment => payment.type === typeString);
  }
  
  if (projectId) {
    // In a real app, you'd filter by projectId as well
    // For now, we'll just use the existing filters
  }

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.error;
      case 'cancelled':
        return colors.text.tertiary;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} color={colors.success} />;
      case 'pending':
        return <Clock size={20} color={colors.warning} />;
      case 'overdue':
        return <AlertCircle size={20} color={colors.error} />;
      case 'cancelled':
        return <XIcon size={20} color={colors.text.tertiary} />;
      default:
        return null;
    }
  };

  const handleSendReminder = (payment: Payment) => {
    Alert.alert(
      'Send Reminder',
      `Send payment reminder to ${payment.clientName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            Alert.alert('Success', 'Payment reminder sent!');
          }
        },
      ]
    );
  };

  const handleMarkAsPaid = (payment: Payment) => {
    Alert.alert(
      'Mark as Paid',
      `Mark invoice ${payment.invoiceNumber} as paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Paid', 
          onPress: () => {
            setPayments(prev => prev.map(p => 
              p.id === payment.id 
                ? { ...p, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0], canMarkAsPaid: false, canCancel: false }
                : p
            ));
            Alert.alert('Success', 'Invoice marked as paid!');
            // Update recent activity on homepage
            updateRecentActivity({
              type: 'payment_received',
              invoiceId: payment.id,
              clientName: payment.clientName,
              amount: payment.amount,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleCancelInvoice = (payment: Payment) => {
    // Only allow cancellation if invoice is not paid
    if (payment.status === 'paid') {
      Alert.alert('Cannot Cancel', 'Paid invoices cannot be cancelled. Use the refund option instead.');
      return;
    }

    Alert.alert(
      'Cancel Invoice',
      `Are you sure you want to cancel invoice ${payment.invoiceNumber}? This will send a cancellation email to ${payment.clientName}.`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Cancel Invoice', 
          style: 'destructive',
          onPress: () => {
            setPayments(prev => prev.map(p => 
              p.id === payment.id 
                ? { ...p, status: 'cancelled' as const, canMarkAsPaid: false, canCancel: false }
                : p
            ));
            Alert.alert('Success', 'Invoice cancelled and client notified via email!');
            // Update recent activity on homepage
            updateRecentActivity({
              type: 'invoice_cancelled',
              invoiceId: payment.id,
              clientName: payment.clientName,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleMarkUnpaid = (payment: Payment) => {
    Alert.alert(
      'Mark as Unpaid',
      `Mark invoice ${payment.invoiceNumber} as unpaid? This will change the status to pending.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Unpaid', 
          style: 'destructive',
          onPress: () => {
            setPayments(prev => prev.map(p => 
              p.id === payment.id 
                ? { ...p, status: 'pending' as const, paidDate: undefined, canMarkAsPaid: true, canCancel: true }
                : p
            ));
            Alert.alert('Success', 'Invoice marked as unpaid!');
            // Update recent activity on homepage
            updateRecentActivity({
              type: 'payment_status_change',
              invoiceId: payment.id,
              status: 'unpaid',
              clientName: payment.clientName,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleRefundInvoice = (payment: Payment) => {
    Alert.alert(
      'Refund Invoice',
      `Issue a refund for invoice ${payment.invoiceNumber}? This will process a refund to ${payment.clientName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Issue Refund', 
          style: 'destructive',
          onPress: () => {
            setPayments(prev => prev.map(p => 
              p.id === payment.id 
                ? { ...p, status: 'cancelled' as const, canMarkAsPaid: false, canCancel: false }
                : p
            ));
            Alert.alert('Success', 'Refund processed and client notified!');
            // Update recent activity on homepage
            updateRecentActivity({
              type: 'payment_refund',
              invoiceId: payment.id,
              clientName: payment.clientName,
              amount: payment.amount,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  // Mock function to update recent activity - in real app this would update a global store
  const updateRecentActivity = (activity: any) => {
    // This would update the homepage recent activity in a real implementation
    console.log('Activity updated:', activity);
  };

  const getHeaderTitle = () => {
    if (clientId && filteredPayments.length > 0) {
      const clientName = filteredPayments[0].clientName;
      if (type) {
        const typeString = Array.isArray(type) ? type[0] : type;
        return `${typeString.charAt(0).toUpperCase() + typeString.slice(1)} Payments - ${clientName}`;
      }
      return `${clientName} - Invoices`;
    }
    if (type) {
      const typeString = Array.isArray(type) ? type[0] : type;
      return `${typeString.charAt(0).toUpperCase() + typeString.slice(1)} Payments`;
    }
    return "Payments";
  };

  const renderInvoicesTab = () => (
    <View style={styles.tabContent}>
      {!clientId && (
        <View style={styles.summaryCards}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Coins size={24} color={colors.success} />
              <Text style={styles.summaryAmount}>£3,500</Text>
            </View>
            <Text style={styles.summaryLabel}>Total Paid</Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Clock size={24} color={colors.warning} />
              <Text style={styles.summaryAmount}>£800</Text>
            </View>
            <Text style={styles.summaryLabel}>Pending</Text>
          </Card>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {clientId ? `Invoices` : 'Invoices'}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/new-invoice')}
        >
          <Plus size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>New Invoice</Text>
        </TouchableOpacity>
      </View>

      {filteredPayments.map((payment) => (
        <TouchableOpacity 
          key={payment.id} 
          onPress={() => router.push(`/invoice/${payment.id}`)}
          activeOpacity={0.7}
        >
          <Card style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <Text style={styles.invoiceNumber}>{payment.invoiceNumber}</Text>
              <Text style={styles.clientName}>{payment.clientName}</Text>
              <Text style={styles.projectTitle}>{payment.projectTitle}</Text>
            </View>
            <View style={styles.paymentAmount}>
              <Text style={styles.amount}>£{payment.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                {getStatusIcon(payment.status)}
                <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.detailText}>
              {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
            </Text>
            {payment.paidDate && (
              <Text style={styles.detailText}>
                Paid: {new Date(payment.paidDate).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.paymentActions}>
            <Button
              title="Download"
              variant="outline"
              size="small"
              onPress={() => Alert.alert('Download', 'Invoice downloaded')}
              style={styles.actionButton}
              leftIcon={<Download size={16} color={colors.primary} />}
            />
            
            {payment.status === 'paid' && isCreative && (
              <>
                <Button
                  title="Mark Unpaid"
                  variant="outline"
                  size="small"
                  onPress={() => handleMarkUnpaid(payment)}
                  style={styles.actionButton}
                  leftIcon={<RotateCcw size={16} color={colors.warning} />}
                  textStyle={{ color: colors.warning }}
                />
                <Button
                  title="Refund"
                  variant="outline"
                  size="small"
                  onPress={() => handleRefundInvoice(payment)}
                  style={[styles.actionButton, { borderColor: colors.error }]}
                  textStyle={{ color: colors.error }}
                  leftIcon={<XIcon size={16} color={colors.error} />}
                />
              </>
            )}
            
            {payment.canMarkAsPaid && isCreative && (
              <Button
                title="Mark Paid"
                variant="primary"
                size="small"
                onPress={() => handleMarkAsPaid(payment)}
                style={styles.actionButton}
                leftIcon={<CheckCircle size={16} color={colors.text.inverse} />}
              />
            )}
            
            {payment.canCancel && isCreative && payment.status !== 'paid' && (
              <Button
                title="Cancel"
                variant="outline"
                size="small"
                onPress={() => handleCancelInvoice(payment)}
                style={[styles.actionButton, { borderColor: colors.error }]}
                textStyle={{ color: colors.error }}
                leftIcon={<XIcon size={16} color={colors.error} />}
              />
            )}
            
            {payment.status === 'pending' && !isCreative && (
              <Button
                title="Send Reminder"
                variant="primary"
                size="small"
                onPress={() => handleSendReminder(payment)}
                style={styles.actionButton}
                leftIcon={<Send size={16} color={colors.text.inverse} />}
              />
            )}
          </View>
          </Card>
        </TouchableOpacity>
      ))}

      {filteredPayments.length === 0 && (
        <View style={styles.emptyState}>
          <Coins size={48} color={colors.primary} />
          <Text style={[typography.h3, styles.emptyStateTitle]}>No invoices found</Text>
          <Text style={[typography.body, styles.emptyStateDescription]}>
            {clientId ? 'No invoices for this client yet.' : 'Create your first invoice to get started.'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderPaymentMethodsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isCreative ? 'Payout Methods' : 'Payment Methods'}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-payment-method')}
        >
          <Plus size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Method</Text>
        </TouchableOpacity>
      </View>

      {paymentMethods.map((method) => (
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
              <Text style={styles.methodType}>
                {isCreative ? (
                  method.type === 'card' ? 'Debit Card' : 'Bank Account'
                ) : (
                  method.type === 'card' ? `${method.brand} Card` : 'Bank Account'
                )}
              </Text>
              <Text style={styles.methodDetails}>
                •••• •••• •••• {method.last4}
              </Text>
            </View>
            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          
          <View style={styles.methodActions}>
            <Button
              title="Edit"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.methodActionButton}
            />
            {!method.isDefault && (
              <Button
                title="Set Default"
                variant="primary"
                size="small"
                onPress={() => {}}
                style={styles.methodActionButton}
              />
            )}
          </View>
        </Card>
      ))}

      {isCreative && (
        <Card style={styles.payoutSettingsCard}>
          <Text style={styles.sectionTitle}>Payout Settings</Text>
          <Text style={styles.settingsDescription}>
            Choose how often you'd like to receive payouts
          </Text>
          
          <View style={styles.frequencyOptions}>
            {(['weekly', 'biweekly', 'monthly'] as const).map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.frequencyButton,
                  payoutFrequency === frequency && styles.selectedFrequencyButton
                ]}
                onPress={() => setPayoutFrequency(frequency)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  payoutFrequency === frequency && styles.selectedFrequencyButtonText
                ]}>
                  {frequency === 'biweekly' ? 'Bi-weekly' : frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </Text>
                <Text style={[
                  styles.frequencyDescription,
                  payoutFrequency === frequency && styles.selectedFrequencyDescription
                ]}>
                  {frequency === 'weekly' && 'Every Friday'}
                  {frequency === 'biweekly' && 'Every other Friday'}
                  {frequency === 'monthly' && 'Last Friday of month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.nextPayoutText}>
            Next payout: {payoutFrequency === 'weekly' ? 'Friday, Feb 9' : payoutFrequency === 'biweekly' ? 'Friday, Feb 16' : 'Friday, Feb 23'}
          </Text>
        </Card>
      )}

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {isCreative ? 'Secure Payouts' : 'Secure Payments'}
        </Text>
        <Text style={styles.infoText}>
          {isCreative ? (
            'Your payout information is encrypted and securely stored. Payments are processed within 1-2 business days.'
          ) : (
            'All payment information is encrypted and securely stored. We never store your full card details.'
          )}
        </Text>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={getHeaderTitle()} showBackButton />
      
      {/* Only show tabs if not filtered by client */}
      {!isFiltered && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'invoices' && styles.activeTabButton]}
            onPress={() => setActiveTab('invoices')}
          >
            <Coins size={18} color={activeTab === 'invoices' ? colors.primary : colors.text.tertiary} />
            <Text style={[styles.tabButtonText, activeTab === 'invoices' && styles.activeTabButtonText]}>
              Invoices
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'methods' && styles.activeTabButton]}
            onPress={() => setActiveTab('methods')}
          >
            <CreditCard size={18} color={activeTab === 'methods' ? colors.primary : colors.text.tertiary} />
            <Text style={[styles.tabButtonText, activeTab === 'methods' && styles.activeTabButtonText]}>
              {isCreative ? 'Payouts' : 'Methods'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* When filtered, always show invoices */}
      {isFiltered ? (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {renderInvoicesTab()}
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.swipeContainer}
          decelerationRate="fast"
          snapToInterval={screenWidth}
          snapToAlignment="start"
          bounces={false}
          scrollEnabled={true}
        >
          <View style={[styles.tabPage, { width: screenWidth }]}>
            <ScrollView 
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              bounces={true}
            >
              {renderInvoicesTab()}
            </ScrollView>
          </View>
          
          <View style={[styles.tabPage, { width: screenWidth }]}>
            <ScrollView 
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              bounces={true}
            >
              {renderPaymentMethodsTab()}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeTabButtonText: {
    color: colors.text.inverse,
  },
  swipeContainer: {
    flex: 1,
  },
  tabPage: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentCard: {
    marginBottom: 16,
    padding: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDetails: {
    marginBottom: 16,
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  methodCard: {
    marginBottom: 12,
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  methodActions: {
    flexDirection: 'row',
    gap: 8,
  },
  methodActionButton: {
    flex: 1,
  },
  infoCard: {
    padding: 16,
    backgroundColor: colors.primary + '10',
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  payoutSettingsCard: {
    padding: 20,
    marginBottom: 24,
  },
  settingsDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  frequencyOptions: {
    gap: 12,
    marginBottom: 16,
  },
  frequencyButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedFrequencyButton: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  selectedFrequencyButtonText: {
    color: colors.primary,
  },
  frequencyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  selectedFrequencyDescription: {
    color: colors.primary,
  },
  nextPayoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    textAlign: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});