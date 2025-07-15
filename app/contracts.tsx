import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, FilePlus, FileCheck } from 'lucide-react-native';
import { useProjectStore } from '@/store/projectStore';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { Project } from '@/types/project';

export default function ContractsScreen() {
  const router = useRouter();
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const params = useLocalSearchParams();
  const contractId = params.contractId as string;
  const signed = params.signed as string;
  const projectId = params.projectId as string;
  const clientId = params.clientId as string;

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects that have contracts (either signed or pending)
  let contractProjects = projects.filter(
    project => project.status === 'Contract Sent' || project.contractSigned
  );

  // Filter by client if clientId is provided
  if (clientId) {
    contractProjects = contractProjects.filter(project => project.clientId === clientId);
  }

  // Filter by project if projectId is provided
  if (projectId) {
    contractProjects = contractProjects.filter(project => project.id === projectId);
  }

  // If we have a specific contract ID, show that contract
  useEffect(() => {
    if (contractId && projects.length > 0) {
      // Find the project with this contract
      const project = projects.find(p => p.contractId === contractId);
      if (project) {
        // Navigate to contract detail
        router.replace(`/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${contractId}&signed=${signed}`);
      }
    }
  }, [contractId, projects, signed, router]);

  // If we have a specific project, navigate directly to its contract
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const filteredProjects = projects.filter(
        project => (project.status === 'Contract Sent' || project.contractSigned) && project.id === projectId
      );
      
      if (filteredProjects.length > 0) {
        const project = filteredProjects[0];
        router.replace(`/template-preview?id=1&projectId=${project.id}&clientId=${project.clientId}&contractId=${project.contractId}&signed=${project.contractSigned}`);
      }
    }
  }, [projectId, projects, router]);

  const getHeaderTitle = () => {
    if (clientId && contractProjects.length > 0) {
      const clientName = contractProjects[0].clientName;
      return `${clientName} - Contracts`;
    }
    if (projectId && contractProjects.length > 0) {
      const projectTitle = contractProjects[0].title;
      return `${projectTitle} - Contract`;
    }
    return "Contracts";
  };

  const renderContractCard = ({ item }: { item: Project }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(`/template-preview?id=1&projectId=${item.id}&clientId=${item.clientId}&contractId=${item.contractId}&signed=${item.contractSigned}`);
      }}
    >
      <Card style={styles.contractCard}>
        <View style={styles.contractHeader}>
          <View style={styles.contractTitleRow}>
            {item.contractSigned ? (
              <FileCheck size={20} color={colors.success} />
            ) : (
              <FilePlus size={20} color={colors.warning} />
            )}
            <Text style={styles.contractTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.contractSigned ? colors.success + '20' : colors.warning + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.contractSigned ? colors.success : colors.warning }
            ]}>
              {item.contractSigned ? 'Signed' : 'Pending'}
            </Text>
          </View>
        </View>
        
        <View style={styles.contractDetails}>
          <Text style={styles.clientText}>Client: {item.clientName}</Text>
          <Text style={styles.contractIdText}>
            Contract ID: {item.contractId || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.contractDates}>
          <Text style={styles.dateText}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.contractSigned && item.contractSignedDate && (
            <Text style={styles.dateText}>
              Signed: {new Date(item.contractSignedDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={getHeaderTitle()} 
        showBackButton 
        rightElement={
          !clientId && !projectId ? (
            <Button
              title="New"
              onPress={() => router.push('/new-project')}
              variant="primary"
              size="small"
              leftIcon={<Plus size={16} color={colors.text.inverse} />}
            />
          ) : undefined
        }
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : contractProjects.length > 0 ? (
        <FlatList
          data={contractProjects}
          keyExtractor={(item) => item.id}
          renderItem={renderContractCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No contracts found"
          description={
            clientId 
              ? "No contracts found for this client."
              : projectId
              ? "No contract found for this project."
              : "You haven't created any contracts yet. Start by creating a new project with a contract."
          }
          actionLabel={!clientId && !projectId ? "Create Contract" : undefined}
          onAction={!clientId && !projectId ? () => router.push('/new-project') : undefined}
          icon={<FilePlus size={32} color={colors.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  contractCard: {
    marginBottom: 16,
    borderRadius: 20,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contractTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contractDetails: {
    marginBottom: 8,
  },
  clientText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  contractIdText: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
  },
  contractDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});