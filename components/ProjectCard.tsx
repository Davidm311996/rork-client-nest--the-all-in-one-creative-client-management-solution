import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, FileText, MessageCircle, CreditCard } from 'lucide-react-native';
import Card from './Card';
import { useThemeStore } from '@/store/themeStore';
import { createTypography } from '@/constants/typography';
import { Project } from '@/types/project';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  const typography = createTypography(colors);

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
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={[typography.h4, { color: colors.text.primary }]} numberOfLines={1}>{project.title}</Text>
          <View style={styles.clientContainer}>
            <Text style={[typography.caption, { color: colors.text.tertiary }]}>CLIENT</Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>{project.clientName}</Text>
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
          
          <Text style={[typography.caption, { color: colors.text.tertiary }]}>
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

