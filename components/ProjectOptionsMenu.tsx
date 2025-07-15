import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Edit3, Trash2, X } from 'lucide-react-native';
import Card from '@/components/Card';
import CustomAlert from '@/components/CustomAlert';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'expo-router';

interface ProjectOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onEditProject: () => void;
  onDeleteProject?: () => void;
  projectTitle: string;
  projectId: string;
}

export default function ProjectOptionsMenu({
  visible,
  onClose,
  onEditProject,
  onDeleteProject,
  projectTitle,
  projectId,
}: ProjectOptionsMenuProps) {
  const { deleteProject } = useProjectStore();
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const handleEditProject = () => {
    onClose();
    onEditProject();
  };

  const handleDeleteProject = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onClose();
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProject(projectId);
      router.back();
      Alert.alert('Success', 'Project deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete project');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.container}>
          <Card style={styles.menu}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>{projectTitle}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.options}>
              <TouchableOpacity
                style={styles.option}
                onPress={handleEditProject}
                activeOpacity={0.7}
              >
                <View style={styles.optionIcon}>
                  <Edit3 size={20} color={colors.primary} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Edit Project Information</Text>
                  <Text style={styles.optionDescription}>
                    Update project details, client, and settings
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.option}
                onPress={handleDeleteProject}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, styles.dangerIcon]}>
                  <Trash2 size={20} color={colors.error} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, styles.dangerText]}>
                    Delete Project
                  </Text>
                  <Text style={styles.optionDescription}>
                    Permanently remove this project
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </View>
      
      <CustomAlert
        visible={showDeleteAlert}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`}
        type="error"
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowDeleteAlert(false),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]}
        onClose={() => setShowDeleteAlert(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  menu: {
    width: '100%',
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  options: {
    padding: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dangerIcon: {
    backgroundColor: colors.error + '20',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dangerText: {
    color: colors.error,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});