import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Search, Plus, X } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import KeyboardAwareView from '@/components/KeyboardAwareView';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useClientStore } from '@/store/clientStore';
import { useProjectStore } from '@/store/projectStore';

export default function ChatScreen() {
  const router = useRouter();
  const { clients } = useClientStore();
  const { projects, fetchProjects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Generate conversations from projects that have messages
  const getConversationsFromProjects = () => {
    return projects
      .filter(project => project.messages.length > 0)
      .map(project => {
        const lastMessage = project.messages[project.messages.length - 1];
        const unreadCount = project.messages.filter(msg => !msg.read && msg.senderId !== 'user').length;
        
        // Format last message preview - always show the actual last message
        let lastMessagePreview = lastMessage.content;
        if (lastMessage.type === 'file' || lastMessage.type === 'image' || lastMessage.type === 'video') {
          lastMessagePreview = `📎 ${lastMessage.fileName || lastMessage.content}`;
        }
        
        return {
          id: project.id,
          clientName: project.clientName,
          lastMessage: lastMessagePreview,
          lastMessageSender: lastMessage.senderId,
          timestamp: formatTimestamp(lastMessage.timestamp),
          unread: unreadCount > 0,
          unreadCount,
          projectTitle: project.title,
          projectId: project.id,
          lastMessageTimestamp: lastMessage.timestamp, // Add for proper sorting
        };
      })
      .sort((a, b) => {
        // Sort by most recent message timestamp
        return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
      });
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const conversations = getConversationsFromProjects();

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get clients without existing conversations
  const clientsWithoutChats = clients.filter(client => 
    !conversations.some(conv => conv.clientName === client.name)
  );

  const handleNewChat = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    const clientProjects = projects.filter(p => p.clientId === clientId);
    
    if (clientProjects.length > 0) {
      // Navigate to the first project's messages tab
      router.push(`/project/${clientProjects[0].id}?tab=messages`);
    } else {
      Alert.alert('No Projects', `No projects found for ${client?.name}. Create a project first to start messaging.`);
    }
    
    setShowNewChatModal(false);
  };

  const renderNewChatModal = () => {
    if (!showNewChatModal) return null;

    return (
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Start New Chat</Text>
            <TouchableOpacity onPress={() => setShowNewChatModal(false)}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {clientsWithoutChats.length > 0 ? (
            <ScrollView style={styles.clientsList}>
              {clientsWithoutChats.map(client => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientItem}
                  onPress={() => handleNewChat(client.id)}
                >
                  <Avatar name={client.name} size={40} />
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noClientsContainer}>
              <Text style={styles.noClientsText}>
                All clients already have active conversations
              </Text>
            </View>
          )}
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAwareView style={styles.container} isChatScreen={false}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1}>Chat</Text>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={() => setShowNewChatModal(true)}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor={colors.text.tertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => router.push(`/project/${conversation.projectId}?tab=messages`)}
              activeOpacity={0.7}
            >
              <Avatar name={conversation.clientName} size={50} />
              
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.clientName} numberOfLines={1}>
                    {conversation.clientName}
                  </Text>
                  <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                </View>
                
                <Text style={styles.projectTitle} numberOfLines={1}>
                  {conversation.projectTitle}
                </Text>
                
                <Text 
                  style={[
                    styles.lastMessage,
                    conversation.unread && styles.unreadMessage
                  ]} 
                  numberOfLines={1}
                >
                  {conversation.lastMessageSender === 'user' 
                    ? `You: ${conversation.lastMessage}` 
                    : conversation.lastMessage
                  }
                </Text>
              </View>
              
              {conversation.unread && (
                <View style={styles.unreadContainer}>
                  <View style={styles.unreadDot} />
                  {conversation.unreadCount > 1 && (
                    <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color={colors.primary} />
            <Text style={[typography.h3, styles.emptyTitle]}>No results found</Text>
            <Text style={[typography.body, styles.emptyDescription]}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color={colors.primary} />
            <Text style={[typography.h3, styles.emptyTitle]}>No conversations yet</Text>
            <Text style={[typography.body, styles.emptyDescription]}>
              Start a project to begin chatting with your clients
            </Text>
            <Button
              title="Start New Chat"
              variant="primary"
              onPress={() => setShowNewChatModal(true)}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>

      {renderNewChatModal()}
      </SafeAreaView>
    </KeyboardAwareView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginBottom: 12,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  projectTitle: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  unreadMessage: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  unreadContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  unreadCount: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 24,
  },
  emptyStateButton: {
    minWidth: 200,
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
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  clientsList: {
    maxHeight: 300,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  clientInfo: {
    marginLeft: 12,
    flex: 1,
  },
  clientEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  noClientsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noClientsText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});