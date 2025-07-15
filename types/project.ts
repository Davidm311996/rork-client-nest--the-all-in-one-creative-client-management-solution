export type ProjectStatus = 
  | 'Contract Sent'
  | 'In Progress'
  | 'Review'
  | 'Completed';

export type Project = {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  createdAt: string;
  dueDate: string;
  budget: number;
  contractSigned: boolean;
  paymentStatus: 'Not Started' | 'Deposit Paid' | 'Final Paid';
  // Booking/Event information
  eventType?: string;
  eventDate?: string;
  eventLocation?: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  clientPhone?: string;
  clientEmail?: string;
  // Contract information
  contractId?: string;
  contractSignedDate?: string;
  // Payment information
  depositInvoiceId?: string;
  finalInvoiceId?: string;
  files: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
    approved: boolean;
  }[];
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
    type?: 'text' | 'file' | 'image' | 'video';
    fileUrl?: string;
    fileName?: string;
  }[];
};