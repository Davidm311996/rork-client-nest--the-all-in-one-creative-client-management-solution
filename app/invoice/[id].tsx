import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  X as XIcon,
  RotateCcw,
  RefreshCw,
  Send,
  Calendar,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useAuthStore } from '@/store/authStore';

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  projectTitle: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'deposit' | 'final' | 'milestone';
  createdDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
  paymentTerms: string;
}

export default function InvoiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const isCreative = user?.role === 'creative';
  
  // Mock invoice data - in real app this would come from API/store
  const getInvoiceData = (invoiceId: string): InvoiceDetail => {
    const invoices: Record<string, InvoiceDetail> = {
      '1': {
        id: '1',
        invoiceNumber: 'INV-001',
        clientId: '1',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah@example.com',
        clientPhone: '+1 (555) 123-4567',
        clientAddress: '123 Main St, New York, NY 10001',
        projectTitle: 'Wedding Photography',
        projectId: '1',
        amount: 1200,
        status: 'paid',
        type: 'deposit',
        createdDate: '2024-01-10',
        dueDate: '2024-01-15',
        paidDate: '2024-01-14',
        description: 'Wedding photography services - deposit payment',
        lineItems: [
          {
            id: '1',
            description: 'Wedding Photography Package',
            quantity: 1,
            rate: 1000,
            amount: 1000
          },
          {
            id: '2',
            description: 'Additional Hours (2 hours)',
            quantity: 2,
            rate: 100,
            amount: 200
          }
        ],
        subtotal: 1200,
        tax: 0,
        total: 1200,
        notes: 'Thank you for your business! Looking forward to capturing your special day.',
        paymentTerms: 'Payment due within 5 days of invoice date.'
      },
      '2': {
        id: '2',
        invoiceNumber: 'INV-002',
        clientId: '2',
        clientName: 'Emma Chen',
        clientEmail: 'emma@coastalcafe.com',
        clientPhone: '+1 (555) 987-6543',
        clientAddress: '456 Ocean Drive, Santa Monica, CA 90401',
        projectTitle: 'Product Photography',
        projectId: '2',
        amount: 800,
        status: 'pending',
        type: 'final',
        createdDate: '2024-01-25',
        dueDate: '2024-02-01',
        description: 'Product photography services - final payment',
        lineItems: [
          {
            id: '1',
            description: 'Product Photography Session',
            quantity: 1,
            rate: 800,
            amount: 800
          }
        ],
        subtotal: 800,
        tax: 0,
        total: 800,
        notes: 'Final payment for product photography session.',
        paymentTerms: 'Payment due within 7 days of invoice date.'
      },
      '3': {
        id: '3',
        invoiceNumber: 'INV-003',
        clientId: '3',
        clientName: 'Jason Miller',
        clientEmail: 'jason@apexfitness.com',
        clientPhone: '+1 (555) 456-7890',
        clientAddress: '789 Studio Lane, Los Angeles, CA 90028',
        projectTitle: 'Website Redesign',
        projectId: '3',
        amount: 500,
        status: 'paid',
        type: 'milestone',
        createdDate: '2024-01-15',
        dueDate: '2024-01-20',
        paidDate: '2024-01-19',
        description: 'Website redesign services - milestone payment',
        lineItems: [
          {
            id: '1',
            description: 'Website Design Phase 1',
            quantity: 1,
            rate: 500,
            amount: 500
          }
        ],
        subtotal: 500,
        tax: 0,
        total: 500,
        notes: 'Milestone payment for initial design phase.',
        paymentTerms: 'Payment due within 5 days of invoice date.'
      },
      '4': {
        id: '4',
        invoiceNumber: 'INV-004',
        clientId: '4',
        clientName: 'Jason Miller',
        clientEmail: 'jason@apexfitness.com',
        clientPhone: '+1 (555) 321-0987',
        clientAddress: '789 Fitness Ave, Los Angeles, CA 90028',
        projectTitle: 'Website Redesign',
        projectId: '4',
        amount: 2000,
        status: 'paid',
        type: 'final',
        createdDate: '2024-08-15',
        dueDate: '2024-08-20',
        paidDate: '2024-08-18',
        description: 'Website redesign services - final payment',
        lineItems: [
          {
            id: '1',
            description: 'Website Development & Launch',
            quantity: 1,
            rate: 2000,
            amount: 2000
          }
        ],
        subtotal: 2000,
        tax: 0,
        total: 2000,
        notes: 'Final payment for website redesign project. Thank you for your business!',
        paymentTerms: 'Payment due within 5 days of invoice date.'
      }
    };
    
    return invoices[invoiceId] || invoices['1']; // Default to first invoice if not found
  };
  
  const invoiceId = Array.isArray(id) ? id[0] : id || '1';
  const [invoice, setInvoice] = useState<InvoiceDetail>(getInvoiceData(invoiceId));

  const getStatusColor = (status: InvoiceDetail['status']) => {
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

  const getStatusIcon = (status: InvoiceDetail['status']) => {
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

  const handleDownload = () => {
    Alert.alert('Download', 'Invoice PDF downloaded to your device.');
  };

  const handleSendReminder = () => {
    Alert.alert(
      'Send Reminder',
      `Send payment reminder to ${invoice.clientName}?`,
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

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Mark as Paid',
      `Mark invoice ${invoice.invoiceNumber} as paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Paid', 
          onPress: () => {
            setInvoice(prev => ({ 
              ...prev, 
              status: 'paid', 
              paidDate: new Date().toISOString().split('T')[0] 
            }));
            Alert.alert('Success', 'Invoice marked as paid!');
            updateRecentActivity({
              type: 'payment_received',
              invoiceId: invoice.id,
              clientName: invoice.clientName,
              amount: invoice.amount,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleMarkUnpaid = () => {
    Alert.alert(
      'Mark as Unpaid',
      `Mark invoice ${invoice.invoiceNumber} as unpaid? This will change the status to pending.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Unpaid', 
          style: 'destructive',
          onPress: () => {
            setInvoice(prev => ({ 
              ...prev, 
              status: 'pending', 
              paidDate: undefined 
            }));
            Alert.alert('Success', 'Invoice marked as unpaid!');
            updateRecentActivity({
              type: 'payment_status_change',
              invoiceId: invoice.id,
              status: 'unpaid',
              clientName: invoice.clientName,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleCancelInvoice = () => {
    if (invoice.status === 'paid') {
      Alert.alert('Cannot Cancel', 'Paid invoices cannot be cancelled. Use the refund option instead.');
      return;
    }

    Alert.alert(
      'Cancel Invoice',
      `Are you sure you want to cancel invoice ${invoice.invoiceNumber}? This will send a cancellation email to ${invoice.clientName}.`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Cancel Invoice', 
          style: 'destructive',
          onPress: () => {
            setInvoice(prev => ({ ...prev, status: 'cancelled' }));
            Alert.alert('Success', 'Invoice cancelled and client notified via email!');
            updateRecentActivity({
              type: 'invoice_cancelled',
              invoiceId: invoice.id,
              clientName: invoice.clientName,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  const handleRefundInvoice = () => {
    Alert.alert(
      'Refund Invoice',
      `Issue a refund for invoice ${invoice.invoiceNumber}? This will process a refund to ${invoice.clientName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Issue Refund', 
          style: 'destructive',
          onPress: () => {
            setInvoice(prev => ({ ...prev, status: 'cancelled' }));
            Alert.alert('Success', 'Refund processed and client notified!');
            updateRecentActivity({
              type: 'payment_refund',
              invoiceId: invoice.id,
              clientName: invoice.clientName,
              amount: invoice.amount,
              timestamp: Date.now()
            });
          }
        },
      ]
    );
  };

  // Mock function to update recent activity
  const updateRecentActivity = (activity: any) => {
    // In a real app, this would update the activity store
    console.log('Activity updated:', activity);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          title: invoice.invoiceNumber,
          headerBackTitle: 'Back'
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Header */}
        <Card style={styles.headerCard}>
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <Text style={styles.invoiceType}>
                {invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)} Payment
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(invoice.status)}20` }]}>
                {getStatusIcon(invoice.status)}
                <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.amount}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
        </Card>

        {/* Client Information */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.clientInfo}>
            <View style={styles.clientRow}>
              <User size={16} color={colors.text.secondary} />
              <Text style={styles.clientText}>{invoice.clientName}</Text>
            </View>
            <View style={styles.clientRow}>
              <Mail size={16} color={colors.text.secondary} />
              <Text style={styles.clientText}>{invoice.clientEmail}</Text>
            </View>
            {invoice.clientPhone && (
              <View style={styles.clientRow}>
                <Phone size={16} color={colors.text.secondary} />
                <Text style={styles.clientText}>{invoice.clientPhone}</Text>
              </View>
            )}
            {invoice.clientAddress && (
              <View style={styles.clientRow}>
                <Building size={16} color={colors.text.secondary} />
                <Text style={styles.clientText}>{invoice.clientAddress}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Project & Dates */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Project</Text>
              <Text style={styles.detailValue}>{invoice.projectTitle}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>{formatDate(invoice.createdDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
            </View>
            {invoice.paidDate && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Paid Date</Text>
                <Text style={styles.detailValue}>{formatDate(invoice.paidDate)}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Line Items */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.lineItemsContainer}>
            {invoice.lineItems.map((item) => (
              <View key={item.id} style={styles.lineItem}>
                <View style={styles.lineItemInfo}>
                  <Text style={styles.lineItemDescription}>{item.description}</Text>
                  <Text style={styles.lineItemDetails}>
                    {item.quantity} × {formatCurrency(item.rate)}
                  </Text>
                </View>
                <Text style={styles.lineItemAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              {invoice.tax && invoice.tax > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.tax)}</Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.finalTotalRow]}>
                <Text style={styles.finalTotalLabel}>Total</Text>
                <Text style={styles.finalTotalValue}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Payment Terms & Notes */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Terms & Notes</Text>
          <View style={styles.termsContainer}>
            <Text style={styles.termsLabel}>Payment Terms</Text>
            <Text style={styles.termsText}>{invoice.paymentTerms}</Text>
            
            {invoice.notes && (
              <>
                <Text style={[styles.termsLabel, { marginTop: 16 }]}>Notes</Text>
                <Text style={styles.termsText}>{invoice.notes}</Text>
              </>
            )}
          </View>
        </Card>

        {/* Action Buttons */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsContainer}>
            <Button
              title="Download PDF"
              variant="outline"
              onPress={handleDownload}
              style={styles.actionButton}
              leftIcon={<Download size={20} color={colors.primary} />}
            />
            
            {invoice.status === 'pending' && !isCreative && (
              <Button
                title="Send Reminder"
                variant="primary"
                onPress={handleSendReminder}
                style={styles.actionButton}
                leftIcon={<Send size={20} color={colors.text.inverse} />}
              />
            )}
            
            {isCreative && (
              <>
                {invoice.status === 'pending' && (
                  <>
                    <Button
                      title="Mark as Paid"
                      variant="primary"
                      onPress={handleMarkAsPaid}
                      style={styles.actionButton}
                      leftIcon={<CheckCircle size={20} color={colors.text.inverse} />}
                    />
                    <Button
                      title="Cancel Invoice"
                      variant="outline"
                      onPress={handleCancelInvoice}
                      style={[styles.actionButton, { borderColor: colors.error }]}
                      textStyle={{ color: colors.error }}
                      leftIcon={<XIcon size={20} color={colors.error} />}
                    />
                  </>
                )}
                
                {invoice.status === 'paid' && (
                  <>
                    <Button
                      title="Mark as Unpaid"
                      variant="outline"
                      onPress={handleMarkUnpaid}
                      style={styles.actionButton}
                      leftIcon={<RotateCcw size={20} color={colors.warning} />}
                      textStyle={{ color: colors.warning }}
                    />
                    <Button
                      title="Issue Refund"
                      variant="outline"
                      onPress={handleRefundInvoice}
                      style={[styles.actionButton, { borderColor: colors.error }]}
                      textStyle={{ color: colors.error }}
                      leftIcon={<RefreshCw size={20} color={colors.error} />}
                    />
                  </>
                )}
              </>
            )}
          </View>
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
    gap: 16,
  },
  headerCard: {
    padding: 20,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  invoiceType: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  clientInfo: {
    gap: 12,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  lineItemsContainer: {
    gap: 16,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  lineItemDescription: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  lineItemDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  lineItemAmount: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  totalsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  finalTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '700',
  },
  finalTotalValue: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: '700',
  },
  termsContainer: {
    gap: 8,
  },
  termsLabel: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionsCard: {
    padding: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});