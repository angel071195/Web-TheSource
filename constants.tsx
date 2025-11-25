
import React from 'react';
import { Snowflake, Thermometer, Zap, Droplets, BrickWall, Wrench, Sparkles, Truck, Ruler, PaintBucket, Bike } from 'lucide-react';

export const COLORS = {
  background: '#F9FAFB',
  white: '#FFFFFF',
  black: '#111827',
  grayText: '#6B7280',
  grayLight: '#E5E7EB',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  facebook: '#1877F2',
  google: '#DB4437'
};

export const CATEGORIES = [
  { id: 'AC_TECH', label: 'Técnico A/C', icon: <Snowflake size={20} /> },
  { id: 'REFRIGERATION', label: 'Refrigeración', icon: <Thermometer size={20} /> },
  { id: 'ELECTRICIAN', label: 'Electricista', icon: <Zap size={20} /> },
  { id: 'PLUMBER', label: 'Plomería', icon: <Droplets size={20} /> },
  { id: 'MASON', label: 'Albañilería', icon: <BrickWall size={20} /> },
  { id: 'ALUMINUM', label: 'Aluminio', icon: <Ruler size={20} /> },
  { id: 'MOTO_MECH', label: 'Mec. Moto', icon: <Bike size={20} /> },
  { id: 'MECHANIC', label: 'Mecánico', icon: <Wrench size={20} /> },
  { id: 'CLEANING', label: 'Limpieza', icon: <Sparkles size={20} /> },
  { id: 'TRANSPORT', label: 'Transporte', icon: <Truck size={20} /> },
  { id: 'PAINTER', label: 'Pintor', icon: <PaintBucket size={20} /> },
];

export const PRICING_UNITS = [
    { label: 'Precio Fijo', value: 'fixed' },
    { label: 'Por Hora', value: 'hour' },
    { label: 'Por Día', value: 'day' },
    { label: 'Medio Día', value: 'half_day' },
    { label: 'Por Metro Cuadrado', value: 'm2' },
    { label: 'Por Punto', value: 'point' },
    { label: 'Por Visita', value: 'visit' },
    { label: 'A Convenir', value: 'quote' }
];

export const BANKS_BOLIVIA = [
  'Banco Unión', 'Banco Mercantil Santa Cruz', 'Banco Nacional de Bolivia', 'Banco Bisa', 'Banco Ganadero', 'Banco Sol', 'Banco FIE'
];

export const WALLETS_BOLIVIA = [
  'Tigo Money', 'Yape', 'Soli Pagos', 'Simple'
];

export const AVATARS = [
  // Heroes / Fantasy / Adventure
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Spooky',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Abby',
  // Robots / Sci-Fi
  'https://api.dicebear.com/7.x/bottts/svg?seed=RoboCop',
  'https://api.dicebear.com/7.x/bottts/svg?seed=C3PO',
  'https://api.dicebear.com/7.x/bottts/svg?seed=WallE',
  // Stylized / Cool People
  'https://api.dicebear.com/7.x/micah/svg?seed=Wednesday',
  'https://api.dicebear.com/7.x/micah/svg?seed=Sheldon',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Iron',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bat',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Wonder',
];

export const INITIAL_PROVIDERS = [
  {
    id: '1',
    name: 'Carlos Mamani',
    professions: ['Electricista'],
    rating: 4.8,
    reviews: 12,
    location: 'Puerto Quijarro, Centro',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    price: 50,
    unit: 'visit',
    walletBalance: 15,
    bio: 'Experto en instalaciones domiciliarias e industriales. 10 años de experiencia.',
    isVerified: true,
    issuesInvoice: true,
    cvUrl: 'https://example.com/cv-carlos.pdf',
    tariffs: [{service: 'Visita', price: 50, unit: 'visit'}, {service: 'Punto Eléctrico', price: 70, unit: 'point'}],
    paymentMethods: [{id: 'pm1', type: 'DIGITAL_WALLET', title: 'Yape', details: '70012345'}]
  },
  {
    id: '2',
    name: 'Ana Flores',
    professions: ['Limpieza'],
    rating: 5.0,
    reviews: 8,
    location: 'Barrio Lindo',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    price: 150,
    unit: 'day',
    walletBalance: 2, 
    bio: 'Limpieza profunda y desinfección.',
    isVerified: false,
    issuesInvoice: false,
    cvUrl: '',
    tariffs: [{service: 'Limpieza General', price: 150, unit: 'day'}],
    paymentMethods: [{id: 'pm2', type: 'CASH', title: 'Efectivo', details: 'Pago directo'}]
  }
];
