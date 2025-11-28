
import { Service, ServiceCategory, User, UserRole, Subscription } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    description: 'Películas y series en 4K Ultra HD + HDR. Sin anuncios.',
    category: ServiceCategory.MOVIES,
    price: 35.00,
    durationDays: 30,
    stock: 12,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
    isHot: true,
  },
  {
    id: '2',
    name: 'Spotify Premium',
    description: 'Música sin límites, descarga offline y sin publicidad.',
    category: ServiceCategory.MUSIC,
    price: 20.00,
    durationDays: 30,
    stock: 50,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg',
  },
  {
    id: '3',
    name: 'Disney+ Standard',
    description: 'Disney, Pixar, Marvel, Star Wars y National Geographic.',
    category: ServiceCategory.MOVIES,
    price: 25.00,
    durationDays: 30,
    stock: 20,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    isHot: true,
  },
  {
    id: '4',
    name: 'Max (HBO)',
    description: 'Lo mejor de Warner Bros, HBO, DC y Cartoon Network.',
    category: ServiceCategory.MOVIES,
    price: 25.00,
    durationDays: 30,
    stock: 5,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Max_logo_2023.svg',
  },
  {
    id: '5',
    name: 'Crunchyroll Fan',
    description: 'El catálogo de anime más grande del mundo. Simulcast.',
    category: ServiceCategory.ANIME,
    price: 20.00,
    durationDays: 30,
    stock: 0, // Agotado
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Crunchyroll_Logo_2018_Icon_Orange.svg',
  },
  {
    id: '6',
    name: 'Prime Video',
    description: 'Envíos gratis y series exclusivas Amazon Originals.',
    category: ServiceCategory.MOVIES,
    price: 20.00,
    durationDays: 30,
    stock: 15,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Amazon_Prime_Video_blue_logo.svg',
  },
  {
    id: '7',
    name: 'YouTube Premium',
    description: 'Videos sin anuncios, descargas y YouTube Music.',
    category: ServiceCategory.MOVIES,
    price: 15.00,
    durationDays: 30,
    stock: 8,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  },
  {
    id: '8',
    name: 'Canva Pro',
    description: 'Herramientas de diseño profesional y contenido premium.',
    category: ServiceCategory.SOFTWARE,
    price: 25.00,
    durationDays: 30,
    stock: 10,
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Carlos Cliente',
  email: 'carlos@example.com',
  password: 'password123',
  role: UserRole.USER,
  balance: 50.00,
  loyaltyPoints: 0
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Admin Master',
  email: 'elderangelo071195@gmail.com',
  password: '11353726012SC',
  role: UserRole.ADMIN,
  balance: 0.00, // Updated to 0 as requested
  loyaltyPoints: 0
};

export const INITIAL_SUBS: Subscription[] = [
  {
    id: 's1',
    serviceId: '2',
    serviceName: 'Spotify Premium',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg',
    buyerEmail: 'carlos@example.com', // Linked to Mock User
    email: 'premium.user@musicify.com',
    password: 'SecurePassword123!',
    purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days left
    status: 'ACTIVE'
  }
];
