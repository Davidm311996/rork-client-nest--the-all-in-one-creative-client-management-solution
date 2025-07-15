export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  projects: string[]; // Array of project IDs
  status: 'invited' | 'active' | 'inactive' | 'completed';
  inviteToken?: string; // For pending invites
  linkedCreativeId: string; // Which creative they're linked to
};

export type ClientInvite = {
  id: string;
  email: string;
  clientName?: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  creativeId: string;
};