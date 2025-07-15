import { Client } from '@/types/client';

export const clients: Client[] = [
  {
    id: '1',
    name: 'Sarah & Michael Johnson',
    email: 'sarah.johnson@example.com',
    phone: '555-123-4567',
    company: '',
    createdAt: '2025-06-15T10:00:00Z',
    projects: ['1'],
  },
  {
    id: '2',
    name: 'Coastal Cafe',
    email: 'info@coastalcafe.example',
    phone: '555-987-6543',
    company: 'Coastal Cafe LLC',
    createdAt: '2025-06-18T15:30:00Z',
    projects: ['2'],
  },
  {
    id: '3',
    name: 'Emma Chen',
    email: 'emma@bloomboutique.example',
    phone: '555-456-7890',
    company: 'Bloom Boutique',
    createdAt: '2025-06-10T09:00:00Z',
    projects: ['3'],
  },
  {
    id: '4',
    name: 'Jason Miller',
    email: 'jason@apexfitness.example',
    phone: '555-789-0123',
    company: 'Apex Fitness',
    createdAt: '2025-05-05T13:00:00Z',
    projects: ['4'],
  }
];