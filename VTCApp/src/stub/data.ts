// ─── Stub Data — all data is mocked until the backend is ready ───────────────

export type UserRole = 'passenger' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  rating?: number;
  totalRides?: number;
}

export interface Driver extends User {
  role: 'driver';
  vehicle: {
    make: string;
    model: string;
    plate: string;
    category: VehicleCategory;
    color: string;
  };
  isOnline: boolean;
  location?: { lat: number; lng: number };
  documentsValid: boolean;
}

export type VehicleCategory = 'Berline' | 'Van' | 'SUV Premium' | 'Luxe';

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  estimatedPrice: number;
  estimatedDuration: number; // minutes
  estimatedDistance: number; // km
  category: VehicleCategory;
  type: 'classic' | 'disposition';
  dispositionDuration?: number; // hours
  forThirdParty?: { name: string; phone: string };
  status: RideStatus;
  driverId?: string;
  createdAt: string;
}

export type RideStatus =
  | 'searching'
  | 'accepted'
  | 'driver_approaching'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface FinancialSummary {
  pendingBalance: number;
  availableBalance: number;
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalRides: number;
}

// ─── Stub Users ───────────────────────────────────────────────────────────────

export const STUB_PASSENGER: User = {
  id: 'p-001',
  name: 'Marie Dupont',
  email: 'marie.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  role: 'passenger',
  rating: 4.8,
  totalRides: 47,
};

export const STUB_DRIVER: Driver = {
  id: 'd-001',
  name: 'Karim Benzara',
  email: 'karim.benzara@vtc.fr',
  phone: '+33 6 98 76 54 32',
  role: 'driver',
  rating: 4.9,
  totalRides: 312,
  vehicle: {
    make: 'Mercedes',
    model: 'Classe E',
    plate: 'AB-123-CD',
    category: 'Berline',
    color: 'Noir',
  },
  isOnline: true,
  documentsValid: true,
};

export const STUB_NEARBY_DRIVERS: Driver[] = [
  {
    id: 'd-001',
    name: 'Karim Benzara',
    email: '',
    phone: '',
    role: 'driver',
    rating: 4.9,
    totalRides: 312,
    vehicle: { make: 'Mercedes', model: 'Classe E', plate: 'AB-123-CD', category: 'Berline', color: 'Noir' },
    isOnline: true,
    location: { lat: 48.8566, lng: 2.3522 },
    documentsValid: true,
  },
  {
    id: 'd-002',
    name: 'Sophie Laurent',
    email: '',
    phone: '',
    role: 'driver',
    rating: 4.7,
    totalRides: 198,
    vehicle: { make: 'BMW', model: 'Série 5', plate: 'EF-456-GH', category: 'Berline', color: 'Blanc' },
    isOnline: true,
    location: { lat: 48.858, lng: 2.348 },
    documentsValid: true,
  },
  {
    id: 'd-003',
    name: 'Marc Olivier',
    email: '',
    phone: '',
    role: 'driver',
    rating: 4.6,
    totalRides: 421,
    vehicle: { make: 'Tesla', model: 'Model S', plate: 'IJ-789-KL', category: 'Luxe', color: 'Gris' },
    isOnline: true,
    location: { lat: 48.854, lng: 2.355 },
    documentsValid: true,
  },
];

export const STUB_FAVORITE_DRIVERS: Driver[] = [
  STUB_NEARBY_DRIVERS[0],
  STUB_NEARBY_DRIVERS[1],
];

export const VEHICLE_CATEGORIES: {
  category: VehicleCategory;
  description: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMin: number;
  waitTime: number; // minutes
  emoji: string;
}[] = [
  { category: 'Berline', description: '1-4 passagers · Confort standard', basePrice: 3.5, pricePerKm: 1.8, pricePerMin: 0.35, waitTime: 3, emoji: '🚗' },
  { category: 'Van', description: '1-7 passagers · Idéal groupe', basePrice: 5.0, pricePerKm: 2.2, pricePerMin: 0.45, waitTime: 5, emoji: '🚐' },
  { category: 'SUV Premium', description: '1-4 passagers · Grand confort', basePrice: 6.0, pricePerKm: 2.5, pricePerMin: 0.50, waitTime: 4, emoji: '🚙' },
  { category: 'Luxe', description: '1-3 passagers · Haut de gamme', basePrice: 8.0, pricePerKm: 3.2, pricePerMin: 0.65, waitTime: 6, emoji: '🚘' },
];

export const DISPOSITION_DURATIONS: { label: string; hours: number; discount: number }[] = [
  { label: '1 heure', hours: 1, discount: 0 },
  { label: '2 heures', hours: 2, discount: 0.05 },
  { label: '3 heures', hours: 3, discount: 0.08 },
  { label: '4 heures', hours: 4, discount: 0.10 },
  { label: 'Demi-journée (4h)', hours: 4, discount: 0.10 },
  { label: 'Journée (8h)', hours: 8, discount: 0.15 },
];

export const STUB_RIDE_HISTORY: RideRequest[] = [
  {
    id: 'r-001',
    passengerId: 'p-001',
    passengerName: 'Marie Dupont',
    pickup: '15 Rue de Rivoli, Paris',
    dropoff: 'Aéroport Charles de Gaulle, Terminal 2E',
    estimatedPrice: 68.50,
    estimatedDuration: 45,
    estimatedDistance: 32,
    category: 'Berline',
    type: 'classic',
    status: 'completed',
    driverId: 'd-001',
    createdAt: '2026-03-10T08:30:00Z',
  },
  {
    id: 'r-002',
    passengerId: 'p-001',
    passengerName: 'Marie Dupont',
    pickup: 'Tour Eiffel, Paris',
    dropoff: 'Musée du Louvre, Paris',
    estimatedPrice: 24.80,
    estimatedDuration: 20,
    estimatedDistance: 4.2,
    category: 'Luxe',
    type: 'classic',
    status: 'completed',
    driverId: 'd-003',
    createdAt: '2026-03-08T14:15:00Z',
  },
  {
    id: 'r-003',
    passengerId: 'p-001',
    passengerName: 'Marie Dupont',
    pickup: 'Hôtel Le Meurice, Paris',
    dropoff: 'Gare du Nord, Paris',
    estimatedPrice: 95.00,
    estimatedDuration: 240,
    estimatedDistance: 0,
    category: 'Van',
    type: 'disposition',
    dispositionDuration: 4,
    status: 'completed',
    driverId: 'd-002',
    createdAt: '2026-03-05T09:00:00Z',
  },
];

export const STUB_DRIVER_RIDE_HISTORY = [
  {
    id: 'r-010',
    passengerName: 'Jean Martin',
    pickup: 'Montparnasse',
    dropoff: 'La Défense',
    gross: 42.0,
    commission: 4.2,
    net: 37.8,
    status: 'paid',
    date: '2026-03-14',
  },
  {
    id: 'r-011',
    passengerName: 'Claire Bernard',
    pickup: 'CDG T2',
    dropoff: 'Paris 8e',
    gross: 68.0,
    commission: 6.8,
    net: 61.2,
    status: 'pending',
    date: '2026-03-15',
  },
  {
    id: 'r-012',
    passengerName: 'Ahmed Ziani',
    pickup: 'Paris 11e',
    dropoff: 'Versailles',
    gross: 55.5,
    commission: 5.55,
    net: 49.95,
    status: 'paid',
    date: '2026-03-13',
  },
];

export const STUB_FINANCIAL: FinancialSummary = {
  pendingBalance: 61.20,
  availableBalance: 823.40,
  totalEarnings: 12480.50,
  weeklyEarnings: 648.90,
  monthlyEarnings: 2340.00,
  totalRides: 312,
};

export const STUB_INCOMING_RIDE: RideRequest = {
  id: 'r-incoming',
  passengerId: 'p-002',
  passengerName: 'Paul Girard',
  pickup: '22 Avenue des Champs-Élysées, Paris',
  dropoff: 'Opéra Garnier, Paris',
  estimatedPrice: 18.50,
  estimatedDuration: 15,
  estimatedDistance: 2.8,
  category: 'Berline',
  type: 'classic',
  status: 'searching',
  createdAt: new Date().toISOString(),
};

export const SAVED_ADDRESSES = [
  { id: 'a-home', label: 'Domicile', address: '8 Rue du Faubourg Saint-Honoré, Paris 75008', icon: '🏠' },
  { id: 'a-work', label: 'Bureau', address: '101 Avenue des Champs-Élysées, Paris 75008', icon: '🏢' },
  { id: 'a-gym', label: 'Salle de sport', address: '15 Rue du Commerce, Paris 75015', icon: '💪' },
];

export const PAYMENT_METHODS = [
  { id: 'pm-1', type: 'card', brand: 'Visa', last4: '4242', isDefault: true },
  { id: 'pm-2', type: 'card', brand: 'Mastercard', last4: '5555', isDefault: false },
  { id: 'pm-3', type: 'apple_pay', brand: 'Apple Pay', last4: '', isDefault: false },
];
