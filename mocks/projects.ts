import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Wedding Photography',
    description: 'Full day wedding photography coverage including engagement session',
    clientId: '1',
    clientName: 'Sarah & Michael Johnson',
    status: 'In Progress',
    createdAt: '2025-06-15T10:00:00Z',
    dueDate: '2025-08-20T00:00:00Z',
    contractSigned: true,
    contractSignedDate: '2025-06-16T14:30:00Z',
    paymentStatus: 'Deposit Paid',
    budget: 3500,
    eventType: 'Wedding',
    eventDate: '2025-08-20T16:00:00Z',
    eventLocation: {
      address: '123 Garden View Venue, Beverly Hills, CA 90210',
      coordinates: {
        latitude: 34.0736,
        longitude: -118.4004
      }
    },
    clientPhone: '+1 (555) 123-4567',
    contractId: 'contract_1',
    depositInvoiceId: 'invoice_1',
    files: [
      {
        id: 'f1',
        name: 'Engagement Photos',
        url: 'https://example.com/files/engagement',
        type: 'folder',
        uploadedAt: '2025-06-20T14:30:00Z',
        approved: true,
      }
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'client1',
        senderName: 'Sarah Johnson',
        content: "We're so excited to see the engagement photos!",
        timestamp: '2025-06-21T09:15:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'user',
        senderName: 'You',
        content: "I've uploaded them to the portal. Let me know what you think!",
        timestamp: '2025-06-21T10:30:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'client1',
        senderName: 'Sarah Johnson',
        content: "They look absolutely stunning! Thank you so much.",
        timestamp: '2025-06-21T14:45:00Z',
        read: false,
        type: 'text',
      }
    ]
  },
  {
    id: '2',
    title: 'Brand Identity Design',
    description: 'Complete brand identity package including logo, color palette, and brand guidelines',
    clientId: '2',
    clientName: 'Coastal Cafe',
    status: 'Contract Sent',
    createdAt: '2025-06-18T15:30:00Z',
    dueDate: '2025-07-30T00:00:00Z',
    contractSigned: false,
    paymentStatus: 'Not Started',
    budget: 2800,
    eventType: 'Brand Launch',
    eventDate: '2025-07-30T10:00:00Z',
    eventLocation: {
      address: '456 Ocean Drive, Santa Monica, CA 90401'
    },
    clientPhone: '+1 (555) 987-6543',
    contractId: 'contract_2',
    files: [],
    messages: [
      {
        id: 'm1',
        senderId: 'user',
        senderName: 'You',
        content: "I've sent over the contract for the brand identity project. Please review and sign when you get a chance.",
        timestamp: '2025-06-18T16:00:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'client2',
        senderName: 'Emma Chen',
        content: "Thanks! I'll review it this evening and get back to you.",
        timestamp: '2025-06-19T08:30:00Z',
        read: false,
        type: 'text',
      }
    ]
  },
  {
    id: '3',
    title: 'Product Photography',
    description: 'Studio photography for new summer collection',
    clientId: '3',
    clientName: 'Bloom Boutique',
    status: 'Review',
    createdAt: '2025-06-10T09:00:00Z',
    dueDate: '2025-06-25T00:00:00Z',
    contractSigned: true,
    contractSignedDate: '2025-06-11T16:20:00Z',
    paymentStatus: 'Deposit Paid',
    budget: 1500,
    eventType: 'Product Shoot',
    eventDate: '2025-06-25T09:00:00Z',
    eventLocation: {
      address: '789 Studio Lane, Los Angeles, CA 90028'
    },
    clientPhone: '+1 (555) 456-7890',
    contractId: 'contract_3',
    depositInvoiceId: 'invoice_3',
    files: [
      {
        id: 'f1',
        name: 'Summer Collection Draft',
        url: 'https://example.com/files/summer-draft',
        type: 'folder',
        uploadedAt: '2025-06-17T11:45:00Z',
        approved: false,
      }
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'client3',
        senderName: 'Emma Chen',
        content: "The photos look great! Could we get a bit more brightness on the white dresses?",
        timestamp: '2025-06-18T14:20:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'user',
        senderName: 'You',
        content: "Absolutely, I'll adjust those and upload a revised version tomorrow.",
        timestamp: '2025-06-18T15:05:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'client3',
        senderName: 'Emma Chen',
        content: "Perfect! Looking forward to seeing the updates.",
        timestamp: '2025-06-19T11:20:00Z',
        read: false,
        type: 'text',
      }
    ]
  },
  {
    id: '4',
    title: 'Website Redesign',
    description: 'Complete website redesign with responsive layouts',
    clientId: '4',
    clientName: 'Apex Fitness',
    status: 'Completed',
    createdAt: '2025-05-05T13:00:00Z',
    dueDate: '2025-06-10T00:00:00Z',
    contractSigned: true,
    contractSignedDate: '2025-05-06T10:15:00Z',
    paymentStatus: 'Final Paid',
    budget: 5200,
    eventType: 'Website Launch',
    eventDate: '2025-06-10T12:00:00Z',
    clientPhone: '+1 (555) 321-0987',
    contractId: 'contract_4',
    depositInvoiceId: 'invoice_4',
    finalInvoiceId: 'invoice_5',
    files: [
      {
        id: 'f1',
        name: 'Final Website Files',
        url: 'https://example.com/files/apex-final',
        type: 'folder',
        uploadedAt: '2025-06-08T16:30:00Z',
        approved: true,
      }
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'client4',
        senderName: 'Jason Miller',
        content: "The website looks fantastic! Thank you for all your hard work.",
        timestamp: '2025-06-09T10:15:00Z',
        read: true,
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'user',
        senderName: 'You',
        content: "You're welcome! It was a pleasure working with you. Don't hesitate to reach out if you need any adjustments.",
        timestamp: '2025-06-09T11:00:00Z',
        read: true,
        type: 'text',
      }
    ]
  }
];