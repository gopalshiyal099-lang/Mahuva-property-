
export enum PropertyStatus {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  SOLD = 'Sold',
  PENDING = 'Pending'
}

export enum PropertyType {
  SALE = 'Sale',
  RENTAL = 'Rental'
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  description: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  CLOSED = 'Closed',
  LOST = 'Lost'
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  interestedIn: string; // Property ID
  source: string;
  createdAt: string;
}

export interface Message {
  id: string;
  leadId: string;
  type: 'whatsapp' | 'sms';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
}

export type View = 'dashboard' | 'inventory' | 'leads' | 'messages';
