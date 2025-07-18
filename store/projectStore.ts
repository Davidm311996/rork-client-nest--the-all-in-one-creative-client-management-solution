import { create } from 'zustand';
import { Project, ProjectStatus } from '@/types/project';
import { projects as mockProjects } from '@/mocks/projects';
import { useSubscriptionStore } from './subscriptionStore';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  markMessagesAsRead: (projectId: string) => void;
  completeProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initialize with mock data immediately to avoid loading states
  projects: mockProjects,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    const state = get();
    // Don't fetch if already loading or if projects are already loaded
    if (state.isLoading || state.projects.length > 0) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ projects: mockProjects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  getProjectById: (id: string) => {
    return get().projects.find(project => project.id === id);
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject: Project = {
        id: `${Date.now()}`, // Generate a unique ID
        createdAt: new Date().toISOString(),
        ...projectData,
      };
      
      set(state => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      
      return newProject;
    } catch (error) {
      set({ error: 'Failed to create project', isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    // For message updates, don't show loading state to keep UI responsive
    const isMessageUpdate = updates.messages !== undefined;
    
    if (!isMessageUpdate) {
      set({ isLoading: true, error: null });
    }
    
    try {
      // In a real app, this would be an API call
      // Skip delay for message updates to keep chat responsive
      if (!isMessageUpdate) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      let updatedProject: Project | undefined;
      
      set(state => {
        const updatedProjects = state.projects.map(project => {
          if (project.id === id) {
            updatedProject = { ...project, ...updates };
            return updatedProject;
          }
          return project;
        });
        
        return { 
          projects: updatedProjects, 
          isLoading: isMessageUpdate ? state.isLoading : false 
        };
      });
      
      if (!updatedProject) {
        throw new Error('Project not found');
      }
      
      return updatedProject;
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
        isLoading: false,
      }));
      
      // Decrement project usage when deleting
      const { decrementProjectUsage } = useSubscriptionStore.getState();
      decrementProjectUsage();
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
      throw error;
    }
  },

  markMessagesAsRead: (projectId: string) => {
    set(state => {
      const updatedProjects = state.projects.map(project => {
        if (project.id === projectId) {
          const updatedMessages = project.messages.map(msg => ({ ...msg, read: true }));
          return { ...project, messages: updatedMessages };
        }
        return project;
      });
      
      return { projects: updatedProjects };
    });
  },

  completeProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const updatedProjects = state.projects.map(project => {
          if (project.id === id) {
            return { 
              ...project, 
              status: 'Completed' as ProjectStatus,
              completedAt: new Date().toISOString()
            };
          }
          return project;
        });
        
        return { projects: updatedProjects, isLoading: false };
      });
    } catch (error) {
      set({ error: 'Failed to complete project', isLoading: false });
      throw error;
    }
  },
}));