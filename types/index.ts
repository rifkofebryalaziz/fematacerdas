export interface User {
  name: string;
  email: string;
  age?: string;
  location?: string;
  consultationPurpose?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface Chat {
  id: string;
  title: string;
  starred: boolean;
}

export interface MessageSource {
  filename: string;
  pages: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: MessageSource[];
  isLoading?: boolean;
}

export interface Place {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'optik';
  rating: number;
  distance: number;
  address: string;
  lat: number;
  lng: number;
}

export interface Settings {
  aiResponse: 'ringkas' | 'detail';
  tone: 'formal' | 'santai';
  medicalDisclaimer: boolean;
  showSource: boolean;
  saveHistory: boolean;
  locationPermission: boolean;
  searchRadius: 3 | 5 | 10;
  recommendationType: 'rs' | 'klinik' | 'optik' | 'semua';
  sortBy: 'terdekat' | 'rating';
  autoDeleteDays: 7 | 30 | null;
}