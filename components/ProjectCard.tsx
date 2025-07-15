import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, FileText, MessageCircle, CreditCard } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { Project } from '@/types/project';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Contract Sent':
        return colors.warning;
      case 'In Progress':
        return colors.primary;
      case 'Review':
        return colors.secondary;
      case 'Completed':
        return colors.success;
      default:
        return colors.inactive;
    }
  };

  const getStatusIcon = () => {
    switch (project.status) {
      case 'Contract Sent':
        return <FileText size={16} color={getStatusColor(project.status)} />;
      case 'In Progress':
        return <Clock size={16} color={getStatusColor(project.status)} />;
      case 'Review':
        return <MessageCircle size={16} color={getStatusColor(project.status)} />;
      case 'Completed':
        return <CreditCard size={16} color={getStatusColor(project.status)} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={typography.h4} numberOfLines={1}>{project.title}</Text>
          <View style={styles.clientContainer}>
            <Text style={typography.caption}>CLIENT</Text>
            <Text style={typography.bodySmall}>{project.clientName}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text 
              style={[
                styles.statusText, 
                { color: getStatusColor(project.status) }
              ]}
            >
              {project.status}
            </Text>
          </View>
          
          <Text style={typography.caption}>
            {new Date(project.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  clientContainer: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});