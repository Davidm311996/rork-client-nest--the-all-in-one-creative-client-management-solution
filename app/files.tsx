import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  FileText, 
  Download,
  Eye,
  MoreVertical,
  Plus,
  User,
  X
} from 'lucide-react-native';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useProjectStore } from '@/store/projectStore';

type FileItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: string;
  uploadedAt: string;
  projectName: string;
  clientName: string;
  status: 'delivered' | 'pending' | 'approved';
};

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Wedding_Photos_Final.zip',
    type: 'other',
    size: '245 MB',
    uploadedAt: '2025-01-02T10:30:00Z',
    projectName: 'Wedding Photography',
    clientName: 'Sarah Johnson',
    status: 'approved',
  },
  {
    id: '2',
    name: 'Brand_Logo_Concepts.pdf',
    type: 'document',
    size: '12 MB',
    uploadedAt: '2025-01-01T15:45:00Z',
    projectName: 'Brand Identity',
    clientName: 'Coastal Cafe',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Product_Shots_Draft.jpg',
    type: 'image',
    size: '8 MB',
    uploadedAt: '2024-12-30T09:15:00Z',
    projectName: 'Product Photography',
    clientName: 'Bloom Boutique',
    status: 'delivered',
  },
];

export default function FilesScreen() {
  const router = useRouter();
  const { projects } = useProjectStore();
  const [files] = useState<FileItem[]>(mockFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showFileUploadOptions, setShowFileUploadOptions] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={24} color={colors.primary} />;
      case 'video':
        return <Video size={24} color={colors.primary} />;
      case 'document':
        return <FileText size={24} color={colors.primary} />;
      default:
        return <File size={24} color={colors.primary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'delivered':
        return colors.primary;
      case 'pending':
        return colors.warning;
      default:
        return colors.inactive;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUploadFiles = () => {
    setShowFileUploadOptions(true);
  };

  const handleFileUploadFromFiles = (type: string) => {
    setShowFileUploadOptions(false);
    Alert.alert('Upload', `${type} upload would start here`);
  };

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case 'preview':
        Alert.alert('Preview', `Opening ${file.name}`);
        break;
      case 'download':
        Alert.alert('Download', `Downloading ${file.name}`);
        break;
      case 'share':
        Alert.alert('Share', `Sharing ${file.name}`);
        break;
      default:
        break;
    }
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <Card style={styles.fileCard}>
      <View style={styles.fileHeader}>
        <View style={styles.fileInfo}>
          <View style={styles.fileIconContainer}>
            {getFileIcon(item.type)}
          </View>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.fileProject}>
              {item.projectName} • {item.clientName}
            </Text>
            <Text style={styles.fileMetadata}>
              {item.size} • {formatDate(item.uploadedAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.fileActions}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {item.status}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setSelectedFile(item);
            }}
          >
            <MoreVertical size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderClientItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Handle client selection - navigate to client details or perform action
        setShowClientSelector(false);
        console.log('Client selected:', item.id);
      }}
    >
      <View style={styles.clientIcon}>
        <User size={20} color={colors.primary} />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.clientProject}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Files" 
        showBackButton 
      />

      <View style={styles.filesContainer}>
        <View style={styles.filesHeader}>
          <View>
            <Text style={styles.filesTitle}>Project Files</Text>
            <Text style={styles.filesSubtitle}>{files.length} {files.length === 1 ? 'file' : 'files'} uploaded</Text>
          </View>
          <TouchableOpacity
            style={styles.addFilesButton}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              handleUploadFiles();
            }}
          >
            <Plus size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>

        {files.length > 0 ? (
          <FlatList
            data={files}
            keyExtractor={(item) => item.id}
            renderItem={renderFileItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Upload size={48} color={colors.primary} />
            <Text style={styles.emptyStateTitle}>No files yet</Text>
            <Text style={styles.emptyStateDescription}>
              Upload files to share with your clients
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleUploadFiles}
            >
              <Text style={styles.emptyStateButtonText}>Upload Files</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Client Selector Modal */}
      <Modal
        visible={showClientSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClientSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.clientSelectorModal}>
            <Text style={[typography.h3, styles.modalTitle]}>Select Client</Text>
            <Text style={styles.modalSubtitle}>Choose which client to upload files for</Text>
            
            <FlatList
              data={projects}
              keyExtractor={(item) => item.id}
              renderItem={renderClientItem}
              style={styles.clientList}
              showsVerticalScrollIndicator={false}
            />
            
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowClientSelector(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>

      {/* File Actions Modal */}
      <Modal
        visible={selectedFile !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFile(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModal}>
            <Text style={[typography.h4, styles.modalTitle]}>
              {selectedFile?.name}
            </Text>
            
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                if (selectedFile) handleFileAction('preview', selectedFile);
                setSelectedFile(null);
              }}
            >
              <Eye size={20} color={colors.text.primary} />
              <Text style={styles.modalActionText}>Preview</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                if (selectedFile) handleFileAction('download', selectedFile);
                setSelectedFile(null);
              }}
            >
              <Download size={20} color={colors.text.primary} />
              <Text style={styles.modalActionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                if (selectedFile) handleFileAction('share', selectedFile);
                setSelectedFile(null);
              }}
            >
              <Upload size={20} color={colors.text.primary} />
              <Text style={styles.modalActionText}>Share with Client</Text>
            </TouchableOpacity>
            
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setSelectedFile(null)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>

      {/* Upload Modal */}
      {showFileUploadOptions && (
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
                <FileText size={24} color={colors.primary} />
                <Text style={styles.fileUploadListText}>Documents</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.fileUploadListOption, styles.cancelOption]}
                onPress={() => setShowFileUploadOptions(false)}
              >
                <X size={24} color={colors.error} />
                <Text style={[styles.fileUploadListText, { color: colors.error }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  headerButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fileCard: {
    marginBottom: 16,
    borderRadius: 24,
    padding: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fileInfo: {
    flexDirection: 'row',
    flex: 1,
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
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  fileProject: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  fileMetadata: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  fileActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  clientSelectorModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  actionModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  uploadOption: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    width: '45%',
    minHeight: 80,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cancelUploadOption: {
    borderColor: colors.error + '30',
    backgroundColor: colors.error + '10',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  clientList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  clientProject: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalActionText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 12,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  uploadModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '85%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filesContainer: {
    flex: 1,
  },
  filesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  filesSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addFilesButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 12,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    minWidth: 200,
  },
  emptyStateButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});