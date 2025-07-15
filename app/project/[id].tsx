import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Linking, Dimensions, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import type { KeyboardEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MessageCircle, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle,
  Upload,
  MoreVertical,
  Send,
  Download,
  Eye,
  Check,
  Paperclip,
  Image,
  Video,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  X as XIcon
} from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import ProjectOptionsMenu from '@/components/ProjectOptionsMenu';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import UpgradePrompt from '@/components/UpgradePrompt';
import { SubscriptionTier } from '@/types/subscription';
import { useAuthStore } from '@/store/authStore';



const { width: screenWidth } = Dimensions.get('window');

export default function ProjectDetailScreen() {
  const { id, tab } = useLocalSearchParams();
  const router = useRouter();
  const { getProjectById, isLoading, updateProject, markMessagesAsRead, fetchProjects, projects, completeProject } = useProjectStore();
  const { canUseFeature } = useSubscriptionStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState((tab as string) || 'overview');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showFileUploadOptions, setShowFileUploadOptions] = useState(false);
  const [eventDetailsExpanded, setEventDetailsExpanded] = useState(false);
  const [showClientInfoModal, setShowClientInfoModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const messagesScrollRef = useRef<ScrollView>(null);
  const keyboardOffsetRef = useRef(new Animated.Value(0));
  const keyboardOffset = keyboardOffsetRef.current;
  
  const isClient = user?.role === 'client';
  
  // Ensure projects are loaded
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);
  
  const project = getProjectById(id as string);

  // Move useEffect to top level to avoid hooks order issues
  useEffect(() => {
    if (activeTab === 'messages' && project) {
      markMessagesAsRead(project.id);
    }
  }, [activeTab, project?.id]);

  // Handle tab changes and scroll to correct page with smooth animation
  useEffect(() => {
    const tabIndex = ['overview', 'files', 'messages'].indexOf(activeTab);
    if (scrollViewRef.current && tabIndex !== -1) {
      scrollViewRef.current.scrollTo({ 
        x: tabIndex * screenWidth, 
        animated: true 
      });
    }
  }, [activeTab]);

  // Keyboard handling for messages tab
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        const height = event.endCoordinates.height;
        Animated.timing(keyboardOffset, {
          toValue: -height,
          duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event: KeyboardEvent) => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? event.duration || 250 : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);



  // Show loading only if we're actually loading and don't have the project yet
  if ((isLoading && projects.length === 0) || (!project && projects.length === 0)) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Project Not Found" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={typography.body}>This project could not be found.</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleContractAction = () => {
    if (!canUseFeature('contracts')) {
      setShowUpgradePrompt(true);
      return;
    }
    // Handle contract action
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setShowUpgradePrompt(false);
    const { upgradeTier } = useSubscriptionStore.getState();
    try {
      await upgradeTier(tier);
    } catch (error) {
      Alert.alert('Error', 'Upgrade failed. Please try again.');
    }
  };

  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleAddressPress = (address: string, coordinates?: { latitude: number; longitude: number }) => {
    if (Platform.OS === 'ios') {
      if (coordinates) {
        Linking.openURL(`maps://?ll=${coordinates.latitude},${coordinates.longitude}&q=${encodeURIComponent(address)}`);
      } else {
        Linking.openURL(`maps://?q=${encodeURIComponent(address)}`);
      }
    } else {
      if (coordinates) {
        Linking.openURL(`geo:${coordinates.latitude},${coordinates.longitude}?q=${encodeURIComponent(address)}`);
      } else {
        Linking.openURL(`geo:0,0?q=${encodeURIComponent(address)}`);
      }
    }
  };

  const handleFileUpload = () => {
    setShowFileUploadOptions(true);
  };

  const handleAddToCalendar = (eventDate: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const date = new Date(eventDate);
    const title = encodeURIComponent(`${project.title} - ${project.eventType || 'Event'}`);
    const details = encodeURIComponent(`Project: ${project.title}\nClient: ${project.clientName}`);
    const startDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    if (Platform.OS === 'ios') {
      const calendarUrl = `calshow:${date.getTime() / 1000}`;
      Linking.openURL(calendarUrl).catch(() => {
        // Fallback to Google Calendar
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
        Linking.openURL(googleUrl);
      });
    } else {
      // Android - try to open default calendar app
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
      Linking.openURL(googleUrl);
    }
  };

  const handleFileUploadFromFiles = (type: string) => {
    setShowFileUploadOptions(false);
    simulateFileUpload(type);
  };

  const simulateFileUpload = async (source: string) => {
    try {
      const newFile = {
        id: `file_${Date.now()}`,
        name: `${source}_upload_${Date.now()}.jpg`,
        url: `https://example.com/files/${Date.now()}`,
        type: source === 'documents' ? 'pdf' : 'image',
        uploadedAt: new Date().toISOString(),
        approved: false,
      };

      await updateProject(project.id, {
        files: [...project.files, newFile]
      });

      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleFileApproval = async (fileId: string, approved: boolean) => {
    try {
      const updatedFiles = project.files.map(file =>
        file.id === fileId ? { ...file, approved } : file
      );

      await updateProject(project.id, { files: updatedFiles });
      Alert.alert('Success', `File ${approved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update file status');
    }
  };

  const handleFileDownload = (file: any) => {
    Alert.alert('Download', `Downloading ${file.name}...`);
  };

  const handleFilePreview = (file: any) => {
    Alert.alert('Preview', `Opening preview for ${file.name}`);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const newMessage = {
        id: `msg_${Date.now()}`,
        content: messageText.trim(),
        senderId: 'user',
        senderName: 'You',
        timestamp: new Date().toISOString(),
        read: true,
        type: 'text' as const,
      };

      await updateProject(project.id, {
        messages: [...project.messages, newMessage]
      });

      setMessageText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleFileUploadToChat = async (type: 'file' | 'image' | 'video') => {
    try {
      const fileName = type === 'image' ? 'image.jpg' : type === 'video' ? 'video.mp4' : 'document.pdf';
      const fileMessage = {
        id: `msg_${Date.now()}`,
        senderId: 'user',
        senderName: 'You',
        content: `Shared a ${type}`,
        timestamp: new Date().toISOString(),
        read: true,
        type,
        fileName,
        fileUrl: `https://example.com/files/${fileName}`,
      };
      
      await updateProject(project.id, {
        messages: [...project.messages, fileMessage]
      });
      
      setShowFileUploadOptions(false);
      Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleTimelineItemPress = (item: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    switch (item) {
      case 'contract-created':
        router.push(`/contracts?projectId=${project.id}&clientId=${project.clientId}`);
        break;
      case 'contract-signed':
        if (project.contractSigned && project.contractId) {
          router.push(`/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${project.contractId}&signed=true`);
        } else {
          router.push(`/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${project.contractId}`);
        }
        break;
      case 'deposit-payment':
        router.push(`/new-invoice?clientId=${project.clientId}&projectId=${project.id}`);
        break;
      case 'final-payment':
        router.push(`/new-invoice?clientId=${project.clientId}&projectId=${project.id}`);
        break;
      case 'project-delivery':
        setActiveTab('files');
        break;
      default:
        break;
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenWidth);
    const tabs = ['overview', 'files', 'messages'];
    if (pageIndex >= 0 && pageIndex < tabs.length) {
      setActiveTab(tabs[pageIndex]);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { backgroundColor: colors.success + '20', borderWidth: 1, borderColor: colors.success + '40', borderRadius: 20 };
      case 'in progress':
        return { backgroundColor: colors.warning + '20', borderWidth: 1, borderColor: colors.warning + '40', borderRadius: 20 };
      case 'contract sent':
        return { backgroundColor: colors.accent + '20', borderWidth: 1, borderColor: colors.accent + '40', borderRadius: 20 };
      case 'pending':
        return { backgroundColor: colors.inactive + '20', borderWidth: 1, borderColor: colors.inactive + '40', borderRadius: 20 };
      default:
        return { backgroundColor: colors.primary + '20', borderWidth: 1, borderColor: colors.primary + '40', borderRadius: 20 };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { color: colors.success, fontWeight: '700' as const };
      case 'in progress':
        return { color: colors.warning, fontWeight: '700' as const };
      case 'contract sent':
        return { color: colors.accent, fontWeight: '700' as const };
      case 'pending':
        return { color: colors.inactive, fontWeight: '700' as const };
      default:
        return { color: colors.primary, fontWeight: '700' as const };
    }
  };

  // Dynamic timeline based on project progress
  const getTimelineItems = () => {
    const items = [];
    
    // Contract Created - always first
    items.push({
      id: 'contract-created',
      title: 'Contract Created',
      date: new Date(project.createdAt).toLocaleDateString(),
      completed: true,
      icon: <FileText size={20} color={colors.text.inverse} />
    });
    
    // Contract Signed
    items.push({
      id: 'contract-signed',
      title: 'Contract Signed',
      date: project.contractSigned && project.contractSignedDate 
        ? new Date(project.contractSignedDate).toLocaleDateString()
        : 'Waiting for signature',
      completed: project.contractSigned,
      current: !project.contractSigned,
      icon: <FileText size={20} color={colors.text.inverse} />
    });
    
    // Deposit Payment
    const depositPaid = project.paymentStatus === 'Deposit Paid' || project.paymentStatus === 'Final Paid';
    items.push({
      id: 'deposit-payment',
      title: 'Deposit Payment',
      date: depositPaid ? 'Paid' : 'Pending payment',
      completed: depositPaid,
      current: project.contractSigned && !depositPaid,
      icon: <CreditCard size={20} color={colors.text.inverse} />
    });
    
    // Project Delivery
    const delivered = project.status === 'Completed';
    items.push({
      id: 'project-delivery',
      title: 'Project Delivery',
      date: delivered ? 'Delivered' : 'In progress',
      completed: delivered,
      current: depositPaid && !delivered,
      icon: <Upload size={20} color={colors.text.inverse} />
    });
    
    // Final Payment
    const finalPaid = project.paymentStatus === 'Final Paid';
    items.push({
      id: 'final-payment',
      title: 'Final Payment',
      date: finalPaid ? 'Paid' : 'Pending payment',
      completed: finalPaid,
      current: delivered && !finalPaid,
      icon: <CreditCard size={20} color={colors.text.inverse} />
    });
    
    return items;
  };

  const renderTabButton = (tabName: string, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setActiveTab(tabName);
      }}
    >
      {icon}
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tabName && styles.activeTabButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Project Header Card */}
      <Card style={styles.headerCard}>
        <View style={styles.projectHeader}>
          <View style={styles.projectInfo}>
            <Text style={[typography.h3, styles.projectTitle]}>{project.title}</Text>
            <View style={[styles.statusBadge, getStatusBadgeStyle(project.status)]}>
              <Text style={[styles.statusText, getStatusTextStyle(project.status)]}>{project.status}</Text>
            </View>
          </View>
        </View>
        
        <Text style={[typography.body, styles.description]}>
          {project.description}
        </Text>
      </Card>

      {/* Client Info Card */}
      <TouchableOpacity 
        style={styles.clientInfoCard}
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          // Show client info in a custom modal
          setShowClientInfoModal(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.clientAvatarContainer}>
          <Avatar name={project.clientName} size={56} />
        </View>
        <View style={styles.clientInfoContent}>
          <Text style={styles.clientInfoLabel}>Client</Text>
          <Text style={styles.clientInfoName}>{project.clientName}</Text>
          {project.clientPhone && (
            <Text style={styles.clientInfoPhone}>{project.clientPhone}</Text>
          )}
        </View>
        <View style={styles.clientInfoArrow}>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </View>
      </TouchableOpacity>

      {/* Invoice Card - Show for creatives */}
      {!isClient && (
        <Card style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <View style={[styles.invoiceIcon, { backgroundColor: colors.primary + '20' }]}>
              <CreditCard size={24} color={colors.primary} />
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={typography.h4}>
                {project.depositInvoiceId || project.finalInvoiceId ? 'Show Invoice' : 'Create Invoice'}
              </Text>
              <Text style={[typography.body, { color: colors.text.secondary }]}>
                {project.depositInvoiceId || project.finalInvoiceId 
                  ? 'View and manage project invoices'
                  : 'Generate an invoice for this project'
                }
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.invoiceButton}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              if (project.depositInvoiceId || project.finalInvoiceId) {
                // Navigate to invoice view/management page
                router.push(`/invoice/${project.depositInvoiceId || project.finalInvoiceId}`);
              } else {
                // Navigate to create new invoice
                router.push(`/new-invoice?clientId=${project.clientId}&projectId=${project.id}`);
              }
            }}
          >
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
              {project.depositInvoiceId || project.finalInvoiceId ? 'Show Invoice' : 'Create Invoice'}
            </Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
      )}

      {/* Contract Card */}
      <Card style={styles.contractCard}>
        <View style={styles.contractHeader}>
          <View style={[styles.contractIcon, { backgroundColor: colors.accent + '20' }]}>
            <FileText size={24} color={colors.accent} />
          </View>
          <View style={styles.contractInfo}>
            <Text style={typography.h4}>Contract</Text>
            <Text style={[typography.body, { color: colors.text.secondary }]}>
              {project.contractSigned ? 'Signed & Active' : (canUseFeature('contracts') ? 'Awaiting Signature' : 'No active contract')}
            </Text>
          </View>
        </View>
        
        {canUseFeature('contracts') ? (
          <TouchableOpacity 
            style={styles.contractButton}
            onPress={() => handleTimelineItemPress('contract-signed')}
          >
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
              {project.contractSigned ? 'View Signed Contract' : 'View Contract'}
            </Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.contractButton}
            onPress={() => setShowUpgradePrompt(true)}
          >
            <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
              Upgrade for Contracts
            </Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Card>

      {/* Collapsible Event Information */}
      {(project.eventType || project.eventDate || project.eventLocation || project.clientPhone) && (
        <Card style={styles.bookingCard}>
          <TouchableOpacity 
            style={styles.eventHeader}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setEventDetailsExpanded(!eventDetailsExpanded);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.eventHeaderContent}>
              <View style={styles.eventIconContainer}>
                <Calendar size={20} color={colors.accent} />
              </View>
              <Text style={styles.eventTitle}>Event Details</Text>
            </View>
            <View style={[styles.expandIcon, eventDetailsExpanded && styles.expandIconRotated]}>
              {eventDetailsExpanded ? (
                <ChevronDown size={20} color={colors.text.secondary} />
              ) : (
                <ChevronRight size={20} color={colors.text.secondary} />
              )}
            </View>
          </TouchableOpacity>
          
          {eventDetailsExpanded && (
            <View style={styles.eventContent}>
              {project.eventType && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Calendar size={16} color={colors.text.secondary} />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Event Type</Text>
                    <Text style={styles.detailValue}>{project.eventType}</Text>
                  </View>
                </View>
              )}
              
              {project.eventDate && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Clock size={16} color={colors.text.secondary} />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Event Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(project.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              )}
              
              {project.eventLocation && (
                <TouchableOpacity 
                  style={styles.detailRow}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    handleAddressPress(project.eventLocation!.address, project.eventLocation!.coordinates);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.detailIconContainer}>
                    <MapPin size={16} color={colors.primary} />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={[styles.detailLabel, { color: colors.primary }]}>Location</Text>
                    <Text style={[styles.detailValue, { color: colors.primary }]} numberOfLines={2}>
                      {project.eventLocation.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {project.clientPhone && (
                <TouchableOpacity 
                  style={styles.detailRow}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    handlePhonePress(project.clientPhone!);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.detailIconContainer}>
                    <Phone size={16} color={colors.primary} />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={[styles.detailLabel, { color: colors.primary }]}>Phone</Text>
                    <Text style={[styles.detailValue, { color: colors.primary }]}>
                      {project.clientPhone}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card>
      )}

      {/* Timeline Card */}
      <Card style={styles.timelineCard}>
        <Text style={[typography.h4, styles.timelineHeaderTitle]}>Project Timeline</Text>
        
        <View style={styles.timeline}>
          {getTimelineItems().map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.timelineItem, 
                item.completed && styles.timelineItemCompleted,
                item.current && styles.timelineItemCurrent,
                !item.completed && !item.current && styles.timelineItemPending
              ]}
              onPress={() => handleTimelineItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.timelineIconContainer,
                item.completed && styles.timelineIconCompleted,
                item.current && styles.timelineIconCurrent
              ]}>
                {item.icon}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[typography.body, styles.timelineTitle]}>{item.title}</Text>
                <Text style={[typography.caption, styles.timelineDate]}>
                  {item.date}
                </Text>
              </View>
              <View style={styles.timelineStatus}>
                {item.completed ? (
                  <View style={styles.timelineCheckmark}>
                    <CheckCircle size={20} color={colors.success} />
                  </View>
                ) : item.current ? (
                  <View style={[styles.timelineCheckmark, { backgroundColor: colors.warning + '20' }]}>
                    <Clock size={20} color={colors.warning} />
                  </View>
                ) : (
                  <View style={[styles.timelineCheckmark, { backgroundColor: colors.inactive + '20' }]}>
                    <Clock size={20} color={colors.inactive} />
                  </View>
                )}
              </View>
              {index < getTimelineItems().length - 1 && (
                <View style={[
                  styles.timelineConnector,
                  item.completed ? styles.timelineConnectorCompleted : styles.timelineConnectorPending
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      {/* Project Completion Section - Show for creatives at any time */}
      {!isClient && project.status !== 'Completed' && (
        <Card style={styles.completionCard}>
          <Text style={typography.h4}>
            {project.contractSigned && 
             project.paymentStatus === 'Final Paid' && 
             project.files.length > 0 && 
             project.files.every(file => file.approved) 
              ? 'Ready to Complete Project' 
              : 'Complete Project'}
          </Text>
          <Text style={[typography.body, styles.completionDescription]}>
            {project.contractSigned && 
             project.paymentStatus === 'Final Paid' && 
             project.files.length > 0 && 
             project.files.every(file => file.approved)
              ? 'All requirements have been met. You can now mark this project as completed.'
              : 'Mark this project as completed at any time. This will move the client to the bottom of your client list.'}
          </Text>
          <Button
            title="Complete Project"
            variant="primary"
            onPress={() => {
              Alert.alert(
                'Complete Project',
                'Are you sure you want to mark this project as completed? This will move the client to the completed section.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Complete', 
                    onPress: async () => {
                      try {
                        await completeProject(project.id);
                        Alert.alert('Success', 'Project marked as completed!');
                      } catch (error) {
                        Alert.alert('Error', 'Failed to complete project');
                      }
                    }
                  },
                ]
              );
            }}
            style={styles.completionButton}
            leftIcon={<CheckCircle size={20} color={colors.text.inverse} />}
          />
        </Card>
      )}
    </View>
  );

  const renderFilesTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.filesHeaderCard}>
        <View style={styles.filesHeader}>
          <View>
            <Text style={typography.h4}>Project Files</Text>
            <Text style={[typography.body, { color: colors.text.secondary }]}>
              {project.files.length} {project.files.length === 1 ? 'file' : 'files'} uploaded
            </Text>
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setShowFileUploadOptions(true)}
          >
            <Plus size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </Card>

      {showFileUploadOptions && activeTab === 'files' && (
        <View style={styles.fileUploadModal}>
          <TouchableWithoutFeedback onPress={() => setShowFileUploadOptions(false)}>
            <View style={styles.fileUploadModalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.fileUploadModalContent}>
            <Text style={styles.fileUploadModalTitle}>Upload Files</Text>
            <View style={styles.fileUploadList}>
              <TouchableOpacity 
                style={styles.fileUploadListOption}
                onPress={() => handleFileUploadFromFiles('camera')}
              >
                <Image size={24} color={colors.primary} />
                <Text style={styles.fileUploadListText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fileUploadListOption}
                onPress={() => handleFileUploadFromFiles('gallery')}
              >
                <Image size={24} color={colors.primary} />
                <Text style={styles.fileUploadListText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fileUploadListOption}
                onPress={() => handleFileUploadFromFiles('documents')}
              >
                <Paperclip size={24} color={colors.primary} />
                <Text style={styles.fileUploadListText}>Documents</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.fileUploadListOption, styles.cancelOption]}
                onPress={() => setShowFileUploadOptions(false)}
              >
                <XIcon size={24} color={colors.error} />
                <Text style={[styles.fileUploadListText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {project.files.length > 0 ? (
        project.files.map(file => (
          <Card key={file.id} style={styles.fileCard}>
            <View style={styles.fileItemHeader}>
              <View style={styles.fileIconContainer}>
                {file.type === 'image' ? (
                  <Image size={24} color={colors.primary} />
                ) : file.type === 'video' ? (
                  <Video size={24} color={colors.primary} />
                ) : (
                  <FileText size={24} color={colors.primary} />
                )}
              </View>
              <View style={styles.fileInfo}>
                <Text style={[typography.body, styles.fileName]} numberOfLines={1}>{file.name}</Text>
                <Text style={[typography.caption, { color: colors.text.secondary }]}>
                  Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                styles.approvalBadge,
                file.approved ? styles.approvedBadge : styles.pendingBadge
              ]}>
                <Text style={[
                  styles.approvalText,
                  { color: file.approved ? colors.success : colors.warning }
                ]}>
                  {file.approved ? 'Approved' : 'Pending'}
                </Text>
              </View>
            </View>
            
            <View style={styles.fileActions}>
              <TouchableOpacity 
                style={styles.fileActionButton}
                onPress={() => handleFilePreview(file)}
              >
                <Eye size={16} color={colors.primary} />
                <Text style={styles.fileActionText}>Preview</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fileActionButton}
                onPress={() => handleFileDownload(file)}
              >
                <Download size={16} color={colors.primary} />
                <Text style={styles.fileActionText}>Download</Text>
              </TouchableOpacity>
            </View>

            {/* Only show approval actions to clients */}
            {isClient && !file.approved && (
              <View style={styles.approvalActions}>
                <TouchableOpacity 
                  style={[styles.approvalActionButton, styles.approveButton]}
                  onPress={() => handleFileApproval(file.id, true)}
                >
                  <Check size={16} color={colors.text.inverse} />
                  <Text style={[styles.approvalActionText, { color: colors.text.inverse }]}>Approve</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.approvalActionButton, styles.rejectButton]}
                  onPress={() => handleFileApproval(file.id, false)}
                >
                  <XIcon size={16} color={colors.error} />
                  <Text style={[styles.approvalActionText, { color: colors.error }]}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))
      ) : (
        <View style={styles.emptyStateContainer}>
          <Upload size={48} color={colors.primary} />
          <Text style={[typography.h3, styles.emptyStateTitle]}>No files yet</Text>
          <Text style={[typography.body, styles.emptyStateDescription]}>
            Upload files to share with your client
          </Text>
          <Button
            title="Upload Files"
            variant="primary"
            onPress={handleFileUpload}
            style={styles.emptyStateButton}
          />
        </View>
      )}
    </View>
  );

  const renderMessagesTab = () => {
    return (
      <View style={styles.messagesContainer}>
        <View style={styles.messagesListContainer}>
          {project.messages.length > 0 ? (
            <ScrollView 
              ref={messagesScrollRef}
              style={styles.messagesList} 
              contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              bounces={true}
              onContentSizeChange={() => {
                // Auto scroll to bottom when new messages are added
                setTimeout(() => {
                  if (messagesScrollRef.current) {
                    messagesScrollRef.current.scrollToEnd({ animated: true });
                  }
                }, 100);
              }}
            >
                {project.messages.map(message => (
                  <View 
                    key={message.id} 
                    style={[
                      styles.messageItem,
                      message.senderId === 'user' ? styles.sentMessage : styles.receivedMessage
                    ]}
                  >
                    {message.senderId !== 'user' && (
                      <Avatar name={message.senderName} size={32} />
                    )}
                    <View 
                      style={[
                        styles.messageBubble,
                        message.senderId === 'user' ? styles.sentBubble : styles.receivedBubble
                      ]}
                    >
                      {message.type === 'file' || message.type === 'image' || message.type === 'video' ? (
                        <View style={styles.fileMessageContainer}>
                          <View style={styles.fileIcon}>
                            {message.type === 'image' && <Image size={20} color={colors.primary} />}
                            {message.type === 'video' && <Video size={20} color={colors.primary} />}
                            {message.type === 'file' && <Paperclip size={20} color={colors.primary} />}
                          </View>
                          <View style={styles.fileMessageInfo}>
                            <Text style={[
                              typography.body,
                              message.senderId === 'user' ? styles.sentText : styles.receivedText
                            ]}>
                              {message.fileName || message.content}
                            </Text>
                            <TouchableOpacity 
                              style={styles.downloadButton}
                              onPress={() => Alert.alert('Download', `Downloading ${message.fileName}...`)}
                            >
                              <Download size={16} color={colors.primary} />
                              <Text style={styles.downloadText}>Download</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <Text 
                          style={[
                            typography.body,
                            message.senderId === 'user' ? styles.sentText : styles.receivedText
                          ]}
                        >
                          {message.content}
                        </Text>
                      )}
                      <Text 
                        style={[
                          styles.messageTime,
                          message.senderId === 'user' ? styles.sentTime : styles.receivedTime
                        ]}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyMessagesContainer}>
              <MessageCircle size={48} color={colors.primary} />
              <Text style={[typography.h3, styles.emptyStateTitle]}>No messages yet</Text>
              <Text style={[typography.body, styles.emptyStateDescription]}>
                Start a conversation with your client
              </Text>
            </View>
          )}
        </View>
        
        {/* Chat Input Bar */}
        <View style={styles.chatInputWrapper}>
          <View style={styles.messageInputContainer}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => setShowFileUploadOptions(true)}
            >
              <Paperclip size={20} color={colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.messageInput, { fontSize: messageText ? 16 : 14 }]}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Enter message"
              placeholderTextColor={colors.text.tertiary + '60'}
              multiline
              maxLength={500}
              onFocus={() => {
                // Scroll to bottom when input is focused
                setTimeout(() => {
                  if (messagesScrollRef.current) {
                    messagesScrollRef.current.scrollToEnd({ animated: true });
                  }
                }, 300);
              }}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={20} color={messageText.trim() ? colors.text.inverse : colors.text.tertiary} />
            </TouchableOpacity>
          </View>
          
          {showFileUploadOptions && (
            <View style={styles.fileUploadOptions}>
              <TouchableOpacity 
                style={styles.fileUploadOption}
                onPress={() => handleFileUploadToChat('image')}
              >
                <Image size={20} color={colors.primary} />
                <Text style={styles.fileUploadOptionText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fileUploadOption}
                onPress={() => handleFileUploadToChat('video')}
              >
                <Video size={20} color={colors.primary} />
                <Text style={styles.fileUploadOptionText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fileUploadOption}
                onPress={() => handleFileUploadToChat('file')}
              >
                <Paperclip size={20} color={colors.primary} />
                <Text style={styles.fileUploadOptionText}>File</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fileUploadOption}
                onPress={() => setShowFileUploadOptions(false)}
              >
                <XIcon size={20} color={colors.error} />
                <Text style={[styles.fileUploadOptionText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header 
        title={project.title} 
        showBackButton 
        rightElement={
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowOptionsMenu(true)}
          >
            <MoreVertical size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.tabBar}>
        {renderTabButton('overview', 'Overview', <Clock size={18} color={activeTab === 'overview' ? colors.text.inverse : colors.text.tertiary} />)}
        {renderTabButton('files', 'Files', <FileText size={18} color={activeTab === 'files' ? colors.text.inverse : colors.text.tertiary} />)}
        {renderTabButton('messages', 'Messages', <MessageCircle size={18} color={activeTab === 'messages' ? colors.text.inverse : colors.text.tertiary} />)}
      </View>
      
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
            {renderOverviewTab()}
          </ScrollView>
        </View>
        
        <View style={[styles.tabPage, { width: screenWidth }]}>
          <ScrollView 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={true}
          >
            {renderFilesTab()}
          </ScrollView>
        </View>
        
        <View style={[styles.tabPage, { width: screenWidth }]}>
          {renderMessagesTab()}
        </View>
      </ScrollView>

      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        title="Feature Locked"
        description="Contracts are available on Professional and Studio plans. Upgrade to unlock digital contracts and e-signatures."
        suggestedTier="mid"
      />
      
      <ProjectOptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        onEditProject={() => router.push(`/edit-project/${project.id}`)}
        projectTitle={project.title}
        projectId={project.id}
      />
      
      {/* Client Info Modal */}
      {showClientInfoModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.clientInfoModal}>
            <Text style={styles.clientInfoTitle}>{project.clientName}</Text>
            <View style={styles.clientInfoModalContent}>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Phone:</Text>
                <Text style={styles.clientInfoValue}>{project.clientPhone || 'Not provided'}</Text>
              </View>
              <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Email:</Text>
                <Text style={styles.clientInfoValue}>{project.clientEmail || 'Not provided'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.clientInfoCloseButton}
              onPress={() => setShowClientInfoModal(false)}
            >
              <Text style={styles.clientInfoCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorButton: {
    marginTop: 16,
  },
  moreButton: {
    padding: 8,
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
    paddingBottom: 40,
  },
  tabContent: {
    gap: 20,
  },
  headerCard: {
    padding: 24,
    borderRadius: 24,
  },
  projectHeader: {
    marginBottom: 16,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectTitle: {
    flex: 1,
    marginRight: 12,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  clientInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border + '60',
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  clientAvatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: colors.primary + '25',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  clientInfoContent: {
    flex: 1,
  },
  clientInfoLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  clientInfoName: {
    ...typography.h4,
    fontWeight: '700',
    marginBottom: 2,
  },
  clientInfoPhone: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  clientInfoArrow: {
    padding: 8,
  },
  contractCard: {
    padding: 24,
    borderRadius: 24,
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contractIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contractInfo: {
    flex: 1,
  },
  contractButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  invoiceCard: {
    padding: 24,
    borderRadius: 24,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  timelineCard: {
    padding: 24,
    borderRadius: 24,
  },
  bookingCard: {
    padding: 24,
    borderRadius: 24,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  eventHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  expandIcon: {
    padding: 4,
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  eventContent: {
    gap: 20,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  description: {
    marginTop: 8,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineHeaderTitle: {
    marginBottom: 20,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 16,
  },
  timelineItemCompleted: {
    opacity: 1,
  },
  timelineItemCurrent: {
    opacity: 1,
  },
  timelineItemPending: {
    opacity: 0.6,
  },
  timelineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.inactive + '30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  timelineIconCompleted: {
    backgroundColor: colors.success,
  },
  timelineIconCurrent: {
    backgroundColor: colors.primary,
  },
  timelineTitle: {
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  timelineDate: {
    color: colors.text.secondary,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  timelineStatus: {
    width: 32,
    alignItems: 'center',
  },
  timelineCheckmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineConnector: {
    position: 'absolute',
    left: 23,
    top: 64,
    width: 2,
    height: 16,
    backgroundColor: colors.border,
  },
  timelineConnectorCompleted: {
    backgroundColor: colors.success,
  },
  timelineConnectorPending: {
    backgroundColor: colors.border,
  },
  filesHeaderCard: {
    padding: 24,
    borderRadius: 24,
  },
  filesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 12,
  },
  fileCard: {
    marginBottom: 16,
    padding: 24,
    borderRadius: 24,
  },
  fileItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  approvalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  approvedBadge: {
    backgroundColor: colors.success + '20',
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
  },
  approvalText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  fileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  fileActionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approvalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.error,
  },
  approvalActionText: {
    ...typography.body,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 32,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesListContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatInputWrapper: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 24,
    maxWidth: '100%',
  },
  sentBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  receivedBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sentText: {
    color: colors.text.inverse,
  },
  receivedText: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTime: {
    color: colors.text.inverse + '80',
  },
  receivedTime: {
    color: colors.text.tertiary,
  },
  emptyMessagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.inactive,
  },
  invoiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileMessageInfo: {
    flex: 1,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  downloadText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  fileUploadOptions: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fileUploadOption: {
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.background,
    minWidth: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileUploadOptionText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  fileUploadModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fileUploadModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fileUploadModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '85%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileUploadModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  fileUploadList: {
    gap: 12,
  },
  fileUploadListOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileUploadListText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cancelOption: {
    borderColor: colors.error + '30',
    backgroundColor: colors.error + '10',
  },
  completionCard: {
    marginTop: 16,
    padding: 20,
    backgroundColor: colors.success + '10',
    borderWidth: 1,
    borderColor: colors.success + '30',
    borderRadius: 24,
  },
  completionDescription: {
    color: colors.text.secondary,
    marginTop: 8,
    marginBottom: 16,
  },
  completionButton: {
    backgroundColor: colors.success,
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
  clientInfoModal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    margin: 20,
    width: '85%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clientInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  clientInfoModalContent: {
    marginTop: 4,
  },
  clientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientInfoValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  clientInfoCloseButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  clientInfoCloseText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});