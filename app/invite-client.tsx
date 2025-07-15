import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Share,
  FlatList
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Mail, Copy, Send, Clock, CheckCircle, XCircle, RotateCcw, QrCode, ExternalLink } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore, PendingInvite } from '@/store/authStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function InviteClientScreen() {
  const router = useRouter();
  const { createInvite, fetchPendingInvites, resendInvite, revokeInvite, pendingInvites } = useAuthStore();
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [expandedQRInvites, setExpandedQRInvites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPendingInvites();
  }, []);

  const handleSendInvite = async () => {
    if (!clientEmail.trim()) {
      Alert.alert('Error', 'Please enter client email');
      return;
    }

    // Check if email already has pending invite
    const existingInvite = pendingInvites.find(
      invite => invite.email.toLowerCase() === clientEmail.toLowerCase() && 
      invite.status === 'pending'
    );

    if (existingInvite) {
      Alert.alert('Error', 'This email already has a pending invite');
      return;
    }

    setIsLoading(true);
    try {
      const invite = await createInvite(clientEmail, clientName || undefined);
      
      // Generate invite link
      const inviteLink = `https://clientnest.app/invite/${invite.token}`;
      setGeneratedInviteLink(inviteLink);
      
      // Show custom success modal instead of Alert
      setShowSuccessModal(true);
      setClientName('');
      setClientEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send invite';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const shareInviteLink = async (link: string) => {
    try {
      await Share.share({
        message: `Join me on Client Nest: ${link}`,
        url: link,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share invite link');
    }
  };

  const copyInviteLink = async (link: string) => {
    try {
      await Clipboard.setStringAsync(link);
      Alert.alert('Copied!', 'Invite link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy invite link');
    }
  };

  const handleResendInvite = async (invite: PendingInvite) => {
    try {
      await resendInvite(invite.id);
      Alert.alert('Success', 'Invite resent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend invite');
    }
  };

  const handleRevokeInvite = async (invite: PendingInvite) => {
    Alert.alert(
      'Revoke Invite',
      'Are you sure you want to revoke this invite? The client will no longer be able to use the link.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Revoke', 
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeInvite(invite.id);
              Alert.alert('Success', 'Invite revoked successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to revoke invite');
            }
          }
        }
      ]
    );
  };

  const getStatusIcon = (status: PendingInvite['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'accepted':
        return <CheckCircle size={16} color={colors.success} />;
      case 'expired':
        return <XCircle size={16} color={colors.error} />;
      case 'revoked':
        return <XCircle size={16} color={colors.text.tertiary} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PendingInvite['status']) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'accepted':
        return colors.success;
      case 'expired':
        return colors.error;
      case 'revoked':
        return colors.text.tertiary;
      default:
        return colors.text.secondary;
    }
  };

  const toggleQRCode = (inviteId: string) => {
    const newExpanded = new Set(expandedQRInvites);
    if (newExpanded.has(inviteId)) {
      newExpanded.delete(inviteId);
    } else {
      newExpanded.add(inviteId);
    }
    setExpandedQRInvites(newExpanded);
  };

  const renderInviteItem = ({ item }: { item: PendingInvite }) => {
    const isExpired = new Date(item.expiresAt) < new Date();
    const canResend = item.status === 'pending' || item.status === 'expired';
    const canRevoke = item.status === 'pending';
    const inviteLink = `https://clientnest.app/invite/${item.token}`;
    const showQR = expandedQRInvites.has(item.id);

    return (
      <Card style={styles.inviteCard}>
        <View style={styles.inviteHeader}>
          <View style={styles.inviteInfo}>
            <Text style={styles.inviteEmail}>{item.email}</Text>
            {item.clientName && (
              <Text style={styles.inviteClientName}>{item.clientName}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.inviteDetails}>
          <Text style={styles.inviteDate}>
            Sent {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.status === 'pending' && (
            <Text style={styles.inviteExpiry}>
              {isExpired ? 'Expired' : `Expires ${new Date(item.expiresAt).toLocaleDateString()}`}
            </Text>
          )}
        </View>

        {item.status === 'pending' && !isExpired && (
          <View style={styles.qrToggleContainer}>
            <TouchableOpacity 
              style={styles.qrToggleButton}
              onPress={() => toggleQRCode(item.id)}
            >
              <QrCode size={16} color={colors.primary} />
              <Text style={styles.qrToggleText}>
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {showQR && item.status === 'pending' && !isExpired && (
          <View style={styles.inviteQrSection}>
            <View style={styles.inviteQrContainer}>
              <QRCode
                value={inviteLink}
                size={120}
                color={colors.text.primary}
                backgroundColor={colors.background}
              />
            </View>
            <View style={styles.inviteLinkActions}>
              <TouchableOpacity 
                style={styles.inviteLinkButton}
                onPress={() => copyInviteLink(inviteLink)}
              >
                <Copy size={14} color={colors.primary} />
                <Text style={styles.inviteLinkButtonText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.inviteLinkButton}
                onPress={() => shareInviteLink(inviteLink)}
              >
                <ExternalLink size={14} color={colors.primary} />
                <Text style={styles.inviteLinkButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(canResend || canRevoke) && (
          <View style={styles.inviteActions}>
            {canResend && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleResendInvite(item)}
              >
                <RotateCcw size={14} color={colors.primary} />
                <Text style={styles.actionButtonText}>Resend</Text>
              </TouchableOpacity>
            )}
            {canRevoke && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.revokeButton]}
                onPress={() => handleRevokeInvite(item)}
              >
                <XCircle size={14} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>Revoke</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Invite Client" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <UserPlus size={48} color={colors.primary} />
          </View>
          
          <Text style={[typography.h2, styles.title]}>Invite a Client</Text>
          <Text style={[typography.body, styles.description]}>
            Send an invitation to collaborate on projects through Client Nest
          </Text>
        </View>
        
        <Card style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={typography.label}>Client Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Enter client name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={typography.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={clientEmail}
              onChangeText={setClientEmail}
              placeholder="Enter client email"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </Card>
        
        <View style={styles.pendingInvites}>
          <Text style={typography.h4}>Pending Invites</Text>
          {pendingInvites.length > 0 ? (
            <FlatList
              data={pendingInvites}
              keyExtractor={(item) => item.id}
              renderItem={renderInviteItem}
              scrollEnabled={false}
              style={styles.invitesList}
            />
          ) : (
            <Text style={styles.emptyText}>No pending invites</Text>
          )}
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
          title={isLoading ? "Sending..." : "Send Invite"}
          variant="primary"
          onPress={handleSendInvite}
          disabled={isLoading}
          loading={isLoading}
          leftIcon={<Send size={18} color={colors.text.inverse} />}
          style={styles.footerButton}
        />
      </View>
      
      {/* Custom Success Modal */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <Card style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <CheckCircle size={48} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Invite Sent!</Text>
            <Text style={styles.successMessage}>
              Invitation has been sent to {clientEmail}. They will receive an email with instructions to join.
            </Text>
            
            {generatedInviteLink && (
              <View style={styles.qrSection}>
                <Text style={styles.qrTitle}>Or share this QR code:</Text>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={generatedInviteLink}
                    size={160}
                    color={colors.text.primary}
                    backgroundColor={colors.background}
                  />
                </View>
                <View style={styles.linkActions}>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => copyInviteLink(generatedInviteLink)}
                  >
                    <Copy size={16} color={colors.primary} />
                    <Text style={styles.linkButtonText}>Copy Link</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => shareInviteLink(generatedInviteLink)}
                  >
                    <ExternalLink size={16} color={colors.primary} />
                    <Text style={styles.linkButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <View style={styles.successActions}>
              <Button
                title="Send Another"
                variant="outline"
                onPress={() => setShowSuccessModal(false)}
                style={styles.successButton}
              />
              <Button
                title="Done"
                variant="primary"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.back();
                }}
                style={styles.successButton}
              />
            </View>
          </Card>
        </View>
      )}
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
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary + '30',
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
  formCard: {
    width: '100%',
    gap: 20,
    marginBottom: 32,
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formGroup: {
    gap: 6,
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
  pendingInvites: {
    width: '100%',
    marginBottom: 24,
  },
  invitesList: {
    marginTop: 16,
  },
  inviteCard: {
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  inviteClientName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
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
  inviteDetails: {
    marginBottom: 12,
  },
  inviteDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  inviteExpiry: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    gap: 4,
  },
  revokeButton: {
    backgroundColor: colors.error + '10',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successModal: {
    width: '85%',
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  successButton: {
    flex: 1,
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  linkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.primary + '10',
    gap: 6,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  qrToggleContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  qrToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    gap: 6,
    alignSelf: 'flex-start',
  },
  qrToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  inviteQrSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inviteQrContainer: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  inviteLinkActions: {
    flexDirection: 'row',
    gap: 8,
  },
  inviteLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    gap: 4,
  },
  inviteLinkButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});