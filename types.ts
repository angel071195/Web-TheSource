
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  RESELLER = 'RESELLER'
}

export enum ServiceCategory {
  MOVIES = 'Películas',
  MUSIC = 'Música',
  ANIME = 'Anime',
  SPORTS = 'Deportes',
  SOFTWARE = 'Software'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number; // Monthly price in Bolivianos
  durationDays: number;
  logoUrl: string;
  stock: number;
  isHot?: boolean; // Oferta flash
}

export interface Subscription {
  id: string;
  serviceId: string;
  serviceName: string;
  logoUrl: string;
  buyerEmail: string; // ID/Email of the user who bought this subscription
  email: string; // Provided by Admin (Account credentials)
  password?: string; // Provided by Admin
  profileName?: string; // Provided by Admin
  pin?: string;
  adminMessage?: string; // Message from Admin
  purchaseDate: string; // ISO string
  expiryDate: string; // ISO string
  status: 'ACTIVE' | 'EXPIRED' | 'REPORTED' | 'PENDING';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for authentication
  role: UserRole;
  balance: number;
  loyaltyPoints: number;
  isOnline?: boolean; // Real-time status
  registeredAt?: string; // For Admin tracking
  lastLogin?: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'SALE' | 'REDEEM';
  amount: number;
  date: string;
  description: string;
  userEmail?: string;
}

export interface RechargeRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  receiptImage: string; // Base64 string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  approvalDate?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'QR' | 'BANK_INFO';
  imageData?: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}
