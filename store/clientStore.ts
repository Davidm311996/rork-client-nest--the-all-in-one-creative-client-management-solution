import { create } from 'zustand';
import { Client } from '@/types/client';
import { clients as mockClients } from '@/mocks/clients';

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClients: () => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  createClient: (client: Omit<Client, 'id' | 'createdAt' | 'projects'>) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  markClientAsCompleted: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ clients: mockClients, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch clients', isLoading: false });
    }
  },

  getClientById: (id: string) => {
    return get().clients.find(client => client.id === id);
  },

  createClient: async (clientData) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClient: Client = {
        id: `${Date.now()}`, // Generate a unique ID
        createdAt: new Date().toISOString(),
        projects: [],
        ...clientData,
      };
      
      set(state => ({
        clients: [...state.clients, newClient],
        isLoading: false,
      }));
      
      return newClient;
    } catch (error) {
      set({ error: 'Failed to create client', isLoading: false });
      throw error;
    }
  },

  updateClient: async (id: string, updates: Partial<Client>) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedClient: Client | undefined;
      
      set(state => {
        const updatedClients = state.clients.map(client => {
          if (client.id === id) {
            updatedClient = { ...client, ...updates };
            return updatedClient;
          }
          return client;
        });
        
        return { clients: updatedClients, isLoading: false };
      });
      
      if (!updatedClient) {
        throw new Error('Client not found');
      }
      
      return updatedClient;
    } catch (error) {
      set({ error: 'Failed to update client', isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete client', isLoading: false });
      throw error;
    }
  },

  markClientAsCompleted: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const updatedClients = state.clients.map(client => {
          if (client.id === id) {
            return { ...client, status: 'completed' as const };
          }
          return client;
        });
        
        return { clients: updatedClients, isLoading: false };
      });
    } catch (error) {
      set({ error: 'Failed to mark client as completed', isLoading: false });
      throw error;
    }
  },
}));