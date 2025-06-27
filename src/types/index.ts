export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  category: string;
  capacity: number;
  price: number;
  distance?: number;
}

export interface Reservation {
  id: string;
  code: string;
  fullName: string;
  email: string;
  whatsappPhone: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  qrCode?: string;
  createdAt: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}