
export type ViewState = 
  | 'LOGIN' 
  | 'ONBOARDING_CLIENT' 
  | 'ONBOARDING_PROVIDER' 
  | 'HOME' 
  | 'SEARCH' 
  | 'REQUEST_SERVICE' 
  | 'CLIENT_PROFILE' 
  | 'PROFILE_DETAIL' 
  | 'WORKER_DASHBOARD' 
  | 'MY_SERVICES' 
  | 'WALLET' 
  | 'OPPORTUNITIES' 
  | 'ADMIN' 
  | 'JOB_CLOSING' 
  | 'HELP' 
  | 'TERMS'
  | 'HIRE_MODE'
  | 'LEAD_DETAIL';

export type UserType = 'CLIENT' | 'PROVIDER';

export interface Tariff {
  service: string;
  price: number | string;
  unit: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  title: string;
  details: string;
  qrImage?: string;
}

export interface Provider {
  id: string;
  name: string;
  professions: string[];
  rating: number;
  reviews: number;
  location: string;
  image: string;
  price: number;
  unit: string;
  walletBalance: number;
  bio: string;
  isVerified: boolean;
  issuesInvoice: boolean;
  cvUrl?: string;
  tariffs: Tariff[];
  paymentMethods: PaymentMethod[];
}

export interface UserData {
  name: string;
  email?: string;
  location: string;
  loyaltyPoints: number;
  walletBalance: number;
  type?: UserType;
  unlockedLeads?: string[];
  age?: string;
  phone?: string;
  image?: string;
  bio?: string;
  professions?: string[];
  customProfession?: string;
  tariffs?: Tariff[];
  idFront?: string | null;
  idBack?: string | null;
  cv?: string | null;
  paymentMethods?: PaymentMethod[];
  acceptedTerms?: boolean;
  issuesInvoice?: boolean;
}

export interface Lead {
  id: string;
  clientName: string;
  avatar?: string;
  location?: string;
  message: string;
  status: 'LOCKED' | 'UNLOCKED';
  date: string;
  phone: string;
  category: string;
  budget?: string;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  clientName: string;
  location: string;
  date: string;
  category: string;
  budget: string;
}

export interface AdminData {
  pendingRecharges: {
      id: string; 
      workerName: string; // Added workerName
      amount: number; 
      date: string; 
      status: string; 
      proofUrl: string;
  }[];
  jobAudits: {id: string, service: string, amount: number, warning: boolean, client: string}[];
  revenue: number;
}