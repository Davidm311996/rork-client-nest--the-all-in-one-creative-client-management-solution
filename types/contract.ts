export type ContractTemplate = {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: string;
  lastModified: string;
  isDefault: boolean;
  category: 'photography' | 'design' | 'video' | 'consulting' | 'web-development' | 'copywriting' | 'social-media' | 'illustration' | 'music' | 'other';
  variables: string[]; // Variables like [CLIENT_NAME], [BUSINESS_NAME], etc.
};

export type ContractInstance = {
  id: string;
  templateId: string;
  projectId: string;
  clientId: string;
  content: string; // Filled template content
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  expiresAt?: string;
  clientSignature?: string;
  creativeSignature?: string;
};

export const CONTRACT_VARIABLES = [
  '[CLIENT_NAME]',
  '[CLIENT_EMAIL]',
  '[CLIENT_ADDRESS]',
  '[BUSINESS_NAME]',
  '[BUSINESS_EMAIL]',
  '[BUSINESS_ADDRESS]',
  '[PROJECT_TITLE]',
  '[PROJECT_DESCRIPTION]',
  '[PROJECT_PRICE]',
  '[PROJECT_DEPOSIT]',
  '[PROJECT_START_DATE]',
  '[PROJECT_END_DATE]',
  '[CURRENT_DATE]',
] as const;