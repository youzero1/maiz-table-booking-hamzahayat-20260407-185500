export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  openingHours: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export interface TimeSlot {
  id: string;
  restaurantId: string;
  date: string;
  time: string;
  available: boolean;
  tableIds: string[];
}

export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  tableId: string;
  tableName: string;
  tableLocation: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  allergies: string[];
  specialRequests: string;
  createdAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'consumer' | 'restaurant';
  restaurantId?: string;
}

export const ALLERGIES = [
  'nuts',
  'peanuts',
  'dairy',
  'gluten',
  'shellfish',
  'soy',
  'eggs',
  'fish',
  'sesame',
  'wheat',
];
