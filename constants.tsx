
import { Property, PropertyStatus, PropertyType, Lead, LeadStatus } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Modern Sunset Villa',
    address: '123 Ocean Drive, Miami, FL',
    price: 1250000,
    type: PropertyType.SALE,
    status: PropertyStatus.AVAILABLE,
    beds: 4,
    baths: 3,
    sqft: 2800,
    imageUrl: 'https://picsum.photos/seed/villa1/800/600',
    description: 'A stunning modern villa with ocean views and private pool.'
  },
  {
    id: 'p2',
    title: 'Downtown Loft Apartment',
    address: '789 Main St, New York, NY',
    price: 4500,
    type: PropertyType.RENTAL,
    status: PropertyStatus.AVAILABLE,
    beds: 2,
    baths: 2,
    sqft: 1200,
    imageUrl: 'https://picsum.photos/seed/loft1/800/600',
    description: 'Chic industrial loft in the heart of downtown, featuring high ceilings.'
  },
  {
    id: 'p3',
    title: 'Family Suburban Home',
    address: '456 Oak Lane, Austin, TX',
    price: 650000,
    type: PropertyType.SALE,
    status: PropertyStatus.PENDING,
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    imageUrl: 'https://picsum.photos/seed/home1/800/600',
    description: 'Perfect family home with a spacious backyard and modern kitchen.'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+15551234567',
    status: LeadStatus.NEW,
    interestedIn: 'p1',
    source: 'Zillow',
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 'l2',
    name: 'Sarah Smith',
    email: 'sarah@test.com',
    phone: '+15559876543',
    status: LeadStatus.CONTACTED,
    interestedIn: 'p2',
    source: 'Website',
    createdAt: '2024-03-19T14:30:00Z'
  }
];
