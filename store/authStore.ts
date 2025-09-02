import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'creative' | 'client';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  linkedCreativeId?: string; // For clients - which creative they're linked to
  isEmailVerified: boolean;
};

export type PendingInvite = {
  id: string;
  email: string;
  clientName?: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  creativeId: string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: boolean;
  pendingInvites: PendingInvite[];
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, businessName?: string, inviteToken?: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  
  // Invite system
  createInvite: (email: string, clientName?: string) => Promise<PendingInvite>;
  validateInviteToken: (token: string) => Promise<boolean>;
  acceptInvite: (token: string) => Promise<void>;
  resendInvite: (inviteId: string) => Promise<void>;
  revokeInvite: (inviteId: string) => Promise<void>;
  fetchPendingInvites: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerification: false,
      pendingInvites: [],

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data - determine role based on email for testing
          const isClientEmail = email.includes('client') || email.includes('test');
          const user: User = {
            id: '1',
            name: isClientEmail ? 'Sarah Client' : 'David Johnson',
            email,
            role: isClientEmail ? 'client' : 'creative',
            businessName: isClientEmail ? undefined : 'Creative Studio',
            phone: '+1 (555) 123-4567',
            address: '123 Creative Street, Design City, DC 12345',
            createdAt: new Date().toISOString(),
            isEmailVerified: true,
            linkedCreativeId: isClientEmail ? 'creative-1' : undefined,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            pendingVerification: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },

      register: async (name: string, email: string, password: string, role: UserRole, businessName?: string, inviteToken?: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            role,
            businessName: role === 'creative' ? businessName : undefined,
            createdAt: new Date().toISOString(),
            isEmailVerified: false,
            linkedCreativeId: inviteToken ? 'creative-id-from-token' : undefined,
          };
          
          set({ 
            user, 
            isAuthenticated: false, // Not authenticated until email verified
            isLoading: false,
            pendingVerification: true,
          });

          // If this was from an invite, mark the invite as accepted
          if (inviteToken) {
            await get().acceptInvite(inviteToken);
          }
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },

      verifyEmail: async (code: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (user) {
            const updatedUser = { ...user, isEmailVerified: true };
            set({ 
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false,
              pendingVerification: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Invalid verification code');
        }
      },

      sendPasswordReset: async (email: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Failed to send reset email');
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          pendingVerification: false,
          pendingInvites: [],
        });
      },

      checkAuthStatus: async () => {
        const { user } = get();
        if (user && user.isEmailVerified) {
          set({ isAuthenticated: true });
        } else if (user && !user.isEmailVerified) {
          set({ pendingVerification: true });
        }
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...updates } 
          });
        }
      },

      // Invite system methods
      createInvite: async (email: string, clientName?: string) => {
        const { user } = get();
        if (!user || user.role !== 'creative') {
          throw new Error('Only creatives can send invites');
        }

        const invite: PendingInvite = {
          id: Date.now().toString(),
          email,
          clientName,
          token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          status: 'pending',
          creativeId: user.id,
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const currentInvites = get().pendingInvites;
        set({ pendingInvites: [...currentInvites, invite] });

        return invite;
      },

      validateInviteToken: async (token: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { pendingInvites } = get();
        const invite = pendingInvites.find(inv => inv.token === token);
        
        if (!invite) return false;
        if (invite.status !== 'pending') return false;
        if (new Date(invite.expiresAt) < new Date()) {
          // Mark as expired
          const updatedInvites = pendingInvites.map(inv => 
            inv.id === invite.id ? { ...inv, status: 'expired' as const } : inv
          );
          set({ pendingInvites: updatedInvites });
          return false;
        }
        
        return true;
      },

      acceptInvite: async (token: string) => {
        const { pendingInvites } = get();
        const updatedInvites = pendingInvites.map(invite => 
          invite.token === token ? { ...invite, status: 'accepted' as const } : invite
        );
        set({ pendingInvites: updatedInvites });
      },

      resendInvite: async (inviteId: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { pendingInvites } = get();
        const updatedInvites = pendingInvites.map(invite => 
          invite.id === inviteId 
            ? { 
                ...invite, 
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending' as const 
              } 
            : invite
        );
        set({ pendingInvites: updatedInvites });
      },

      revokeInvite: async (inviteId: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { pendingInvites } = get();
        const updatedInvites = pendingInvites.map(invite => 
          invite.id === inviteId ? { ...invite, status: 'revoked' as const } : invite
        );
        set({ pendingInvites: updatedInvites });
      },

      fetchPendingInvites: async () => {
        const { user } = get();
        if (!user || user.role !== 'creative') return;
        
        // Simulate API call - in real app this would fetch from server
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingVerification: state.pendingVerification,
        pendingInvites: state.pendingInvites,
      }),
    }
  )
);